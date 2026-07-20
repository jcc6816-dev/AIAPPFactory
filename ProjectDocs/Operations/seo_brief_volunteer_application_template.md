# SEO Architect Brief: Volunteer Application Template

> Version: 2026-06-29
> Loop stage: Validate -> Decide Complete -> Architect
> Build gate: product and UX review required
> Evidence QA: `ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Batch3_Codex_Decide_2026-06-29.md`
> Product review: `ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Batch3_Product_Truth_Review_2026-06-29.md`

## 1. Architect Decision

Create one real Template asset:

- Template ID: `volunteer-application`
- URL: `/templates/volunteer-application`
- English name: `Volunteer Application Form`
- Chinese name: `志愿者申请表`
- Category: Nonprofit & Community / 公益与社群
- Intent: `volunteer_application`

Do not create a Solution, Use Case, Post, Integration, Alternative or pSEO page.

Positioning:

> A lightweight volunteer application form for collecting applicant contact details, interests, relevant skills, motivation, general availability preferences and manual follow-up consent. Share it by link or QR code, then review responses, export CSV or notify the team through a Webhook path.

This is an application/intake form, not volunteer scheduling, shift booking, screening, approval or volunteer-management software.

## 2. Search Intent And Ownership

Primary intent:

- `volunteer application form`
- `volunteer application form template`
- lightweight `volunteer registration form`

Excluded intent:

- `volunteer signup form` when the SERP expects shifts, slots or capacity.
- volunteer scheduling or rostering.
- background checks and legal screening.
- signed waivers or electronic signatures.

Topic ownership:

- Primary category: Nonprofit & Community.
- Related context: Community Application and Event Registration.
- It is not a Lead Capture subcluster and should not inherit sales language.

## 3. Product Boundaries

Supported:

- AI-generated application fields.
- mobile one-question flow.
- public share link and QR access.
- submission collection and response dashboard.
- CSV export.
- generic Webhook, delivery logs and retry.
- Feishu, DingTalk, WeCom and Slack Incoming Webhook notification paths.

Unsupported and prohibited:

- shift scheduling, calendars, slot selection or capacity limits.
- time reservation or confirmed assignment.
- background/criminal checks.
- automatic screening, approval, acceptance or rejection.
- file or resume upload.
- e-signature, waiver or legal-compliance claims.
- volunteer management, attendance or certificates.
- production email confirmation or invitation.
- native CRM/nonprofit-management synchronization.
- iframe/HTML embed.

## 4. Required Fields

Use this order:

1. Full name - required.
2. Email or phone - required.
3. Volunteer role or area of interest - required.
4. Relevant skills or experience - optional.
5. Why would you like to volunteer? - required.
6. General availability preference - optional; state that it does not reserve a shift.
7. Location preference: in person, remote or either - optional.
8. Consent to manual follow-up - required.

Do not enable these fields by default:

- date of birth.
- emergency contact.
- health, disability or accessibility diagnosis.
- government ID.
- criminal history/background-check authorization.
- references.
- signature or waiver.
- attachment upload.

## 5. Template Content

English scenario:

`Volunteer applications and interest intake for nonprofits, community groups, schools, events and local programs.`

Chinese scenario:

`适用于公益组织、社区团体、学校、活动和本地项目的志愿者申请与意向收集。`

Success message, English:

`Thank you for applying to volunteer. The team will review your information and follow up manually through its existing contact process.`

Success message, Chinese:

`感谢提交志愿者申请。团队会人工查看信息，并通过现有联系方式进行后续沟通。`

The template preview must show application fields, not a calendar, shift grid, capacity counter, approval status or upload control.

## 6. CTA And Creation Context

Template CTA must carry:

- `template=volunteer-application`
- `source=template_volunteer-application`
- `intent=volunteer_application`

English prompt:

```text
Create a volunteer application form with applicant name, contact details, volunteer role or interest, relevant skills, motivation, optional general availability preference, location preference, and consent for manual follow-up. Do not create shift scheduling, slot or capacity booking, background checks, automatic approval, file upload, electronic signature, attendance, certificates, production email, native CRM sync, or embed promises.
```

Chinese prompt:

```text
创建一个志愿者申请表，收集申请人姓名、联系方式、感兴趣的志愿岗位或领域、相关技能经验、参与动机、可选的一般时间偏好、地点偏好和人工后续联系许可。不要生成班次排期、时段或名额预订、背景调查、自动审批、文件上传、电子签名、考勤、证书、生产级邮件、原生 CRM 同步或嵌入承诺。
```

## 7. Metadata

