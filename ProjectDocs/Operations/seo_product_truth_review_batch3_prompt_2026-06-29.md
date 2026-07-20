# Product Manager Task: Topic Research Batch 3 Truth Review

请在 Gemini 完成 Batch 3 Google US SERP 报告后，对以下三个 Topic 做产品事实复核：

1. Service Request / Customer Complaint Form
2. Volunteer Application Form
3. Vendor / Supplier Registration Form

报告路径以 Gemini 实际交付为准，预定路径登记在 `seo_gemini_topic_research_batch3_prompt_2026-06-29.md`。

你的职责不是判断 Google 排名，也不要直接写 SEO 页面。请逐 Track 回答：

1. Google 结果中呈现的用户主任务，GenForms 当前能否完成完整闭环：`AI 创建 -> 链接/二维码 -> 提交 -> 数据面板/CSV -> Webhook/团队提醒`。
2. 哪些字段是完成该主任务必须的，哪些敏感字段只能选填或不应默认收集。
3. 当前可以明确承诺的能力。
4. 当前必须禁止的承诺。
5. 最合适的产品承接：独立 Use Case、Template-only、并入现有 Topic、Hold 或 Reject。
6. 如果进入 Architect，最小资产包是什么；不要因为竞品有很多页面就建议批量铺页。

必须重点检查这些风险：

- Service/Complaint：不得暗示 helpdesk、SLA、工单状态、自动分派、客服邮件系统或原生 CRM。
- Volunteer：不得暗示排班、背景审查、自动审批、自动录取、文件上传或电子签名。
- Vendor/Supplier：不得暗示资质验证、采购审批、文档管理、供应商生命周期管理、合规认证或 ERP 原生同步。

GenForms 当前可明确写：AI 生成、移动端单题流、公开链接、二维码、提交收集、数据面板、CSV、通用 Webhook、Webhook 日志/失败重试、Feishu/DingTalk/WeCom/Slack Incoming Webhook 通知路径。

输出格式：

| Track | 产品结论 | 必要字段 | 可承诺 | 禁止承诺 | 建议承接 | 产品缺口 | 是否允许进入 Architect |
|---|---|---|---|---|---|---|---|

最后给出明确结论：三个 Topic 中哪个最适合成为下一 Build 候选，哪些只能 Template-only/Hold/Reject。不要修改代码或页面。
