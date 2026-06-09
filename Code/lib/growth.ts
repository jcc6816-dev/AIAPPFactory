"use client";

const GA_EVENT_NAMES: Record<string, string> = {
  page_leave: "page_leave",
  signup_started: "signup_start",
  user_signed_up: "sign_up",
  user_signed_in: "login",
  landing_viewed: "landing_view",
  template_viewed: "template_view",
  template_used: "template_use_click",
  skill_viewed: "skill_view",
  skill_tried: "skill_try",
  ai_generate_submitted: "form_generate",
  form_created: "form_saved",
  form_published: "form_publish",
  public_form_submitted: "form_submit",
  checkout_started: "checkout_start",
  purchase_completed: "purchase",
  // 新增游客体验事件映射
  demo_started: "demo_start",
  demo_completed: "demo_complete",
  // 保持对旧 GA4 事件名的兼容性映射
  ai_generate_submit: "form_generate",
  publish_form: "form_publish",
};

function trackGoogleAnalyticsEvent(
  eventName: string,
  metadata: Record<string, any>
) {
  const gaEventName = GA_EVENT_NAMES[eventName];
  const gtag = (window as Window & { gtag?: (...args: any[]) => void }).gtag;

  if (!gaEventName || typeof gtag !== "function") return;
  gtag("event", gaEventName, metadata);
}

function getStoredId(key: string, prefix: string) {
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const next = `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  window.localStorage.setItem(key, next);
  return next;
}

function getPageMetadata() {
  return {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  };
}

export function trackGrowthEvent(eventName: string, metadata: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  const enrichedMetadata: Record<string, any> = {
    ...getPageMetadata(),
    ...metadata,
  };

  trackGoogleAnalyticsEvent(eventName, enrichedMetadata);

  const isDev = window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1" ||
                window.location.hostname.includes("vercel.app") ||
                window.location.hostname === "43.98.193.104";

  const visitorId = getStoredId("aiff_visitor_id", "visitor");
  const sessionId = getStoredId("aiff_session_id", "session");
  const { template_id, form_uuid, share_code, ...metadataJson } = enrichedMetadata;
  
  metadataJson.is_dev = isDev;

  const payload = {
    event_name: eventName,
    visitor_id: visitorId,
    session_id: sessionId,
    path: enrichedMetadata.page_path,
    referrer: document.referrer,
    source: (() => {
      const searchParams = new URLSearchParams(window.location.search);
      let src = searchParams.get("utm_source") || searchParams.get("ref") || "";
      if (!src && document.referrer) {
        try {
          const refUrl = new URL(document.referrer);
          src = refUrl.hostname.replace("www.", "");
        } catch {}
      }
      return src || "direct";
    })(),
    template_id,
    form_uuid,
    share_code,
    metadata: metadataJson,
  };

  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/growth/events", new Blob([body], { type: "application/json" }));
      return;
    }

    fetch("/api/growth/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    console.warn("trackGrowthEvent failed:", e);
  }
}
