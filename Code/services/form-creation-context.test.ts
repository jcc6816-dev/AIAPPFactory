import { describe, expect, it } from "vitest";

import {
  getTemplateCreationDefaults,
  getUseCaseCreationContext,
} from "./form-creation-context";

describe("form creation context", () => {
  it("maps the waitlist use case to the waitlist intent", () => {
    expect(
      getUseCaseCreationContext("waitlist-form-builder-indie-hackers")
    ).toEqual({ intent: "waitlist" });
  });

  it("provides bilingual waitlist template defaults", () => {
    const english = getTemplateCreationDefaults("waitlist", "en");
    const chinese = getTemplateCreationDefaults("waitlist", "zh");

    expect(english).toMatchObject({
      source: "template_waitlist",
      intent: "waitlist",
    });
    expect(english.prompt).toContain("pre-launch waitlist form");
    expect(chinese.prompt).toContain("产品预发布 Waitlist 表单");
  });

  it("keeps quote request context from use case through template creation", () => {
    expect(getUseCaseCreationContext("quote-request-form-builder")).toEqual({
      intent: "quote_request",
    });

    const english = getTemplateCreationDefaults("quote-request", "en");
    const chinese = getTemplateCreationDefaults("quote-request", "zh");

    expect(english).toMatchObject({
      source: "template_quote-request",
      intent: "quote_request",
    });
    expect(english.prompt).toContain("quote request form");
    expect(chinese.prompt).toContain("询价需求表");
  });

  it("keeps demo request context from use case through template creation", () => {
    expect(getUseCaseCreationContext("demo-request-form-builder")).toEqual({
      intent: "demo_request",
    });

    const english = getTemplateCreationDefaults("demo-request", "en");
    const chinese = getTemplateCreationDefaults("demo-request", "zh");

    expect(english).toMatchObject({
      source: "template_demo-request",
      intent: "demo_request",
    });
    expect(english.prompt).toContain("B2B demo request form");
    expect(chinese.prompt).toContain("B2B Demo 申请表");
  });

  it("keeps lead magnet and newsletter template-only contexts within product boundaries", () => {
    const leadMagnet = getTemplateCreationDefaults("content-download", "en");
    const newsletter = getTemplateCreationDefaults("newsletter-signup", "en");

    expect(leadMagnet).toMatchObject({
      source: "template_content-download",
      intent: "lead_magnet_request",
    });
    expect(leadMagnet.prompt).toContain("Do not promise automatic email");

    expect(newsletter).toMatchObject({
      source: "template_newsletter-signup",
      intent: "newsletter_signup",
    });
    expect(newsletter.prompt).toContain("Do not promise website embed");
  });

  it("provides bounded course and community template creation contexts", () => {
    const courseEn = getTemplateCreationDefaults("course-registration", "en");
    const courseZh = getTemplateCreationDefaults("course-registration", "zh");
    const communityEn = getTemplateCreationDefaults("community-application", "en");
    const communityZh = getTemplateCreationDefaults("community-application", "zh");

    expect(courseEn).toMatchObject({
      source: "template_course-registration",
      intent: "course_registration",
    });
    expect(courseEn.prompt).toContain("Do not promise payment");
    expect(courseZh.prompt).toContain("不要生成支付");

    expect(communityEn).toMatchObject({
      source: "template_community-application",
      intent: "community_application",
    });
    expect(communityEn.prompt).toContain("manual follow-up consent");
    expect(communityEn.prompt).toContain("Do not promise automatic approval");
    expect(communityZh.prompt).toContain("人工后续联系许可");
  });

  it("provides a bounded volunteer application creation context", () => {
    const english = getTemplateCreationDefaults("volunteer-application", "en");
    const chinese = getTemplateCreationDefaults("volunteer-application", "zh");

    expect(english).toMatchObject({
      source: "template_volunteer-application",
      intent: "volunteer_application",
    });
    expect(english.prompt).toContain("general availability preference");
    expect(english.prompt).toContain("Do not create shift scheduling");
    expect(chinese.prompt).toContain("不要生成班次排期");
  });

  it("provides a bounded customer service request creation context", () => {
    const english = getTemplateCreationDefaults("customer-service-request", "en");
    const chinese = getTemplateCreationDefaults("customer-service-request", "zh");

    expect(english).toMatchObject({
      source: "template_customer-service-request",
      intent: "service_request_intake",
    });
    expect(english.prompt).toContain("required consent to manual follow-up");
    expect(english.prompt).toContain("government ID");
    expect(english.prompt).toContain("verification codes or tokens");
    expect(chinese.prompt).toContain("必填的人工后续联系许可");
    expect(chinese.prompt).toContain("验证码或 Token");
  });

  it("provides a bounded customer testimonial creation context", () => {
    const english = getTemplateCreationDefaults("customer-testimonial-form", "en");
    const chinese = getTemplateCreationDefaults("customer-testimonial-form", "zh");

    expect(english).toMatchObject({
      source: "template_customer-testimonial-form",
      intent: "customer_testimonial",
    });
    expect(english.prompt).toContain("publishing preference");
    expect(english.prompt).toContain("Do not create file");
    expect(chinese.prompt).toContain("公开使用偏好");
    expect(chinese.prompt).toContain("不要生成文件");
  });

  it("does not invent context for an unrelated template or use case", () => {
    expect(getTemplateCreationDefaults("contact-us", "en")).toEqual({});
    expect(getUseCaseCreationContext("unknown-use-case")).toEqual({});
  });
});
