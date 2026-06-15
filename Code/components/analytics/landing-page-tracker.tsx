"use client";

import { useEffect } from "react";

import { trackGrowthEvent } from "@/lib/growth";

export default function LandingPageTracker({
  slug,
  templateId,
  entryPoint = "use_case_landing",
}: {
  slug: string;
  templateId: string;
  entryPoint?: string;
}) {
  useEffect(() => {
    trackGrowthEvent("landing_viewed", {
      landing_slug: slug,
      entry_point: entryPoint,
      template_id: templateId,
    });
  }, [entryPoint, slug, templateId]);

  return null;
}
