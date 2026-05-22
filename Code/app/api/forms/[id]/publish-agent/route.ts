import { respData, respErr, respJson } from "@/lib/resp";
import { buildPageAgentResponse } from "@/lib/page-agent-response";

import {
  answerFormPublishAgentQuery,
  buildFormShareUrl,
  buildFormPublishAgentResponses,
  resolvePublishAgentLocale,
} from "@/services/form-publish-agent";
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

    const locale = resolvePublishAgentLocale({
      bodyLocale: body.locale,
      referer: req.headers.get("referer"),
    });
    const shareUrl = buildFormShareUrl({
      baseUrl: process.env.NEXT_PUBLIC_WEB_URL,
      locale,
      shareCode: form.share_code,
    });
    const webhookLogs = await listWebhookLogs(form);
    const responses = buildFormPublishAgentResponses(form, webhookLogs, shareUrl);
    const answer = answerFormPublishAgentQuery(query, responses);
    const agent_response = buildPageAgentResponse(answer, {
      query,
      meta: {
        source: "form-publish-agent",
        form_uuid: form.uuid,
      },
    });

    return respData({
      answer,
      agent_response,
      responses,
    });
  } catch (error: any) {
    console.log("publish agent failed:", error);
    return respErr(error.message || "publish agent failed");
  }
}
