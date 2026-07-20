# Codex 复核报告：AI-TASK-2026-006-036 SEO 主题集群与 Post 内容作战计划

> 复核日期：2026-06-18  
> 复核对象：`ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-036-seo-topic-cluster-plan.md`  
> 结论：方向通过，但不能直接进入批量写稿或发布；需要按本文要求返工收敛后再执行。

## 1. 总体判断

Gemini 的核心方向是正确的：

- 不建议为了增加页面数量而批量发布低质量 Post。
- 优先围绕少数高意图主题集群做内容、内链和已有页面增强。
- Webhook / Contact Form / Lead Capture 比泛泛的 `AI form builder` 更适合作为当前阶段主攻。
- 14 天节奏控制在少量高质量内容，比一次性大量发布更符合当前站点阶段。

但报告存在几类需要修正的问题：

- 部分因果判断过于确定。
- 部分数据或数字没有来源。
- 部分内链使用 `file:///`，不能用于真实网页内容。
- “新增 Solution 页面”可能涉及代码/配置变更，不能在“无需代码修改”的前提下直接列为执行项。
- 文章建议里有些表达容易滑向营销化或未验证承诺，需要改成事实型、教程型内容。

## 2. 必须修正的问题

### 2.1 不得把 “CTR 为 0 导致 Google 回收曝光” 写成确定事实

报告中写到：

> “CTR 持续为 0 会被算法判定为用户意图不匹配，从而迅速回收探索曝光”

这只能作为合理推断，不能写成已被证明的结论。GSC 数据只能证明：

- 某些页面曾有展示；
- 点击为 0；
- 后续曝光下降。

但不能证明曝光下降就是 CTR 直接导致。还可能包含：

- 查询需求波动；
- 周末 / 工作日差异；
- Google 初始探索后自然回落；
- 页面主题和查询意图匹配度不足；
- 新站权重和外部信号不足。

返工要求：统一改成“可能因素之一”，不要写成确定因果。

### 2.2 不得使用未验证数字作为文章事实

报告中出现以下未验证数字或表述：

- “无重试机制普通 webhook 有 2.4% 丢包概率”
- “对话式表单在手机端转化率提升 37%”
- “单题流能将表单转化率提高 50% 以上”

这些如果没有可信来源或 GenForms 自有数据，不能写入文章。否则会变成 SEO 风险和信任风险。

返工要求：

- 没有来源的数据全部删除。
- 可以改成“常见风险”“建议监控指标”“需要通过自有数据验证”。
- 如需引用外部报告，必须标注来源并由 Codex/Mike 再复核。

### 2.3 所有文章内链必须使用真实 URL 路径

报告中使用了类似：

`file:///use-cases/webhook-form-builder-retry-logs`

这不能进入文章草稿。真实内容里必须使用：

- `/use-cases/webhook-form-builder-retry-logs`
- `/templates/contact-us`
- `/solutions/saas-lead-capture-form-builder`

或完整 canonical：

- `https://genforms.ai/use-cases/webhook-form-builder-retry-logs`

返工要求：所有内容 brief 中的链接统一改为站内相对路径或 `https://genforms.ai/...`。

### 2.4 新增 Solution 页面不是纯内容动作

报告建议新增：

- `/solutions/webhook-integration-form-builder`
- `/solutions/conversational-form-builder`

这类 Solution 页面通常涉及代码、配置、sitemap、结构化数据和内链入口，不应在“无需修改代码或数据库”的结论下直接列入执行。

返工要求：

- 第一阶段不要新建 Solution 页面。
- 先用现有 Use Case / Template / Post 做内链集群。
- 如果后续确实要新增 Solution 页面，必须另起任务，先出实施计划。

### 2.5 旧页微调要更克制

两篇 Webhook 文章已经做过 SERP 修改并提交抓取。报告又安排 Day 1 / Day 2 继续微调，可能导致频繁修改。

返工要求：

- 已修改过并提交抓取的文章冻结观察 5-7 天。
- 如没有新的 GSC/Bing 明确错误，不继续改正文和 meta。
- 可以新增相关新文章，并从新文章反向内链到旧文章和 Use Case。

## 3. 通过的方向

### 3.1 首选主题集群：Webhook Form Builder

