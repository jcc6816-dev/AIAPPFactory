# SEO Cleanup Brief: Community Application Template-only Coverage

> Version: 2026-06-28
> Loop stage: Validate -> Decide Complete -> Cleanup / Observe
> Build gate: product review required
> Evidence review: `ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Course_Community_review.md`

## Decision

Keep:

- `/templates/community-application`

Retire:

- `/solutions/community-application-form-template`
- `/zh/solutions/community-application-form-template`

Permanent redirect targets:

- English Solution -> `/templates/community-application`
- Chinese Solution -> `/zh/templates/community-application`

Do not create a Use Case, Post, Integration, Alternative, or pSEO expansion.

## Rationale

- Broad Google queries are polluted by government, housing/planning, education, and generic application intent.
- Membership-qualified queries show a real lightweight template need.
- GSC first-party signal is only two page impressions in the latest 28-day sample.
- GenForms supports application-data collection but not approve/reject workflow, membership provisioning, payment, or automatic Discord/Slack invite generation.
- Keeping both a Solution and Template for the same weak intent creates unnecessary cannibalization.

## Template positioning

Positioning:

> A lightweight community application form for collecting applicant background, joining motivation, contribution intent, and rule consent. Review responses manually, export CSV, or notify your team through a Webhook/Bot path.

Supported:

- public link and QR sharing.
- application responses and dashboard.
- CSV export.
- generic Webhook and supported Bot notification paths.

Unsupported:

- approve/reject workflow.
- automatic invite generation.
- Discord/Slack native membership synchronization.
- membership account provisioning.
- payment or subscription handling.
- production email invitations.

## Required template corrections

- Final field order: applicant name, email or other contact details, background, joining reason, contribution, rule consent, and manual follow-up consent.
- Replace any `入群通知` wording with `申请通知` or `团队提醒`.
- Remove `生成入群审核提示`, `Draft welcome message`, and any language that implies approval or automatic invitation.
- Do not imply an approved status or automatic invitation.
- Add visible English/Chinese FAQ explaining manual review and external invite delivery.
- Add Template creation context:
  - `source=template_community-application`
  - `intent=community_application`
- Prompt must request only application fields and manual follow-up consent.

Prompt boundary:

```text
Create a community application form with applicant name, contact details, background, joining motivation, contribution intent, rules consent, and manual follow-up consent. Do not promise automatic approval, Discord or Slack invitations, membership provisioning, payment, subscriptions, or production email invitations.
```

中文 Prompt：

```text
创建一个社群申请表，收集申请人姓名、联系方式、背景、加入原因、可贡献内容、规则同意和人工后续联系许可。不要承诺自动审批、自动发送 Discord 或 Slack 邀请、会员开通、付款订阅或生产级邮件邀请。
```

## Visible FAQ

English:

1. **Are community applications approved automatically?**
   - No. GenForms collects application details for your team to review manually. It does not provide an approve/reject workflow.
2. **Does GenForms automatically send Discord or Slack invitations?**
   - No. Webhook or Bot paths can notify your team about a new application, but your team sends any community invitation through its existing external channel.
3. **Can GenForms process paid memberships?**
   - No. GenForms does not process membership payments, subscriptions, checkout, or account provisioning.
4. **Where can I review community applications?**
   - Review applications in the response dashboard, export CSV, or notify your team through a generic Webhook or supported Bot path.

Chinese:

1. **社群申请会自动批准吗？**
   - 不会。GenForms 负责收集申请信息，由团队人工审核；当前不提供通过或驳回审批流。
2. **会自动发送 Discord 或 Slack 邀请吗？**
   - 不会。Webhook 或机器人路径可以提醒团队有新申请，但社群邀请仍需团队通过现有外部渠道发送。
3. **支持付费会员吗？**
   - 不支持。GenForms 不处理会员付款、订阅、结账或账号开通。
4. **在哪里查看社群申请？**
   - 可以在回复数据面板查看申请、导出 CSV，或通过通用 Webhook 或支持的机器人路径提醒团队。

## Metadata

English title:

`Community Application Form Template | GenForms`

English description:

`Collect community applicant contact details, background, joining motivation, contribution intent, and consent for manual review. Share by link or QR code and review responses in one place.`

Chinese title:

`社群申请表模板 | GenForms`

Chinese description:

`收集社群申请人的联系方式、背景、加入原因、可贡献内容和人工跟进许可，通过链接或二维码分享，并由团队人工审核。`

## Redirect and index controls

- Add permanent redirects in `Code/next.config.mjs` for English and Chinese Solution routes.
- Redirect all three legacy entry forms: unprefixed, `/en`, and `/zh`.
- Remove the retired slug from exported `solutionLandingPages`, static params, listing pages, and sitemap.
- Ensure internal links no longer point to the retired Solution.
- Preserve the Template canonical and hreflang.

## Acceptance criteria

- Template returns 200 and remains in sitemap.
- Retired English/Chinese Solution routes return 308 to their localized Template targets.
- Retired slug is absent from sitemap and Solution listing.
- Template states that review and invite delivery are manual/external.
- No payment, approval, provisioning, native sync, or automated invite promise remains.
- CTA carries `intent=community_application`.
- focused tests, production build, local verification, and production SEO/release gates pass.

## Observation

Freeze the retained Template for 14 days after cleanup. Do not expand unless Google provides stable membership/community-form queries or product capabilities materially change.
