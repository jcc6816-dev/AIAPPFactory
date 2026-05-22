import { respData, respErr, respJson } from "@/lib/resp";
import { buildPageAgentResponse } from "@/lib/page-agent-response";

import {
  answerFormDataAgentQueryWithContext,
} from "@/services/form-data-agent";
import { getFormByUuidForUser } from "@/services/form";
import { getUserUuid } from "@/services/user";
import { listFormSubmissions } from "@/services/form-runtime";
import { listWebhookLogs } from "@/services/webhook-log";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const { id } = await params;
    if (!id) {
      return respErr("form id is required");
    }

    const form = await getFormByUuidForUser(user_uuid, id);
    if (!form) {
      return respErr("form not found");
    }

    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    if (!query) {
      return respErr("query is required");
    }

    const [submissions, webhookLogs] = await Promise.all([
      listFormSubmissions(form),
      listWebhookLogs(form),
    ]);
    const result = answerFormDataAgentQueryWithContext(
      query,
      form,
      submissions,
      webhookLogs
    );
    const answer = result.answer;
    const agent_response = buildPageAgentResponse(answer, {
      query,
      meta: {
        source: "form-data-agent",
        form_uuid: form.uuid,
        filter: result.filter,
      },
    });

    return respData({
      answer,
      agent_response,
      summary: result.summary,
      filter: result.filter,
    });
  } catch (error: any) {
    console.log("data agent failed:", error);
    return respErr(error.message || "data agent failed");
  }
}
