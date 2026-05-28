import type {
  FormArtifactMetadata,
  FormArtifactEventType,
  FormArtifactHistoryEvent,
  FormArtifactStatus,
  FormArtifactPreferences,
  FormArtifactVisualSettings,
  FormPreferredDevice,
  FormLayout,
  FormSchema,
  FormTheme,
  FormThemeVariant,
  FormVisualDirection,
  GenerationMeta,
  FormSkillSettings,
} from "@/types/form";

const MAX_ARTIFACT_HISTORY_EVENTS = 50;

const allowedVisualDirections: FormVisualDirection[] = [
  "premium-event",
  "corporate-intake",
  "creator-launch",
  "finance-ops",
  "warm-feedback",
];
const allowedThemes: FormTheme[] = [
  "minimal",
  "business",
  "dark",
  "brutalism",
  "retro",
  "moss",
  "sunset",
  "neon",
];

export function normalizeFormThemeVariant(value?: string): FormThemeVariant {
  return value === "glass" || value === "gradient-flow" ? value : "default";
}

export function normalizeFormPreferredDevice(value?: string): FormPreferredDevice {
  return value === "desktop" ? "desktop" : "phone";
}

export function normalizeFormLayout(value?: string): FormLayout {
  return value === "long" ? "long" : "single";
}

export function normalizeFormVisualDirection(
  value?: string
): FormVisualDirection | undefined {
  return value && allowedVisualDirections.includes(value as FormVisualDirection)
    ? (value as FormVisualDirection)
    : undefined;
}

export function normalizeFormArtifactPreferences(
  input: Record<string, string | undefined>
): FormArtifactPreferences {
  const preferences: FormArtifactPreferences = {};

  if (input.theme && allowedThemes.includes(input.theme as FormTheme)) {
    preferences.theme = input.theme as FormTheme;
  }

  if (input.layout) {
    preferences.layout = normalizeFormLayout(input.layout);
  }

  if (input.themeVariant) {
    preferences.themeVariant = normalizeFormThemeVariant(input.themeVariant);
  }

  if (input.preferredDevice || input.device) {
    preferences.preferredDevice = normalizeFormPreferredDevice(
      input.preferredDevice || input.device
    );
  }

  const visualDirection = normalizeFormVisualDirection(input.visualDirection);
  if (visualDirection) {
    preferences.visualDirection = visualDirection;
  }

  return preferences;
}

export function buildFormArtifactVisualSettings(input: {
  theme: FormTheme;
  schema: FormSchema;
}): FormArtifactVisualSettings {
  return {
    theme: input.theme,
    layout: input.schema.layout === "long" ? "long" : "single",
    themeVariant: normalizeFormThemeVariant(input.schema.aspects?.themeVariant),
    preferredDevice: normalizeFormPreferredDevice(input.schema.aspects?.preferredDevice),
    visualDirection: input.schema.aspects?.visualDirection,
  };
}

function getDefaultHistoryEventType(input: {
  status: FormArtifactStatus;
  generation?: GenerationMeta;
  existingArtifact?: FormArtifactMetadata;
}): FormArtifactEventType {
  if (
    input.status === "published" &&
    input.existingArtifact?.status !== "published"
  ) {
    return "published";
  }

  if (
    input.status === "draft" &&
    input.existingArtifact?.status === "published"
  ) {
    return "unpublished";
  }

  if (!input.existingArtifact) {
    return input.generation?.source === "template"
      ? "template_applied"
      : "generated";
  }

  return "draft_saved";
}

function getDefaultHistorySummary(type: FormArtifactEventType) {
  const summaries: Record<FormArtifactEventType, string> = {
    generated: "Created initial form artifact from AI generation.",
    template_applied: "Created form artifact from a template.",
    visual_changed: "Updated form visual settings.",
    schema_edited: "Updated form schema.",
    skill_changed: "Updated form skill settings.",
    draft_saved: "Saved form draft.",
    published: "Published form artifact.",
    unpublished: "Moved published form back to draft.",
  };

  return summaries[type];
}

