# Product Feedback / Beta Feedback Topic Decide

> 日期：2026-06-27  
> Loop 阶段：Decide  
> 决策：Architect Candidate / Hold  
> Parent Topic：Customer Feedback

## 1. 结论

`Product Feedback Form` 是经过 Google US SERP 验证的真实搜索意图，适合成为 Customer Feedback 下的独立子集群，但当前不进入 Build。

正确状态是：

> 保留为 P1 Architect Candidate，等待 Customer Feedback 第一轮冻结数据和真实 Product Feedback 模板准备度，不使用现有 Beta Bug 模板冒充通用 Product Feedback。

最早解冻复核日期：2026-07-11。

## 2. 市场证据

`product feedback form` Google US Top 10 样本中：

- Jotform、Typeform、Tally、AidaForm 以 Template / Form 承接。
- Zendesk、Usersnap、Formbricks、Featurebase、Savio、Survicate 以教程、专业平台或工具比较承接。
- SERP 同时存在轻量创建意图和专业产品反馈系统意图。

因此 GenForms 可以承接“创建并发布一个产品反馈表单”，但不能把页面定位成完整产品洞察平台、Feature Request Portal 或 Website Widget。

证据限制：保存的 HTML / PNG 是根据结构化 SERP 数据生成的本地高保真渲染，不是 Google 原始截图。该证据足够支持 Topic Decide，不支持夸大竞品转化路径结论。

## 3. 当前资产审计

### 3.1 Customer Feedback Pillar

- URL：`/use-cases/customer-feedback-form-builder`
- 角色：评价服务或体验、收集评分和改进建议。
- 当前状态：2026-06-27 新上线并冻结至 2026-07-11。
- 结论：不应把 `product feedback form` 强塞进 H1 或 title，避免两个用户任务混淆。

### 3.2 Beta Feedback Template

- URL：`/templates/beta-feedback`
- 当前字段：版本/URL、执行动作、问题描述、严重程度、错误日志。
- 当前任务：Beta Bug Report 和问题复现。
- 结论：可以继续承接 `beta feedback form`、`beta bug report form`，但不能直接改名或作为通用 Product Feedback 创建入口。

通用 Product Feedback 还需要：

- Product / feature being evaluated
- Overall usefulness or satisfaction
- Primary use case
- What worked well
- What should improve
- Desired feature or outcome
- Follow-up interview consent
- Optional contact details

## 4. 产品边界

### 4.1 可以承接

- AI 生成产品反馈表单
- 移动端单题流
- 公开链接和二维码
- 收集评分、使用场景、意见、功能建议和回访许可
- 提交数据面板与 CSV 导出
- Webhook / Bot 后续流转

### 4.2 不能承诺

- Feature Request Portal 或公开 Roadmap
- 投票、评论、状态订阅和 Changelog
- Website / In-app Widget 注入
- 自动截图或会话重放绑定
- 自动情感分析、主题聚类或专业 Product Analytics
- CRM / Jira / Linear 原生同步
- 生产级邮件 Campaign
- Spam protection
- Unlimited free

## 5. GSC / 数据判断

截至最新本地 GSC snapshot：

- 没有发现稳定的 `product feedback form` 或 `beta feedback form` query。
- Customer Feedback Pillar 刚进入冻结观察，尚不足以判断 Google 是否会把 Product Feedback query 分配给该页。
- 现在新发相邻 Use Case 会增加 cannibalization 和归因噪音。

## 6. 状态迁移条件

2026-07-11 后满足任一条件，可从 `Architect Candidate / Hold` 进入 Architect：

1. GSC 出现 `product feedback form`、`product feedback template` 或相关 query。
2. 产品侧确认新增真实 `product-feedback` 模板。
3. 产品侧批准扩展 `beta-feedback`，但必须保留 Beta Bug 与通用 Product Feedback 的清晰分工。
4. Customer Feedback query 已稳定，不会与 Product Feedback owning URL 互相抢占。

进入 Architect 后需要决定：

- 是否创建 `/use-cases/product-feedback-form-builder`。
- 是否新增 `/templates/product-feedback`。
- `beta-feedback` 是否仅作为 Bug/Beta 子模板保留。
- 与 Customer Feedback Pillar、Webhook Topic 和后续 Product Feedback Questions Post 的内链关系。

## 7. 当前禁止动作

- 不新建 Product Feedback URL。
- 不把 `/templates/beta-feedback` 改名为 Product Feedback。
- 不修改 Customer Feedback Pillar 的 title/H1 抢 Product Feedback 词。
- 不把 Website Feedback Widget、Feature Portal 或高级分析能力写入页面。
- 不在 Customer Feedback 冻结期内批量生成 Feedback pSEO 页面。

## 8. Loop 状态

`Product Feedback / Beta Feedback`：`Decide -> Architect Candidate / Hold`。

负责人：

- Codex：2026-07-11 后检查 GSC query 和页面归属。
- 产品经理：决定是否新增真实 Product Feedback 模板。
- Gemini：当前无需重复 SERP 研究；只有 SERP 明显变化或需要扩充新关键词时再重跑。

