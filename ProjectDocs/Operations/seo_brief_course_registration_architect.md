# SEO Architect Brief: Course Registration Form

> Version: 2026-06-28
> Loop stage: Validate -> Architect
> Build gate: product and UX review required
> Evidence review: `ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Course_Community_review.md`
> Primary category: Education & Training
> Related product family: Event Registration

## 1. Architect decision

Course Registration enters Architect using the two existing assets:

- `/solutions/course-registration-form-builder`
- `/templates/course-registration`

Do not create a new Use Case, Post, Integration page, Alternative page, or pSEO batch in the first round.

Positioning:

> AI course registration form builder for classes, training programs, workshops, and cohorts. Collect student details and learning goals, share by link or QR code, review responses, export CSV, and route new registrations through webhook-ready follow-up.

This is a registration-data collection tool, not a tuition checkout, seat inventory, attendance, certificate, email automation, calendar, or LMS platform.

## 2. Evidence summary

Google US evidence covers:

- `course registration form`
- `course registration form template`
- `class registration form`
- `training registration form`
- `workshop registration form`
- `online course registration form`

Observed pattern:

- 33 of 56 extracted rows are template pages.
- Repeated competitors include SurveyMonkey, Jotform, 123FormBuilder, Tally, AidaForm, Fillout, and other form/template providers.
- Academic registrar PDFs create a secondary document intent.
- Only one extracted snippet explicitly mentions payment upfront.
- Only one extracted snippet explicitly mentions capacity.

GSC baseline, latest available 28d snapshot:

- Existing Solution: 42 impressions, 0 clicks, average position 65.1.
- `course form`: 23 impressions, 0 clicks, average position 69.7.

Conclusion: the page needs stronger task alignment and truthful boundaries, not a narrower invented `pre-registration` keyword or a payment workaround that the product does not support.

## 3. Search intent and ownership

Primary user task:

1. Start from a course/class/training/workshop registration template.
2. Collect student identity, contact details, course choice, experience, learning goal, and optional scheduling preference.
3. Share a public link or QR code.
4. Review registrations in a dashboard.
5. Export CSV or route registrations through a Webhook/Bot path.

Topic ownership:

- Primary category: Education & Training.
- Related product family: Event Registration.
- Workshop registration already overlaps the Event Registration Topic.
- Link/QR distribution and attendee data collection are shared capabilities.

Do not classify this Topic as Lead Capture. A course registration may create a lead, but the user's stated task is registration/enrollment intake rather than sales lead capture.

## 4. Product boundaries

Supported:

- AI-generated course registration fields.
- public share link.
- QR access.
- response collection and dashboard.
- CSV export.
- generic Webhook configuration, delivery logs, and retry.
- Feishu, DingTalk, WeCom, and Slack Bot paths.
- mobile one-question flow.

Unsupported and prohibited in copy:

- tuition or payment collection.
- Stripe, PayPal, Paddle, or checkout handling.
- seat/capacity inventory or automatic registration closing.
- production-grade confirmation email.
- configurable Success Redirect.
- calendar scheduling or automatic class invitation.
- attendance tracking or certificates.
- native LMS/CRM synchronization.
- iframe or HTML embed.

## 5. Existing Solution structure

URL remains:

`/solutions/course-registration-form-builder`

### Metadata

Suggested English title:

`Course Registration Form Builder for Classes & Training | GenForms`

Suggested English description:

`Create a mobile-friendly course registration form with AI. Collect student details and learning goals, share by link or QR code, review responses, export CSV, and use webhook-ready follow-up.`

Suggested Chinese title:

`AI 课程报名表单生成器 | GenForms`

Suggested Chinese description:

`用 AI 创建适合课程、培训和工作坊的移动端报名表，通过公开链接或二维码分享，并查看提交、导出 CSV 或接入 Webhook 后续流程。`

### Hero

English H1:

`Course Registration Form Builder`

English supporting copy:

`Create a mobile-friendly registration form for classes, training programs, workshops, or cohorts. Collect student details and learning goals, then share by link or QR code and review every response in one place.`

Primary CTA:

- English: `Create a course registration form`
- Chinese: `创建课程报名表`

Secondary CTA:

- English: `Preview registration fields`
- Chinese: `查看报名字段`
- Destination: `#recommended-fields`

Badge:

- English: `AI Ready • Share link / QR`
- Chinese: `AI 生成 • 链接 / 二维码分享`

Hero preview must use the real `course-registration` template. It must not show ticket sales, payment, seat limits, automated email, or calendar confirmation.

## 6. Recommended fields

Use this field order:

1. Student name
2. Email or phone
3. Course, class, workshop, or training choice
4. Experience level
5. Learning goal
6. Preferred session or time window (optional preference only; it does not reserve or lock a time)
7. Accessibility or learning support needs (optional; do not request medical diagnoses)
8. Questions for the instructor
9. Follow-up consent

Remove from the Solution recommended-field list:

- `Payment or confirmation status`

The existing template may retain course-choice and experience fields. Any text such as `For class details delivery` must be changed to neutral contact wording because GenForms does not send production email confirmations.

## 7. Workflow module

Visible workflow:

