# SEO Architect Brief: Waitlist Form 子集群

> 版本：2026-06-27  
> Loop 阶段：Validate -> Architect  
> Architect 状态：已完成，可以进入一个小范围 Build Goal  
> Parent Topic：Lead Capture  
> Gemini 报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Waitlist.md`  
> Codex 复核：`ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Waitlist_review.md`

## 1. Architect 结论

Waitlist 已通过市场与产品契合度验证，但不应成为与 Lead Capture 平级的新顶层 Topic。

正确架构是：

> Lead Capture 为母 Topic；Waitlist 为有独立搜索意图、独立资产和 GSC 信号的子集群。

第一阶段不新建 URL，只把现有 Use Case、Template、Post、母 Pillar 和 Webhook 支撑页连接成一个可归因的资产包。

建议定位：

> AI waitlist form builder for pre-launch signups and early demand validation, with a public link, QR sharing, response dashboard, CSV export, and webhook-ready follow-up.

中文定位：

> 用 AI 创建产品预发布 Waitlist 表单，通过公开链接或二维码收集早期用户，在数据面板查看并导出报名数据，并可进入 Webhook-ready 后续流转。

### 1.1 Go / No-Go

| 判断项 | 结论 |
|---|---|
| Validate 是否通过 | 通过，Google US SERP 与 GSC 均证明存在独立子意图 |
| Architect 是否通过 | 通过 |
| 是否进入 Build | Go，但只做现有资产接线和事实边界修复 |
| 是否新建页面 | No-Go；当前已有足够承接资产 |
| 是否改排名较好的 Post 正文 | No-Go；保护现有 title、meta 和正文 |
| 是否启动 pSEO | No-Go；先观察现有 3 个 Waitlist 资产 |

## 2. 证据等级与限制

Gemini 研究覆盖 7 个 Google US 关键词：

- `waitlist form`
- `waitlist form builder`
- `waitlist form template`
- `free waitlist form`
- `startup waitlist form`
- `product waitlist form`
- `AI waitlist form builder`

原始证据共 59 条自然结果，单词结果数依次为 10、8、9、8、8、8、8。证据足够支持 Topic 和页面类型判断，但不是 70 条完整 Top 10。

其他限制：

- PNG 仅覆盖 SERP 首屏，不能独立复核全部自然结果。
- 59 条记录没有结构化 `cta_path`，竞品转化路径只能作为有限人工样本使用。
- 16 条记录缺少 snippet。
- 原报告中的 PAA、Related Searches、80% 用户覆盖和更高转化率等说法没有完整原始证据，不进入本 Brief 的事实层。

## 3. GSC 交叉验证

最新可用 snapshot 为 2026-06-25。

| Window | 资产 / Query | Impressions | Clicks | Avg position | Architect 判断 |
|---|---|---:|---:|---:|---|
| 28d | `/use-cases/waitlist-form-builder-indie-hackers` | 36 | 0 | 25.0 | 已进入可优化区，保留为 Waitlist Sub-Pillar |
| 28d | `/posts/waitlist-form-demand-validation` | 20 | 0 | 10.0 | 已有前 10 小样本，必须保护正文和 metadata |
| 28d | `/templates/waitlist` | 8 | 0 | 71.1 | 已被发现但权重弱，优先增强集群内链 |
| 28d | `create waitlist` | 1 | 0 | 12.0 | 方向信号，样本不足以单独触发改标题 |

这些数据证明 Waitlist 不需要靠新 URL 再验证，当前问题是资产权重与创建路径尚未充分汇合。

## 4. Topic 资产包与页面分工

| Layer | 现有资产 | 唯一角色 | 本轮 Architect 决策 |
|---|---|---|---|
| Parent Pillar | `/use-cases/ai-lead-capture-form-builder` | Lead Capture 母 Topic，解释通用获客任务 | 向 Waitlist 子场景传递内链，不抢 Waitlist template 词 |
| Waitlist Sub-Pillar | `/use-cases/waitlist-form-builder-indie-hackers` | builder、startup、AI waitlist 主承接 | 保留 URL；补 `intent=waitlist`，接入正确 Post 和能力边界 |
| Template | `/templates/waitlist` | waitlist form template、free template 主承接 | 保留 URL；CTA 带 waitlist context，接受 Use Case/Post 入链 |
| Support Post | `/posts/waitlist-form-demand-validation` | demand validation 教程意图 | 保护 title/meta/正文；补专属 CTA 和资产内链 |
| Technical support | `/use-cases/webhook-form-builder-retry-logs` | 报名提交后的高级流转与可靠性 | 只做后续路径，不作为 Waitlist 首屏主卖点 |

第一阶段不新增 Solution 页。现有资产已经覆盖创建、模板和教程三个主要意图，再增加同义 Solution 会稀释页面所有权。

## 5. 关键词归属与防止 Cannibalization

| 关键词组 | 唯一主要承接页 | 优先级 | 说明 |
|---|---|---|---|
| `waitlist form builder` | `/use-cases/waitlist-form-builder-indie-hackers` | P1 | 创建型 Use Case 意图 |
| `startup waitlist form` | Waitlist Sub-Pillar | P1 | 定位 pre-launch signup，不定位 viral software |
| `AI waitlist form builder` | Waitlist Sub-Pillar | P1 | 强调 AI 建表，不承诺专用 waitlist automation |
| `waitlist form template` | `/templates/waitlist` | P0 | 明确模板意图 |
| `free waitlist form` | `/templates/waitlist` | P1/P2 | 只能描述真实免费额度，不写 unlimited free |
| `product waitlist form` | Waitlist Sub-Pillar / Post | P2 | 不承诺库存到货通知或电商自动化 |
| `waitlist form` | Sub-Pillar / Template | P2 | 混合意图，不抢大学候补和线下排队语义 |
| `validate product demand with waitlist` | `/posts/waitlist-form-demand-validation` | P1 | 教程和方法意图 |

拒绝创建以下近义 URL：

- `/solutions/lead-capture/waitlist-form`
- `/solutions/lead-capture/waitlist-builder`
- `/templates/free-waitlist-form`
- `/use-cases/startup-waitlist-form`
- `/use-cases/product-waitlist-form`
- `/ai-generator/waitlist-form`

## 6. 页面内容边界

### 6.1 可以明确写

- AI 生成 Waitlist 表单
- 移动端单题流
- 公开分享链接
- 二维码分享
- 收集姓名、邮箱、角色、使用场景、痛点和邀请偏好
- 提交收集与基础数据面板
- CSV 导出
- Webhook 配置、日志和失败重试
- 通用 Webhook、Feishu / DingTalk / WeCom / Slack Bot 后续路径

### 6.2 部分支持，必须克制表达

- Pre-launch signup：支持收集报名，不是完整 launch campaign 系统。
- 用户分组：可以通过表单字段收集角色和意向，不是自动 segmentation engine。
- 后续跟进：可以导出或通过 Webhook/Bot 流转，不是生产级邮件自动化。
- Free：只能依据真实套餐额度描述，不能写 unlimited free。

### 6.3 不能承诺

- Referral loop、推荐奖励和病毒裂变
- Waitlist rank、队列位置和 leaderboard
- 邀请码、自动放号和 access control
- 生产级邮件确认、drip campaign 或 launch newsletter
- Custom domain
- iframe / HTML embed
- Spam protection
- CRM 原生同步
- 电商缺货通知或库存同步
- 保证提高转化率

现有模板 Quick Action `Draft beta welcome email` 容易形成产品能力误解。Build 时应改为只生成跟进文案草稿的明确表述，或删除该动作，不能暗示 GenForms 会发送邮件。

## 7. 内链架构

### 7.1 母 Topic 与子集群

| From | To | 推荐锚文本 / 任务 |
|---|---|---|
| Lead Capture Parent Pillar | Waitlist Sub-Pillar | `create a pre-launch waitlist form` |
| Waitlist Sub-Pillar | Lead Capture Parent Pillar | `AI lead capture form builder` |

当前两个 Use Case 已通过 `relatedSlugs` 互相连接，Build 只需验证生产渲染和锚文本是否清楚，不新增重复模块。

### 7.2 Waitlist 资产内部连接

| From | To | 推荐锚文本 / 任务 |
|---|---|---|
| Waitlist Sub-Pillar | `/templates/waitlist` | `start with the waitlist template` |
| Waitlist Sub-Pillar | Demand Validation Post | `validate product demand with a waitlist form` |
| Template | Waitlist Sub-Pillar | `waitlist form builder for a product launch` |
| Post | Waitlist Sub-Pillar | `create a waitlist form`；现有正文入链保留 |
| Post | Template | `use the early access waitlist template` |
| Waitlist Sub-Pillar / Post | Webhook Pillar | `route waitlist signups through a webhook` |

内链应出现在相关任务上下文中，不制作关键词链接墙。

## 8. CTA 与创建上下文

### 8.1 Waitlist Sub-Pillar

```text
/forms/new?template=waitlist
  &source=usecase_waitlist-form-builder-indie-hackers
  &intent=waitlist
  &prompt=Create a waitlist form for an indie SaaS launch with early access, role, use case, and contact fields.
