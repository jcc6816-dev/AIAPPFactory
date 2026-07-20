import { respData, respErr, respJson } from "@/lib/resp";

import {
  getFormByUuidForUser,
  normalizeFormStatus,
  normalizeOcrTemplate,
  normalizeWebhookAuthMode,
  normalizeWebhookProvider,
  updateFormDraft,
} from "@/services/form";
import { createGrowthEventSafely } from "@/models/growth-event";
import { getUserUuid } from "@/services/user";
import { serializeFormForClient } from "@/services/webhook-security";
import { sanitizeGrowthAttribution } from "@/lib/growth-attribution";

export async function GET(
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

    return respData(serializeFormForClient(form));
  } catch (error) {
    console.log("get form failed:", error);
    return respErr("get form failed");
  }
}

export async function PATCH(
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

    const body = await req.json();
    const previousProvider =
      typeof body.webhook_provider === "string"
        ? (await getFormByUuidForUser(user_uuid, id))?.webhook_provider
        : undefined;
    const nextForm = await updateFormDraft(user_uuid, id, {
      title: typeof body.title === "string" ? body.title : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      theme: typeof body.theme === "string" ? body.theme : undefined,
      schema: body.schema,
      webhook_enabled:
        typeof body.webhook_enabled === "boolean"
          ? body.webhook_enabled
          : undefined,
      webhook_url:
        typeof body.webhook_url === "string" ? body.webhook_url : undefined,
      webhook_provider:
        typeof body.webhook_provider === "string"
          ? normalizeWebhookProvider(body.webhook_provider)
          : undefined,
      webhook_secret:
        typeof body.webhook_secret === "string" ? body.webhook_secret : undefined,
      webhook_auth_mode:
        typeof body.webhook_auth_mode === "string"
          ? normalizeWebhookAuthMode(body.webhook_auth_mode)
          : undefined,
      webhook_keyword:
        typeof body.webhook_keyword === "string"
          ? body.webhook_keyword
          : undefined,
      webhook_header_name:
        typeof body.webhook_header_name === "string"
          ? body.webhook_header_name
          : undefined,
      ocr_template:
        typeof body.ocr_template === "string"
          ? normalizeOcrTemplate(body.ocr_template)
          : undefined,
      skill_settings:
        body.skill_settings && typeof body.skill_settings === "object"
          ? body.skill_settings
          : undefined,
      status:
        typeof body.status === "string"
          ? normalizeFormStatus(body.status)
          : undefined,
    });

    if (!nextForm) {
      return respErr("form not found");
    }

    if (body.status === "published") {
      const attribution = sanitizeGrowthAttribution(
        nextForm.generation_meta_json?.attribution
      );
      await createGrowthEventSafely({
        event_name: "form_published",
        visitor_id: attribution?.visitor_id || "",
        user_uuid,
        session_id: attribution?.session_id || "",
        path: `/api/forms/${id}`,
        form_uuid: nextForm.uuid,
        share_code: nextForm.share_code,
        source: attribution?.channel || "unattributed",
        metadata_json: {
          title: nextForm.title,
          theme: nextForm.theme,
          attribution,
        },
      });
    }

    if (
      typeof body.webhook_provider === "string" &&
      nextForm.webhook_provider !== previousProvider
    ) {
      await createGrowthEventSafely({
        event_name: "webhook_provider_selected",
        visitor_id: "",
        user_uuid,
        path: `/api/forms/${id}`,
        form_uuid: nextForm.uuid,
        share_code: nextForm.share_code,
        source: "product",
        metadata_json: { provider: nextForm.webhook_provider || "generic" },
      });
    }

    return respData(serializeFormForClient(nextForm));
  } catch (error) {
    console.log("update form failed:", error);
    return respErr("update form failed");
  }
}
