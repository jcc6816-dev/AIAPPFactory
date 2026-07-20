# Typeform Alternatives Authority & Distribution Plan — 2026-07

> 状态：Proof Pack Ready / No page rewrite / No external submission
> Backlog：JUL-A01
> Protected owner：`/posts/typeform-alternatives`
> Evidence：Google US batch 2026-07-03 + GSC through 2026-07-01

## 1. Decision

不再全文重写 `/posts/typeform-alternatives`，不创建第二个 Typeform Alternatives URL。当前动作是受控的 Authority/Distribution：争取相关第三方提及、保护现有 Cluster 内链、用真实社区问题验证卖点。

SERP 不能证明 backlinks 是唯一原因；它证明的是：first-party alternatives、竞品自有 comparison pages 和 Reddit 同时竞争，单纯继续堆正文的边际收益低。SaaSHub 是一个低风险、可追踪的 Authority 实验，不是已被本批 SERP 证明的排名杠杆。

## 2. Revalidated SERP Mix

三个 query 共 28 个 visible first-page organic rows。初版把 Formgrid、TinyCommand、Qualaroo、SmartSurvey 的 comparison 页面归为“第三方 editorial”，在站点身份复核后该分类不成立；它们应视为产品方自有内容。因此不再保留会误导决策的 57% / 32% 精确占比。

| Type | Examples | Meaning |
|---|---|---|
| First-party product / product-owned comparison | Tally、Fillout、Formbricks、MakeForms、Jotform、Youform、Formgrid、TinyCommand、Qualaroo、SmartSurvey | 品牌、产品事实与产品方 comparison 内容是主要占位形式 |
| UGC / forum | Reddit r/Entrepreneur | 用户讨论影响信任，但不能做垃圾推广 |
| Verified independent directory/editorial | 本批 SERP 证据未确认 | 不得据此声称目录收录一定提升排名；SaaSHub 仅作为可测实验 |

## 3. Product Truth Pitch

可以使用：

- Free：3 published forms、100 starter submissions。
- Pro：$19/month；$180/year（相当于 $15/month billed annually）。
- Business：Custom。
- AI template/prompt generation。
- One-question flow、public link、QR sharing。
- Submission dashboard、CSV、Webhook delivery/retry logs（按真实套餐边界）。

禁止使用：

- Buyout、lifetime deal、one-time purchase。
- Unlimited free forms/responses。
- Conditional logic、native CRM sync、production email automation、spam protection、embed。
- “cheapest”或无法证明的价格比较。

## 4. Distribution Workstreams

### A. Validated external targets

| Candidate | Validation | Status | Controlled action |
|---|---|---|---|
| SaaSHub | `/submit` 直接页明确为免费软件提交工具 | **Go** | 使用 `saashub_authority_submission_proof_pack_2026-07-03.md` 进行人工审核和提交；不自动执行 |
| AlternativeTo | 已尝试提交路径 404，先前遇到 Cloudflare | **Blocked** | 不猜测规则、不绕过保护；获得可验证提交路径后再复核 |
| Formgrid | 第一方表单产品及其自有 Typeform Alternatives 页面 | **Reject** | 不作为中立目录外联 |
| TinyCommand | 第一方 Forms / workflow SaaS | **Reject** | 不作为中立目录外联 |
| Qualaroo / SmartSurvey | 竞品自有 comparison 内容，未验证公开更新政策 | **Hold** | 当前不投入；只有出现公开、合规的 editorial update policy 才复核 |

验证来源：`research_batch_2026-07-05_prepare/authority_target_validation.md`。不自动联系；任何 outreach 先确认网站仍有真实编辑流程、联系人和更新政策。

### B. Community participation

- 不回复多年旧 Reddit 线程只为贴链接。
- 只参与新的、明确询问 Typeform free/cheaper/AI alternative 的讨论。
- 先完整回答价格、free limits、single-question flow 和 webhook trade-off；只有社区规则允许时才附 GenForms 链接。
- 必须披露与 GenForms 的关系，不伪装普通用户。

### C. Existing cluster protection

当前代码已把：

- `/posts/typeform-alternatives`
- `/use-cases/typeform-alternative-webhooks`
- `/posts/google-forms-vs-typeform-vs-genforms-workflow`
- Lead Capture 支撑内容

接入同一 Growth Cluster，并为 Typeform Post 配置 `typeform_alternative + typeform_style` CTA。当前不新增内部同义 URL；只在后续 release audit 中检查链接是否仍可访问。

## 5. Outreach Proof Pack

每次 outreach 只提供：

1. GenForms 首页与定价锚点。
2. `/posts/typeform-alternatives`。
3. `/use-cases/typeform-alternative-webhooks`。
4. 一张真实 mobile one-question flow 图。
5. 一张 Webhook logs/retry proof 图。
6. 公开、可复核的 Free/Pro/Business limits。

### Short factual description

> GenForms is an AI form builder for creating mobile-friendly, one-question forms from a prompt or template. It publishes share links and QR access, stores responses in a dashboard, supports CSV export, and offers webhook delivery with retry logs. The public plans are Free, Pro at $19/month or $180/year, and a custom Business plan.

不把这段描述自动群发；每个站点按其 editorial format 调整，并保持事实不变。

## 6. Measurement

- Accepted third-party mentions。
- Live referral links and referral sessions with explicit UTM。
- Branded query impressions。
- `/posts/typeform-alternatives` 7d/28d impressions、position、clicks。
- `post_typeform-alternatives` CTA click。
- U-062 完成后才看 attributed create/publish/real submission。

## 7. Stop Rules

- 站点要求购买 dofollow link、虚假 review 或 undisclosed sponsorship：Reject。
- 两次合规 outreach 无回应：Hold，不持续骚扰。
- Reddit/社区规则不允许自我推广：只回答，不放链接。
- 28-45 天无 referral/branded/GSC 改善：停止该渠道，保留已获得的自然提及。
- 不因 Authority campaign 再次重写 Protected Owner。
