# GenForms.ai SEO Topic Universe

> 创建日期：2026-06-25
> 用途：把 GenForms.ai 后续可扩展的 SEO 主题按“场景、功能、集成、竞品、行业/角色、模板”统一整理成主题宇宙，作为关键词研究、SERP 调研、Topic Cluster、pSEO 和内链规划的上游池子。
> 依据：`seo_growth_sop_v2.md`、`seo_topic_cluster_map.md`、`seo_core_keyword_observation_list.md`、`seo_content_topic_queue.md`、`Code/services/form-templates.ts`，以及 Jotform / Typeform / Tally / Fillout 等竞品公开模板与分类信息。

## 1. 核心判断

当前已经进入主线的 Contact Form、Webhook Form、Typeform Alternative、QR Code Form 只是第一批高优先级主题，不代表 GenForms.ai 的 SEO 主题只有这几个。

GenForms 的主题扩展应按多维矩阵推进：

```text
应用场景 Form
  x 功能能力
  x 集成/工作流
  x 竞品替代
  x 行业/角色
  x 模板资产
```

例子：

- `contact form builder` = 应用场景。
- `webhook form builder` = 功能能力。
- `form submissions to Feishu` = 集成/工作流。
- `Typeform alternative with webhooks` = 竞品替代 + 功能能力。
- `lead capture form for SaaS` = 应用场景 + 行业/角色。
- `event registration form with QR code` = 应用场景 + 功能能力。

这份文档不是要求马上创建所有页面，而是让后续工作有共同地图：

- 关键词研究从这里取候选。
- SERP 调研从这里分批执行。
- Topic Cluster 从这里决定 Pillar / Cluster。
- pSEO 从这里选择小批量试点组合。
- 内链从这里决定主题之间如何连接。

## 2. Topic 不能闭门造车

Topic Universe 必须同时满足两类证据：

1. 内部承接证据：GenForms 是否已有模板、Use Case、创建路径、Webhook/QR/导出/数据面板等真实能力。
2. 市场验证证据：竞品是否长期维护对应模板、分类、用例、集成页，且这些主题在多个竞品中重复出现。

因此后续扩展主题的默认流程是：

```text
竞品模板/分类/用例观察
  -> 归入 Topic Universe
  -> 检查 GenForms 产品承接
  -> Google SERP 研究
  -> GSC/GA4/Clarity 信号交叉验证
  -> 升级为 Topic Cluster / pSEO 试点 / Backlog
```

### 2.1 竞品 Topic 来源

| 来源 | 可观察信号 | 对我们有什么用 |
|---|---|---|
| Jotform templates | 模板分类数量、热门模板、行业/表单类型分类 | 判断成熟模板市场里哪些主题长期存在 |
| Typeform templates | 角色、目标、表单类型、热门模板、集成分类 | 判断 Typeform-style 和商业/反馈/招聘/活动类主题 |
| Tally templates | 模板列表和使用量/复制量排序 | 判断轻量 no-code 表单用户真实复制的主题 |
| Fillout templates | 新兴工具模板示例、B2B/ops/feedback/intake 主题 | 判断更现代工具偏好的细分场景 |
| GSC query | 我们自己已经被 Google 测试的词 | 判断 GenForms 真实进入 Google 分配池的主题 |
| Clarity / GA4 | 当天 Google 用户进入后的行为 | 判断主题带来的用户质量和产品承接问题 |

### 2.2 本次竞品样本的市场信号

以下不是最终关键词结论，只是 Topic Universe 的市场验证输入：

