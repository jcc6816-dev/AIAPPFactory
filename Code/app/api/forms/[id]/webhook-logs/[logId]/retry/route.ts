import { respData, respErr, respJson } from "@/lib/resp";

import { getFormByUuidForUser } from "@/services/form";
import { getUserUuid } from "@/services/user";
import { retryWebhookLog } from "@/services/webhook-log";
import { createGrowthEventSafely } from "@/models/growth-event";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string; logId: string }> }
) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const { id, logId } = await params;
    if (!id || !logId) {
      return respErr("form id and webhook log id are required");
    }

    const form = await getFormByUuidForUser(user_uuid, id);
    if (!form) {
      return respErr("form not found");
    }

    const result = await retryWebhookLog(form, logId);
    await createGrowthEventSafely({
      event_name: "webhook_manual_retry",
      visitor_id: "",
      user_uuid,
      path: `/api/forms/${id}/webhook-logs/${logId}/retry`,
      form_uuid: form.uuid,
      share_code: form.share_code,
      source: "product",
      metadata_json: {
        provider: form.webhook_provider || "generic",
        result: result.status,
      },
    });
    return respData(result);
  } catch (error: any) {
    console.log("retry webhook failed:", error);
    return respErr(error.message || "retry webhook failed");
  }
}
