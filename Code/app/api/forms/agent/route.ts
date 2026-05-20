import { generateFormSchemaFromPrompt } from "@/services/form-generator";
import { normalizeFormTheme } from "@/services/form";
import { getUserUuid } from "@/services/user";
import {
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

      try {
        const user_uuid = await getUserUuid();
        if (!user_uuid) {
          send({ type: "error", message: "请先登录后再使用 AI Agent 生成表单。" });
          controller.close();
          return;
        }

        const { prompt, theme, provider, model, existingSchema } = await req.json();
        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
          send({ type: "error", message: "请输入表单生成需求。" });
          controller.close();
          return;
        }

        const currentSchema =
          existingSchema && Array.isArray(existingSchema.fields)
            ? (existingSchema as FormSchema)
            : null;
        const isRevision = Boolean(currentSchema);

        send({ type: "thinking", message: "正在理解你的业务场景和目标用户..." });
        await sleep(180);
        send({
          type: "thinking",
          message: isRevision
            ? "正在对比当前草稿，判断需要新增、删除还是调整字段..."
            : "正在规划字段结构、填写顺序和单题流体验...",
        });
        await sleep(180);
        send({
          type: "tool_start",
          tool: isRevision ? "revise_form_schema" : "generate_form_schema",
          message: isRevision
            ? "正在基于现有 Schema 执行增量修改..."
            : "正在调用表单生成工具创建初版 Schema...",
        });

        const generated = await generateFormSchemaFromPrompt(
          prompt,
          normalizeFormTheme(theme),
          {
            provider,
            model,
            existingSchema: currentSchema || undefined,
          }
        );

        const changes = summarizeFormSchemaChanges(currentSchema, generated.schema);
        const warnings = validateFormSchemaForAgent(generated.schema);

        send({
          type: "thinking",
          message: isRevision
            ? `已完成 ${generated.schema.fields.length} 个字段的增量调整，正在同步右侧预览沙盒...`
            : `已生成 ${generated.schema.fields.length} 个字段，正在同步右侧预览沙盒...`,
        });
        await sleep(120);
        send({
          type: "change_summary",
          changes,
          warnings,
          message: isRevision ? "已生成本次修改摘要。" : "已生成表单结构摘要。",
        });
        send({
          type: "draft_updated",
          data: generated,
          message: "表单草稿已更新。",
        });
        send({
          type: "done",
          message: isRevision
            ? "增量修改完成，你可以继续要求我微调字段。"
            : "生成完成，你可以继续用自然语言要求我微调。",
        });
        controller.close();
      } catch (error: any) {
        console.log("form agent stream failed:", error);
        send({ type: "error", message: error?.message || "AI Agent 生成失败，请稍后重试。" });
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