| 市场信号 | 竞品证据摘要 | GenForms 对应主题 |
|---|---|---|
| Registration / Event | Jotform 把 Registration、Event Registration 列为大类；Typeform 有 event registration / plan events；Tally 热门列表有 registration 和 event registration | Event Registration Form、QR Event Form |
| Application / HR / Recruiting | Jotform 有 Application 和 Job Application 大类；Typeform 有 recruit talent、job application；Tally 热门列表也有 job application | Job Application Form、Community Application |
| Survey / Feedback / Satisfaction | Jotform Survey、Feedback、Satisfaction 数量大；Typeform 有 get feedback、customer feedback、NPS；Tally 热门列表有 customer feedback、NPS | Customer Feedback、Satisfaction Survey、NPS Survey |
| Lead Gen / Contact / Enquiry | Typeform 有 lead gen forms、lead generation；Tally 热门列表有 contact、lead generation、enquiry；Jotform 有 contact forms | Contact Form、Lead Capture、Newsletter Signup |
| Booking / Appointment | Jotform 有 Booking、Appointment；Typeform 有 booking forms；Tally 有 online booking | Booking Consultation Form |
| Order / Checkout / Payment | Jotform Order / Payment 大类很大；Typeform 有 online order；Tally 有 food order、digital product checkout | Order / Checkout Form，当前产品需谨慎评估支付能力边界 |
| Product / User Research | Typeform 有 product surveys、market research、user persona；Tally 有 product market fit、feature request、user research interview；Fillout 有 user onboarding、user persona | Beta Feedback、User Interview Recruitment、Product Feedback |
| Client / Project Intake | Tally 有 web project intake、project intake、branding questionnaire；Fillout 有 project request、client intake | Client Intake / Project Request，适合作为后续场景主题 |

### 2.3 竞品验证后的主题优先级变化

基于市场验证，本 Topic Universe 的优先级需要做两点调整：

- `Event Registration / QR Event Form` 从普通 P1 提升为 P1 高优先级候选，因为 Jotform、Typeform、Tally 都有强重复信号，且 GenForms 有 event-registration 模板和 QR 能力承接。
- `Customer Feedback / Satisfaction / NPS` 保持 P1/P2，但应进入下一批 SERP 研究候选，因为竞品重复信号强，GenForms 也已有 satisfaction-survey、event-feedback、nps-survey 模板。
- `Job Application` 保持 P2，不是因为市场弱，而是因为 ATS/招聘系统边界需要谨慎。
- `Order / Checkout / Payment` 先不进入当前主线。市场很强，但 GenForms 当前支付/订单能力边界需要确认，不能为了流量承诺未支持能力。
- `Client Intake / Project Request` 新增为 P1/P2 候选，适合服务型业务、agency 和 consultant 场景，且与 Contact / Booking / Lead Capture 有自然内链关系。

## 3. 已验证 / 当前主线主题

| 主题 | 维度 | 当前承接 | 状态 | 下一步 |
|---|---|---|---|---|
| Contact Form | 场景 | `/use-cases/contact-form-builder-for-websites` + `/templates/contact-us` | 已上线，冻结观察 | 补模板内链，等待 GSC 分区 |
| Webhook Form | 功能 | `/use-cases/webhook-form-builder-retry-logs` + webhook 文章 | 已上线，有 Clarity Google 来源信号 | 优先做 Cluster 内链核查 |
| Typeform Alternative | 竞品 | `/posts/typeform-alternatives` + `/use-cases/typeform-alternative-webhooks` | 已改造，冻结观察 | 保护观察，不继续大改 |
| QR Code Form | 功能 / 场景 | `/use-cases/qr-code-form-builder` | 有 20-30 名区间信号 | 内链增强，等待是否进入 Golden Tuning |
| Lead Capture | 场景 / 行业 | `/use-cases/ai-lead-capture-form-builder` + `/templates/lead-capture` | 已有研究和模板修正 | 等 GSC 数据，后续可能升级为独立 Cluster |
| Event Registration / QR Event | 场景 / 功能 | Use Case + Template + QR Solution | 已上线并冻结观察 | 等 query 与创建事件 |
| Customer Feedback | 场景 | Use Case + satisfaction-survey Template | 已上线并冻结观察 | 2026-07-11 后 Decide 是否扩 Product Feedback |
| Waitlist | Lead Capture 子场景 | Use Case + Template + Post | 已上线并冻结观察 | 不扩 referral/leaderboard 能力 |
| Quote Request | Lead Capture 子场景 | `/use-cases/quote-request-form-builder` + `/templates/quote-request` | 2026-06-27 已上线 | 冻结至 2026-07-11，不扩 Estimate 同义页 |

## 4. 应用场景类主题

这类主题最接近用户的自然搜索表达，通常适合作为 Use Case、Template、教程或 pSEO 页面。

