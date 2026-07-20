# SEO Goal: Waitlist Form Topic Discover / Validate

> 创建日期：2026-06-27  
> 当前阶段：Discover / Validate  
> 执行人：Gemini 采集证据，Codex 复核决策  
> 状态：Codex reviewed - Enter Architect as Lead Capture subcluster

> 复核报告：`ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Waitlist_review.md`

## 1. Goal

判断 `Waitlist Form` 是否是经过 Google 和市场验证、且 GenForms 当前能够真实承接的独立 SEO Topic，并决定它应：

- 进入 Architect；
- 继续留在 Topic Universe；
- 作为 Lead Capture 子主题；
- 或因产品缺口暂缓。

本 Goal 不直接创建、重写或部署页面。

## 2. 已知资产

- Use Case：`/use-cases/waitlist-form-builder-indie-hackers`
- Template：`/templates/waitlist`
- 相关 Topic：Lead Capture、Typeform Alternative、Webhook
- 竞品初始证据：Tally、Typeform、Jotform 等模板/Use Case 中重复出现 waitlist 场景

现有资产不等于应继续投入。必须先通过真实 Google US SERP 判断 Google 如何理解该 Topic。

## 3. 必查关键词

必须分别研究，不得只查一个主词：

1. `waitlist form`
2. `waitlist form builder`
3. `waitlist form template`
4. `free waitlist form`
5. `startup waitlist form`
6. `product waitlist form`
7. `AI waitlist form builder`

允许根据 Google Autocomplete、People Also Ask 和 Related Searches 补充长尾词，但不能替代以上 7 个核心词。

## 4. Google 证据要求

### 4.1 地区与环境

- 使用美国 VPN 或其他可复核的美国出口。
- Google 参数至少包含 `gl=us&hl=en`。
- 记录抓取时间、设备、出口地区和完整搜索 URL。
- 只把 Google 传统自然结果作为 Top 10 排名依据。

### 4.2 原始证据保存

每个关键词保存：

- 原始 HTML/DOM；
- 完整 SERP 截图；
- 结构化 JSON 或 CSV；
- 完整检索 URL。

统一目录：

`/Users/mike/Documents/AIFactory/SEOData/serp_raw/waitlist_batch/`

建议命名：

- `waitlist_form.html`
- `waitlist_form.png`
- `waitlist_form.json`

其他关键词使用同样的 snake_case 命名。

### 4.3 禁止事项

- 禁止用 Brave、Bing、DuckDuckGo 结果代替 Google Top 10。
- 禁止生成 mock Google HTML 或根据记忆手工补 Top 10。
- 禁止把 CAPTCHA、空白页或挑战页面标记为成功。
- 禁止为了凑齐 10 条而虚构 title、URL、snippet、rank。
- 禁止只保存截图而不保存可解析 URL/HTML 数据。

如果某个关键词抓取失败，必须标记 `failed`，说明失败原因，并保留失败截图。报告可以部分完成，但不得伪造完整证据链。

## 5. 每个关键词的 Top 10 字段

| Field | Requirement |
|---|---|
| `keyword` | 原始搜索词 |
| `rank` | 传统自然结果排名 |
| `title` | Google 展示标题 |
| `url` | 最终页面 URL |
| `domain` | 域名 |
| `snippet` | Google 可见摘要 |
| `page_type` | product / template / guide / category / comparison / community / video |
| `intent_read` | 该结果满足的用户任务 |
| `cta_path` | 页面如何引导创建、注册或购买 |

广告、AI Overview、People Also Ask、图片、视频模块和论坛模块单独记录，不能混入传统自然 Top 10 排名。

## 6. 必须回答的市场问题

1. Google 把 `waitlist form` 理解为简单表单、模板，还是完整 waitlist software？
2. `waitlist form builder` 是否被 referral/viral waitlist、queue ranking、email campaign 等重型能力主导？
3. `waitlist form template` 是否明显偏向直接套用模板？
4. `free waitlist form` 的 free 意图是免费模板、免费额度，还是 unlimited free？
5. Startup/Product 相关词的用户主任务，是收集邮箱，还是管理邀请、排名和推荐裂变？
6. `AI waitlist form builder` 是否有真实、稳定的独立意图，还是低需求的内部想象？
7. 哪些关键词应由现有 Use Case、Template、Post 承接，哪些不应做页面？
8. Waitlist 应成为独立 Topic，还是 Lead Capture 的子集？

## 7. 竞品承接拆解

优先研究 Google Top 10 实际出现的竞品，不预设固定竞品名单。对其中至少 5 个代表页面记录：

- 首屏承诺；
- 页面类型；
- 核心字段/模板预览；
- 主 CTA 与次 CTA；
- CTA 后进入模板、编辑器、注册还是定价；
- 是否强调 free、no-code、AI、embed、custom domain；
- 是否强调 referral、viral loop、queue position、invite code、email automation；
- 用户可见的结果感和信任证据；
- GenForms 可借鉴模式；
- GenForms 当前无法承接的部分。

## 8. GenForms 产品事实边界

当前可以明确写：

- AI 生成表单；
- 单题流移动端填写；
- 公开分享链接；
- 二维码分享；
- 提交收集和基础数据面板；
- CSV 导出；
- 通用 Webhook 配置、日志和失败重试；
- Feishu / DingTalk / WeCom / Slack Bot 后续路径。

当前不能直接承诺：

- iframe / HTML embed；
- custom domain；
- 生产级邀请邮件、确认邮件或 email campaign；
- referral / viral waitlist；
- 推荐码、邀请奖励；
- waitlist ranking / queue position；
- 自动放行、分批邀请和 access control；
- spam protection；
- CRM 原生同步；
- 专业增长分析；
- unlimited free。

## 9. 最终报告结构

报告必须使用中文，并包含以下 10 个章节：

1. 执行摘要；
2. 抓取环境、时间和数据完整性；
3. 7 个关键词逐词 Top 10 原始证据表；
4. SERP Features、Autocomplete、PAA、Related Searches；
5. 逐关键词 Search Intent 和用户主任务；
6. 代表竞品页面及转化路径拆解；
7. GenForms 产品契合度和能力红线；
8. 关键词到页面类型的映射；
9. Topic 资产包建议与内部链接关系；
10. 最终决策：Enter Architect / Keep in Universe / Merge into Lead Capture / Reject。

逐关键词必须给出：

- `同意进入主线 / 部分同意 / 不同意`；
- 推荐页面类型；
- 推荐目标 URL；
- 优先级 P0/P1/P2；
- 证据置信度；
- 不建议承诺的能力。

## 10. 输出路径

主报告必须写入：

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Waitlist.md`

同时更新 Gemini 的 `walkthrough.md`，列出所有原始 HTML、截图、JSON 和报告路径。

## 11. 验收标准

Codex 只有在以下条件全部满足后才会进入 Validate / Decide：

- 7 个关键词都有成功证据或如实失败记录；
- 成功样本来自真实 Google US SERP；
- Top 10 URL 可逐条复核；
- 没有 mock、伪造或其他搜索引擎替代数据；
- 用户任务、页面类型和竞品 CTA 分析完整；
- 明确区分简单 waitlist form 与重型 waitlist software；
- 所有建议遵守 GenForms 当前产品事实边界。