同意优先做 Webhook 集群。理由：

- 已经有展示历史；
- 与 GenForms 的差异化更接近：Webhook、重试日志、表单提交数据流；
- 用户意图更偏 B2B 和技术运营，商业价值高于泛泛表单词；
- 能和现有页面形成内链闭环。

### 3.2 第二优先级：Contact Form / Lead Capture

同意作为辅助集群：

- Contact Form 有较宽搜索需求，但商业意图偏浅；
- Lead Capture 商业意图更强，但竞争更大；
- 两者都适合作为 Webhook 集群之外的辅助入口。

### 3.3 暂不主攻 Typeform 大词

同意暂不把 `typeform alternative` 当短期主战场。该主题竞争强，当前可作为长尾补充，不适合作为 7 天恢复曝光的主力。

## 4. 建议的 14 天实际执行版本

将 Gemini 的 4 篇发布节奏收敛为：

### 第一阶段：7 天内只做 2 篇 P0 内容

1. `Why Webhook Retries Matter for Form Submissions`
   - 目标：`form webhook retry`
   - 内链：`/use-cases/webhook-form-builder-retry-logs`、`/templates/contact-us`
   - CTA：`Create a webhook-ready form`
   - 要求：教程型，不写未验证丢包率。

2. `How to Send Form Submissions to Lark or Feishu with Webhooks`
   - 目标：`Lark webhook form` / `Feishu form notification`
   - 内链：`/use-cases/feishu-dingtalk-form-notifications`、`/templates/contact-us`
   - CTA：`Try a notification-ready contact form`
   - 要求：面向非开发者，提供步骤、字段、排错清单。

### 第二阶段：根据 7 天数据决定是否追加

3. `Website Contact Form Best Practices: What to Ask and What to Avoid`
   - 只有在 Contact Form 相关查询继续有展示时追加。

4. `SaaS Lead Capture Form Examples for Early-Stage Teams`
   - 只有在 Lead Capture 相关查询继续有展示时追加。

暂不建议立即写 `Google Forms vs Typeform vs GenForms`，因为它容易进入泛竞品对比战场，且当前站点权重不足。

## 5. 给 Gemini 的返工要求

请 Gemini 返工输出一个更窄、更可执行的版本：

1. 不再写“CTR 直接导致 Google 回收曝光”的确定因果。
2. 删除所有未验证数字。
3. 所有链接改为真实站内路径或 `https://genforms.ai/...`。
4. 第一阶段只保留 2 篇 P0 Webhook 文章 brief。
5. 每篇文章 brief 必须包含：
   - 目标关键词；
   - 目标读者；
   - 文章大纲；
   - 必须回答的问题；
   - 站内链接；
   - CTA；
   - 禁止出现的说法；
   - 发布后 7 天观察指标。
6. 暂不新增 Solution 页面。
7. 暂不继续修改已提交抓取的旧文章。

## 6. 当前状态建议

- `U-054` 不应标记为可执行完成。
- 建议状态：`待返工` 或 `待收敛`。
- Codex 批准方向，但不批准直接写 4-6 篇文章或直接发布。

## 7. 二次复核：两篇 P0 Webhook 草稿

> 复核日期：2026-06-18  
> 复核对象：
> - `ProjectDocs/AI-Team/reports/gemini/production-ready-post-webhook-retries-matter.md`
> - `ProjectDocs/AI-Team/reports/gemini/production-ready-post-send-form-submissions-to-lark-feishu.md`
> 结论：方向通过，但不能直接发布；需按下列小修完成后进入后台草稿，由 Mike 人工发布。

### 7.1 已通过的事实点

- 最大 Webhook 尝试次数为 4 次，已与 `Code/services/skills/webhook.ts` 核对一致。
- 自动重试仅针对 `status >= 500` 的服务端错误，已与 `shouldRetry()` 核对一致。
- 重试等待间隔为 1s、5s、15s，已与 `attempt === 2/3/4` 分支核对一致。
- 飞书机器人使用 `msg_type: "text"` 和 `content.text`，已与 `feishu_bot` 分支核对一致。
- 飞书签名模式会追加 `timestamp` 和 `sign`，签名算法为基于 `${timestamp}\n${secret}` 的 HMAC-SHA256 base64，已与代码核对一致。
- 站内路径 `/use-cases/webhook-form-builder-retry-logs`、`/use-cases/feishu-dingtalk-form-notifications`、`/templates/contact-us` 均为真实业务路径。
- 两篇草稿已经删除上一版中的未验证数据、夸张承诺和 `file:///` 链接。

