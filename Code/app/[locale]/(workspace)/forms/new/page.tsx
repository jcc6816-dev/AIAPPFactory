import { redirect } from "next/navigation";
import { normalizeFormArtifactPreferences } from "@/services/form-artifact";
import { getFormCreationAllowance } from "@/services/form";
import { getUserUuid } from "@/services/user";
import FormCreationManager from "@/components/forms/form-creation-manager";
import {
  getLocalizedSceneTemplateSchema,
  getSceneTemplateById,
} from "@/services/form-templates";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    template?: string;
    prompt?: string;
    theme?: string;
    visualDirection?: string;
    themeVariant?: string;
    device?: string;
    preferredDevice?: string;
    layout?: string;
    skill?: string;
    skill_config?: string;
    source?: string;
    intent?: string;
    mode?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const { template, prompt, skill, skill_config } = query;
  const initialCreationContext = normalizeCreationContext(query);
  const templateDefinition = template
    ? getSceneTemplateById(template)
    : undefined;
  const isZh = locale.toLowerCase().startsWith("zh");
  const localizedTemplateSchema = templateDefinition
    ? getLocalizedSceneTemplateSchema(templateDefinition, locale)
    : undefined;
  const initialContextSummary = templateDefinition
    ? {
        title: isZh
          ? templateDefinition.name
          : templateDefinition.nameEn || templateDefinition.name,
        intent: initialCreationContext.intent,
        source: initialCreationContext.source || "template",
        recommendedFields: localizedTemplateSchema!.fields
          .slice(0, 5)
          .map((field) => field.label),
      }
    : undefined;
  const user_uuid = await getUserUuid();
  const initialArtifactPreferences = normalizeFormArtifactPreferences(query);
  
  const queryParams = new URLSearchParams();
  if (template) queryParams.set("template", template);
  if (prompt) queryParams.set("prompt", prompt);
  if (skill) queryParams.set("skill", skill);
  if (skill_config) queryParams.set("skill_config", skill_config);
  if (initialCreationContext.source) queryParams.set("source", initialCreationContext.source);
  if (initialCreationContext.intent) queryParams.set("intent", initialCreationContext.intent);
  if (initialCreationContext.mode) queryParams.set("mode", initialCreationContext.mode);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const callbackUrl = `/${locale}/forms/new${queryString}`;
  let allowance: {
    isPaidUser: boolean;
    isInternalUser?: boolean;
    isUnlimited?: boolean;
    maxForms: number | null;
    currentFormCount: number;
    canCreate: boolean;
  } = {
    isPaidUser: false,
    maxForms: 1,
    currentFormCount: 0,
    canCreate: false,
  };

  if (user_uuid) {
    allowance = await getFormCreationAllowance(user_uuid);
  }

  return (
    <FormCreationManager 
      canCreate={user_uuid ? allowance.canCreate : false} 
      allowance={allowance}
      initialTemplateId={template} 
      initialPrompt={prompt} 
      initialArtifactPreferences={initialArtifactPreferences}
      initialCreationContext={initialCreationContext}
      initialContextSummary={initialContextSummary}
      initialSkill={skill}
      initialSkillConfig={skill_config}
      isGuest={!user_uuid}
    />
  );
}

function normalizeContextValue(value?: string) {
  if (!value || value.length > 80 || !/^[a-z0-9_-]+$/i.test(value)) {
    return undefined;
  }

  return value;
}

function normalizeCreationContext(query: {
  source?: string;
  intent?: string;
  mode?: string;
}) {
  return {
    source: normalizeContextValue(query.source),
    intent: normalizeContextValue(query.intent),
    mode: normalizeContextValue(query.mode),
  };
}
