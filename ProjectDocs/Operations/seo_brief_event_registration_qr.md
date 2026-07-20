# SEO Architect Brief: Event Registration / QR Event

> 版本：2026-06-26
> Loop 阶段：Validate -> Architect
> 建议状态：Architect 通过后进入 Build
> 主证据：产品经理承接边界复核、Gemini Google US SERP 报告、现有 `event-registration` 模板、现有 QR 发布能力
> 相关报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Event_QR.md`

## 1. Architect 结论

`Event Registration / QR Event` 可以进入 GenForms.ai SEO 主线，建议优先级为 P0。

但第一阶段必须把定位收窄为：

> AI event registration form builder for signup, RSVP, workshop and webinar intake, with share links, QR access, response dashboard, CSV export, and webhook-ready follow-up.

中文定位：

> AI 活动报名表单生成器，用于活动报名、RSVP、工作坊和 webinar 信息收集，支持公开链接、二维码访问、提交数据面板、CSV 导出和 Webhook-ready 后续流转。

第一阶段不把 GenForms 定位成活动管理、票务销售、支付、座位管理、邮件通知或签到核销系统。

### 1.1 Go / No-Go

| 判断项 | 结论 |
|---|---|
| 是否通过 Validate | 通过 |
| 是否进入 Architect | 通过 |
| 是否进入 Build | Go，但只做轻量报名/扫码报名边界内的最小实现 |
| 是否做 pSEO | 暂不大规模做；只保留后续 5-10 页试点候选 |
| 是否需要产品/UX 复核 | 需要，在 Build 前复核首屏预览、CTA、模板字段和红线文案 |

## 2. 市场与 SERP 证据

Gemini 已完成 Google US SERP 研究，覆盖：

- `event registration form`
- `event registration form template`
- `online event registration form`
- `QR code event registration form`
- `RSVP form`
- `webinar registration form`
- `workshop registration form`

SERP 共同信号：

| 关键词组 | Google 偏好的页面类型 | 对 GenForms 的含义 |
|---|---|---|
| `event registration form` / `event registration form template` | 模板页、模板分类页、轻教程 | 需要一个清晰的 event registration Pillar + template 创建入口 |
| `QR code event registration form` | QR 工具页、活动工具页、教程、部分 check-in 相关结果 | 必须强调 scan-to-register，不承诺 QR ticket check-in |
| `RSVP form` | RSVP 模板页、轻量工具页、教程 | RSVP 是强子主题，适合做 template/cluster，不建议第一阶段抢作主 Pillar |
| `webinar registration form` | webinar 工具功能页、模板页、Zoom/LiveWebinar 文档 | 可承接轻量报名和线索收集，不承诺自动发送参会链接 |
| `workshop registration form` | 模板页、教程页 | 可承接工作坊报名字段和报名名单，不承诺支付/名额/课程系统 |

核心 SERP 竞争形态：

- Jotform / SurveyMonkey / Microsoft Forms：模板承接和快速创建。
- Typeform：高颜值单题流和模板体验。
- RSVPify / rsvp.link：轻量 RSVP / 短链接 / CSV。
- Eventbrite / RegFox 等：票务、支付、核销、座位、日程等重能力，当前不进入 GenForms 承诺边界。

## 3. 搜索意图分工

### 3.1 主意图

用户希望马上创建一个可发布的活动报名表，完成：

- 收集报名人姓名、邮箱、公司/角色。
- 收集活动类型、参加方式、场次或偏好。
- 用公开链接或二维码发布。
- 让移动端用户快速填写。
- 查看报名数据。
- 导出 CSV 或进入 Webhook/Bot 后续通知流程。

### 3.2 子意图

| 子意图 | 用户主任务 | 建议承接 |
|---|---|---|
| Event signup | 为 meetup、沙龙、小型活动收集报名 | 主 Pillar + event-registration 模板 |
| RSVP | 确认是否参加、随行人数、饮食偏好 | 子模板/Cluster，后续可独立做 `/templates/rsvp-form` |
| QR event registration | 让用户从海报、展位、课堂、活动现场扫码报名 | Pillar 中重点模块 + QR Code Form 内链 |
| Webinar registration | 收集 webinar 报名和关注话题 | Template/FAQ，避免承诺自动参会链接或邮件提醒 |
| Workshop registration | 收集工作坊报名、角色、期望和问题 | Template/FAQ，避免承诺支付、名额管理或课程系统 |

### 3.3 不承接意图

| 不承接意图 | 原因 |
|---|---|
| Paid event registration | 当前不能承诺支付、订金、退款、优惠券或票种收费 |
| Ticketing | 当前不是票务系统 |
| QR ticket check-in | 当前没有唯一门票二维码、现场扫码核销和签到 App |
| Seat / capacity management | 当前不能承诺座位、容量、waiting list 自动管理 |
| Event agenda management | 当前不做活动日程、分会场、多 session 编排 |
| Production email confirmation | 当前不承诺生产级邮件确认、提醒和群发 |

## 4. Topic 资产包

### 4.1 Pillar Page

建议主承接页：

- URL：`/use-cases/event-registration-form-builder`
- 页面类型：Use Case / Pillar
- 主 CTA：`Create an event registration form`
- 中文 CTA：`创建活动报名表`
- CTA 参数建议：
  - `template=event-registration`
  - `source=usecase_event-registration-form-builder`
  - `intent=event_registration`
  - `prompt=Create an event registration form for signup, RSVP, workshop or webinar intake with attendee contact fields, attendance preference, QR-friendly sharing, response dashboard, CSV export, and webhook-ready follow-up.`

说明：

- 当前代码已有 `/use-cases/ai-event-registration-form-builder`，但建议后续 Build 评估是否新增更符合主关键词的 `/use-cases/event-registration-form-builder`。
- 如果不想新增 URL，也可以先改造已有 `/use-cases/ai-event-registration-form-builder`，但主关键词不应被 `AI` 前缀过度稀释。

### 4.2 Template Page

当前已有模板：

- `event-registration`
- 当前模板文案含有 `manage seats`、`ticket type`、`confirmation email draft` 等较强承诺，需要在 Build 阶段收窄。

建议模板页：

- URL：`/templates/event-registration`
- 主关键词：`event registration form template`
- CTA：`Use event registration template`
- 中文 CTA：`使用活动报名模板`

建议字段：

| 字段 | 说明 |
|---|---|
| Attendee name | 参会人姓名 |
| Email or phone | 联系方式 |
| Company / organization | 公司或组织 |
| Role / title | 角色或职位 |
| Event type | meetup / workshop / webinar / internal session / RSVP |
| Attendance preference | attending / maybe / cannot attend 或 online / onsite |
| Session or topic interest | 感兴趣主题或场次，避免写成复杂 agenda |
| Number of guests | 随行人数，适合 RSVP |
| Dietary or accessibility needs | 饮食或无障碍需求 |
| Questions for organizer | 给主办方的问题 |
| Consent checkbox | 同意接收活动相关后续联系 |

### 4.3 Cluster Post

第一阶段不需要同时写多篇 Post，但 Architect 需要定义周边资产。

| Cluster Post | 目标关键词 | 作用 | 优先级 |
|---|---|---|---|
| `How to create an event registration form with QR code` | `how to create event registration form with QR code` | 支撑 QR 场景，解释 scan-to-register，不承诺 check-in | P1 |
| `Event registration form fields checklist` | `event registration form fields` | 提供字段清单和信息增益，回链 Pillar | P1/P2 |
| `RSVP form template checklist` | `RSVP form template` | 作为 RSVP 子主题，后续可配套 template | P2 |
| `Workshop registration form questions` | `workshop registration form` | 支撑 workshop 长尾 | P2 |
| `Webinar registration form questions` | `webinar registration form` | 支撑 webinar 长尾 | P2 |

### 4.4 Existing Assets

| 已有资产 | 当前作用 | Build 阶段建议 |
|---|---|---|
| `/use-cases/ai-event-registration-form-builder` | 现有活动报名 Use Case | 可作为主页面改造候选或 301/内链到新 Pillar |
| `/use-cases/qr-code-form-builder` | QR 能力 Pillar | 与 Event Pillar 互链，强调 QR 表单/扫码填写 |
| `/solutions/event-registration-form-with-qr-code` | 现有 Solution | 可作为 QR Event 支撑页，但需检查是否存在 check-in / ticketing 过度承诺 |
| `/templates/event-registration` | 现有模板承接 | 需要收窄 ticket/seat/email 等文案 |
| `ShareQrCard` | 发布页 QR 能力 | 可在页面中作为结果感或流程模块引用 |

## 5. 页面结构建议

### 5.1 首屏

目标：用户和 Google 第一眼都理解这是“活动报名表 / 扫码报名入口”，不是票务系统。

建议首屏：

- H1：`AI Event Registration Form Builder`
- 可测试版本：`Create an Event Registration Form with AI and QR Sharing`
- Supporting copy：
  - `Generate a mobile-friendly event signup, RSVP, workshop, or webinar registration form. Share it with a public link or QR code, collect responses in a dashboard, export CSV, and route follow-up through webhook-ready workflows.`
- 主 CTA：`Create an event registration form`
- 二级 CTA：`Preview recommended fields`
- Badge：`AI Ready • Share link / QR`

首屏右侧预览建议展示 event signup mini form，不展示泛表单：

- Event type: Workshop
- Attendee name
- Email
- Company / role
- Attendance preference
- Questions for organizer
- QR access / share link preview

### 5.2 推荐字段模块

页面中段应展示字段清单，帮助 Google 和用户理解这不是泛 AI 表单。

字段顺序：

1. Attendee name
2. Email or phone
3. Company / organization
4. Role / title
5. Event type or session interest
6. Attendance preference
7. Number of guests
8. Dietary or accessibility needs
9. Questions for organizer
10. Consent checkbox

### 5.3 QR 使用路径

必须明确写成 scan-to-register：

```text
Create the form
-> Publish public link
-> Use QR code on posters, flyers, venue signs, counters, or slides
-> Attendees scan and submit from mobile
-> Review responses, export CSV, or route follow-up through webhook/bot
```

禁止写成：

- QR ticket validation
- check-in scanner
- ticket QR code
- gate scan
- badge scanning

### 5.4 提交后处理

可承诺：

- 查看报名提交。
- 导出 CSV。
- Webhook-ready 后续流转。
- Feishu / DingTalk / WeCom / Slack Bot 推送路径作为高级 follow-up path。

不能承诺：

- 自动邮件确认。
- 自动日历邀请。
- 自动 Zoom link。
- CRM 原生同步。
- 付款后发票或票据。

### 5.5 FAQ 建议

FAQ 必须和页面可见内容一致，适合后续 FAQPage JSON-LD。

建议 FAQ：

1. **Can I create an event registration form with AI?**
   - Yes. Describe your event, workshop, webinar, meetup, or RSVP flow and GenForms can draft attendee fields you can adjust before publishing.

2. **Can attendees register from a QR code?**
   - Yes. Publish the form as a public link and use QR access for posters, flyers, slides, venue signs, or offline signup points.

3. **Does GenForms sell tickets or collect payments?**
   - No. This page focuses on lightweight registration and RSVP forms. Ticketing, payments, refunds, and paid event checkout are outside the current promise.

4. **Can I use this for event check-in or QR ticket scanning?**
   - Not as a check-in scanner. GenForms can provide QR access to the registration form, but it does not currently manage unique ticket QR codes or gate scanning.

5. **Where do event registrations go after someone submits?**
   - You can review submissions in the response dashboard, export CSV, or route follow-up through webhook-ready workflows and bot notification paths.

6. **Is this suitable for webinars and workshops?**
   - Yes, for collecting registrations, attendee details, topic interests, questions, and preferences. It does not replace webinar platforms that send joining links or reminders.

## 6. 内链设计

### 6.1 Pillar 入链

| From | To | Anchor |
|---|---|---|
| `/templates/event-registration` | `/use-cases/event-registration-form-builder` | `event registration form builder` |
| `/use-cases/qr-code-form-builder` | `/use-cases/event-registration-form-builder` | `event registration form with QR code` |
| `/solutions/event-registration-form-with-qr-code` | `/use-cases/event-registration-form-builder` | `AI event registration form builder` |
| 后续 QR 教程 Post | `/use-cases/event-registration-form-builder` | `create an event registration form with QR code` |

### 6.2 Pillar 出链

| From | To | Anchor |
|---|---|---|
| `/use-cases/event-registration-form-builder` | `/templates/event-registration` | `event registration form template` |
| `/use-cases/event-registration-form-builder` | `/use-cases/qr-code-form-builder` | `QR code form builder` |
| `/use-cases/event-registration-form-builder` | `/use-cases/webhook-form-builder-retry-logs` | `webhook-ready follow-up for form submissions` |
| `/use-cases/event-registration-form-builder` | 后续 QR 教程 Post | `create an event registration form with QR code` |

## 7. CTA Intent

建议新增或使用：

- `intent=event_registration`
- 可选 `mode=qr_friendly`，如果产品侧接受该 mode。

主 CTA URL 示例：

```text
/forms/new?template=event-registration
  &source=usecase_event-registration-form-builder
  &intent=event_registration
  &prompt=Create+an+event+registration+form+for+signup+RSVP+workshop+or+webinar+intake...
