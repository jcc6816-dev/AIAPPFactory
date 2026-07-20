# GenForms Activation Sample 20：高意图小样本验证计划（2026-07-07）

## 目标

在不依赖大盘 SEO 流量的情况下，主动获得 20 个左右高意图外部访问样本，验证陌生用户是否愿意从具体场景进入 GenForms，并跨过首次创建动作。

本计划不以付费为短期目标。当前要验证的是：

`具体场景入口 -> /forms/new -> Create this form -> 登录/创建 -> 发布/提交/首次结果`

## 本轮不做

- 不买泛流量。
- 不做 Product Hunt 正式 launch。
- 不大规模扩 SEO 页面。
- 不把目录提交当成转化结论。
- 不让 Mike 做大量人工重复操作；只处理验证码、账号、人机验证和语气判断。

## 统一归因规则

所有外部链接必须带：

- `source=activation_sample_*`
- `utm_campaign=activation_sample_202607`
- 渠道可选：`utm_source`、`utm_medium`

Hermes `/forms/new` 监控需要按 `content_source` 识别 `activation_sample_*`，并排除 `codex_verify`、`deploy_check`、`playwright` 等内部测试流量。

## 5 个场景入口

| 场景 | 入口 URL | 使用对象 |
| --- | --- | --- |
| Event registration | `https://genforms.ai/forms/new?template=event-registration&source=activation_sample_event&utm_campaign=activation_sample_202607` | 活动、meetup、课程、社群 |
| Expense reimbursement | `https://genforms.ai/forms/new?template=invoice-receipt-collection&source=activation_sample_reimbursement&utm_campaign=activation_sample_202607` | 报销、收票、内部流程 |
| Client intake | `https://genforms.ai/forms/new?template=client-intake&source=activation_sample_client_intake&utm_campaign=activation_sample_202607` | freelancer、agency、咨询 |
| Customer feedback | `https://genforms.ai/forms/new?template=customer-feedback&source=activation_sample_feedback&utm_campaign=activation_sample_202607` | SaaS、社区、服务业反馈 |
| Lead capture | `https://genforms.ai/forms/new?template=lead-capture&source=activation_sample_lead_capture&utm_campaign=activation_sample_202607` | 创作者、newsletter、landing page |

## 第一批 20 个样本来源

### A. 目录与工具站：8 个

目标是获得持续弱外部流量和可复盘 session，不期待立即付费。

| # | 渠道 | 入口 | 分工 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | Product Hunt profile / upcoming prep | 官网或 event link | Mike/Antigravity GUI | 待准备，不正式 launch |
| 2 | Futurepedia | 官网或 lead capture | Antigravity GUI | 待提交 |
| 3 | There’s An AI For That | 官网或 lead capture | Antigravity GUI | 待提交 |
| 4 | Toolify / AI directory | 官网 | Antigravity GUI | 待提交 |
| 5 | SaaSCity | SaaS / lead capture | Antigravity GUI | 待提交 |
| 6 | OpenFuture AI | 官网 | Antigravity GUI | 待提交 |
| 7 | ListAi.cc | 官网或 lead capture | WorkBuddy/Antigravity GUI | 已有历史提交，复核 |
| 8 | NavTools / similar AI directory | 官网或 webhook/use-case page | Antigravity GUI | 待提交 |

提交文案统一避免“大而全平台”，使用：

> GenForms.ai helps teams create a ready-to-publish form from a template or prompt, then share it by link or QR code and collect submissions.

### B. 社区反馈：7 个

目标是获得真实场景反馈，不硬广。

| # | 渠道 | 建议话题 | 推荐入口 | 分工 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 9 | r/SideProject | Asking for feedback on AI-generated form templates | Event / lead capture | Mike 审语气，Antigravity 发布 | 待执行 |
| 10 | r/SaaS feedback/self-promo thread | Form creation flow for SaaS lead capture | Lead capture | Mike 审语气 | 待执行 |
| 11 | r/indiehackers | Testing whether AI form templates reduce setup time | Client intake | Mike 审语气 | 待执行 |
| 12 | Indie Hackers / maker community | Need feedback on first-create flow | Event / feedback | Mike/Antigravity | 待执行 |
| 13 | LinkedIn founder post | Before/after: template to publishable form | Event | Mike | 待执行 |
| 14 | X/Twitter maker post | Short demo + ask for form use cases | Lead capture | Mike | 待执行 |
| 15 | Relevant no-code community | AI form + QR/share link workflow | Event / feedback | Antigravity GUI | 待执行 |

社区帖原则：

- 透明说明是自己产品。
- 不伪装用户提问。
- 先请求反馈，不承诺夸大效果。
- 每帖只放一个场景入口。

参考模板：

```text
I’m testing whether AI-generated form templates can reduce the time from “I need a form” to “I can share a link/QR and collect submissions.”

I’m not looking for signups as much as feedback on the first-create flow:
- Is it clear that the form is already prepared?
- Would you click “Create this form”?
- Does the login step feel safe or annoying?

Here’s one test flow for [scenario]:
[tracked URL]
```

### C. 手动高意图触达：5 个

目标是找有明确表单需求的人，而不是泛用户。

| # | 对象 | 场景 | 推荐入口 | 分工 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 16 | 正在办活动/meetup 的创作者 | 报名表 | Event | Mike/Antigravity | 待找 |
| 17 | freelancer / agency | client intake | Client intake | Mike/Antigravity | 待找 |
| 18 | newsletter / landing page owner | lead capture | Lead capture | Mike/Antigravity | 待找 |
| 19 | 小团队运营/行政 | reimbursement | Reimbursement | Mike/Antigravity | 待找 |
| 20 | SaaS/社区运营 | feedback/NPS | Feedback | Mike/Antigravity | 待找 |

私信原则：

```text
I’m testing a small AI form builder flow and looking for honest feedback from people who actually use forms.

For your [scenario], this link should open a prepared form template directly:
[tracked URL]

Could you tell me where you’d stop or whether the “Create this form” step feels clear?
```

## Hermes 监控口径

Hermes 每天看 `activation_sample_*` sessions，并输出：

- sessions
- CTA viewed
- CTA clicked
- guest login intent started
- guest login intent returned
- form_created
- 触发 `iterate` 的 source 明细

## 决策规则

| 结果 | 判断 | 下一步 |
| --- | --- | --- |
| 20 个样本里没有真实 session | 分发没有完成或渠道无效 | 换渠道，不改产品 |
| 有 session 但没有 CTA view | 入口或页面加载有问题 | 修入口/加载/首屏可见性 |
| CTA view 有但 click 为 0 | 用户仍不愿跨过 first action | 再改 CTA 文案/信任/额度提示 |
| click 有但 login/form_created 断 | 登录、额度或创建链路是主断点 | 修登录回跳/额度/创建 |
| form_created 有但 publish/submit 断 | 进入首次成功后半段 | 修发布、二维码、测试提交、结果页 |

## 24 小时内的执行顺序

1. Codex：补齐 Hermes `content_source` 输出，部署并验证。
2. Codex：把本计划交给 Hermes，要求按 `activation_sample_*` 单独观察。
3. Antigravity GUI / Mike：先做 3 个低摩擦目录或社区预热，不追求一次做完 20 个。
4. Hermes：如出现 Hotfix 或连续 Iterate，推送飞书。
5. Codex：24 小时后根据 Hermes 汇总给出 Pass / Iterate / Stop。

