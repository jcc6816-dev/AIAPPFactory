"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";

import type { FormArtifactPreferences } from "@/types/form";
import { trackGrowthEvent } from "@/lib/growth";

interface TemplateUseButtonProps {
  locale: string;
  templateId: string;
  label: string;
  trackingMetadata?: Record<string, string>;
  source?: string;
}

function buildTemplateHref(
  locale: string,
  templateId: string,
  preferences?: FormArtifactPreferences,
  source?: string
) {
  const params = new URLSearchParams({ template: templateId });

  if (source) params.set("source", source);
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

  const localePrefix = locale.toLowerCase().startsWith("zh")
    ? `/${locale}`
    : "";

  return `${localePrefix}/forms/new?${params.toString()}`;
}

export default function TemplateUseButton({
  locale,
  templateId,
  label,
  trackingMetadata = {},
  source,
}: TemplateUseButtonProps) {
  const [preferences, setPreferences] = useState<FormArtifactPreferences>();
  const href = useMemo(
    () => buildTemplateHref(locale, templateId, preferences, source),
    [locale, preferences, templateId, source]
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
    trackGrowthEvent("template_used", {
      template_id: templateId,
      cta_text: label,
      ...trackingMetadata,
      ...(preferences || {}),
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
      <Link
        href={href}
        onClick={trackTemplateUse}
        className="relative overflow-hidden inline-flex items-center justify-center gap-2.5 w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient hover:scale-[1.02] active:scale-[0.98] text-white font-black text-sm shadow-xl shadow-blue-600/30 hover:shadow-indigo-600/40 transition-all duration-300 group"
        style={{ "--bg-size": "200%" } as React.CSSProperties}
      >
        <Play className="size-4 fill-white" />
        {label}
      </Link>
      
      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 animate-pulse shrink-0">
        <span className="size-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-ping"></span>
        AI Ready • 30s Deploy
      </span>
    </div>
  );
}
