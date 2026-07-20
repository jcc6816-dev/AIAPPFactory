# Google SERP Capture Required: Contact Form Cluster

日期：2026-06-19
负责人：Codex
状态：待补 Google 样本；这是进入页面实现前的强制 Gate

## 0. 当前执行状态

2026-06-19 已尝试由 Codex 自动抓取 Google SERP：

- 查询：`contact form builder`
- URL：`https://www.google.com/search?q=contact+form+builder&num=10&hl=en&gl=us&pws=0`
- 结果：Google 返回 CAPTCHA / unusual traffic 页面，无法自动获取真实结果。
- 结论：不能用自动抓取结果；必须通过真实浏览器人工采集 Google 样本，或使用合规的 Google SERP 数据服务。

当前 Codex 环境无法直接读取真实浏览器中的 Google 搜索结果，因此下一步需要人工在 Google 搜索并提供截图/结果文本，Codex 再负责结构化录入、对比和结论分析。

## 1. 为什么需要这份文件

GenForms 当前主要做 Google SEO，因此关键词研究、竞品判断、搜索意图拆解和页面优化结论必须以 Google SERP 为准。

此前保存的 Brave Search 样本只能作为临时参考，不能作为最终优化依据。原因：

- Google 和 Brave 的排序、结果类型、竞品集合可能不同。
- 如果用 Brave 样本做页面优化，可能偏离 Google 对关键词的理解。
- 只有 Google SERP 能回答“Google 认为这个关键词应该展示什么”。

## 2. 执行结论

在补齐 Google SERP 样本前：

- 不实现 `/use-cases/contact-form-builder-for-websites` 的 SEO 页面修改。
- 不把 Brave Top 10 当成 Google Top 10。
- 不用 Brave 样本最终决定 title、description、FAQ、页面模块或竞品借鉴对象。
- 只保留 Brave 样本作为市场参考和对照组。
- 不使用 Bing、Brave、DuckDuckGo 或第三方榜单替代 Google 样本得出最终结论。

## 3. 需要抓取的关键词

| 优先级 | 关键词 | 用途 |
| --- | --- | --- |
| P0 | `contact form builder` | 主词，决定本页是否值得优化 |
| P0 | `contact form generator` | 判断是否与主词同页承接 |
| P0 | `website contact form` | 判断网站发布/嵌入语境是否成立 |
| P1 | `free contact form builder` | 判断 free intent 是否应辅助覆盖 |
| P1 | `contact us form template` | 判断模板意图是否应转向 `/templates/contact-us` |
| P1 | `business inquiry form` | 判断是否只是子场景/模板意图 |
| P1 | `contact form builder with webhook` | 判断是否应独立进入 Webhook 页面 |

## 4. Google SERP 采集方式

推荐方式：

1. 使用干净浏览器或无痕窗口。
2. 地区尽量使用美国/英文环境。
3. 不登录 Google 账号，或至少记录是否登录。
4. 搜索每个关键词。
5. 保存前 10 个自然结果。
6. 同时截图首屏和完整可见结果页。

记录每个关键词时必须保存：

- 查询关键词。
- 查询日期和时间。
- 浏览器/地区/语言状态。
- 是否登录 Google。
- 前 10 个自然结果 URL。
- 每个结果的 title。
- 每个结果的 snippet。
- 页面类型判断。
- 是否有广告。
- 是否有 AI Overview / featured snippet / PAA。
- 主要竞品。
- Google 结果类型判断。

## 5. Google SERP 记录模板

### Keyword: `[keyword]`

查询信息：

- 日期：
- 时间：
- 地区/语言：
- 浏览器：
- 是否登录：
- 是否无痕：
- 是否出现广告：
- 是否出现 AI Overview：
- 是否出现 Featured Snippet：
- 是否出现 People Also Ask：

Top 10 自然结果：

| Rank | Title | URL | Domain | Snippet | Page type | First-screen promise | CTA type | Notes |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |  |  |
| 8 |  |  |  |  |  |  |  |  |
| 9 |  |  |  |  |  |  |  |  |
| 10 |  |  |  |  |  |  |  |  |

Google 意图判断：

- 主意图：
- 次级意图：
- 页面类型分布：
- 最值得借鉴的 3 个页面：
- 不适合 GenForms 借鉴的页面：
- 与 Brave 样本是否一致：
- 对 GenForms 页面优化的影响：

## 6. 与 Brave 样本的对比规则

完成 Google 样本后，必须和现有 Brave 样本对比：

| 对比项 | 判断问题 |
| --- | --- |
| URL 重叠 | Google 前 10 和 Brave 前 10 有多少重叠？ |
| 页面类型 | Google 更偏工具页、模板页、教程页、目录页还是插件页？ |
| 竞品集合 | Google 出现的主要竞品是谁？ |
| 搜索意图 | Google 是否也认为用户想要 no-code website contact form？ |
| CTA 模式 | Google 头部页面是 `create`、`use template`、`install app` 还是 `read guide`？ |
| Trust 信号 | Google 头部页面是否强调 spam、notifications、embed、responses？ |
| GenForms 承接 | 现有 Use Case 页是否能承接，还是应该转模板页/支撑文章？ |

## 7. 进入实现前的判定标准

只有满足以下条件，才能进入 `/use-cases/contact-form-builder-for-websites` 的页面实现：

1. Google P0 关键词样本已保存。
2. Google 对 `contact form builder` 的主意图明确。
3. Google 样本证明 Use Case 页可以承接该词，而不是必须由模板页承接。
4. Google 样本确认 `contact form builder with webhook` 是否应独立承接。
5. 已更新 Brief，明确哪些结论来自 Google，哪些只是 Brave/市场参考。

## 8. 当前状态

当前状态：等待 Google SERP 样本。

在此之前，所有 Contact Form 页面优化结论均为待验证，不进入代码实现。
