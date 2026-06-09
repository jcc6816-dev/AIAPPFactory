import { redirect } from "next/navigation";
import { normalizeFormArtifactPreferences } from "@/services/form-artifact";
import { getFormCreationAllowance } from "@/services/form";
import { getUserUuid } from "@/services/user";
import FormCreationManager from "@/components/forms/form-creation-manager";

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
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const { template, prompt, skill, skill_config } = query;
  const user_uuid = await getUserUuid();
  const initialArtifactPreferences = normalizeFormArtifactPreferences(query);
  
  const queryParams = new URLSearchParams();
  if (template) queryParams.set("template", template);
  if (prompt) queryParams.set("prompt", prompt);
  if (skill) queryParams.set("skill", skill);
  if (skill_config) queryParams.set("skill_config", skill_config);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const callbackUrl = `/${locale}/forms/new${queryString}`;
  let allowance: {
    isPaidUser: boolean;
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
      initialSkill={skill}
      initialSkillConfig={skill_config}
      isGuest={!user_uuid}
    />
  );
}
