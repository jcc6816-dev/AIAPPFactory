import { respData, respErr, respJson } from "@/lib/resp";

import {
  answerFormWebhookAgentQuery,
  buildFormWebhookAgentSummary,
} from "@/services/form-webhook-agent";
import { getFormByUuidForUser } from "@/services/form";
import { getUserUuid } from "@/services/user";
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

    const logs = await listWebhookLogs(form);
    const summary = buildFormWebhookAgentSummary(form, logs);

    return respData({
      answer: answerFormWebhookAgentQuery(query, summary),
      summary,
    });
  } catch (error: any) {
    console.log("webhook logs agent failed:", error);
    return respErr(error.message || "webhook logs agent failed");
  }
}
