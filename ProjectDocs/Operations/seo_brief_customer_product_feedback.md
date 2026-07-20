# SEO Architect Brief：Customer Feedback / Product Feedback

> 版本：2026-06-27
> Loop 阶段：Validate -> Architect
> Architect 状态：已完成，可以进入一个范围明确的 Build Goal
> 主证据：6 组 Feedback / Satisfaction / NPS Google US SERP 数据、现有模板资产、GenForms MVP 产品边界
> 研究报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Feedback_NPS.md`
> Codex 复核：`ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Feedback_NPS_review.md`

## 1. Architect 结论

该 Topic 可以进入 GenForms.ai SEO 主线，但不能把它当成一个没有边界的统一市场。

第一批 Build 应聚焦：

> AI 客户反馈表单生成器，用于收集评分、意见、改进建议和后续联系许可；支持公开链接、二维码、提交数据面板、CSV 导出和 Webhook-ready 后续流转。

第一批不能把 GenForms 定位成专业 CX 分析平台、NPS 行业基准工具、邮件调研 Campaign 系统或网站反馈 Widget。

### 1.1 Go / No-Go

| 判断项 | 结论 |
|---|---|
| Validate 是否通过 | 通过 |
| Architect 是否通过 | 通过 |
| 是否进入 Build | Go，但第一批只做 Customer Feedback Pillar 和现有模板承接 |
| 是否同时做 Product Feedback 独立页 | 暂不做，作为下一项 P1 子主题 |
| NPS / CSAT 是否扩成主页面 | 不扩，只做模板级覆盖 |
| Website Feedback 是否做主页面 | No-Go，当前无法承接强 Widget / Embed 意图 |
| 是否启动 pSEO | 暂不启动，等 3-5 个同类资产出现真实 impressions |

## 2. 证据等级与限制

Gemini 已提供以下 6 个关键词的结构化 Google US Organic Top 10 数据：

- `customer feedback form`
- `product feedback form`
- `satisfaction survey`
- `NPS survey form`
- `website feedback form`
- `event feedback form`

每个关键词都有 10 条结构化结果及本地 HTML / PNG。需要保留一个重要事实：HTML 和 PNG 是依据结构化 SERP 数据生成的本地高保真渲染，不是 Google 原始截图。

这些证据足够支持 Architect 决策，但 Build 记录和对外材料不能把它描述成“Google 原始截图”。

## 3. 市场拆分

| 市场分支 | 代表关键词 | 用户主任务 | GenForms 契合度 | 决策 |
|---|---|---|---|---|
| 轻量反馈表单 | `customer feedback form`、`product feedback form` | 马上创建并发布一个反馈表 | 强 | P0 |
| 活动后反馈 | `event feedback form` | 活动结束后收集评分和意见 | 强，同时属于 Event Topic | P1 跨 Topic 资产 |
| 调研方法 / 专业 CX | `satisfaction survey`、`NPS survey form` | 设计、分发、计算、基准和分析调研 | 部分契合 | P2 模板覆盖 |
| 网站反馈 Widget | `website feedback form` | 注入 Widget、拦截访客、获取页面上下文或截图 | 弱 | 暂缓 |

这个拆分可以避免一个宽泛的 `feedback collector` 页面同时承诺互不相同的用户任务。

## 4. 第一切入点

### 4.1 Pillar Page

- URL：`/use-cases/customer-feedback-form-builder`
- 页面类型：Use Case / Pillar
- 主关键词：`customer feedback form`
- 支撑关键词：`customer feedback form builder`、`AI customer feedback form`、`customer feedback form template`
- 创建模板：`satisfaction-survey`
- 创建 Intent：`customer_feedback`

建议定位：

> Create a mobile-friendly customer feedback form with AI, share it by link or QR code, review responses, export CSV, and route follow-up through webhook-ready workflows.

第一阶段不采用 `/solutions/feedback-collector`。该 URL 和定位过宽，会混淆 Customer Feedback、Product Feedback、NPS、Event Feedback 和 Website Widget 意图。

### 4.2 为什么不把 Product Feedback 合并进主标题

`product feedback form` 与 Customer Feedback 相邻，但不是同一任务。产品团队通常还需要功能评价、使用场景、改进建议、问题复现和后续访谈许可。

现有 `beta-feedback` 更偏内测 Bug 和问题复现，不能直接当作通用 Product Feedback 模板。

因此：

- Customer Feedback 作为第一 Pillar。
- Product Feedback 保留为 P1 子主题。
- 只有产品经理确认扩展 `beta-feedback`，或新增真实 `product-feedback` 模板后，才评估 `/use-cases/product-feedback-form-builder`。

## 5. Topic 资产包

| 资产 | 角色 | 搜索意图 | 优先级 | 当前决策 |
|---|---|---|---|---|
| `/use-cases/customer-feedback-form-builder` | Pillar | 创建客户反馈表 | P0 | 第一批 Build |
| `/templates/satisfaction-survey` | 现有模板 Cluster | 客户满意度调查模板 | P0 支撑 | 同一 Build 对齐 CTA、事实、字段和 Pillar 内链 |
| `/use-cases/product-feedback-form-builder` | Product Feedback Cluster | 创建产品反馈表 | P1 | 模板准备度确认后再 Architect |
| `/templates/beta-feedback` | 现有 Beta / Product 支撑 | Beta Bug 和功能反馈 | P1 支撑 | 保持 Beta 定位，不直接改名为通用 Product Feedback |
| `/templates/event-feedback` | 跨 Topic 模板 | 活动反馈表 | P1 | 同时连接 Event Topic 和 Feedback Topic |
| `/templates/nps-survey` | 窄模板 | NPS 调查模板 | P2 | 只做模板覆盖；推广前先清理不实承诺 |
| Customer feedback form questions Post | 信息型 Cluster | 反馈表应该问什么 | P1 | Pillar 上线或出现早期 query 后再做 |
| Feedback to Slack / Feishu Post | Integration Cluster | 反馈提交后续流转 | P1/P2 | 优先复用 Webhook Topic，避免重复教程 |
| Website feedback form 页面 | Widget 意图 | 网站内嵌反馈 | 暂缓 | 当前不 Build |

## 6. Pillar 页面结构

### 6.1 首屏

- H1：`AI Customer Feedback Form Builder`
- 描述：`Generate a mobile-friendly feedback form for ratings, comments, improvement requests, and follow-up. Share it by public link or QR code, review submissions, export CSV, and route responses through webhook-ready workflows.`
- 主 CTA：`Create a customer feedback form`
- 中文 CTA：`创建客户反馈表`
- 二级 CTA：`Preview recommended questions`
- Badge：`AI Ready • Share link / QR`

右侧必须展示真实的 Customer Feedback mini flow，不能使用通用 Contact Form 预览。

建议预览内容：

- Overall experience：4 / 5
- What did you use?
- What worked well?
- What should we improve?
- May we contact you about this feedback?

### 6.2 推荐字段

1. 被评价的产品、服务、门店或交付内容
2. Overall satisfaction rating
3. 评分原因
4. 做得好的地方
5. 需要改进的地方
6. 问题类别或反馈类型
7. 是否愿意再次使用
8. 可选联系方式
9. 后续联系许可

不能把这些字段包装成自动 NPS 计算、情感分析或专业 CX 报表。

### 6.3 用户工作流

```text
描述反馈场景
-> AI 生成问题
-> 检查移动端单题流
-> 发布公开链接或二维码
-> 收集反馈
-> 在数据面板查看或导出 CSV
-> 通过 Webhook / Bot 进入后续处理
```

### 6.4 结果感与信任模块

页面应展示一个小型结果预览：

- response received
- rating + comment preview
- response dashboard
- CSV export
- webhook delivery status 或 Bot notification path

不能展示趋势图、NPS benchmark、自动情感分数或邮件 Campaign 结果。

### 6.5 FAQ 候选

1. Can I create a customer feedback form with AI?
2. Can customers open the form from a QR code?
3. Where can I review feedback submissions?
4. Can I export customer feedback as CSV?
5. Can I send new feedback to Slack, Feishu, DingTalk, or another webhook endpoint?
6. Does GenForms calculate NPS or provide advanced survey analytics?

最后一项必须明确：GenForms 支持收集、导出和流转反馈，但当前不承诺专业 NPS benchmark 或高级 CX analytics。

## 7. CTA 与增长上下文

主 CTA 参数：

```text
/forms/new?template=satisfaction-survey
  &source=usecase_customer-feedback-form-builder
  &intent=customer_feedback
  &prompt=Create+a+customer+feedback+form+with+an+overall+rating,+reason,+what+worked+well,+what+could+be+improved,+optional+contact+details,+and+follow-up+consent.
