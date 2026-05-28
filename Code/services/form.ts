import {
  CreateFormPayload,
  FormArtifactHistoryEvent,
  FormRecord,
  FormSchema,
  FormSkillSettings,
  FormTheme,
  OcrTemplate,
  WebhookAuthMode,
  WebhookProvider,
} from "@/types/form";
import {
  FormStatus,
  findFormByShareCode,
  findFormByUuid,
  getFormsByUserUuid,
  insertForm,
  updateFormByUuid,
} from "@/models/form";

import { getIsoTimestr } from "@/lib/time";
import { getUniSeq } from "@/lib/hash";
import { encryptSecret } from "@/lib/secure";
import {
  areFormArtifactVisualSettingsEqual,
  buildFormArtifactVisualSettings,
  buildGenerationMetaWithArtifact,
} from "./form-artifact";
import { assertFormReadyToPublish } from "./form-publish-check";
import { getUserCredits } from "./credit";
import { normalizeGeneratedSchema } from "./form-generator";
import { getFormSkillSettings, normalizeFormSkillSettings } from "./form-skills";

const allowedThemes: FormTheme[] = ["minimal", "business", "dark", "brutalism", "retro", "moss", "sunset", "neon"];
const allowedWebhookAuthModes: WebhookAuthMode[] = [
  "none",
  "keyword",
  "query_keyword",
  "header_keyword",
  "body_keyword",
  "signature",
];
const allowedWebhookProviders: WebhookProvider[] = [
  "generic",
  "feishu_bot",
  "dingtalk_bot",
  "wecom_bot",
];
const allowedOcrTemplates: OcrTemplate[] = [
  "general_image",
  "invoice",
  "receipt",
  "id_card",
];

function getFreeFormLimit(): number {
  const configuredLimit = Number(process.env.DEV_FREE_FORM_LIMIT || "");

  if (process.env.NODE_ENV !== "production") {
    if (Number.isFinite(configuredLimit) && configuredLimit > 0) {
      return configuredLimit;
    }

    return 100;
  }

  return 1;
}

export function normalizeFormTheme(theme?: string): FormTheme {
  if (theme && allowedThemes.includes(theme as FormTheme)) {
    return theme as FormTheme;
  }

  return "minimal";
}

export function normalizeFormStatus(status?: string): FormStatus {
  return status === FormStatus.Published ? FormStatus.Published : FormStatus.Draft;
}

export function isFormPublished(form?: Pick<FormRecord, "status"> | null) {
  return form?.status === FormStatus.Published;
}

export function normalizeWebhookAuthMode(mode?: string): WebhookAuthMode {
  if (mode && allowedWebhookAuthModes.includes(mode as WebhookAuthMode)) {
    return mode as WebhookAuthMode;
  }

  return "none";
}

export function normalizeWebhookProvider(provider?: string): WebhookProvider {
  if (provider && allowedWebhookProviders.includes(provider as WebhookProvider)) {
    return provider as WebhookProvider;
  }

  return "generic";
}

export function normalizeOcrTemplate(template?: string): OcrTemplate {
  if (template && allowedOcrTemplates.includes(template as OcrTemplate)) {
    return template as OcrTemplate;
  }

  return "general_image";
}

export function inferOcrTemplate(input: {
  title?: string;
  description?: string;
  schema?: FormSchema;
}): OcrTemplate {
  const text = [
    input.title || "",
    input.description || "",
    ...(input.schema?.fields || []).map((field) => `${field.label} ${field.key}`),
  ]
    .join(" ")
    .toLowerCase();

  if (/身份证|证件|id card|identity card|passport/i.test(text)) {
    return "id_card";
  }

  if (/收据|小票|receipt/i.test(text)) {
    return "receipt";
  }

  if (/发票|票据|报销|invoice/i.test(text)) {
    return "invoice";
  }

  return "general_image";
}

export async function createForm(
  user_uuid: string,
  payload: CreateFormPayload
): Promise<FormRecord> {
  await ensureFormCreationAllowed(user_uuid);

  const now = getIsoTimestr();
  const theme = normalizeFormTheme(payload.theme);
  const schema = normalizeGeneratedSchema(payload.schema);
  const status = normalizeFormStatus(payload.status);
  const userCredits = await getUserCredits(user_uuid);
  const skillSettings = payload.skill_settings
    ? normalizeFormSkillSettings(payload.skill_settings, {
        isPaidUser: Boolean(userCredits.is_recharged),
        now,
      })
    : undefined;
  if (status === FormStatus.Published) {
    assertFormReadyToPublish({
      title: payload.title,
      schema,
      webhookEnabled: payload.webhook?.enabled,
      webhookUrl: payload.webhook?.url,
    });
  }

  const form: FormRecord = {
    uuid: getUniSeq("form_"),
    user_uuid,
    title: payload.title.trim(),
    description: payload.description?.trim() || "",
    theme,
    schema_json: schema,
    status,
    share_code: getUniSeq("share_"),
    ocr_template: normalizeOcrTemplate(
      payload.ocr_template ||
        inferOcrTemplate({
          title: payload.title,
          description: payload.description,
          schema,
        })
    ),
    llm_provider: payload.generation?.provider,
    llm_model: payload.generation?.model || "",
    generation_meta_json: buildGenerationMetaWithArtifact({
      generation: payload.generation,
      schema,
      theme,
      status,
      now,
      skillSettings,
      historyEvent: {
        type:
          status === FormStatus.Published
            ? "published"
            : payload.generation?.source === "template"
              ? "template_applied"
              : "generated",
      },
    }),
    webhook_enabled: payload.webhook?.enabled ?? false,
    webhook_url: payload.webhook?.url?.trim() || "",
    webhook_provider: normalizeWebhookProvider(payload.webhook?.provider),
    webhook_secret_encrypted: payload.webhook?.secret
      ? encryptSecret(payload.webhook.secret)
      : "",
    webhook_auth_mode: normalizeWebhookAuthMode(payload.webhook?.auth_mode),
    webhook_keyword_encrypted: payload.webhook?.keyword
      ? encryptSecret(payload.webhook.keyword)
      : "",
    webhook_header_name: payload.webhook?.header_name?.trim() || "",
    created_at: now,
    updated_at: now,
  };

  return insertForm(form);
}

