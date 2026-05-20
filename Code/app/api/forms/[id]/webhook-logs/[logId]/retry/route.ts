import { respData, respErr, respJson } from "@/lib/resp";

import { getFormByUuidForUser } from "@/services/form";
import { getUserUuid } from "@/services/user";
import { retryWebhookLog } from "@/services/webhook-log";

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
    return respData(result);
  } catch (error: any) {
    console.log("retry webhook failed:", error);
    return respErr(error.message || "retry webhook failed");
  }
}
