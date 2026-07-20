# Gemini Task: Client Intake / Project Request + Quote Request Topic Research

> 创建日期：2026-06-27  
> 负责人：Gemini 采集与初步分析，Codex 最终复核  
> Loop 阶段：Topic Discover / Validate  
> 重要：这是两个独立 Topic，必须输出两个报告和两个 JSON，不得混成一个结论。

## 1. 总目标

基于美国区真实 Google SERP，验证：

1. 泛 `Client Intake / Project Request` 除现有 Web Design Client Intake 外，是否还有 GenForms 当前可以真实承接的轻量子意图。
2. `Quote Request Form` 是否应从 Topic Universe 进入 Architect，还是继续作为 Lead Capture 的子场景保留。

不得依据关键词字面或竞品首页臆测。所有结论必须能追溯到保存的 Google HTML、截图、结构化结果和产品事实。

## 2. 研究 Track A：Client Intake / Project Request

### 2.1 关键词

- `client intake form`
- `client intake form template`
- `project intake form`
- `project request form`
- `creative agency client intake form`
- `consulting client intake form`

已有 `web design client intake form` 与 `website design questionnaire` 已完成 Google US 研究并上线 Solution，本次只作为对照，不重复抓取。

### 2.2 必须回答

- Google 对泛 Client Intake 的主导理解是轻量表单、行业模板、PDF/Word，还是专业业务系统？
- 法律、医疗、咨询、Agency 等行业意图如何分布？
- `project intake form` / `project request form` 是否明显要求审批、资源分配、工单状态或项目管理？
- 除 Web Design 外，是否存在一个用户任务清楚、产品边界安全的下一子场景？
- 现有 `/solutions/web-design-client-intake-form-template` 应作为子场景，还是可以支撑泛 Client Intake Parent？

### 2.3 产品边界

GenForms 可以明确承接：

- AI 生成表单
- 公开分享链接和二维码
- 移动端单题流
- 提交收集、数据面板和 CSV 导出
- Webhook 配置、日志、失败重试和 Bot 路径

不能承诺：

- 文件上传
- 电子签名、合同和自动报价
- HIPAA 或行业合规保证
- 审批流、资源分配和项目管理看板
- CRM 原生同步
- 生产级邮件通知
- Spam protection
- Unlimited free

### 2.4 输出

- 报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Client_Intake_Project_Request.md`
- 原始证据：`SEOData/serp_raw/client_intake_project_request_batch/`
- 结构化结果：`client_intake_project_request_results.json`

最终决策只能选择：

- `Enter Architect`
- `Merge into existing Web Design Client Intake`
- `Keep in Topic Universe`
- `Reject / Product mismatch`

## 3. 研究 Track B：Quote Request

### 3.1 关键词

- `quote request form`
- `request a quote form`
- `quote request form template`
- `price quote request form`
- `estimate request form`
- `service quote request form`

### 3.2 必须回答

- Google 展示的是在线询价表单、PDF/Word/Excel、询价邮件教程，还是自动报价/估价软件？
- `quote request form` 与 `estimate request form` 是否应拆成不同意图？
- 用户只是提交服务需求，还是期待即时价格计算、附件/图纸上传、支付或报价单生成？
- GenForms 是否能以 Lead Capture 子场景真实承接：服务类型、需求描述、预算、时间、联系方式、后续 Webhook？
- 页面更适合 Use Case、Template、Post，还是不应创建新 URL？

### 3.3 产品边界

可以承接：

- AI 生成询价需求收集表
- 服务类型、需求范围、预算、时间和联系方式字段
- 公开链接、二维码、提交面板、CSV、Webhook/Bot 流转

不能承诺：

- 即时报价计算器
- 自动生成正式报价单或 PDF
- 文件/照片/图纸上传
- 支付、订金、发票和订单
- 现场估价、排班或服务派单
- CRM 原生同步
- 生产级邮件通知
- Unlimited free

### 3.4 输出

- 报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Quote_Request.md`
- 原始证据：`SEOData/serp_raw/quote_request_batch/`
- 结构化结果：`quote_request_results.json`

最终决策只能选择：

- `Enter Architect as Lead Capture subcluster`
- `Template-only coverage`
- `Keep in Topic Universe`
- `Reject / Product mismatch`

## 4. Google 采集要求

对每个关键词：

1. 使用美国 VPN / 美国出口，Google 参数至少包含 `gl=us&hl=en&pws=0`。
2. 保存 Google 返回的原始 HTML DOM，不得用本地 mock HTML 代替。
3. 保存完整页面 PNG；若只能截首屏，必须在报告中明确标注。
4. 若遇 CAPTCHA，记录失败，不得生成模拟 Google 截图冒充原始证据。
5. 提取最多 10 条真实自然结果；不足 10 条时记录实际数量，不补造。
6. 每条结果保存：rank、title、url、domain、snippet、page_type、intent、is_organic。
7. Sponsored、AI Overview、PAA、Related Searches 必须与自然结果分开；只有在 HTML/截图可复核时才能写入报告。
8. 对排名最有代表性的 3-5 个竞品页面人工打开，记录首屏定位、主 CTA、次 CTA、创建路径和产品承诺。

## 5. 分析要求

每个关键词至少给出：

- Search Intent
- 用户主任务
- Top 结果页面类型分布
- 反复出现的竞品与 URL
- 竞品如何承接和转化
- GenForms 可承接部分
- 产品缺口和不能承诺部分
- 唯一建议 owning URL / 页面类型
- P0 / P1 / P2 优先级及依据

优先级只能代表 SERP 机会、产品契合和执行价值。若没有可靠第三方搜索量，不得把优先级解释成绝对搜索量。

## 6. 防重复规则

- 不建议与 `/solutions/web-design-client-intake-form-template` 同义的新页面。
- 不建议为每个近义 Quote 词创建一页。
- 不把 Project Request 的审批/项目管理意图塞进普通表单页面。
- 不把 Quote Request 写成自动报价系统。
- 不因竞品有某项功能就假设 GenForms 也支持。

## 7. 验收清单

- 12 个关键词分别有 success / failed 状态。
- 每个成功关键词有真实 Google HTML、截图和结构化结果。
- 两个 Topic 分别输出报告和最终决策。
- 报告说明数据完整性、地区证据和采集限制。
- 所有 URL 可从报告追溯到 JSON 和 HTML。
- 不包含无证据的百分比、搜索量、转化率或用户规模。
- 不创建或修改产品页面；本任务只做 Discover / Validate。

## 8. 回传给 Codex

完成后只需回复：

1. 两个报告的绝对路径。
2. 两个 evidence 目录的绝对路径。
3. 每个 Track 成功/失败关键词数量。
4. 两个最终决策。
5. 任何 CAPTCHA、地区或数据完整性限制。