function createFormArtifactHistoryEvent(input: {
  type: FormArtifactEventType;
  summary?: string;
  now: string;
  status: FormArtifactStatus;
  visualSettings: FormArtifactVisualSettings;
  actor?: string;
}): FormArtifactHistoryEvent {
  return {
    id: `${input.now}-${input.type}`,
    type: input.type,
    summary: input.summary || getDefaultHistorySummary(input.type),
    createdAt: input.now,
    actor: input.actor,
    snapshot: {
      status: input.status,
      visualSettings: input.visualSettings,
    },
  };
}

function appendArtifactHistory(input: {
  existingArtifact?: FormArtifactMetadata;
  event: FormArtifactHistoryEvent;
}) {
  return [
    ...(input.existingArtifact?.history || []),
    input.event,
  ].slice(-MAX_ARTIFACT_HISTORY_EVENTS);
}

export function buildFormArtifactMetadata(input: {
  schema: FormSchema;
  theme: FormTheme;
  status: FormArtifactStatus;
  generation?: GenerationMeta;
  existingArtifact?: FormArtifactMetadata;
  skillSettings?: FormSkillSettings;
  historyEvent?: {
    type?: FormArtifactEventType;
    summary?: string;
    actor?: string;
  };
  now?: string;
}): FormArtifactMetadata {
  const now = input.now || new Date().toISOString();
  const visualSettings = buildFormArtifactVisualSettings({
    theme: input.theme,
    schema: input.schema,
  });
  const eventType =
    input.historyEvent?.type ||
    getDefaultHistoryEventType({
      status: input.status,
      generation: input.generation,
      existingArtifact: input.existingArtifact,
    });
  const event = createFormArtifactHistoryEvent({
    type: eventType,
    summary: input.historyEvent?.summary,
    actor: input.historyEvent?.actor,
    now,
    status: input.status,
    visualSettings,
  });

  return {
    kind: "form",
    artifactVersion: input.existingArtifact?.artifactVersion || 1,
    status: input.status,
    sourcePrompt:
      input.generation?.prompt?.trim() ||
      input.existingArtifact?.sourcePrompt,
    clarificationAnswers:
      input.generation?.clarification_answers ||
      input.existingArtifact?.clarificationAnswers,
    visualSettings,
    skillSettings: input.skillSettings || input.existingArtifact?.skillSettings,
    createdAt: input.existingArtifact?.createdAt || now,
    updatedAt: now,
    history: appendArtifactHistory({
      existingArtifact: input.existingArtifact,
      event,
    }),
  };
}

export function buildGenerationMetaWithArtifact(input: {
  generation?: GenerationMeta;
  schema: FormSchema;
  theme: FormTheme;
  status: FormArtifactStatus;
  now?: string;
  existingArtifact?: FormArtifactMetadata;
  skillSettings?: FormSkillSettings;
  historyEvent?: {
    type?: FormArtifactEventType;
    summary?: string;
    actor?: string;
  };
}): GenerationMeta {
  const now = input.now || new Date().toISOString();
  const generation: GenerationMeta = {
    ...(input.generation || {}),
    generated_at: input.generation?.generated_at || now,
  };

  return {
    ...generation,
    artifact: buildFormArtifactMetadata({
      schema: input.schema,
      theme: input.theme,
      status: input.status,
      generation,
      existingArtifact: input.existingArtifact,
      skillSettings: input.skillSettings,
      historyEvent: input.historyEvent,
      now,
    }),
  };
}

export function areFormArtifactVisualSettingsEqual(
  left?: FormArtifactVisualSettings,
  right?: FormArtifactVisualSettings
) {
  return (
    left?.theme === right?.theme &&
    left?.layout === right?.layout &&
    left?.themeVariant === right?.themeVariant &&
    left?.preferredDevice === right?.preferredDevice &&
    left?.visualDirection === right?.visualDirection
  );
}
