"use client";

const GA_EVENT_NAMES: Record<string, string> = {
  user_signed_up: "sign_up",
  user_signed_in: "login",
  template_viewed: "template_view",
  template_used: "template_use",
  skill_viewed: "skill_view",
  skill_tried: "skill_try",
  form_created: "form_generate",
  form_published: "form_publish",
  public_form_submitted: "form_submit",
  checkout_started: "begin_checkout",
  purchase_completed: "purchase",
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

export function trackGrowthEvent(eventName: string, metadata: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  trackGoogleAnalyticsEvent(eventName, metadata);

  const visitorId = getStoredId("aiff_visitor_id", "visitor");
  const sessionId = getStoredId("aiff_session_id", "session");
  const { template_id, form_uuid, share_code, ...metadataJson } = metadata;

  const payload = {
    event_name: eventName,
    visitor_id: visitorId,
    session_id: sessionId,
    path: window.location.pathname + window.location.search,
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