export async function getFormCreationAllowance(user_uuid: string) {
  const forms = await getFormsByUserUuid(user_uuid);
  const userCredits = await getUserCredits(user_uuid);
  const isPaidUser = Boolean(userCredits.is_recharged);
  const freeFormLimit = getFreeFormLimit();
  const maxForms = isPaidUser ? null : freeFormLimit;
  const currentFormCount = forms.length;
  const canCreate = isPaidUser || currentFormCount < freeFormLimit;

  return {
    isPaidUser,
    maxForms,
    currentFormCount,
    canCreate,
  };
}

export async function ensureFormCreationAllowed(user_uuid: string) {
  const allowance = await getFormCreationAllowance(user_uuid);
  if (!allowance.canCreate) {
    throw new Error("free plan users have reached the current form limit");
  }

  return allowance;
}

export async function listFormsByUser(user_uuid: string): Promise<FormRecord[]> {
  return getFormsByUserUuid(user_uuid);
}

export async function getFormByUuidForUser(
  user_uuid: string,
  form_uuid: string
): Promise<FormRecord | undefined> {
  const form = await findFormByUuid(form_uuid);
  if (!form || form.user_uuid !== user_uuid) {
    return undefined;
  }

  return form;
}

export async function getFormByShareCode(share_code: string) {
  return findFormByShareCode(share_code);
}

