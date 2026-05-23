import { describe, expect, it } from "vitest";

import {
  buildGeneratedFormDraftFromTemplate,
  getHomepageSceneTemplates,
  getSceneTemplateById,
  getSceneTemplateCategories,
  getTemplateAutomationSummary,
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

  it("keeps every template publishable as a generated draft with bilingual symmetry", () => {
    for (const template of sceneTemplates) {
      expect(template.formSchema.layout).toBe("single");
      expect(template.formSchema.fields.length).toBeGreaterThanOrEqual(3);
      expect(template.formSchema.fields.length).toBeLessThanOrEqual(8);
      expect(template.agentQuickActions.length).toBeGreaterThanOrEqual(3);
      expect(template.suggestedPrompts.length).toBeGreaterThanOrEqual(1);

      // Verify bilingual fields exist
      expect(template.nameEn).toBeTruthy();
      expect(template.categoryEn).toBeTruthy();
      expect(template.scenarioEn).toBeTruthy();
      expect(template.descriptionEn).toBeTruthy();
      expect(template.formSchemaEn).toBeTruthy();
      expect(template.agentQuickActionsEn?.length).toBeGreaterThanOrEqual(3);
      expect(template.suggestedPromptsEn?.length).toBeGreaterThanOrEqual(1);

      // Verify keys symmetry between CN and EN schemas to avoid webhook mapping leaks
      const cnKeys = template.formSchema.fields.map(f => f.key);
      const enKeys = template.formSchemaEn!.fields.map(f => f.key);
      expect(cnKeys).toEqual(enKeys);

      const draft = buildGeneratedFormDraftFromTemplate(template);

      expect(draft.source).toBe("template");
      expect(draft.model).toBe(template.id);
      expect(draft.ocr_template).toBe(template.ocrTemplate);
      expect(draft.webhook_provider).toBe(template.webhookPreset);
      expect(draft.schema).toEqual(template.formSchema);
      expect(draft.schema).not.toBe(template.formSchema);

      // Verify draft building with locale
      const draftEn = buildGeneratedFormDraftFromTemplate(template, "en-US");
      expect(draftEn.title).toBe(template.nameEn);
      expect(draftEn.description).toBe(template.descriptionEn);
      expect(draftEn.schema).toEqual(template.formSchemaEn);
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

  it("provides category and automation metadata for template picking", () => {
    expect(getSceneTemplateCategories()).toContain("增长获客");

    const invoiceTemplate = getSceneTemplateById("invoice-receipt-collection");

    expect(invoiceTemplate).toBeTruthy();
    expect(getTemplateAutomationSummary(invoiceTemplate!)).toContain("OCR：invoice");
    expect(getTemplateAutomationSummary(invoiceTemplate!)).toContain("推送：dingtalk_bot");
  });
});