```

QR 相关页 CTA：

```text
/forms/new?template=event-registration
  &source=usecase_qr-code-form-builder
  &intent=qr_form
```

注意：

- 不要用 `ticket_sales`、`payment`、`check_in` 等 intent。
- 首页和 FormGenerator 里现有 `ticket sales form`、`门票销售表单` 文案应在后续产品/SEO 修正中调整为 `event signup form` 或 `event registration form`。

## 8. Schema 建议

| 页面 | Schema | 说明 |
|---|---|---|
| Pillar Use Case | `SoftwareApplication` + `FAQPage` + `BreadcrumbList` | FAQ 必须和可见内容一致；Breadcrumb 使用 `item.@id` 绝对 URL |
| Template Page | `SoftwareApplication` 或模板型结构 + `FAQPage` + `BreadcrumbList` | 不虚构评分、评论、价格、库存 |
| Cluster Post | `BlogPosting` + `FAQPage` + `BreadcrumbList` | FAQ 可见后再加 JSON-LD |

结构化数据红线：

- 不添加虚构 `Review`、`AggregateRating`。
- 不把页面标成票务产品或 EventManagementSoftware。
- 不写未确认价格、支付或门票库存。

## 9. 产品事实边界

### 9.1 可以明确写

- AI 生成活动报名表。
- 公开链接分享。
- 二维码访问和扫码填写。
- 移动端单题流填写。
- 提交数据面板。
- CSV 导出。
- Webhook-ready 后续流转。
- Feishu / DingTalk / WeCom / Slack Bot 推送路径作为高级 follow-up。
- 适合 webinar、workshop、meetup、RSVP、small event、internal session。

### 9.2 不能承诺

- Sell tickets.
- Accept payments or deposits.
- Manage seats or capacity.
- Check in attendees.
- QR ticket scanning.
- Production-grade email confirmations.
- Calendar scheduling.
- CRM native sync.
- Event agenda or session management.
- Badge generation.
- Refunds, coupons, ticket tiers.
- Unlimited free usage.

## 10. Build 前必须修正的现有风险

当前代码/内容里存在若干与本 Brief 红线冲突的表达，Build 阶段需要修正：

| 位置 | 风险表达 | 建议 |
|---|---|---|
| `form-templates.ts` 的 `event-registration.descriptionEn` | `manage seats` | 改为 `collect attendee details` 或 `track responses` |
| `form-templates.ts` 的 `suggestedPromptsEn` | `ticket type selections`、`confirmation email draft` | 改为 `attendance preference`、`RSVP options`、`follow-up message draft` |
| `agentQuickActionsEn` | `Add ticket type field`、`Generate email template` | 改为 `Add attendance preference`、`Draft follow-up message` |
| `formSchema` | `ticket_type`、VIP ticket wording | 改为 `attendance_preference` 或 `registration_type`，避免 ticketing 预期 |
| 首页 Hero 示例 | `ticket sales form` / `科技峰会门票销售表单` | 改为 `event signup form` / `活动报名表` |
| 现有 Solution 搜索意图 | `offline check-in` | 改为 `offline scan-to-register` |

## 11. pSEO 后续试点候选

不进入第一阶段 Build，但保留为 Expand 阶段候选。

只有当 Pillar 和 Template 上线后出现 impressions、收录稳定、产品承接无歧义，才允许小批量 5-10 页试点。

候选：

- `/templates/rsvp-form`
- `/templates/workshop-registration-form`
- `/templates/webinar-registration-form`
- `/solutions/qr-event-registration-form`
- `/solutions/workshop-registration-form-for-coaches`

每页必须有独特字段、场景、CTA 和可见信息增益，不能只换关键词。

## 12. 观察指标

上线后冻结 7-14 天。

GSC：

- `event registration form`
- `event registration form template`
- `event signup form`
- `online event registration form`
- `QR code event registration form`
- `RSVP form`
- `workshop registration form`
- `webinar registration form`

GA4 / Growth Events：

- landing page sessions
- `forms_new_view`
- `template_use_click`
- `ai_generate_submitted`
- `form_publish`
- `form_submit`
- `intent=event_registration`
- `intent=qr_form`

Clarity：

- Google 来源会话是否停留在首屏。
- 是否点击主 CTA。
- 是否查看字段清单或 QR 模块。
- 是否出现 Pricing / 空白点击 / 无效点击。

## 13. 下一步分工

| 任务 | 负责人 | 输出 |
|---|---|---|
| 评审本 Brief | Mike | 是否允许进入 Build |
| 产品边界确认 | 产品经理 | 确认 `event-registration` 模板字段和文案收窄方案 |
| UX 首屏评审 | UX | 确认首屏预览、QR 结果感和移动端路径 |
| Build 实现 | Codex | 页面/模板/CTA/内链/Schema 小范围实现 |
| URL Inspection | Mike | 上线后提交 Google/Bing |
| 后续 SERP 补充 | Gemini | 仅在拆 RSVP / Workshop / Webinar 子主题时执行 |

## 14. Final Go / No-Go

结论：**Go to Build**。

但 Build 范围必须受控：

1. 不新增大规模 pSEO。
2. 不做票务、支付、核销、座位、邮件确认承诺。
3. 第一阶段优先处理一个 Pillar + 一个 Template 承接 + 与 QR Pillar 的自然内链。
4. Build 前先修正现有 `event-registration` 模板中的 ticket / seat / email 相关过强表达。
5. 页面上线后冻结观察 7-14 天，再决定是否扩 RSVP / Workshop / Webinar 周边资产。