```text
Describe the course or training program
-> Generate and adjust registration fields
-> Publish a public link
-> Share the link or QR code
-> Collect registrations
-> Review responses, export CSV, or route through Webhook/Bot
```

Do not include a Redirect-to-Stripe, Redirect-to-Calendly, automatic email, seat-locking, or LMS step.

## 8. FAQ and Schema

Visible FAQ and FAQPage JSON-LD must match exactly.

1. **Can I create a course registration form with AI?**
   - Yes. Describe the class, course, training program, workshop, or cohort and GenForms can draft registration fields you can review before publishing.

2. **Can students register from a QR code?**
   - Yes. Publish the form as a public link and use QR access on course pages, posters, slides, handouts, or venue signs.

3. **Does GenForms collect tuition or course payments?**
   - No. GenForms collects registration details and learning preferences. It does not process tuition, payments, refunds, coupons, or checkout.

4. **Can GenForms enforce class size or seat limits?**
   - No. The current product does not count or lock seats, stop submissions at a capacity threshold, or manage a waitlist automatically.

5. **Does GenForms send confirmation emails or sync with an LMS?**
   - No. Production email confirmation, calendar invitations, certificates, attendance tracking, and native LMS synchronization are outside the current product promise.

6. **Where can I review course registrations?**
   - Review responses in the submission dashboard, export CSV, or route new registrations through a generic Webhook or supported Bot path.

Schema:

- retain SoftwareApplication.
- retain BreadcrumbList.
- retain FAQPage only when visible FAQ is identical.
- do not add Event, CourseInstance, Offer, AggregateOffer, or Product payment Schema.

## 9. CTA intent and creation context

Add a dedicated creation intent:

- `intent=course_registration`

Solution CTA:

```text
/forms/new?template=course-registration
  &source=solution_course-registration-form-builder
  &intent=course_registration
  &prompt=Create+a+course+registration+form+for+classes+training+programs+workshops+or+cohorts+with+student+contact+course+choice+experience+learning+goal+and+follow-up+consent
```

Template CTA should use:

- `source=template_course-registration`
- `intent=course_registration`

Chinese Solution creation prompt:

```text
创建一个适合课程、班级、培训项目、工作坊或训练营的报名表，收集学员姓名、联系方式、课程选择、经验水平、学习目标、可选时间偏好和后续联系许可。不要生成支付、名额锁定、自动邮件、日历预约、考勤、证书、LMS 同步或跳转承诺。
```

Template creation prompt must use the same boundary. It may generate registration and preference fields only; it must not generate payment, confirmation-email, calendar, capacity, attendance, certificate, LMS, embed, or Redirect promises.

Do not use `lead_capture`, `payment`, `ticket_sales`, `calendar_booking`, or `pre_registration` as the primary intent.

## 10. Internal links

Required links from Course Solution:

| Destination | Anchor |
|---|---|
| `/templates/course-registration` | `course registration form template` |
| `/use-cases/event-registration-form-builder` | `event and workshop registration forms` |
| `/use-cases/qr-code-form-builder` | `share registration forms with a QR code` |
| `/use-cases/webhook-form-builder-retry-logs` | `webhook-ready registration follow-up` |

Required links into Course Solution:

| Source | Anchor |
|---|---|
| `/templates/course-registration` | `course registration form builder` |
| `/use-cases/event-registration-form-builder` | `course and training registration` |
| `/use-cases/qr-code-form-builder` | `course registration with QR access` |

Do not add links from unrelated Lead Capture pages solely to force Topic ownership.

## 11. First-round build scope

Files expected to change after review:

- `Code/services/solution-landing-pages.ts`
- `Code/services/form-templates.ts`
- `Code/services/form-creation-context.ts`
- related tests for boundaries, CTA context, and internal links

Potential shared-page changes are allowed only when they follow existing generic Solution/Template patterns.

Because the required Event Registration, QR, and Webhook links exceed the current same-template fallback behavior, Build scope may also include:

- `Code/app/[locale]/(default)/solutions/[slug]/page.tsx`
- `Code/services/growth-content-clusters.ts` or an equivalent established relationship map
- focused tests for Course-specific related links and removal of generic Typeform / Lead Capture cards

No database migration or new package is required.

## 12. Acceptance criteria

- Existing Course Solution and Template remain the only Course assets.
- Metadata/H1/visible copy match course registration intent.
- No payment, capacity, confirmation-email, Redirect, calendar, attendance, certificate, LMS, CRM, or embed promise remains.
- CTA carries `template=course-registration`, correct source, `intent=course_registration`, and a bounded prompt.
- Template and Solution link to each other.
- Course links to Event Registration, QR, and Webhook only where contextually useful.
- FAQPage content matches visible FAQ.
- canonical, hreflang, sitemap, BreadcrumbList, and SoftwareApplication remain valid.
- focused tests, production build, local desktop/mobile rendering, and production SEO verification pass before deployment.

## 13. Freeze and observation

After deployment:

- submit only the modified Course Solution and Template to Google/Bing URL Inspection.
- freeze for 7-14 days.
- observe `course form`, `course registration form`, `class registration form`, `training registration form`, and `workshop registration form`.
- observe landing sessions and `course_registration` create/generate/publish events.
- do not create supporting Posts or pSEO pages until the existing two-page package earns stable query ownership.
