import { describe, expect, it } from "vitest";

import {
  buildGenerationMetaWithArtifact,
  buildFormArtifactMetadata,
  buildFormArtifactVisualSettings,
} from "./form-artifact";

describe("form artifact metadata", () => {
  it("builds visual settings from schema aspects", () => {
    expect(
      buildFormArtifactVisualSettings({
        theme: "neon",
        schema: {
          layout: "long",
          aspects: {
            visualDirection: "creator-launch",
            themeVariant: "gradient-flow",
            preferredDevice: "desktop",
          },
          fields: [
            {
              key: "email",
              label: "Email",
              type: "email",
              required: true,
            },
          ],
        },
      })
    ).toEqual({
      theme: "neon",
      layout: "long",
      themeVariant: "gradient-flow",
      preferredDevice: "desktop",
      visualDirection: "creator-launch",
    });
  });

  it("preserves source prompt and clarification answers in metadata", () => {
    expect(
      buildFormArtifactMetadata({
        theme: "business",
        status: "published",
        now: "2026-05-25T00:00:00.000Z",
        generation: {
          source: "fallback",
          prompt: "Create a finance intake form",
          clarification_answers: {
            audience: "enterprise",
          },
        },
        schema: {
          layout: "single",
          fields: [
            {
              key: "company",
              label: "Company",
              type: "text",
            },
          ],
        },
      })
    ).toMatchObject({
      kind: "form",
      artifactVersion: 1,
      status: "published",
      sourcePrompt: "Create a finance intake form",
      clarificationAnswers: {
        audience: "enterprise",
      },
      createdAt: "2026-05-25T00:00:00.000Z",
      updatedAt: "2026-05-25T00:00:00.000Z",
      history: [
        {
          type: "published",
          summary: "Published form artifact.",
        },
      ],
    });
  });

  it("appends bounded history when updating metadata", () => {
    const existingArtifact = buildFormArtifactMetadata({
      theme: "minimal",
      status: "draft",
      now: "2026-05-25T00:00:00.000Z",
      generation: {
        source: "template",
        prompt: "Lead capture",
      },
      schema: {
        fields: [
          {
            key: "name",
            label: "Name",
            type: "text",
          },
        ],
      },
    });

    const generation = buildGenerationMetaWithArtifact({
      generation: {
        source: "template",
        prompt: "Lead capture",
      },
      theme: "neon",
      status: "draft",
      now: "2026-05-25T00:05:00.000Z",
      existingArtifact,
      historyEvent: {
        type: "visual_changed",
      },
      schema: {
        layout: "single",
        aspects: {
          themeVariant: "gradient-flow",
          visualDirection: "creator-launch",
          preferredDevice: "phone",
        },
        fields: [
          {
            key: "name",
            label: "Name",
            type: "text",
          },
        ],
      },
    });

    expect(generation.artifact?.history?.map((event) => event.type)).toEqual([
      "template_applied",
      "visual_changed",
    ]);
    expect(generation.artifact?.visualSettings).toMatchObject({
      theme: "neon",
      themeVariant: "gradient-flow",
      visualDirection: "creator-launch",
    });
  });

  it("keeps only the latest 50 history events", () => {
    const existingArtifact = buildFormArtifactMetadata({
      theme: "minimal",
      status: "draft",
      now: "2026-05-25T00:00:00.000Z",
      generation: {
        source: "fallback",
      },
      schema: {
        fields: [
          {
            key: "name",
            label: "Name",
            type: "text",
          },
        ],
      },
    });

    existingArtifact.history = Array.from({ length: 50 }, (_, index) => ({
      id: `event-${index}`,
      type: "draft_saved",
      summary: `Saved draft ${index}`,
      createdAt: `2026-05-25T00:${String(index).padStart(2, "0")}:00.000Z`,
    }));

    const generation = buildGenerationMetaWithArtifact({
      theme: "minimal",
      status: "draft",
      now: "2026-05-25T01:00:00.000Z",
      existingArtifact,
      historyEvent: {
        type: "schema_edited",
      },
      schema: {
        fields: [
          {
            key: "name",
            label: "Name",
            type: "text",
          },
        ],
      },
    });

    expect(generation.artifact?.history).toHaveLength(50);
    expect(generation.artifact?.history?.[0].id).toBe("event-1");
    expect(generation.artifact?.history?.at(-1)?.type).toBe("schema_edited");
  });
});
