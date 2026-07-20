# SEO Architect Brief: Customer Service Request Template

> Version: 2026-06-29
> Loop stage: Validate -> Decide -> Architect
> Build gate: product and UX conditional approval received; required changes incorporated below
> Evidence: `ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Service_Request_Complaint.md`
> Product truth review: `ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Batch3_Product_Truth_Review_2026-06-29.md`

## 1. Architect Decision

Create one lightweight Template asset only:

- Template ID: `customer-service-request`
- URL: `/templates/customer-service-request`
- English name: `Customer Service Request Form`
- Chinese name: `客户服务请求表`
- Category: Contact & Feedback / 联系与反馈
- Intent: `service_request_intake`
- Parent Topics: Contact Form and Customer Feedback

Do not create a Solution, Use Case, Post, Integration, Alternative or pSEO page.

Positioning:

> A lightweight customer service request intake form for collecting contact details, request type, product or service context, a clear description and the customer's preferred follow-up path. Share it by link or QR code, review responses, export CSV or notify the team through a Webhook path.

This is an intake form, not helpdesk, ticketing, maintenance dispatch or SLA software.

## 2. Search Intent And Ownership

Owned intent:

- `service request form`
- `service request form template`
- `customer support request form`
- lightweight `customer service form`

Merged supporting intent:

- customer complaint intake when the task is information collection and manual follow-up.

Excluded intent:

- `work request form` and maintenance request.
- IT helpdesk or support ticket system.
- ticket status, SLA, automated routing or agent assignment.
- complaint evidence upload or regulated dispute handling.

## 3. Product Boundaries

Supported:

- AI-generated intake fields.
- mobile one-question flow.
- public share link and QR access.
- submission collection and response dashboard.
- CSV export.
- generic Webhook, delivery logs and retry.
- Feishu, DingTalk, WeCom and Slack Incoming Webhook notification paths.

Unsupported and prohibited:

- ticket number, ticket status or helpdesk queue.
- SLA, escalation timer or response-time guarantee.
- automatic routing, assignment or ownership.
- support inbox or production email notifications.
- file, screenshot or photo upload.
- automatic resolution or AI customer-support agent claims.
- native Zendesk, Jira, CRM or helpdesk synchronization.
- payment-card, password, government-ID or authentication-secret collection.
- iframe/HTML embed.

Webhook or bot notifications must be described as team alerts, never ticket assignment.

## 4. Required Fields

Use this order:

1. Full name - required.
2. Email or phone - required; only for manual follow-up on this request.
3. Request type - required: product question, service request, complaint/feedback or other.
4. Related product or service - optional.
5. Request description - required.
6. Desired outcome - optional.
7. Consent to manual follow-up - required. Do not ask for a second preferred channel that can conflict with the contact details supplied in field 2.
8. Order or customer reference - optional; the visible placeholder must warn users not to enter passwords, complete payment information, government ID or authentication secrets such as verification codes or tokens.

Do not add file upload, screenshot upload, severity, priority, assignee, SLA, due date, ticket status, resolution status or internal support-owner fields.

## 5. Template Content

English scenario:

`Lightweight customer service requests, support questions and complaint intake before manual team follow-up.`

Chinese scenario:

`用于团队人工跟进前的轻量客户服务请求、支持问题和投诉信息收集。`

English success message:

`Your request has been submitted. The team can review the information and follow up manually through the contact method you provided.`

Chinese success message:

`你的请求已提交。团队会人工查看信息，并通过你提供的联系方式跟进。`

The preview must show the first five real intake fields. It must not show a ticket number, open/in-progress/closed state, SLA timer, agent avatar, assignment control, upload box or support inbox.

Use these natural labels and request-type options in the English preview and schema:

1. `What is your name?`
2. `How can the team contact you?` - email or phone.
3. `What do you need help with?` - Product usage question / Service-related request / Complaint or feedback / Other.
4. `Which product or service is this about?`
5. `Please describe your request.`

## 6. CTA And Creation Context

CTA must carry:

- `template=customer-service-request`
- `source=template_customer-service-request`
- `intent=service_request_intake`
- the bounded prompt below.

English CTA label:

`Use the customer service request template`

CTA helper badge:

`AI Ready • Share link / QR`

English prompt:

```text
Create a lightweight customer service request intake form with name, email or phone contact details, request type, related product or service, request description, optional desired outcome, required consent to manual follow-up, and an optional order or customer reference. Do not create ticket numbers or statuses, SLA promises, escalation timers, automatic routing or assignment, support inboxes, file uploads, automatic resolution, native helpdesk or CRM synchronization, password fields, complete payment information, government ID, authentication secrets such as verification codes or tokens, production email, or embed promises.
```

Chinese prompt:

