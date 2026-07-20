import { describe, expect, it } from "vitest";

import {
  buildGeneratedFormDraftFromTemplate,
  getHomepageSceneTemplates,
  getLocalizedSceneTemplateSchema,
  getSceneTemplateById,
  getSceneTemplateCategories,
  getTemplateAutomationSummary,
  homepageTemplateIds,
  sceneTemplates,
} from "./form-templates";

describe("form templates", () => {
  it("provides the first public benchmark template catalog", () => {
    expect(sceneTemplates).toHaveLength(24);
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

  it("selects the localized schema before a template draft is generated", () => {
    const template = getSceneTemplateById("event-registration");

    expect(template).toBeTruthy();
    expect(getLocalizedSceneTemplateSchema(template!, "en")).toBe(
      template!.formSchemaEn
    );
    expect(getLocalizedSceneTemplateSchema(template!, "es-419")).toBe(
      template!.formSchemaEn
    );
    expect(getLocalizedSceneTemplateSchema(template!, "zh")).toBe(
      template!.formSchema
    );
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

  it("keeps the event registration template scoped to signup and RSVP collection", () => {
    const template = getSceneTemplateById("event-registration");

    expect(template).toBeTruthy();
    expect(template?.descriptionEn).toMatch(/signups|rsvp|qr/i);
    expect(template?.formSchema.fields.map((field) => field.key)).toContain(
      "attendance_preference"
    );
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toContain(
      "attendance_preference"
    );

    const searchableCopy = [
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      ...(template?.agentQuickActions || []),
      ...(template?.agentQuickActionsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ]
      .join(" ")
      .toLowerCase();

    expect(searchableCopy).not.toMatch(
      /ticket|payment|seat|check-in|check in|confirmation email|email template|门票|票种|座位/
    );
  });

  it("keeps the satisfaction survey template focused on lightweight feedback", () => {
    const template = getSceneTemplateById("satisfaction-survey");

    expect(template).toBeTruthy();
    expect(template?.formSchema.fields.map((field) => field.key)).toEqual(
      expect.arrayContaining([
        "product_or_service",
        "satisfaction",
        "best_part",
        "improvement_area",
        "allow_follow_up",
      ])
    );
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toEqual(
      expect.arrayContaining([
        "product_or_service",
        "satisfaction",
        "best_part",
        "improvement_area",
        "allow_follow_up",
      ])
    );

    const searchableCopy = [
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");

    expect(searchableCopy).not.toMatch(
      /NPS benchmark|advanced CX analytics|email campaign|website widget|CRM native/i
    );
  });

  it("keeps the waitlist template within pre-launch collection boundaries", () => {
    const template = getSceneTemplateById("waitlist");

    expect(template).toBeTruthy();
    expect(template?.categoryEn).toBe("Lead Capture");
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toEqual(
      expect.arrayContaining([
        "contact_name",
        "email",
        "user_type",
        "pain_point",
        "invite_preference",
      ])
    );
    expect(template?.agentQuickActionsEn).toContain(
      "Draft beta welcome email copy"
    );

    const publicCopy = `${template?.descriptionEn} ${template?.scenarioEn} ${template?.agentQuickActionsEn?.join(" ")}`;
    expect(publicCopy).not.toMatch(
      /leaderboard|queue position|invite code|send email|email campaign|custom domain|unlimited free/i
    );
  });

  it("provides a real quote request template without pricing-system promises", () => {
    const template = getSceneTemplateById("quote-request");

    expect(template).toBeTruthy();
    expect(template?.categoryEn).toBe("Lead Capture");
    expect(template?.formSchemaEn?.aspects?.visualDirection).toBe(
      "corporate-intake"
    );
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toEqual(
      expect.arrayContaining([
        "contact_method",
        "service_needed",
        "request_summary",
        "budget_range",
        "desired_timeline",
        "follow_up_consent",
      ])
    );

    const publicCopy = [
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
    ].join(" ");
    expect(publicCopy).not.toMatch(
      /instant quote|price calculator|formal quote|PDF quote|payment|invoice|file upload|dispatch/i
    );
  });

  it("provides a real demo request template without scheduling or CRM promises", () => {
    const template = getSceneTemplateById("demo-request");

    expect(template).toBeTruthy();
    expect(template?.categoryEn).toBe("Lead Capture");
    expect(template?.formSchemaEn?.fields).toHaveLength(8);
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toEqual(
      expect.arrayContaining([
        "work_contact",
        "company_name",
        "role",
        "team_size",
        "main_use_case",
        "evaluation_timeline",
        "follow_up_consent",
      ])
    );

    const publicCopy = [
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");
    expect(publicCopy).not.toMatch(
      /calendar sync|meeting invite|redirect-on-submit|lead scoring|CRM native|payment|embed|spam protection|unlimited free/i
    );
  });

  it("keeps job applications as lightweight candidate intake without files or ATS claims", () => {
    const template = getSceneTemplateById("job-application");

    expect(template).toBeTruthy();
    expect(template?.ocrTemplate).toBeUndefined();
    expect(template?.formSchema.fields.map((field) => field.key)).toContain(
      "professional_profile"
    );
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).not.toContain(
      "resume_file"
    );
    expect(template?.descriptionEn).toMatch(/without resume hosting, ATS pipelines/i);

    const publicCopy = [
      template?.scenario,
      template?.scenarioEn,
      template?.description,
      template?.descriptionEn,
      ...(template?.agentQuickActions || []),
      ...(template?.agentQuickActionsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");

    expect(publicCopy).not.toMatch(
      /resume attachment collection|resume upload|upload your resume|简历上传|上传简历|OCR extraction/i
    );
  });

  it("provides a volunteer application template without scheduling or screening promises", () => {
    const template = getSceneTemplateById("volunteer-application");

    expect(template).toBeTruthy();
    expect(template?.formSchema.fields.map((field) => field.key)).toEqual([
      "full_name",
      "contact_details",
      "volunteer_interest",
      "skills_experience",
      "motivation",
      "general_availability",
      "location_preference",
      "follow_up_consent",
    ]);
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toEqual(
      template?.formSchema.fields.map((field) => field.key)
    );
    expect(
      template?.formSchemaEn?.fields.find(
        (field) => field.key === "general_availability"
      )
    ).toMatchObject({ type: "checkbox", required: false });
    expect(
      template?.formSchemaEn?.fields.find(
        (field) => field.key === "follow_up_consent"
      )?.label
    ).toBe("I agree to be contacted about this application.");

    const publicCopy = [
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");

    expect(publicCopy).not.toMatch(
      /date picker|shift grid|remaining capacity|approved status|background check|file upload|electronic signature|日历|班次网格|剩余名额|背景调查|文件上传|电子签名/i
    );
  });

  it("provides a bounded customer service request template for manual follow-up", () => {
    const template = getSceneTemplateById("customer-service-request");

    expect(template).toBeTruthy();
    expect(template?.formSchema.fields.map((field) => field.key)).toEqual([
      "full_name",
      "contact_details",
      "request_type",
      "related_product_service",
      "request_description",
      "desired_outcome",
      "manual_follow_up_consent",
      "customer_reference",
    ]);
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toEqual(
      template?.formSchema.fields.map((field) => field.key)
    );
    expect(
      template?.formSchemaEn?.fields.find(
        (field) => field.key === "manual_follow_up_consent"
      )
    ).toMatchObject({ type: "radio", required: true });
    expect(
      template?.formSchemaEn?.fields.find(
        (field) => field.key === "customer_reference"
      )?.placeholder
    ).toMatch(/passwords.*payment information.*government ID.*verification codes.*tokens/i);
    expect(
      template?.formSchemaEn?.fields.find((field) => field.key === "request_type")
        ?.options?.map((option) => option.label)
    ).toEqual([
      "Product usage question",
      "Service-related request",
      "Complaint or feedback",
      "Other",
    ]);

    const publicCopy = [
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      ...(template?.agentQuickActions || []),
      ...(template?.agentQuickActionsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");

    expect(publicCopy).not.toMatch(
      /ticket number|ticket status|support portal|support inbox|SLA timer|automatic assignment|file upload|工单编号|工单状态|自动分派|文件上传/i
    );
  });

  it("keeps the customer story template within text and manual follow-up boundaries", () => {
    const template = getSceneTemplateById("customer-testimonial-form");

    expect(template).toBeTruthy();
    expect(template?.formSchema.fields.map((field) => field.key)).toEqual([
      "name",
      "product_used",
      "before_problem",
      "after_result",
      "public_permission",
      "company_role",
      "follow_up_contact",
    ]);
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toEqual(
      template?.formSchema.fields.map((field) => field.key)
    );
    expect(template?.formSchema.fields.some((field) => field.type === "image")).toBe(false);

    const publicCopy = [
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      ...(template?.agentQuickActions || []),
      ...(template?.agentQuickActionsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");

    expect(publicCopy).not.toMatch(
      /logo upload|headshot upload|screenshot upload|file upload|上传品牌|上传头像|上传截图/i
    );
  });

  it("keeps consultation booking as a request before manual confirmation", () => {
    const template = getSceneTemplateById("booking-consultation");

    expect(template).toBeTruthy();
    expect(template?.categoryEn).toBe("Request Intake");
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toContain(
      "preferred_time_window"
    );
    expect(template?.successCopyEn).toMatch(/review.*confirm/i);

    const publicCopy = [
      template?.scenario,
      template?.scenarioEn,
      template?.description,
      template?.descriptionEn,
      template?.successCopy,
      template?.successCopyEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      ...(template?.agentQuickActions || []),
      ...(template?.agentQuickActionsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");

    expect(publicCopy).not.toMatch(
      /calendar invite|calendar slot|confirmed booking|实时日历|自动确认|日历邀请/i
    );
  });

  it("keeps content download as an access request without file delivery claims", () => {
    const template = getSceneTemplateById("content-download");

    expect(template).toBeTruthy();
    expect(template?.nameEn).toBe("Lead Magnet Access Request Form");
    expect(template?.successCopyEn).toMatch(/existing process/i);
    expect(template?.formSchemaEn?.fields.find((field) => field.key === "email")?.label).toMatch(
      /follow up/i
    );

    const publicCopy = [
      template?.scenario,
      template?.scenarioEn,
      template?.description,
      template?.descriptionEn,
      template?.successCopy,
      template?.successCopyEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      ...(template?.agentQuickActions || []),
      ...(template?.agentQuickActionsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");

    expect(publicCopy).not.toMatch(
      /send the PDF to|just the PDF please|资料发送到哪个邮箱|自动发送邮件|automatic file delivery/i
    );
  });

  it("keeps course registration as education intake without operational promises", () => {
    const template = getSceneTemplateById("course-registration");

    expect(template).toBeTruthy();
    expect(template?.categoryEn).toBe("Education & Training");
    expect(template?.formSchemaEn?.fields.map((field) => field.key)).toEqual(
      expect.arrayContaining([
        "student_name",
        "contact",
        "course_name",
        "experience_level",
        "learning_goal",
      ])
    );

    const publicCopy = [
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      ...(template?.agentQuickActions || []),
      ...(template?.agentQuickActionsEn || []),
      JSON.stringify(template?.formSchema),
      JSON.stringify(template?.formSchemaEn),
    ].join(" ");

    expect(publicCopy).not.toMatch(
      /开课通知|生成报名确认文案|write confirmation|draft confirmation|for class details delivery|payment or confirmation status/i
    );
  });

  it("keeps community applications contactable and manually reviewed", () => {
    const template = getSceneTemplateById("community-application");
    const zhKeys = template?.formSchema.fields.map((field) => field.key);
    const enKeys = template?.formSchemaEn?.fields.map((field) => field.key);

    expect(template).toBeTruthy();
    expect(zhKeys).toEqual(
      expect.arrayContaining(["contact_details", "follow_up_consent"])
    );
    expect(enKeys).toEqual(
      expect.arrayContaining(["contact_details", "follow_up_consent"])
    );

    const publicCopy = [
      template?.name,
      template?.nameEn,
      template?.description,
      template?.descriptionEn,
      ...(template?.suggestedPrompts || []),
      ...(template?.suggestedPromptsEn || []),
      ...(template?.agentQuickActions || []),
      ...(template?.agentQuickActionsEn || []),
    ].join(" ");

    expect(publicCopy).toMatch(/人工审核|manual team review/i);
    expect(publicCopy).not.toMatch(
      /入群通知|生成入群审核提示|draft welcome message|automatic approval|automatic invitation/i
    );
  });
});
