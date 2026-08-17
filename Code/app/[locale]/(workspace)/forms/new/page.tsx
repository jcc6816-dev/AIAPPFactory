import { redirect } from "next/navigation";
import { normalizeFormArtifactPreferences } from "@/services/form-artifact";
import { getFormCreationAllowance } from "@/services/form";
import { getUserUuid } from "@/services/user";
import FormCreationManager from "@/components/forms/form-creation-manager";
import {
  getLocalizedSceneTemplateSchema,
  getSceneTemplateById,
  getTemplateCreationPrompt,
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
    autogenerate?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const { template, prompt, skill, skill_config, autogenerate } = query;
  // Direct creation is intentionally template-neutral. Only a URL that names a
  // template may show that template's title, fields, and preview context.
  const primaryTemplateId = template;
  const initialCreationContext = normalizeCreationContext(query);
  const templateDefinition = primaryTemplateId
    ? getSceneTemplateById(primaryTemplateId)
    : undefined;
  const isZh = locale.toLowerCase().startsWith("zh");
  // Gallery cards and older shared template URLs can omit a prompt. When the
  // caller explicitly requests generation, resolve a safe template-owned
  // prompt on the server so the creation canvas never stops at an empty brief.
  const defaultPrompt = isZh
    ? "创建一份产品试用申请表，包含姓名、公司邮箱、公司规模和业务需求。"
    : "Create a product demo request form with name, work email, company size, and main use case.";
  const resolvedPrompt =
    prompt ||
    (autogenerate === "1" && templateDefinition
      ? getTemplateCreationPrompt(templateDefinition, locale)
      : (!primaryTemplateId ? defaultPrompt : undefined));
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
  if (primaryTemplateId) queryParams.set("template", primaryTemplateId);
  if (resolvedPrompt) queryParams.set("prompt", resolvedPrompt);
  if (skill) queryParams.set("skill", skill);
  if (skill_config) queryParams.set("skill_config", skill_config);
  if (initialCreationContext.source) queryParams.set("source", initialCreationContext.source);
  if (initialCreationContext.intent) queryParams.set("intent", initialCreationContext.intent);
  if (initialCreationContext.mode) queryParams.set("mode", initialCreationContext.mode);
  if (autogenerate === "1") queryParams.set("autogenerate", "1");
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
      initialTemplateId={primaryTemplateId}
      initialPrompt={resolvedPrompt}
      initialArtifactPreferences={initialArtifactPreferences}
      initialCreationContext={initialCreationContext}
      initialContextSummary={initialContextSummary}
      initialSkill={skill}
      initialSkillConfig={skill_config}
      autoGenerateInitialPrompt={autogenerate === "1"}
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
