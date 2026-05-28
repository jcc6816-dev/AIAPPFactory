"use client";

import { useEffect } from "react";

function getStoredId(key: string, prefix: string) {
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  window.localStorage.setItem(key, next);
  return next;
}

export default function TemplateViewTracker({
  templateId,
}: {
  templateId: string;
}) {
  useEffect(() => {
    const visitorId = getStoredId("aiff_visitor_id", "visitor");
    const sessionId = getStoredId("aiff_session_id", "session");

    fetch("/api/growth/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_name: "template_viewed",
        visitor_id: visitorId,
        session_id: sessionId,
        template_id: templateId,
        path: window.location.pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {});
  }, [templateId]);

  return null;
}