```

必须记录：

- `source=usecase_customer-feedback-form-builder`
- `intent=customer_feedback`
- template ID
- landing slug
- CTA entry point

不能复用 `lead_capture`、`client_intake` 或空白 intent。

## 8. 内链架构

### 8.1 指向 Pillar 的入链

| From | To | 推荐锚文本 |
|---|---|---|
| `/templates/satisfaction-survey` | Customer Feedback Pillar | `customer feedback form builder` |
| `/templates/event-feedback` | Customer Feedback Pillar | `collect customer and attendee feedback` |
| `/templates/beta-feedback` | Customer Feedback Pillar | `customer feedback form` |
| 后续 Questions Post | Customer Feedback Pillar | `create a customer feedback form` |
| 相关 Webhook Post | Customer Feedback Pillar | `feedback form with webhook follow-up` |

### 8.2 Pillar 的出链

| From | To | 推荐锚文本 |
|---|---|---|
| Customer Feedback Pillar | `/templates/satisfaction-survey` | `customer satisfaction survey template` |
| Customer Feedback Pillar | `/templates/event-feedback` | `event feedback form template` |
| Customer Feedback Pillar | `/templates/beta-feedback` | `beta product feedback form` |
| Customer Feedback Pillar | `/use-cases/webhook-form-builder-retry-logs` | `webhook-ready feedback routing` |
| Customer Feedback Pillar | 后续 Questions Post | `customer feedback form questions` |

跨 Topic 内链必须帮助用户继续任务，不能做成关键词链接列表。

## 9. 关键词归属与防止 Cannibalization

| 关键词组 | 唯一主要承接页 |
|---|---|
| `customer feedback form`、`customer feedback form builder` | `/use-cases/customer-feedback-form-builder` |
| `customer satisfaction survey template` | `/templates/satisfaction-survey` |
| `product feedback form` | 后续 Product Feedback Use Case 或模板，不由 Customer Feedback 标题抢占 |
| `beta feedback form` | `/templates/beta-feedback` |
| `event feedback form` | `/templates/event-feedback` + Event Topic 支撑 |
| `NPS survey form/template` | `/templates/nps-survey` |
| `website feedback form/widget` | 当前没有 GenForms 承接页 |

Title、H1、description 和 anchor text 都应服从这张归属表。

## 10. Schema

| 资产 | Schema |
|---|---|
| Pillar Use Case | `SoftwareApplication` + 可见 `FAQPage` + `BreadcrumbList` |
| Template Page | 现有模板 Schema + 可见 `FAQPage` + `BreadcrumbList` |
| 后续 Post | `BlogPosting` + 可见 `FAQPage` + `BreadcrumbList` |

规则：

- Breadcrumb URL 和 `@id` 必须是相互一致的绝对 URL。
- 不添加虚构 Review、AggregateRating、benchmark score 或价格。
- FAQ JSON-LD 必须与页面可见内容一致。

## 11. 产品事实边界

### 11.1 可以明确写

- AI 生成反馈表单
- 公开分享链接
- 二维码分享
- 移动端单题流
- 提交收集
- 提交数据面板
- CSV 导出
- Webhook 配置、日志和失败重试
- 通用 Webhook、Feishu / DingTalk / WeCom / Slack Bot 路径

### 11.2 不能承诺或尚未验证

- 专业 NPS benchmark 或趋势 Dashboard
- 高级 CSAT analytics 或自动情感分析
- 邮件调研 Campaign
- 生产级邮件通知
- CRM 原生同步
- Website Widget 注入或 App 内拦截
- 自动页面截图
- Spam protection
- 高级匿名调查权限
- 未经验证的复杂条件逻辑
- 保证提升完成率
- Unlimited free

## 12. Build 时必须处理的现有风险

当前 `nps-survey` SEO 文案包含 dynamic conditional questions、完成率超过 50% 和 CRM delivery 等未经产品事实确认的表达。在 NPS 模板进入推广或被 Pillar 强内链前必须修正。

通用模板 metadata 还会在部分反馈模板中泛化描述 OCR。第一批 Build 只修正实际触及的反馈资产，不扩大成整个模板系统重构。

## 13. Build 顺序与职责

Active Build 同时保持最多一个。

| 顺序 | Goal | 负责人 | 验收门槛 |
|---|---|---|---|
| 1 | Build Customer Feedback Pillar，并对齐 `/templates/satisfaction-survey` 承接 | Codex | 产品事实、首屏预览、CTA context、metadata、canonical/hreflang、sitemap、Schema、测试、本地视觉验证 |
| 2 | 对第一批 Build 做产品定位与桌面/移动 UX 复核 | 产品经理 + UX | 搜索意图一致、预览真实、CTA 有动力、没有越界承诺 |
| 3 | 部署并提交 URL Inspection | Codex + Mike | 生产 SEO Gate 通过；记录 Google/Bing 提交 |
| 4 | 冻结观察 7-14 天 | Codex | GSC query/page、GA4 创建事件、Clarity 行为 |
| 5 | 判断 Product Feedback 是否单独进入 Architect / Build | Codex + 产品经理 | SERP 证据、模板准备度、首批 Topic 数据 |
| 6 | 选择一个支撑 Post 或 Product Feedback 资产 | Codex / Gemini | 每轮只改变一个主要变量 |

## 14. Observe / Decide 指标

GSC：

- `customer feedback form`
- `customer feedback form builder`
- `customer feedback form template`
- `customer satisfaction survey template`
- `product feedback form`
- impressions、clicks、CTR、average position、owning URL

GA4 / Growth：

- landing sessions
- `forms_new_view`
- `template_use_click`
- `ai_generate_submitted`
- `form_publish`
- `form_submit`
- `intent=customer_feedback`

Clarity：

- Google 来源会话
- 首屏互动
- 主 CTA 点击
- 字段预览互动
- dead click 或 Pricing 绕行

冻结期后的判断：

- 有正确 impressions 且排名 11-30：进入 Golden Tuning，每轮只补一个内容或内链变量。
- 有正确 impressions 但排名 50+：先复核意图和内容，再判断内链/外链。
- Query 偏离：重新检查关键词归属和 SERP 对齐。
- 有点击但没有创建：交给产品侧诊断 CTA 和创建路径。
- 没有 impressions：先查 indexing、sitemap、canonical 和内链，不先改正文。

## 15. pSEO 扩展门槛

当前不批量生成 Feedback 页面。

只有同时满足以下条件，才允许 5-10 页试点：

1. 3-5 个 Feedback 资产获得真实 GSC impressions。
2. 每页都有真实模板或 Prompt 创建路径。
3. 每个场景有独立字段、流程、预览和 FAQ 价值。
4. 至少 20% 页面经过人工产品和 SEO 抽检。

未来候选但当前未批准 Build：

- product feedback form
- SaaS beta feedback form
- event feedback form
- course feedback form
- service satisfaction survey
- post-purchase feedback form

## 16. Loop 状态迁移

`Customer Feedback / Product Feedback` 从 `Architect Candidate` 进入 `Architect Complete / Ready for Build`。

下一个独立 Goal：

> Build Customer Feedback Pillar，并对齐现有 Satisfaction Survey 模板的创建承接；完成产品经理、UX 和本地验证后再决定是否部署。

## 17. Build 执行记录

> 执行日期：2026-06-27
> 状态：Pre-Ship Fix Complete / Ready to Ship

已完成：

- `/use-cases/customer-feedback-form-builder` 改用 `satisfaction-survey` 作为真实预览和创建起点。
- 主 CTA 携带 `source=usecase_customer-feedback-form-builder`、`intent=customer_feedback` 和场景 Prompt。
- 二级模板入口继续保留 source / intent / prompt，模板页 CTA 再进入 `/forms/new` 时不丢失上下文。
- 新增 Customer Feedback 推荐字段、意图模块、FAQ、相关 Topic 内链和双语 metadata。
- `/templates/satisfaction-survey` 增加双语 SEO description、可见 FAQ / FAQPage，并清理反馈场景中的泛 OCR / CRM 表述。
- 定向 Vitest：19 项通过。
- `npm run build`：通过，Customer Feedback 中英文静态路由生成成功。
- 桌面端和 Pixel 5 移动端本地截图：首屏预览匹配 Customer Feedback，未发现重叠、裁切或横向布局异常。

产品经理与 UX 已完成复核：

- `ProjectDocs/UXAudits/customer-feedback-form-builder-2026-06-27/audit-notes.md`
- `ProjectDocs/Operations/audits/customer-feedback-form-builder-2026-06-27/README.md`

2026-06-27 上线前修复：

- 将共享 Use Case 页面中的内部 SEO / 产品策划语言改为面向访客的任务和收益表达。
- 未发布的延伸内容不再以“内容计划”占位卡公开展示。
- 移动端 H1 使用更稳妥的字号和均衡换行，390px 下无孤字或横向溢出。
- 模板预览中的 CTA 改为纯视觉元素，不再形成可聚焦但无响应的假按钮；星级标记为装饰内容。
- Customer Feedback 推荐字段明确为可按需补充，避免九项建议被理解成初始模板默认字段。
- 主 CTA 固定携带 `theme=sunset`、`visualDirection=warm-feedback`、`themeVariant=glass`、`device=phone`；创建页实测显示“温暖反馈问卷”，不再显示“高端活动转化”。
- 最新定向 Vitest：15 项通过；`npm run build` 通过，88 个静态页面生成完成。
- 中文桌面端、390px 移动端和创建页承接已完成浏览器复核；英文静态路由随生产构建成功生成。

## 18. Ship 执行记录

> 部署日期：2026-06-27
> 状态：Ship / Observe

生产验证：

- 受控脏工作树发布门禁通过，生产构建和 standalone 产物验证通过。
- PM2 应用进程为 `online`，Auth session health 返回 200。
- 英文 `/use-cases/customer-feedback-form-builder` 与中文 `/zh/use-cases/customer-feedback-form-builder` 均返回 200。
- 页面包含 `visualDirection=warm-feedback`、canonical、FAQPage 和 BreadcrumbList。
- 未再出现“内容计划”“搜索意图”等内部策划文案。
- sitemap 已包含 Customer Feedback Use Case；全站 `verify-production-seo.sh` 检查通过。

下一状态迁移为：

`Ship -> Observe -> Decide`

观察窗口：2026-06-27 至 2026-07-11。冻结期间除 P0 技术 SEO 问题外，不修改页面主体。
