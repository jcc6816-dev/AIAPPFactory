import { createGrowthEvent } from "@/models/growth-event";
import { getUserEmail, getUserUuid } from "@/services/user";
import { respData, respErr } from "@/lib/resp";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "page_leave",
  "template_viewed",
  "template_used",
  "form_created",
  "form_published",
  "public_form_submitted",
  "checkout_started",
  "support_ticket_created",
  "paywall_impression",
  "paywall_clicked",
]);

function normalizeSource(referrer?: string, source?: string) {
  if (source) return source;
  if (!referrer) return "direct";

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("google")) return "google";
    if (host.includes("bing")) return "bing";
    if (host.includes("baidu")) return "baidu";
    if (host.includes("github")) return "github";
    if (host.includes("x.com") || host.includes("twitter")) return "x";
    if (host.includes("linkedin")) return "linkedin";
    return host;
  } catch {
    return "referral";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event_name = String(body.event_name || "").trim();

    if (!ALLOWED_EVENTS.has(event_name)) {
      return respErr("invalid event");
    }

    const visitor_id = String(body.visitor_id || "").slice(0, 128);
    if (!visitor_id) {
      return respErr("visitor_id is required");
    }

    const user_uuid = await getUserUuid();
    const user_email = user_uuid ? await getUserEmail() : "";
    const referrer = String(body.referrer || "").slice(0, 500);
    const event = await createGrowthEvent({
      event_name,
      visitor_id,
      user_uuid,
      user_email,
      session_id: String(body.session_id || "").slice(0, 128),
      path: String(body.path || "").slice(0, 500),
      referrer,
      source: normalizeSource(referrer, body.source),
      template_id: String(body.template_id || "").slice(0, 255),
      form_uuid: String(body.form_uuid || "").slice(0, 255),
      share_code: String(body.share_code || "").slice(0, 255),
      metadata_json:
        body.metadata && typeof body.metadata === "object" ? body.metadata : {},
      duration_ms: Number(body.duration_ms || 0),
      user_agent: (req.headers.get("user-agent") || "").slice(0, 500),
    });

    return respData({ uuid: event.uuid });
  } catch (error) {
    console.log("record growth event failed:", error);
    return respErr("record growth event failed");
  }
}
