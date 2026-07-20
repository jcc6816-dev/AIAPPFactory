import { createGrowthEventSafely } from "@/models/growth-event";
import { getFormByUuidForUser } from "@/services/form";
import { sendWebhookTest } from "@/services/skills/webhook";
import { getUserUuid } from "@/services/user";
import { respData, respErr, respJson } from "@/lib/resp";

export async function POST(
  _req: Request,
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

    await createGrowthEventSafely({
      event_name: "webhook_test_sent",
      visitor_id: "",
      user_uuid,
      path: `/api/forms/${id}/webhook-test`,
      form_uuid: form.uuid,
      share_code: form.share_code,
      source: "product",
      metadata_json: { provider: form.webhook_provider || "generic" },
    });

    const result = await sendWebhookTest(form);
    await createGrowthEventSafely({
      event_name: result.ok
        ? "webhook_delivery_succeeded"
        : "webhook_delivery_failed",
      visitor_id: "",
      user_uuid,
      path: `/api/forms/${id}/webhook-test`,
      form_uuid: form.uuid,
      share_code: form.share_code,
      source: "product",
      metadata_json: {
        provider: form.webhook_provider || "generic",
        response_status: result.status,
        attempt_count: result.attemptCount,
        is_test: true,
      },
    });

    if (!result.ok) {
      return respErr(
        result.status
          ? `test send failed with status ${result.status}`
          : "test send failed"
      );
    }

    return respData({
      status: "completed",
      response_status: result.status,
      attempt_count: result.attemptCount,
    });
  } catch (error) {
    console.log("test webhook failed");
    return respErr(error instanceof Error ? error.message : "test send failed");
  }
}