| 主题 | 对应模板 / 资产 | 搜索意图 | 建议承接 | 优先级 | 进入条件 |
|---|---|---|---|---|---|
| Lead Capture Form | `lead-capture` | 获取销售线索、官网落地页转化 | Use Case + Template + 支撑 Post | P0/P1 | GSC 出现 lead capture / lead generation query |
| Contact Us Form | `contact-us` | 网站联系表单、咨询入口 | 当前 Contact Pillar + Template | P0 | 已进入主线 |
| Event Registration Form | `event-registration` | 活动报名、webinar、conference registration | Use Case / Solution + Template | P1 | SERP 研究确认后进入 Brief |
| Event Feedback Survey | `event-feedback` | 活动后反馈、满意度收集 | Template / Post | P2 | QR / event cluster 有数据后 |
| Customer Satisfaction Survey | `satisfaction-survey` | 客户满意度、反馈表单 | Template / Use Case | P1/P2 | GSC 或 GA4 显示 feedback/survey 兴趣 |
| Booking Consultation Form | `booking-consultation` | 预约请求信息收集；不能承诺实时日历或已确认预约 | Template only | P2 | 2026-06-28 已修复产品事实并进入 Observe；泛 Booking/Appointment 不建 Pillar |
| Job Application Form | `job-application` | 轻量候选人意向和初筛；不含简历上传、ATS、OCR 或合规工具 | Template only | P2 | 2026-06-28 已修复产品事实并进入 Observe / Hold，不建 Use Case/Solution |
| Demo Request Form | `demo-request` | B2B Demo 申请与销售前资格信息收集 | Use Case + Template | P1 | 2026-06-28 已部署并进入 Observe，冻结至 2026-07-12 |
| Waitlist Form | `waitlist` | 等候名单、产品内测 | Template / Post / Use Case | P1 | 初创/产品发布类 query 出现 |
| Newsletter Signup Form | `newsletter-signup` | 轻量订阅意向收集；不含网页 embed、邮件列表托管、双重确认、Campaign 发送或 ESP 原生同步 | Template only | P2 | 2026-06-28 已部署收口并进入 Observe，冻结至 2026-07-12；不进入 Architect 或 pSEO |
| Course Registration Form | `course-registration` | 课程、班级、培训和工作坊报名信息收集；不含支付、容量、邮件确认或 LMS | Existing Solution + Template；Education & Training 场景，关联 Event Registration 产品族 | P1 | 2026-06-28 已部署并进入 Observe，冻结至 2026-07-12；首轮不新增页面 |
| Community Application | `community-application` | 社群/会员申请信息收集；人工审核和外部发送邀请 | Template only | P2 | 2026-06-28 已部署收口并进入 Observe，旧 Solution 三条路径已 308 退役；冻结至 2026-07-12，不扩 Use Case/Post/pSEO |
| Beta Feedback Form | `beta-feedback` | beta 测试反馈、bug report | Template / Post | P2 | 保持 Beta Bug/问题复现定位；不直接改名为通用 Product Feedback |
| Product Feedback Form | 待真实 `product-feedback` 模板 | 产品使用评价、改进建议、功能需求和回访许可 | Use Case / Template / Post | P1 | Google US SERP 已验证；Architect Candidate / Hold 至 2026-07-11，避免与新上线 Customer Feedback 混淆 |
| NPS Survey | `nps-survey` | NPS 调研、客户忠诚度 | Template / Post | P2 | 历史已有 NPS 信号，可后续验证 |
| User Interview Recruitment | `user-interview-recruitment` | 用户访谈招募、研究筛选 | Template / Post | P2 | research / interview query 有信号后 |
| Content Download Form | `content-download` | gated content / lead magnet 的资料访问申请；文件交付由外部流程完成 | Merge into Lead Capture + Template | P1/P2 | 2026-06-28 已部署收口并进入 Observe，冻结至 2026-07-12；不建独立 Pillar/Solution/Post/pSEO |
| Customer Testimonial Form | `customer-testimonial-form` | 文字型 testimonial / customer story 收集 | Template / Post | P2 | Template-only；旧 `customer-story` 与 Solution 永久重定向 |
| Portfolio Submission | `portfolio-submission` | 作品集提交、创作者招募 | Template / Post | P2 | 创意社区场景 |
| Client Intake / Project Request | 可由 `contact-us` / `booking-consultation` 延展 | 客户需求收集、项目需求提交、agency intake | Use Case / Template / Post | P1/P2 | 竞品重复信号强，需补产品承接路径 |
| Service Request / Customer Complaint | 已上线 `customer-service-request` | 轻量服务/客服请求信息收集与团队通知 | Ship / Observe / Merge / Template-only | P1 | 2026-06-29 已部署；冻结至 2026-07-13，不建独立 SEO 页面，排除 work request/helpdesk/SLA |
| Volunteer Application | 已上线 `volunteer-application` | 志愿者申请、兴趣、技能、一般时间偏好和人工跟进许可收集 | Ship / Observe / Template-only | P0 | 2026-06-29 已部署；冻结至 2026-07-13，不扩 Solution/Use Case/Post/pSEO |
| Vendor / Supplier Registration | 无 | 供应商准入、资质、文件、采购和财务建档 | Reject | Reject | 当前产品与安全治理无法完成主任务；不建任何资产，未来需新 Discover |
| Expense Reimbursement Form | `invoice-receipt-collection` | 报销、收据收集 | 暂缓 | P3 | 当前 MVP 不优先强调 OCR |
| ID & Qualification Verification | `identity-qualification-collection` | 身份/资质上传审核 | 暂缓 | P3 | 涉及高信任和合规，不进当前 SEO 主线 |

