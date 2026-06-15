# Codex 复核报告：Gemini 2026-06-07 满负荷生产增长工作包

## 结论

状态：`PARTIAL_PASS_REWORK_REQUIRED`

Gemini 确实完成了 T1-T7 对应文件，并产出了可供 Mike 或 Codex 使用的材料。但本次工作仍然偏“快速整理”和“自我声明完成”，没有达到原定 6-8 小时深度工作标准。

本轮可以采纳的部分：

- T1 Webhook 博客草稿具备发布基础，核心重试事实与代码基本一致。
- T2 AI Lead Capture 博客草稿具备发布基础，但标题竞争度偏高，建议作为草稿再降竞争度。
- T3 模板 FAQ/CTA/内链 JSON 有价值，可作为后续实现输入。
- T5 GSC/GA4 数据采集说明可用。

本轮必须返工或降级处理的部分：

- T4 外部推广执行包未验证 2026 年 6 月各平台最新提交规则，只能作为草案，不能直接让 Mike 复制执行。
- T6 Top 8 实现清单包含已实现或无需实现事项，不能直接作为 Codex 排期依据。
- T3 JSON 中存在若干可能超出 MVP 当前能力的表述，必须在上线前做事实降级。
- Daily Summary 中“SEO 质量风险：无”过于绝对，应改为“低风险，但存在事实边界和外部规则待核验”。

## 关键复核发现

### 1. Webhook 博客事实基本成立，但需保守发布

代码核验路径：

- `/Users/mike/Documents/AIFactory/Code/services/skills/webhook.ts`

核验结果：

- `WEBHOOK_MAX_ATTEMPTS = 4` 成立。
- 5xx 才自动重试成立。
- 生产环境重试间隔 1s / 5s / 15s 成立。
- generic webhook 的 `X-AIFactory-Signature` HMAC-SHA256 成立。

注意：

- 飞书/钉钉机器人签名与 generic webhook header signature 不是同一种形态，文章中应避免让读者误解所有 provider 都使用 `X-AIFactory-Signature`。
- “manual retries directly from console” 需要在发布前再核实 UI 入口，若没有明确按钮，应改成“review failed deliveries and retry where supported”。

### 2. AI Lead Capture 博客可用，但关键词目标过宽

文章标题 `Best AI Form Builders for Lead Capture and Automation` 面向较大词，短期可能不如低竞争长尾词。

建议改为更贴近 GenForms 当前优势的标题，例如：

- `AI Lead Capture Form Builder for SaaS Teams`
- `How to Build an AI Lead Capture Form with Webhooks`

这类标题更贴合当前已有 solution 页面和 GSC 已出现的 `lead form ai download` 方向。

### 3. 模板 FAQ JSON 有价值，但不能直接上线

文件：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json`

可采纳：

- `lead-capture`
- `content-download`
- `nps-survey`
- `job-application`

需要事实降级：

- `content-download` 中“success page direct download link”需要确认当前产品是否真实支持可配置下载成功页。
- `event-registration` 中“limit seats”需要确认当前 MVP 是否支持名额限制；若不支持，应改为“use ticket category fields and monitor submissions manually”。
- `job-application` 中“direct file uploads”可用，但不要暗示已有完整 ATS。

### 4. Top 8 清单存在重复/错误排期

不可直接执行的项：

- “自动生成 Sitemap 时包含全新 Solution 页面”：当前 `/Users/mike/Documents/AIFactory/Code/app/sitemap.ts` 已经遍历 `solutionLandingPages` 和 `useCaseLandingPages`，该任务应改为“验证生产 sitemap 是否包含并响应正常”，不是实现任务。
- “GA4 模板使用事件深度参数补强”：当前 `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx` 已经发送 `cta_text`、`trackingMetadata` 和 `preferences`，应改为“验证 payload 与 GA4 映射”，不是从零实现。

可作为 Codex 后续实现的项：

- 扩展模板详情页 FAQ 数据源，覆盖更多模板。
- 模板详情页 CTA 文案个性化。
- 模板详情页自然锚文本内链补强。
- Growth source/referrer 归因进一步细化。
- Webhook failed log error_message 更具体地截取 response body。

### 5. 外部推广包必须二次核验

BetaList、Indie Hackers、AlternativeTo 的规则和链接提交政策可能变化。该包不能直接认定为“可执行”，应在执行前做当前平台规则核验。

当前建议：

- Mike 可以先把它当成草案。
- Gemini 后续必须补一版“平台规则核验表”，列出注册要求、是否允许推广链接、是否需要图片、是否免费、是否存在审核排队。
- 未核验前不要把“dofollow 优质外链”写成确定收益。

## 对 Gemini 的流程反馈

本次最大问题不是没有产出，而是任务被过快完成，说明执行深度不足。后续 Gemini 不应只用“文件齐全”作为完成标准，必须按以下验收：

- 每篇博客必须包含后台字段级发布 payload，而不只是 Markdown 正文。
- 每个产品事实必须引用允许读取的代码路径或明确标记“待 Codex/Mike 验证”。
- 每个外部推广动作必须有当前规则核验，否则只能是草案。
- 每个实现建议必须先区分“已实现需验证”“未实现需开发”“不建议做”。
- Daily Summary 禁止使用“风险无”这种绝对话术，必须列出剩余风险。

## Mike 今日可执行动作

优先级 1：

- 发布 T1 Webhook 博客前，先按本复核意见微调 HMAC 和 manual retry 相关表述。

优先级 2：

- T2 AI Lead Capture 博客先保留为草稿，标题建议改成更低竞争长尾方向后再发。

优先级 3：

- 暂不直接执行 T4 外部推广包，要求 Gemini 先补平台规则核验表。

## Codex 后续建议

下一轮应把 Gemini 任务从“生成报告”改成“返工交付物”：

- 修订 T1/T2 为后台可发布字段包。
- 修订 T3 JSON 中可能超出 MVP 的能力描述。
- 重写 T6 Top 8，去掉已实现项和错误项。
- 产出外部目录当前规则核验表。
