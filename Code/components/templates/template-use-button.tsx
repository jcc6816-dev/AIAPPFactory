"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";

import type { FormArtifactPreferences, FormCreationContext } from "@/types/form";
import { trackGrowthEvent } from "@/lib/growth";
import { buildTemplateHref } from "./template-use-url";

interface TemplateUseButtonProps {
  locale: string;
  templateId: string;
  label: string;
  trackingMetadata?: Record<string, string>;
  source?: FormCreationContext["source"];
  intent?: FormCreationContext["intent"];
  mode?: FormCreationContext["mode"];
  prompt?: string;
  badgeLabel?: string;
  defaultPreferences?: FormArtifactPreferences;
}

export default function TemplateUseButton({
  locale,
  templateId,
  label,
  trackingMetadata = {},
  source,
  intent,
  mode,
  prompt,
  badgeLabel = "AI Ready • 30s Deploy",
  defaultPreferences,
}: TemplateUseButtonProps) {
  const [preferences, setPreferences] = useState<FormArtifactPreferences>();
  const effectivePreferences = useMemo(
    () => ({ ...(preferences || {}), ...(defaultPreferences || {}) }),
    [defaultPreferences, preferences]
  );
  const context = useMemo(
    () => ({ source, intent, mode }),
    [intent, mode, source]
  );
  const href = useMemo(
    () => buildTemplateHref(locale, templateId, effectivePreferences, context, prompt),
    [context, effectivePreferences, locale, prompt, templateId]
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
      source,
      intent,
      mode,
      ...trackingMetadata,
      ...effectivePreferences,
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
        {badgeLabel}
      </span>
    </div>
  );
}
