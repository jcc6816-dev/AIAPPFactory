import {
  generateFormSchemaFromPrompt,
  isInspectionOnlyFormRevision,
} from "@/services/form-generator";
import { normalizeFormTheme } from "@/services/form";
import { getUserUuid } from "@/services/user";
import {
  buildFormAgentDoneMessage,
  buildFormAgentProgressMessage,
  buildFormAgentSummaryMessage,
  hasNoStructuralChange,
  summarizeFormSchemaChanges,
  validateFormSchemaForAgent,
} from "@/services/form-agent-tools";
import type { FormSchema } from "@/types/form";

type AgentEvent =
  | { type: "thinking"; message: string }
  | { type: "tool_start"; tool: string; message: string }
  | { type: "draft_updated"; data: unknown; message: string }
  | { type: "change_summary"; changes: string[]; warnings: string[]; message: string }
  | { type: "done"; message: string }
  | { type: "error"; message: string };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function encodeAgentEvent(event: AgentEvent) {
  return `event: agent\ndata: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: AgentEvent) => {
        controller.enqueue(encoder.encode(encodeAgentEvent(event)));
      };

      let isZh = false;
      try {
        const body = await req.json();
        const {
          prompt,
          theme,
          provider,
          model,
          existingSchema,
          existingTitle,
          existingDescription,
          clarifications,
          locale,
        } = body;

        isZh = (locale || "en").toLowerCase().startsWith("zh");

        const user_uuid = await getUserUuid();
        if (!user_uuid) {
          send({
            type: "error",
            message: isZh
              ? "请先登录后再使用 AI Agent 生成表单。"
              : "Please log in before using AI Agent to generate forms.",
          });
          controller.close();
          return;
        }

        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
          send({
            type: "error",
            message: isZh ? "请输入表单生成需求。" : "Please enter your form generation requirements.",
          });
          controller.close();
          return;
        }

        const currentSchema =
          existingSchema && Array.isArray(existingSchema.fields)
            ? (existingSchema as FormSchema)
            : null;
        const isRevision = Boolean(currentSchema);
        const isInspectionOnly =
          isRevision && isInspectionOnlyFormRevision(prompt);

        send({
          type: "thinking",
          message: isZh
            ? "正在理解你的业务场景和目标用户..."
            : "Understanding your business scenario and target audience...",
        });
        await sleep(180);
        send({
          type: "thinking",
          message: isRevision
            ? isZh
              ? "正在对比当前草稿，判断需要新增、删除还是调整字段..."
              : "Comparing with current draft to identify changes..."
            : isZh
            ? "正在规划字段结构、填写顺序 and 单题流体验..."
            : "Planning field structure, sequencing, and step-by-step experience...",
        });
        await sleep(180);
        send({
          type: "tool_start",
          tool: isInspectionOnly
            ? "validate_form_schema"
            : isRevision
              ? "revise_form_schema"
              : "generate_form_schema",
          message: isInspectionOnly
            ? isZh
              ? "正在只读检查当前 Schema，不会自动修改草稿..."
              : "Performing read-only validation on the current schema..."
            : isRevision
            ? isZh
              ? "正在基于现有 Schema 执行增量修改..."
              : "Applying incremental modifications to the schema..."
            : isZh
            ? "正在调用表单生成工具创建初版 Schema..."
            : "Calling generation tool to build initial schema...",
        });

        const generated = await generateFormSchemaFromPrompt(
          prompt,
          normalizeFormTheme(theme),
          {
            provider,
            model,
            existingSchema: currentSchema || undefined,
            existingTitle,
            existingDescription,
            clarifications,
            locale,
          }
        );

        const changes = summarizeFormSchemaChanges(currentSchema, generated.schema, locale);
        const warnings = validateFormSchemaForAgent(generated.schema, locale);

        send({
          type: "thinking",
          message: buildFormAgentProgressMessage({
            isRevision,
            fieldCount: generated.schema.fields.length,
            changes,
          }, locale),
        });
        await sleep(120);
        send({
          type: "change_summary",
          changes,
          warnings,
          message: buildFormAgentSummaryMessage(isRevision, changes, locale),
        });
        send({
          type: "draft_updated",
          data: generated,
          message: hasNoStructuralChange(changes)
            ? isZh
              ? "表单草稿已完成检查。"
              : "Form draft checked."
            : isZh
            ? "表单草稿已更新。"
            : "Form draft updated.",
        });
        send({
          type: "done",
          message: buildFormAgentDoneMessage({ isRevision, changes, warnings }, locale),
        });
        controller.close();
      } catch (error: any) {
        console.log("form agent stream failed:", error);
        send({
          type: "error",
          message: error?.message || (isZh ? "AI Agent 生成失败，请稍后重试。" : "AI Agent generation failed, please try again later."),
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