```

现有 Use Case 已有模板和 Prompt，但 `getUseCaseCreationContext` 尚未映射 waitlist，Build 必须补齐。

### 8.2 Template

模板页默认创建上下文：

```text
template=waitlist
source=template_waitlist
intent=waitlist
```

如果用户由 Use Case 或 Post 带 source / intent / prompt 进入模板页，必须继续保留上游参数。

### 8.3 Support Post

Post 主 CTA：

```text
template=waitlist
source=post_waitlist-form-demand-validation
intent=waitlist
prompt=Create a pre-launch waitlist form that collects name, email, role, main use case, pain point, and launch update preference.
```

推荐按钮：

- Primary：`Review the waitlist workflow`，指向 Waitlist Sub-Pillar。
- Secondary：`Create a waitlist form`，直接进入预配置创建路径。

## 9. Schema 规则

| 资产 | Schema |
|---|---|
| Waitlist Use Case | `SoftwareApplication` + 可见 `FAQPage` + `BreadcrumbList` |
| Waitlist Template | `SoftwareApplication` + 可见 `FAQPage` + `BreadcrumbList` |
| Demand Validation Post | `BlogPosting` + 可见 FAQ 时才加 `FAQPage` + `BreadcrumbList` |

规则：

- Breadcrumb URL 与 `@id` 使用一致的绝对 URL。
- FAQ JSON-LD 必须与页面可见问答一致。
- 不添加虚构 Review、AggregateRating、用户数量、排名提升或转化率数据。
- 不用 Schema 暗示 EmailApplication、CRM、MarketingAutomation 或 ReferralSoftware 能力。

## 10. Build Goal 范围

Active Build 同时只保留一个。下一 Goal 只允许处理以下内容：

1. 在 `growth-content-clusters.ts` 把 Waitlist 的首要 Post 改为 `waitlist-form-demand-validation`。
2. 在 Use Case 创建上下文中增加 `waitlist-form-builder-indie-hackers -> intent=waitlist`。
3. 让 `/templates/waitlist` 默认使用 `source=template_waitlist`、`intent=waitlist`，并保留上游 context。
4. 为 Waitlist Post 增加专属 CTA 配置和相应测试。
5. 验证 Parent、Sub-Pillar、Template、Post、Webhook 的任务型内链；只补缺失链接。
6. 清理本次触及区域中暗示邮件发送、referral、排名或 unlimited free 的表达。
7. 运行定向测试、构建和桌面/移动页面验证。

### 10.1 明确不在 Build 范围

- 不新建 URL。
- 不改 `/posts/waitlist-form-demand-validation` 的 title、meta 或正文主体。
- 不重写 Waitlist Use Case H1 或 metadata；先完成接线并观察。
- 不重构整个 Template 系统。
- 不扩写 referral、email campaign、custom domain 或 embed 内容。
- 不部署 pSEO 页面。

## 11. Build 验收门槛

| 检查项 | 验收标准 |
|---|---|
| 资产分工 | 每个主关键词只有一个主要 owning URL |
| Topic Cluster | Waitlist Use Case 优先展示真实 Waitlist Post |
| 创建路径 | Use Case、Template、Post 均携带 `intent=waitlist` 和正确 source |
| 参数继承 | 从 Use Case/Post 进入 Template 后，创建 CTA 不丢 source、intent、prompt |
| 产品事实 | 页面和 CTA 不承诺红线能力 |
| 内链 | Parent、Sub-Pillar、Template、Post、Webhook 形成任务型连接 |
| Schema | JSON-LD 与可见页面一致，无虚构数据 |
| 测试 | Cluster 顺序、Post CTA、模板 context 有定向测试 |
| 构建 | `npm run build` 通过 |
| 视觉验证 | 英文和中文、桌面和移动端无错位，CTA 与 Waitlist 任务一致 |

Build 完成后仍需产品经理和 UX 做一次轻量复核，重点检查首屏任务、CTA 动力、模板预览和能力边界。

## 12. Observe / Decide 指标

Build 部署后冻结观察 7-14 天。

GSC：

- `waitlist form builder`
- `waitlist form template`
- `startup waitlist form`
- `AI waitlist form builder`
- `free waitlist form`
- `create waitlist`
- 三个 owning URL 的 impressions、clicks、CTR 和 average position

GA4 / Growth：

- landing sessions
- `template_use_click`
- `forms_new_view`
- `ai_generate_submitted`
- `form_publish`
- `form_submit`
- `intent=waitlist`
- source 在 Use Case、Template、Post 之间的分布

Clarity：

- Google 来源 Waitlist 会话
- 主 CTA 和模板入口点击
- 从文章到创建路径的行为
- dead click、Pricing 绕行或创建页退出

冻结期后的决策：

- 排名 11-30 且 query 正确：进入 Golden Tuning，一轮只改变一个变量。
- Template 仍在 50+：先增强相关入链和模板任务清晰度，不新建 free template URL。
- 有点击但没有创建：交给产品侧诊断 CTA、登录和创建路径。
- Query 偏向 referral / ranking：通过可见文案降低预期，不补做不支持能力。
- 7-14 天仍无新信号：先检查收录、canonical、sitemap、内链和外链，不直接重写全部页面。

## 13. pSEO 扩展门槛

当前不启动 Waitlist pSEO。只有同时满足以下条件，才允许 5-10 页小批量试点：

1. Use Case、Template、Post 至少两个资产出现稳定 impressions。
2. 至少一个 Waitlist 页面进入平均排名 11-30 或产生真实点击。
3. 每个试点页面有独立用户任务、字段、预览和创建 Prompt。
4. 产品可以真实承接，且不依赖 referral、ranking、email automation 或 embed。
5. 试点页面经过人工产品与 SEO 抽检。

未来候选但当前未批准：

- SaaS beta waitlist form
- mobile app launch waitlist form
- creator product waitlist form
- community early access form
- workshop waitlist form

## 14. Loop 状态迁移

`Waitlist Form` 从 `Architect` 进入 `Architect Complete / Ready for Build`。

下一个独立 Goal：

> Build Waitlist 子集群接线：对齐真实 Post、`intent=waitlist`、Template/Post 创建上下文和缺失内链；完成测试、构建及产品/UX 复核后再决定部署。

## 15. Build 执行记录

> 执行日期：2026-06-27  
> 状态：Pre-Ship Pass / Ready to Ship  
> UX Audit：`ProjectDocs/Operations/audits/waitlist-subcluster-2026-06-27/README.md`

已完成：

- Waitlist Cluster 改为优先连接 `/posts/waitlist-form-demand-validation`。
- Use Case、Template 和 Post 创建入口统一携带 `intent=waitlist`、可归因 source 和 Waitlist prompt。
- Template 入口继续保留上游 source / intent / prompt。
- Waitlist Use Case 连接 Lead Capture Parent、真实 Waitlist Post、Template 和 Webhook 高级路径。
- 首屏预览移除虚构的 `12.4k joined`、等待时间和席位暗示。
- CTA Badge 改为真实能力 `AI Ready • Share link / QR`。
- 模板动作明确为生成 welcome email copy，不暗示 GenForms 会发送邮件。
- 5 个定向测试文件、26 项测试通过。
- `npm run build` 通过，88 个静态页面生成完成。
- 英文桌面和 390px 移动端浏览器验收通过，无横向溢出或框架错误覆盖层。

下一个状态迁移：

`Pre-Ship Pass -> Ship -> Observe`

## 16. Ship 执行记录

> 部署日期：2026-06-27  
> 当前状态：Ship / Observe  
> 冻结窗口：2026-06-27 至 2026-07-11

生产验证：

- `/use-cases/waitlist-form-builder-indie-hackers`：200。
- `/zh/use-cases/waitlist-form-builder-indie-hackers`：200。
- `/templates/waitlist`：200。
- `/posts/waitlist-form-demand-validation`：200。
- 公网和源站均显示 `AI Ready • Share link / QR`、安全预览和 `intent=waitlist`。
- Template 默认 CTA 携带 `source=template_waitlist` 与 `intent=waitlist`。
- Post CTA 携带 `source=post_waitlist-form-demand-validation` 与 `intent=waitlist`。
- Use Case canonical、`SoftwareApplication`、`FAQPage`、`BreadcrumbList` 通过。
- sitemap 包含 Waitlist Use Case。
- 全站 `verify-production-seo.sh` 通过。

单独发现但不归入 Waitlist 观察变量：`verify-release-state.sh` 曾期待已废弃的长首页 title，与已验证的 Bing-safe 基线 `AI Form Builder | GenForms.ai` 不一致。2026-06-27 已修正本地门禁断言，生产 release-state 全项通过；该修复没有改变生产 metadata 或 Waitlist 观察变量。
