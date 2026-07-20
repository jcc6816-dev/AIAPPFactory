import { createGrowthEvent } from "@/models/growth-event";
import { getUserEmail, getUserUuid } from "@/services/user";
import { respData, respErr } from "@/lib/resp";
import {
  normalizeGrowthTraffic,
  sanitizeGrowthAttribution,
  sanitizeGrowthPath,
  sanitizeGrowthReferrer,
} from "@/lib/growth-attribution";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "page_leave",
  "signup_started",
  "user_signed_up",
  "user_signed_in",
  "landing_viewed",
  "template_viewed",
  "template_used",
  "skill_viewed",
  "skill_tried",
  "ai_generate_submitted",
  "checkout_started",
  "purchase_completed",
  "pricing_viewed",
  "pricing_plan_selected",
  "support_ticket_created",
  "paywall_impression",
  "paywall_clicked",
  "demo_started",
  "demo_completed",
  "forms_new_view",
  "forms_new_primary_action_viewed",
  "forms_new_primary_action_clicked",
  "workspace_preview_ready",
  "template_context_loaded",
  "guest_login_prompt_shown",
  "guest_login_intent_started",
  "guest_login_intent_returned",
  "activation_started",
  "publish_started",
  "test_submission_started",
  "whatsapp_share_clicked",
]);

export async function POST(req: Request) {
  try {
    let body: any = {};
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const text = await req.text();
      if (text.trim()) {
        body = JSON.parse(text);
      }
    } else {
      // Fallback/Parse text if sendBeacon didn't set content-type properly or sent plain text
      const text = await req.text();
      if (text.trim()) {
        try {
          body = JSON.parse(text);
        } catch {
          // ignore parsing error for non-json or malformed
        }
      }
    }

    const event_name = String(body.event_name || "").trim();

    if (!event_name || !ALLOWED_EVENTS.has(event_name)) {
      return respErr("invalid event");
    }

    const visitor_id = String(body.visitor_id || "").slice(0, 128);
    if (!visitor_id) {
      return respErr("visitor_id is required");
    }

    const user_uuid = await getUserUuid();
    const user_email = user_uuid ? await getUserEmail() : "";
    const referrer = sanitizeGrowthReferrer(body.referrer) || "";

    // Prepare metadata and sanitize sensitive information
    const rawMetadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};
    const metadataJson = { ...rawMetadata };
    const attribution = sanitizeGrowthAttribution(metadataJson.attribution);
    if (attribution) metadataJson.attribution = attribution;
    else delete metadataJson.attribution;
    if (metadataJson.page_path) {
      metadataJson.page_path = sanitizeGrowthPath(metadataJson.page_path) || "";
    }
    if (metadataJson.page_location) {
      metadataJson.page_location = sanitizeGrowthPath(metadataJson.page_location) || "";
    }
    if ("callbackUrl" in metadataJson || "callback_url" in metadataJson) {
      const callbackVal = metadataJson.callbackUrl || metadataJson.callback_url;
      metadataJson.has_callback = Boolean(callbackVal);
      delete metadataJson.callbackUrl;
      delete metadataJson.callback_url;
    }
    delete metadataJson.prompt;
    delete metadataJson.answer;
    delete metadataJson.answers;
    delete metadataJson.title;
    delete metadataJson.description;
    delete metadataJson.email;
    delete metadataJson.token;
    delete metadataJson.code;
    delete metadataJson.state;

    const event = await createGrowthEvent({
      event_name,
      visitor_id,
      user_uuid,
      user_email,
      session_id: String(body.session_id || "").slice(0, 128),
      path: (sanitizeGrowthPath(body.path) || "").slice(0, 500),
      referrer,
      source:
        attribution?.channel ||
        normalizeGrowthTraffic({ referrer }).channel,
      template_id: String(body.template_id || "").slice(0, 255),
      form_uuid: String(body.form_uuid || "").slice(0, 255),
      share_code: String(body.share_code || "").slice(0, 255),
      metadata_json: metadataJson,
      duration_ms: Number(body.duration_ms || 0),
      user_agent: (req.headers.get("user-agent") || "").slice(0, 500),
    });

    return respData({ uuid: event.uuid });
  } catch (error) {
    console.log("record growth event failed:", error);
    return respErr("record growth event failed");
  }
}