### 7.2 草稿一必须小修

`production-ready-post-webhook-retries-matter.md` 可以作为第一篇 P0 文章基础，但发布前需修改：

1. 将“Mike 可直接在管理后台导入发布”改为“待 Codex/Mike 复核后可导入后台草稿，由 Mike 人工发布”。
2. 删除或改写 “Response Headers and Body”。当前 Webhook 日志记录了 `response_status`、`response_body`、`request_body_json`、`target_url`、`attempt_count` 等字段，但没有看到 response headers 持久化字段。建议改为 “Response Body and Error Message”。

### 7.3 草稿二必须小修

`production-ready-post-send-form-submissions-to-lark-feishu.md` 方向可用，但存在几个会误导用户的 UI/能力表述：

1. 将“Mike 可直接在管理后台导入发布”改为“待 Codex/Mike 复核后可导入后台草稿，由 Mike 人工发布”。
2. 不要写 “Choose either `Lark Bot` or `Feishu Bot`”。当前产品 provider 文案只有 `Feishu Bot`，没有独立 `Lark Bot` 选项。建议写成：选择 `Feishu Bot`；如果使用 Lark/飞书兼容机器人，请按飞书兼容文本 payload 模式配置。
3. 不要写 “Markdown and text block structure”。当前代码发送的是飞书兼容文本消息：`msg_type: text`、`content.text`，不是 Markdown/card payload。建议改为 “Feishu-compatible text payload”。
4. 不要写 “Click Test Payload”，除非后续确认 UI 中真实存在该按钮。当前可验证路径更稳妥：保存配置后，提交一条测试表单记录，在 Webhook Logs 中查看结果。
5. 将 “notification card appear within seconds” 这类稍强确定性表述改成更稳妥的 “a text notification should appear after the submission is processed”。

### 7.4 发布节奏建议

- 小修完成后，两篇文章先导入后台为 Draft，不要自动 Online。
- Mike 在后台快速检查页面渲染、内链、日期、标题和摘要后，再手动发布。
- 发布后提交 GSC URL Inspection，并记录 7 天观察指标：impressions、clicks、CTR、average position、进入页面后的 `template_use_click` 或 `forms_new_view`。
- 观察期内不要继续频繁修改这两篇新文；除非发现事实错误、404、metadata 错误或渲染错误。

## 8. 三次复核：小修后发布许可

> 复核日期：2026-06-18  
> 复核对象：
> - `ProjectDocs/AI-Team/reports/gemini/production-ready-post-webhook-retries-matter.md`
> - `ProjectDocs/AI-Team/reports/gemini/production-ready-post-send-form-submissions-to-lark-feishu.md`
> 结论：小修已完成，允许进入 Mike 人工审核发布阶段。

### 8.1 已确认修正

- 草稿一已将 “Response Headers and Body” 改为 “Response Body and Error Message”，与当前 Webhook 日志字段一致。
- 草稿二已去掉独立 `Lark Bot` 选项，改为通过 `Feishu Bot` / Feishu-compatible webhook mode 描述。
- 草稿二已去掉 Markdown/card payload 表述，改为 Feishu-compatible text payload。
- 草稿二已去掉 `Test Payload` 按钮路径，改为保存配置后提交测试表单，并在 Webhook Logs 中观察结果。
- 两篇草稿均已将“直接发布”表述改为“后台草稿、人工发布”。

### 8.2 当前允许动作

- 允许将两篇文章保持为后台 Draft。
- 允许 Mike 在后台人工检查标题、摘要、正文渲染、日期、内链和 slug 后手动改为 Online。
- 发布后允许向 Google Search Console 和 Bing Webmaster Tools 请求索引。

### 8.3 仍需遵守

- 不自动发布。
- 不批量追加更多 Post。
- 不在 7 天观察期内反复改这两篇新文，除非发现事实错误、渲染错误、404、metadata 错误或索引阻断。
