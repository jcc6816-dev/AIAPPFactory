import {
  CreateFormPayload,
  FormRecord,
  FormSchema,
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
import { getUserCredits } from "./credit";
import { normalizeGeneratedSchema } from "./form-generator";

const allowedThemes: FormTheme[] = ["minimal", "business", "dark", "brutalism", "retro"];
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
  const form: FormRecord = {
    uuid: getUniSeq("form_"),
    user_uuid,
    title: payload.title.trim(),
    description: payload.description?.trim() || "",
    theme: normalizeFormTheme(payload.theme),
    schema_json: normalizeGeneratedSchema(payload.schema),
    status: FormStatus.Draft,
    share_code: getUniSeq("share_"),
    ocr_template: normalizeOcrTemplate(
      payload.ocr_template ||
        inferOcrTemplate({
          title: payload.title,
          description: payload.description,
          schema: payload.schema,
        })
    ),
    llm_provider: payload.generation?.provider,
    llm_model: payload.generation?.model || "",
    generation_meta_json: payload.generation
      ? {
          ...payload.generation,
          generated_at: payload.generation.generated_at || now,
        }
      : {},
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
    nextUpdates.status = updates.status;
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

  return updateFormByUuid(form_uuid, nextUpdates);
}
