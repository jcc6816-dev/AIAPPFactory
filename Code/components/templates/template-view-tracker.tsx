"use client";

import { useEffect } from "react";
import { trackGrowthEvent } from "@/lib/growth";

export default function TemplateViewTracker({
  templateId,
}: {
  templateId: string;
}) {
  useEffect(() => {
    trackGrowthEvent("template_viewed", { template_id: templateId });
  }, [templateId]);

  return null;
}
