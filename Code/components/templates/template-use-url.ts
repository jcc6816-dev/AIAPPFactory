import type { FormArtifactPreferences, FormCreationContext } from "@/types/form";

export function buildTemplateHref(
  locale: string,
  templateId: string,
  preferences?: FormArtifactPreferences,
  context?: FormCreationContext,
  prompt?: string
) {
  const params = new URLSearchParams({ template: templateId });

  if (context?.source) params.set("source", context.source);
  if (context?.intent) params.set("intent", context.intent);
  if (context?.mode) params.set("mode", context.mode);
  if (prompt) params.set("prompt", prompt);
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