## 5. 功能能力类主题

这类主题强调 GenForms 的产品能力，适合做 Feature / Use Case / 技术教程。

| 主题 | 搜索意图 | 当前承接 | 优先级 | 说明 |
|---|---|---|---|---|
| Webhook Form Builder | 找支持 webhook 的表单工具 | `/use-cases/webhook-form-builder-retry-logs` | P0 | 当前差异化最强 |
| QR Code Form Builder | 用二维码收集表单 | `/use-cases/qr-code-form-builder` | P1 | 已有排名区间信号 |
| AI Form Builder | 泛 AI 表单生成器 | 首页 / Use Case 集合 | P2 | 竞争大，先长期观察 |
| Typeform-style Form | 单题流、互动表单 | `/use-cases/typeform-alternative-webhooks` | P1 | 与 Typeform Alternative 交叉 |
| Form Builder with CSV Export | 导出提交数据 | 待定 | P2 | 当前可作为产品事实，但不单独抢主词 |
| Form with Submission Dashboard | 查看回复、数据面板 | 待定 | P2 | 可做 FAQ/内容模块 |
| Form Notification Workflow | 提交通知、团队提醒 | Webhook / Feishu / DingTalk 文章 | P1 | 与集成类主题交叉 |
| Public Form Link | 分享链接、公开表单 | 待定 | P2 | 可作为模板页说明和 pSEO 支撑 |
| Mobile-friendly Form | 移动端单题流 | Typeform / QR / Contact 页面 | P2 | 作为差异化模块，不急于单独建页 |

## 6. 集成 / 工作流类主题

这类主题通常搜索量不一定大，但意图非常明确，适合教程和长尾页。

| 主题 | 搜索意图 | 当前承接 | 优先级 | 产品边界 |
|---|---|---|---|---|
| Send form submissions to webhook | 把提交发送到 endpoint | `/posts/send-form-submissions-to-webhook` | P0/P1 | 可写 webhook 配置/日志/重试 |
| Form submissions to Feishu / Lark | 推送到飞书/Lark bot | `/posts/feishu-dingtalk-webhook-notification` | P1 | 写 Bot/Webhook 路径，不承诺原生深集成 |
| Form submissions to DingTalk | 推送到钉钉机器人 | `/posts/feishu-dingtalk-webhook-notification` | P1 | 同上 |
| Form submissions to Slack | 推送到 Slack bot/webhook | 待研究 | P2 | 需确认产品文案边界 |
| Form submissions to WeCom | 推送到企业微信机器人 | 待研究 | P2 | 需确认产品文案边界 |
| Form to Google Sheets | 表单到表格 | 待研究 | P2/P3 | 若未稳定支持，不承诺原生同步 |
| Form to CRM | 表单到 CRM | 暂缓 | P3 | 当前不承诺 CRM 原生同步 |

