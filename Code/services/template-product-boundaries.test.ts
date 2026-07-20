import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const templatePagePath = path.join(
  process.cwd(),
  "app/[locale]/(default)/templates/[templateId]/page.tsx"
);

describe("template page product boundaries", () => {
  const source = fs.readFileSync(templatePagePath, "utf8");

  it("does not promise resume hosting, OCR extraction, or ATS delivery", () => {
    expect(source).not.toMatch(/direct resume download links/i);
    expect(source).not.toMatch(/candidate resumes be extracted automatically/i);
    expect(source).not.toMatch(/integrated OCR extraction pipeline/i);
    expect(source).not.toMatch(/简历下载链接|自动解析候选人简历|内置的智能 OCR 提取/i);
  });

  it("states that consultation requests require manual time confirmation", () => {
    expect(source).toContain("This is not a real-time calendar scheduling system.");
    expect(source).toContain("confirm the final time manually");
    expect(source).toContain("这不是实时日历排期系统");
  });

  it("does not promote template-only topics as solution assets", () => {
    expect(source).toContain('"job-application"');
    expect(source).toContain('"booking-consultation"');
    expect(source).toContain('"community-application"');
    expect(source).toContain('"volunteer-application"');
    expect(source).toContain('"customer-service-request"');
    expect(source).toContain("!templateOnlyTopicIds.has(template.id)");
  });

  it("states manual community review and course registration boundaries", () => {
    expect(source).toContain("Are community applications approved automatically?");
    expect(source).toContain("It does not provide an approve/reject workflow.");
    expect(source).toContain("Does GenForms collect tuition or enforce seat limits?");
    expect(source).toContain("It does not process tuition, lock seats");
  });

  it("keeps volunteer metadata, CTA, FAQ, and mobile layout within the approved brief", () => {
    expect(source).toContain('titleEn: "Volunteer Application Form Template"');
    expect(source).toContain('titleZh: "志愿者申请表模板"');
    expect(source).toContain('"Use the volunteer application template"');
    expect(source).toContain("AI Ready • Share link / QR");
    expect(source).toContain("Can volunteers choose or reserve a shift?");
    expect(source).toContain("does not schedule, reserve, assign, or limit shift slots");
    expect(source).toContain("order-2 lg:order-3 lg:col-span-12");
    expect(source).toContain("hidden sm:table-cell");
  });

  it("keeps customer service request metadata, CTA, FAQ, and helper copy bounded", () => {
    expect(source).toContain('titleEn: "Customer Service Request Form Template"');
    expect(source).toContain('titleZh: "客户服务请求表模板"');
    expect(source).toContain('"Use the customer service request template"');
    expect(source).toContain("Is this a helpdesk or ticketing system?");
    expect(source).toContain("When configured, a Webhook");
    expect(source).toContain('template.id === "customer-service-request"');
    expect(source).toContain("hidden lg:block order-3 lg:order-2");
    expect(source.indexOf("Keep product-boundary FAQs ahead of technical details on mobile.")).toBeGreaterThan(
      source.indexOf("faqsForLocale.map")
    );
  });
});
