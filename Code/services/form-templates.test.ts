import { describe, expect, it } from "vitest";

import {
  buildGeneratedFormDraftFromTemplate,
  getHomepageSceneTemplates,
  getSceneTemplateById,
  homepageTemplateIds,
  sceneTemplates,
} from "./form-templates";

describe("form templates", () => {
  it("provides the first public benchmark template catalog", () => {
    expect(sceneTemplates).toHaveLength(20);
    expect(new Set(sceneTemplates.map((template) => template.id)).size).toBe(
      sceneTemplates.length
    );
    expect(sceneTemplates.every((template) => template.source === "public_benchmark")).toBe(true);
  });

  it("keeps every template publishable as a generated draft", () => {
    for (const template of sceneTemplates) {
      expect(template.formSchema.layout).toBe("single");
      expect(template.formSchema.fields.length).toBeGreaterThanOrEqual(3);
      expect(template.formSchema.fields.length).toBeLessThanOrEqual(8);
      expect(template.agentQuickActions.length).toBeGreaterThanOrEqual(3);
      expect(template.suggestedPrompts.length).toBeGreaterThanOrEqual(1);

      const draft = buildGeneratedFormDraftFromTemplate(template);

      expect(draft.source).toBe("template");
      expect(draft.model).toBe(template.id);
      expect(draft.ocr_template).toBe(template.ocrTemplate);
      expect(draft.schema).toEqual(template.formSchema);
      expect(draft.schema).not.toBe(template.formSchema);
    }
  });

  it("provides homepage templates from existing ids", () => {
    const homepageTemplates = getHomepageSceneTemplates();

    expect(homepageTemplates).toHaveLength(homepageTemplateIds.length);
    expect(homepageTemplates.map((template) => template.id)).toEqual([...homepageTemplateIds]);
    expect(getSceneTemplateById("invoice-receipt-collection")?.ocrTemplate).toBe("invoice");
    expect(getSceneTemplateById("identity-qualification-collection")?.ocrTemplate).toBe(
      "id_card"
    );
  });
});