```text
创建一个轻量客户服务请求信息收集表，包含姓名、邮箱或电话联系方式、请求类型、相关产品或服务、请求描述、可选的期望处理结果、必填的人工后续联系许可和可选的订单号或客户编号。不要生成工单编号或状态、SLA 承诺、升级计时、自动路由或分派、客服邮箱系统、文件上传、自动解决、原生 Helpdesk 或 CRM 同步、密码字段、完整支付信息、政府身份证件、验证码或 Token 等认证信息、生产级邮件或嵌入承诺。
```

## 7. Metadata

English title:

`Customer Service Request Form Template`

English description:

`Create a customer service request form for contact details, request type, product context and manual follow-up. Share by link or QR code and review responses in one place.`

Chinese title:

`客户服务请求表模板`

Chinese description:

`创建客户服务请求表，收集联系方式、请求类型、相关产品或服务和问题描述，通过链接或二维码分享并由团队人工跟进。`

The root layout appends `| GenForms.ai`; do not include a brand suffix in the override.

## 8. Visible FAQ And Schema

Visible FAQ and FAQPage JSON-LD must share the same source data.

English:

1. **Is this a helpdesk or ticketing system?**
   - No. This template collects customer service requests for manual review. It does not create ticket numbers, statuses, queues or SLA workflows.
2. **Can customers upload screenshots or files?**
   - No. The current template collects structured text responses and references only; it does not accept file, image or screenshot uploads.
3. **Does GenForms assign requests to support agents?**
   - No. When configured, a Webhook or supported Incoming Webhook path can notify your team, but GenForms does not route or assign requests to agents.
4. **Where can I review customer service requests?**
   - Review responses in the submission dashboard, export CSV, or notify the team through a generic Webhook or supported Incoming Webhook path.

Chinese:

1. **这是 Helpdesk 或工单系统吗？**
   - 不是。该模板只收集客户服务请求供团队人工查看，不会创建工单编号、状态、队列或 SLA 工作流。
2. **客户可以上传截图或文件吗？**
   - 不可以。当前模板只收集结构化文本和参考编号，不接受文件、图片或截图上传。
3. **GenForms 会把请求分派给客服人员吗？**
   - 不会。配置后，Webhook 或支持的 Incoming Webhook 路径可以提醒团队，但 GenForms 不会自动路由或分派请求。
4. **在哪里查看客户服务请求？**
   - 可以在提交数据面板查看回复、导出 CSV，或通过通用 Webhook 或支持的 Incoming Webhook 路径提醒团队。

Schema:

- retain Template SoftwareApplication behavior.
- retain BreadcrumbList.
- add FAQPage only when the same FAQ is visible.
- do not add ticket, support-service, SLA, maintenance, image-upload or rating Schema.

## 9. Internal Links

Allowed contextual links:

- `/use-cases/contact-form-builder-for-websites` for general website contact intake.
- `/use-cases/customer-feedback-form-builder` for feedback-focused collection.
- `/use-cases/webhook-form-builder-retry-logs` for team alerts and delivery logs.

Do not create a new Service Request Pillar. Do not add links from maintenance, booking or vendor Topics.

## 10. Build Scope

Expected files:

- `Code/services/form-templates.ts`
- `Code/services/form-creation-context.ts`
- `Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
- focused tests for fields, metadata, FAQ, CTA context and product boundaries

No database migration, new dependency or Topic-specific page component is required.

Add `customer-service-request` to `templateOnlyTopicIds` so it cannot automatically promote a Solution asset.

## 11. Acceptance Criteria

- Only `/templates/customer-service-request` is created.
- English and Chinese metadata omit a manual brand suffix.
- The eight fields match this Brief; field 7 is required manual follow-up consent, and no conflicting preferred-channel field is present.
- The optional order/reference placeholder visibly prohibits passwords, complete payment information, government ID and authentication secrets such as verification codes or tokens.
- Request type uses Product usage question / Service-related request / Complaint or feedback / Other; desired outcome contains no guaranteed resolution or response-time promise.
- CTA carries `template`, `source`, `intent` and the bounded prompt.
- CTA helper badge is `AI Ready • Share link / QR` or its Chinese equivalent.
- Visible FAQ exactly matches FAQPage JSON-LD.
- Preview uses the first five real intake fields.
- No ticket number/status, queue, SLA, escalation, assignment, upload, support inbox, native sync, payment-card/password, production email or embed promise appears.
- Webhook/Bot wording means team notification, not assignment.
- The Template is in sitemap with valid canonical, hreflang and BreadcrumbList.
- Focused tests, full test suite, build, desktop/mobile rendering and production SEO/release gates pass before deployment.

## 12. Observation

After deployment:

- submit only the English and Chinese Template URLs to Google/Bing.
- freeze for 7-14 days.
- observe `service request form`, `service request form template`, `customer support request form` and `customer service form`.
- observe `template_customer-service-request` and `service_request_intake` create/generate/publish events.
- do not add a Solution, Use Case, Post or pSEO page during the freeze.