## 7. 竞品 / Alternatives 类主题

这类主题属于商业意图收割层，不追求数量，重视客观对比和事实边界。

| 主题 | 搜索意图 | 当前承接 | 优先级 | 说明 |
|---|---|---|---|---|
| Typeform Alternative | 找 Typeform 替代品 | `/posts/typeform-alternatives` | P0 | 已进入主线 |
| Cheaper Typeform Alternative | 价格敏感替代 | `/posts/cheaper-ai-typeform-alternative` | P0/P1 | 冻结观察 |
| Typeform Alternative with Webhooks | 替代 Typeform + 自动化 | `/use-cases/typeform-alternative-webhooks` | P0/P1 | 高意图 |
| Google Forms Alternative | 基础表单升级 | `/use-cases/google-forms-alternative-ai` 或比较文章 | P1/P2 | 等 Typeform/Webhook 数据 |
| Google Forms Alternative with Webhooks | 替代 Google Forms + webhook | 待 SERP 研究 | P2 | 当前暂缓 |
| Jotform Alternative | 替代 Jotform | 待研究 | P2/P3 | 需看 SERP 竞争和产品差异 |
| Tally Alternative | 替代 Tally | 待研究 | P2/P3 | 适合后续 Alternatives 扩展 |
| Paperform / Fillout Alternative | 替代表单工具 | 待研究 | P3 | 等主题权威更强后 |

## 8. 行业 / 角色类主题

这类主题适合后续 pSEO 或垂直页面，但必须有真实产品承接，不能泛泛写行业页。

| 主题 | 可能关键词 | 对应场景 | 优先级 |
|---|---|---|---|
| SaaS teams | SaaS lead capture form, SaaS waitlist form | lead capture / waitlist / demo booking | P1 |
| Event marketers | event registration form, QR code event form | event registration / QR | P1 |
| Product teams | beta feedback form, product feedback form, user interview form | beta feedback / interview recruitment | P2 |
| HR / recruiting | job application form, candidate screening form | job application | P2 |
| Education / training | course registration form, workshop signup form | course registration | P2 |
| Communities | community application form, membership application form | community application | P2 |
| Creators / agencies | portfolio submission form, client intake form | portfolio / contact / booking | P2 |
| Customer success | NPS survey, customer satisfaction survey, testimonial form | NPS / feedback / story | P2 |

## 9. pSEO 组合矩阵

pSEO 不从“生成很多页面”开始，而从组合矩阵里挑 5-10 个最安全、最可承接、最有搜索意图的组合试点。

### 8.1 场景 x 功能

| 组合 | 候选 URL 类型 | 是否适合首批试点 | 原因 |
|---|---|---|---|
| contact form with webhook | Use Case / Post | 是，但由 Webhook Cluster 承接 | 已有研究结论 |
| event registration form with QR code | Solution / Use Case | 是 | 与 QR 和 event 模板强相关 |
| lead capture form with webhook | Use Case / Post | 是 | 与 lead capture 和 webhook 都匹配 |
| waitlist form with QR code | Template / pSEO | 可能 | 需 SERP 验证 |
| customer feedback form with QR code | Template / pSEO | 可能 | 线下反馈场景自然 |

### 8.2 场景 x 行业/角色

| 组合 | 候选 URL 类型 | 是否适合首批试点 | 原因 |
|---|---|---|---|
| SaaS lead capture form | Use Case / Solution | 是 | 已有产品和研究基础 |
| event registration form for webinars | Template / Post | 可能 | 搜索意图明确 |
| job application form for startups | Template / Post | 可能 | ATS 边界需控制 |
| NPS survey for SaaS | Template / Post | 后续 | 需要数据证明 |
| waitlist form for indie hackers | Post / Template | 后续 | 可做社区种子流量 |

### 8.3 集成 x 场景

