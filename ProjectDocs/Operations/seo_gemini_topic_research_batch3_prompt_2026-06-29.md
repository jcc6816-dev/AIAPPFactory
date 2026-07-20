# Gemini Task: GenForms.ai Topic Research Batch 3

请完成 GenForms.ai 下一批 3 个 Topic 的 Google US SERP `Discover / Validate` 研究。该任务只做证据采集与判断，不创建页面、不修改代码。

## Track A: Service Request / Customer Complaint

研究关键词：

1. `service request form`
2. `service request form template`
3. `customer complaint form`
4. `customer complaint form template`
5. `customer support request form`
6. `work request form`

重点判断：Google 是否把这些词理解为轻量表单、工单/helpdesk、内部维修流程、PDF，还是客服系统。不要预设它们属于同一个页面。

## Track B: Volunteer Application

研究关键词：

1. `volunteer application form`
2. `volunteer application form template`
3. `volunteer signup form`
4. `nonprofit volunteer application form`
5. `community volunteer form`
6. `volunteer registration form`

重点判断：核心任务是申请/intake、简单报名、排班、背景审查、审批，还是文件/PDF 下载。

## Track C: Vendor / Supplier Registration

研究关键词：

1. `vendor registration form`
2. `vendor registration form template`
3. `supplier registration form`
4. `supplier registration form template`
5. `vendor application form`
6. `new vendor request form`

重点判断：用户要的是轻量供应商资料收集、采购准入、资质文件、审批流程，还是完整 vendor management 系统。

## Google 与证据要求

- 使用美国地区 Google，参数至少包含 `gl=us&hl=en`；记录执行时间、出口地区和完整请求 URL。
- 每个关键词保存真实 Google SERP HTML DOM、整页 PNG 截图和结构化 JSON。
- 只记录传统自然搜索结果，广告、AI Overview、People Also Ask、视频和图片模块单独标记，不混入 Organic Top 10。
- 每条 Organic 结果保存：rank、title、完整目标 URL、domain、snippet、page type、intent interpretation。
- 不得用 mock HTML、人工重建 SERP 或 Brave/Bing 结果冒充 Google 证据。
- CAPTCHA 或抓取失败必须标记 failed；不得把失败改成 success。可重试或人工干净浏览器补采，但必须保留真实原始证据。
- 检查报告中的每个 Top 10 URL 都能在 JSON/HTML 中追溯。

## 每个 Track 的分析要求

1. Google 对每个关键词的主意图与次意图。
2. 用户真正要完成的主任务。
3. Top 10 页面类型占比和重复出现的竞品/domain。
4. 头部页面首屏、字段、CTA、模板预览、FAQ、Schema 与转化路径。
5. 轻量表单意图与重系统意图的分界。
6. GenForms 当前能力可以真实承接什么。
7. 必须禁止承诺什么。
8. 关键词是否应合并为一个 Topic，还是拆分/拒绝。
9. 推荐页面类型：Use Case、Template、Solution、Post、Merge、Template-only、Hold 或 Reject。
10. 最终决策只能从以下选择：`Enter Architect`、`Merge into existing Topic`、`Template-only`、`Hold`、`Reject`。

## GenForms 当前事实边界

可以明确写：AI 生成表单、移动端单题流、公开分享链接、二维码、提交收集、数据面板、CSV 导出、通用 Webhook、Webhook 日志/失败重试、Feishu/DingTalk/WeCom/Slack Incoming Webhook 通知路径。

不能承诺：iframe/HTML embed、生产级邮件通知、spam protection、CRM/helpdesk/vendor-management 原生同步、支付、票务、日历排班、审批流、电子签名、背景审查、合规验证、文档管理、SLA/工单状态、自动分派、unlimited free。

## 输出路径

- Track A：`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Service_Request_Complaint.md`
- Track B：`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Volunteer_Application.md`
- Track C：`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Vendor_Supplier_Registration.md`

原始证据目录：

- `/Users/mike/Documents/AIFactory/SEOData/serp_raw/service_request_complaint_batch/`
- `/Users/mike/Documents/AIFactory/SEOData/serp_raw/volunteer_application_batch/`
- `/Users/mike/Documents/AIFactory/SEOData/serp_raw/vendor_supplier_registration_batch/`

完成后只需回传：三个报告绝对路径、三个 evidence 目录、每 Track 成功/失败关键词数、三个最终决策、CAPTCHA/地区/完整性限制。不要开始 Build。