English title:

`Volunteer Application Form Template`

English description:

`Create a volunteer application form for contact details, interests, skills, motivation and general availability preferences. Share by link or QR code and review responses in one place.`

Chinese title:

`志愿者申请表模板`

Chinese description:

`创建志愿者申请表，收集联系方式、志愿方向、技能经验、参与动机和一般时间偏好，通过链接或二维码分享并集中查看申请。`

## 8. Visible FAQ And Schema

Visible FAQ and FAQPage JSON-LD must match exactly.

English:

1. **Can volunteers choose or reserve a shift?**
   - No. This template can collect a general availability preference, but it does not schedule, reserve or limit shift slots.
2. **Does GenForms run volunteer background checks?**
   - No. GenForms collects application information only. Background screening and identity verification must be handled through an appropriate external process.
3. **Are volunteer applications approved automatically?**
   - No. Your team reviews applications and follows up manually. GenForms does not provide an approval or acceptance workflow.
4. **Where can I review volunteer applications?**
   - Review applications in the response dashboard, export CSV, or notify your team through a generic Webhook or supported Incoming Webhook path.

Chinese:

1. **志愿者可以选择或预订班次吗？**
   - 不可以。模板可以收集一般时间偏好，但不会安排、预订或限制班次名额。
2. **GenForms 会进行志愿者背景调查吗？**
   - 不会。GenForms 只负责收集申请信息；背景审查和身份验证需要通过适当的外部流程完成。
3. **志愿者申请会自动批准吗？**
   - 不会。申请由团队人工查看和跟进，GenForms 当前不提供批准或录取工作流。
4. **在哪里查看志愿者申请？**
   - 可以在回复数据面板查看申请、导出 CSV，或通过通用 Webhook 或支持的 Incoming Webhook 路径提醒团队。

Schema:

- retain Template SoftwareApplication/CreativeWork behavior used by existing template pages.
- retain BreadcrumbList.
- add FAQPage only when the same FAQ is visible.
- do not add Event, Schedule, Offer, JobPosting or capacity-related Schema.

## 9. Internal Links

Allowed contextual links:

- `/templates/community-application` as a related application template.
- `/use-cases/event-registration-form-builder` only for event attendee registration, not volunteer shift scheduling.
- `/use-cases/webhook-form-builder-retry-logs` for team notification and delivery logs.

Do not create forced links from Lead Capture pages. Do not link to booking or job-application pages in a way that changes Topic ownership.

## 10. Build Scope

Expected files:

- `Code/services/form-templates.ts`
- `Code/services/form-creation-context.ts`
- `Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
- focused tests for template fields, product boundaries, metadata, FAQ and CTA context

No database migration or new package is required.

Use established Template page behavior. Do not add a Volunteer-specific page component unless the existing generic template cannot meet an acceptance criterion.

## 11. Acceptance Criteria

- Only `/templates/volunteer-application` is created for this Topic.
- English and Chinese metadata use `Volunteer Application`, not `Volunteer Signup`.
- Template fields match the required list and do not default to sensitive screening fields.
- Availability is explicitly a preference and never implies booking or assignment.
- CTA carries the correct template, source, intent and bounded prompt.
- CTA helper badge reads `AI Ready • Share link / QR` in English and `AI 就绪 • 链接 / 二维码分享` in Chinese; it must not inherit `AI Ready • 30s Deploy`.
- The first five preview fields are full name, email or phone, volunteer role or interest, relevant skills or experience, and motivation.
- General availability uses broad checkbox preferences and explicitly states that it does not reserve or assign a shift.
- On mobile, the live preview appears before Properties & Integrations; the field table shows only field name and required status.
- FAQ appears after the field list and before automation/JSON details.
- No calendar, shift grid, remaining-capacity count, approved status, upload box or signature control appears in the page or preview.
- Visible FAQ matches FAQPage JSON-LD.
- No scheduling, slots, capacity, background check, approval, upload, e-signature, email, attendance, certificate, native sync or embed promise appears.
- The Template is in sitemap with valid canonical, hreflang and BreadcrumbList.
- Focused tests, TypeScript, production build, desktop/mobile rendering and production SEO/release gates pass before deployment.

## 12. Observation

After deployment:

- submit only the English and Chinese Template URLs to Google/Bing.
- freeze for 7-14 days.
- observe `volunteer application form`, `volunteer application form template`, `volunteer registration form` and `volunteer interest form`.
- observe `template_volunteer-application` and `volunteer_application` create/generate/publish events.
- do not add a Solution, Use Case, Post or pSEO page during the freeze.