| 组合 | 候选 URL 类型 | 是否适合首批试点 | 产品边界 |
|---|---|---|---|
| send contact form submissions to webhook | Post | 是 | webhook 路径真实 |
| send lead capture submissions to Feishu | Post | 可能 | 写 Bot/Webhook，不写原生集成 |
| send event registrations to DingTalk | Post | 可能 | 同上 |
| send form submissions to Slack | Post | 后续 | 需验证当前配置路径 |
| send form submissions to Google Sheets | 暂缓 | 暂缓 | 不承诺原生同步 |

## 10. 主题进入主线的门槛

一个新主题不能因为“看起来合理”就直接写页面。进入主线前必须过四道门：

1. **产品承接门**：是否有真实模板、创建路径、数据查看或 webhook 后续流程。
2. **市场验证门**：至少 2 个头部竞品是否长期维护相关模板、分类、用例或集成页。
3. **SERP 门**：Google Top 10 显示的页面类型是什么，是否适合我们切入。
4. **数据门**：GSC / GA4 / Clarity 是否已有相关 query、页面访问或用户行为信号。
5. **内链门**：它属于哪个 Topic Cluster，是否能自然链接到 Pillar Page。

进入后的动作：

- P0/P1 主题：先做 SERP 研究或内链核查。
- P2 主题：进入观察池，等待 query 或产品成熟。
- P3 主题：暂缓，不进当前 SEO 主线。

## 11. 当前建议的同步工作

### 10.1 每周固定维护主题宇宙

每周 SEO 复盘时新增一个动作：

- 从 GSC 新 query 中找是否出现新的场景词、功能词、竞品词、集成词。
- 把它们归入本表对应维度。
- 对照竞品模板/分类，确认它是不是市场验证过的主题，而不是内部想象出来的主题。
- 判断是否升级为 Topic Cluster、pSEO 候选或继续观察。

### 10.2 和当前主线并行，但不抢资源

短期主线仍然是：

1. Webhook Cluster 内链核查。
2. Contact / Typeform / QR 冻结观察。
3. GSC 分区后再决定下一轮小修。

同步进行的扩展工作是：

1. 建立主题宇宙。
2. 每周把新 query 回填进主题宇宙。
3. 从主题宇宙里挑 1-2 个候选交给 Gemini 做 SERP 研究。
4. 只有研究通过，才进入 Brief。

### 11.3 下一批最值得研究的扩展主题

| 优先级 | 主题 | 为什么 |
|---|---|---|
| P1 | Event Registration Form / QR Event Form | Jotform / Typeform / Tally 均有强重复信号；GenForms 有 event 模板和 QR 能力 |
| P1 | Lead Capture Form Template / SaaS Lead Capture Form | Typeform / Tally 有 lead gen 强信号；GenForms 已有研究、模板和 use case |
| P1 | Customer Feedback Form / Satisfaction Survey / NPS | Jotform / Typeform / Tally 重复信号强；GenForms 有 satisfaction、event-feedback、nps 模板 |
| P1/P2 | Client Intake / Project Request Form | Tally / Fillout 对 project intake、client intake 有明显信号；适合服务型业务和 agency |
| P2 | Job Application Form Builder | 市场强，但 ATS 边界需谨慎 |
| P1 | Waitlist Form Builder | Google US SERP 已验证 builder/template/startup/AI 混合意图；GSC 28d Use Case 36 impressions、avg pos 25。进入 Lead Capture 子集群 Architect，不新建 URL |

## 12. 下一步动作建议

2026-06-29 起，Event Registration、Lead Capture、Waitlist、Quote、Demo、Course 等已完成研究或上线，不再作为 Discover 候选。

Batch 3 已完成 Research、产品事实复核与 Codex Decide，状态固定为：

1. Volunteer Application Form：P0，Template-only，已 Ship / Observe，冻结至 2026-07-13。
2. Service Request / Customer Complaint Form：P1，并入 Contact Form / Customer Feedback，唯一轻量 Template 已部署，冻结至 2026-07-13。
3. Vendor / Supplier Registration Form：Reject，当前不进入 Architect 或 Build。

完整 Portfolio 与选择理由见 `seo_topic_portfolio_2026-06-29.md`；最终决定见 `../AI-Team/reports/codex-review/GenForms_SEO_Batch3_Codex_Decide_2026-06-29.md`。Service Request 已进入 Observe；当前没有 Active Build。
