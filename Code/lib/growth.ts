"use client";

export function trackGrowthEvent(eventName: string, metadata: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  const visitorId = window.localStorage.getItem("aiff_visitor_id") || "";
  const sessionId = window.localStorage.getItem("aiff_session_id") || "";

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
    metadata,
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
