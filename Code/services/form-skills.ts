import type {
  FormRecord,
  FormSkillCode,
  FormSkillSettings,
} from "@/types/form";

import { getIsoTimestr } from "@/lib/time";

export const FREE_FORM_SKILLS: FormSkillCode[] = ["deduplication"];
export const PRO_FORM_SKILLS: FormSkillCode[] = [
  "table_ocr",
  "ai_pre_audit",
  "report_export",
  "email_notification",
  "data_cleaning",
  "ai_insights",
];

const ALL_FORM_SKILLS: FormSkillCode[] = [
  ...FREE_FORM_SKILLS,
  "ocr",
  ...PRO_FORM_SKILLS,
];

function isFormSkillCode(value: string): value is FormSkillCode {
  return ALL_FORM_SKILLS.includes(value as FormSkillCode);
}

export function isProFormSkill(code: FormSkillCode) {
  return PRO_FORM_SKILLS.includes(code);
}

export function normalizeFormSkillSettings(
  input: unknown,
  options?: {
    existing?: FormSkillSettings;
    isPaidUser?: boolean;
    now?: string;
  }
): FormSkillSettings {
  const now = options?.now || getIsoTimestr();
  const existing = options?.existing || {};
  const incoming =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const next: FormSkillSettings = { ...existing };

  for (const [code, rawSetting] of Object.entries(incoming)) {
    if (!isFormSkillCode(code)) {
      continue;
    }

    const enabled =
      typeof rawSetting === "boolean"
        ? rawSetting
        : rawSetting && typeof rawSetting === "object" &&
            typeof (rawSetting as { enabled?: unknown }).enabled === "boolean"
          ? Boolean((rawSetting as { enabled?: unknown }).enabled)
          : undefined;

    if (typeof enabled !== "boolean") {
      continue;
    }

    if (enabled && isProFormSkill(code) && !options?.isPaidUser) {
      throw new Error("pro skill requires an active paid plan");
    }

    const existingConfig = existing[code]?.config || {};
    const incomingConfig =
      rawSetting && typeof rawSetting === "object" &&
      (rawSetting as { config?: unknown }).config &&
      typeof (rawSetting as { config?: unknown }).config === "object"
        ? ((rawSetting as { config: Record<string, any> }).config)
        : {};

    const mergedConfig = {
      ...existingConfig,
      ...incomingConfig,
    };

    next[code] = {
      enabled,
      tier: isProFormSkill(code) ? "pro" : "free",
      updatedAt: now,
      config: Object.keys(mergedConfig).length > 0 ? mergedConfig : undefined,
    };
  }

  return next;
}

export function getFormSkillSettings(form: FormRecord): FormSkillSettings {
  const configured = form.generation_meta_json?.artifact?.skillSettings || {};
  const next: FormSkillSettings = { ...configured };

  if (form.ocr_template && form.ocr_template !== "general_image") {
    next.ocr = {
      enabled: true,
      tier: "free",
      updatedAt: configured.ocr?.updatedAt,
    };
  }

  return next;
}

export function isFormSkillEnabled(form: FormRecord, code: FormSkillCode) {
  return Boolean(getFormSkillSettings(form)[code]?.enabled);
}