export async function updateFormDraft(
  user_uuid: string,
  form_uuid: string,
  updates: Partial<{
    title: string;
    description: string;
    theme: FormTheme;
    schema: FormSchema;
    status: string;
    ocr_template: OcrTemplate;
    webhook_enabled: boolean;
    webhook_url: string;
    webhook_provider: WebhookProvider;
    webhook_secret: string;
    webhook_auth_mode: WebhookAuthMode;
    webhook_keyword: string;
    webhook_header_name: string;
    skill_settings: FormSkillSettings;
  }>
): Promise<FormRecord | undefined> {
  const form = await getFormByUuidForUser(user_uuid, form_uuid);
  if (!form) {
    return undefined;
  }

  const nextUpdates: Partial<FormRecord> = {
    updated_at: getIsoTimestr(),
  };

  if (typeof updates.title === "string") {
    nextUpdates.title = updates.title.trim();
  }

  if (typeof updates.description === "string") {
    nextUpdates.description = updates.description.trim();
  }

  if (typeof updates.theme === "string") {
    nextUpdates.theme = normalizeFormTheme(updates.theme);
  }

  if (updates.schema) {
    nextUpdates.schema_json = normalizeGeneratedSchema(updates.schema);
  }

  if (typeof updates.status === "string") {
    nextUpdates.status = normalizeFormStatus(updates.status);
  }

  if (typeof updates.ocr_template === "string") {
    nextUpdates.ocr_template = normalizeOcrTemplate(updates.ocr_template);
  }

  if (typeof updates.webhook_enabled === "boolean") {
    nextUpdates.webhook_enabled = updates.webhook_enabled;
  }

  if (typeof updates.webhook_url === "string") {
    nextUpdates.webhook_url = updates.webhook_url.trim();
  }

  if (typeof updates.webhook_provider === "string") {
    nextUpdates.webhook_provider = normalizeWebhookProvider(
      updates.webhook_provider
    );
  }

  if (typeof updates.webhook_secret === "string" && updates.webhook_secret.trim()) {
    nextUpdates.webhook_secret_encrypted = encryptSecret(updates.webhook_secret);
  }

  if (typeof updates.webhook_auth_mode === "string") {
    nextUpdates.webhook_auth_mode = normalizeWebhookAuthMode(
      updates.webhook_auth_mode
    );
  }

  if (typeof updates.webhook_keyword === "string" && updates.webhook_keyword.trim()) {
    nextUpdates.webhook_keyword_encrypted = encryptSecret(updates.webhook_keyword);
  }

  if (typeof updates.webhook_header_name === "string") {
    nextUpdates.webhook_header_name = updates.webhook_header_name.trim();
  }

  if (updates.skill_settings) {
    const userCredits = await getUserCredits(user_uuid);
    const existingGeneration = form.generation_meta_json || {};
    const nextSkillSettings = normalizeFormSkillSettings(updates.skill_settings, {
      existing: form.generation_meta_json?.artifact?.skillSettings,
      isPaidUser: Boolean(userCredits.is_recharged),
      now: nextUpdates.updated_at,
    });
    const baseArtifact =
      form.generation_meta_json?.artifact ||
      buildGenerationMetaWithArtifact({
        generation: existingGeneration,
        schema: nextUpdates.schema_json || form.schema_json,
        theme: nextUpdates.theme || form.theme,
        status:
          normalizeFormStatus(nextUpdates.status || form.status) ===
          FormStatus.Published
            ? "published"
          : "draft",
        now: nextUpdates.updated_at,
      }).artifact;
    const skillHistoryEvent: FormArtifactHistoryEvent = {
      id: `${nextUpdates.updated_at}-skill_changed`,
      type: "skill_changed",
      summary: "Updated form skill settings.",
      createdAt: nextUpdates.updated_at || getIsoTimestr(),
      snapshot: {
        status:
          normalizeFormStatus(nextUpdates.status || form.status) ===
          FormStatus.Published
            ? "published"
            : "draft",
        visualSettings:
          baseArtifact?.visualSettings ||
          buildFormArtifactVisualSettings({
            theme: nextUpdates.theme || form.theme,
            schema: nextUpdates.schema_json || form.schema_json,
          }),
      },
    };

    nextUpdates.generation_meta_json = {
      ...existingGeneration,
      artifact: baseArtifact
        ? {
            ...baseArtifact,
            skillSettings: nextSkillSettings,
            updatedAt: nextUpdates.updated_at,
            history: [
              ...(baseArtifact.history || []),
              skillHistoryEvent,
            ].slice(-50),
          }
        : undefined,
    };
  }

  if (nextUpdates.schema_json || nextUpdates.theme || nextUpdates.status) {
    const nextSchema = nextUpdates.schema_json || form.schema_json;
    const nextTheme = nextUpdates.theme || form.theme;
    const nextStatus = normalizeFormStatus(nextUpdates.status || form.status);
    const nextWebhookEnabled =
      nextUpdates.webhook_enabled ?? form.webhook_enabled ?? false;
    const nextWebhookUrl =
      typeof nextUpdates.webhook_url === "string"
        ? nextUpdates.webhook_url
        : form.webhook_url;

    if (nextStatus === FormStatus.Published) {
      const userCredits = await getUserCredits(user_uuid);
      const effectiveFormForSkillCheck: FormRecord = {
        ...form,
        ...nextUpdates,
        generation_meta_json:
          nextUpdates.generation_meta_json || form.generation_meta_json,
      };
      const skillSettings = getFormSkillSettings(effectiveFormForSkillCheck);
      const hasProSkills =
        Boolean(skillSettings.table_ocr?.enabled) ||
        Boolean(skillSettings.ai_pre_audit?.enabled) ||
        Boolean(skillSettings.report_export?.enabled) ||
        Boolean(skillSettings.email_notification?.enabled) ||
        Boolean(skillSettings.data_cleaning?.enabled) ||
        Boolean(skillSettings.ai_insights?.enabled);

      if (hasProSkills && !userCredits.is_recharged) {
        throw new Error("pro skill requires an active paid plan");
      }

      assertFormReadyToPublish({
        title: nextUpdates.title ?? form.title,
        schema: nextSchema,
        webhookEnabled: nextWebhookEnabled,
        webhookUrl: nextWebhookUrl,
      });
    }

    const previousVisualSettings = form.generation_meta_json?.artifact?.visualSettings ||
      buildFormArtifactVisualSettings({
        theme: form.theme,
        schema: form.schema_json,
      });
    const nextVisualSettings = buildFormArtifactVisualSettings({
      theme: nextTheme,
      schema: nextSchema,
    });
    const historyEventType =
      form.status !== FormStatus.Published && nextStatus === FormStatus.Published
        ? "published"
        : form.status === FormStatus.Published && nextStatus !== FormStatus.Published
          ? "unpublished"
          : !areFormArtifactVisualSettingsEqual(previousVisualSettings, nextVisualSettings)
            ? "visual_changed"
            : nextUpdates.schema_json
              ? "schema_edited"
              : "draft_saved";

    nextUpdates.generation_meta_json = buildGenerationMetaWithArtifact({
      generation: form.generation_meta_json,
      schema: nextSchema,
      theme: nextTheme,
      status: nextStatus,
      now: nextUpdates.updated_at,
      existingArtifact:
        nextUpdates.generation_meta_json?.artifact ||
        form.generation_meta_json?.artifact,
      historyEvent: {
        type: historyEventType,
      },
    });
  }

  return updateFormByUuid(form_uuid, nextUpdates);
}
