"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";

import type { FormArtifactPreferences } from "@/types/form";

interface TemplateUseButtonProps {
  locale: string;
  templateId: string;
  label: string;
}

function buildTemplateHref(
  locale: string,
  templateId: string,
  preferences?: FormArtifactPreferences
) {
  const params = new URLSearchParams({ template: templateId });

  if (preferences?.theme) params.set("theme", preferences.theme);
  if (preferences?.visualDirection) {
    params.set("visualDirection", preferences.visualDirection);
  }
  if (preferences?.themeVariant) {
    params.set("themeVariant", preferences.themeVariant);
  }
  if (preferences?.preferredDevice) {
    params.set("device", preferences.preferredDevice);
  }
  if (preferences?.layout) params.set("layout", preferences.layout);

  return `/${locale}/forms/new?${params.toString()}`;
}

function getStoredId(key: string, prefix: string) {
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  window.localStorage.setItem(key, next);
  return next;
}

export default function TemplateUseButton({
  locale,
  templateId,
  label,
}: TemplateUseButtonProps) {
  const [preferences, setPreferences] = useState<FormArtifactPreferences>();
  const href = useMemo(
    () => buildTemplateHref(locale, templateId, preferences),
    [locale, preferences, templateId]
  );

  useEffect(() => {
    const storageKey = `aiff-template-preferences:${templateId}`;

    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw) {
        setPreferences(JSON.parse(raw) as FormArtifactPreferences);
      }
    } catch {
      // The default template URL remains valid when storage is unavailable.
    }

    const handlePreferenceChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        templateId?: string;
        preferences?: FormArtifactPreferences;
      }>;

      if (customEvent.detail?.templateId !== templateId) return;
      setPreferences(customEvent.detail.preferences);
    };

    window.addEventListener(
      "aiff-template-preferences-changed",
      handlePreferenceChange
    );

    return () => {
      window.removeEventListener(
        "aiff-template-preferences-changed",
        handlePreferenceChange
      );
    };
  }, [templateId]);

  function trackTemplateUse() {
    fetch("/api/growth/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_name: "template_used",
        visitor_id: getStoredId("aiff_visitor_id", "visitor"),
        session_id: getStoredId("aiff_session_id", "session"),
        template_id: templateId,
        path: window.location.pathname,
        referrer: document.referrer,
        metadata: preferences || {},
      }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <Link
      href={href}
      onClick={trackTemplateUse}
      className="inline-flex items-center justify-center gap-2.5 w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
    >
      <Play className="size-4 fill-white" />
      {label}
    </Link>
  );
}
