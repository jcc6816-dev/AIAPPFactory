import { respData, respErr, respJson } from "@/lib/resp";

import {
  getFormByUuidForUser,
  normalizeOcrTemplate,
  normalizeWebhookAuthMode,
  normalizeWebhookProvider,
  updateFormDraft,
} from "@/services/form";
import { getUserUuid } from "@/services/user";

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

    return respData(form);
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
    });

    if (!nextForm) {
      return respErr("form not found");
    }

    return respData(nextForm);
  } catch (error) {
    console.log("update form failed:", error);
    return respErr("update form failed");
  }
}
