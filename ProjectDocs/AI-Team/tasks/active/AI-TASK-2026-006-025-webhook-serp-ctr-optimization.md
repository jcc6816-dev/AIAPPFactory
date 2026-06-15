# 任务说明：Webhook 高排名低点击页面 SERP 摘要优化

## Metadata

- task_id: AI-TASK-2026-006-025
- title: Webhook 高排名低点击页面 SERP 摘要优化
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-14
- priority: P1
- permission_level: REPORT_ONLY
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-025-execution-report.md`

## 背景

Codex 分析 Mike 导出的 GSC 近 7 天数据后发现，Webhook 相关博客已经出现较好的排名，但点击为 0：

1. `https://genforms.ai/posts/feishu-dingtalk-webhook-notification`
   - 近 7 天展示：276
   - 平均排名：9.10
   - 点击：0
2. `https://genforms.ai/posts/lark-feishu-form-webhook-bot`
   - 近 7 天展示：31
   - 平均排名：8.16
   - 点击：0

这说明 Google 已经愿意给这类内容排名，但搜索结果中的标题、描述、首屏摘要或搜索意图匹配可能不够吸引点击。此类页面已经进入第一页附近，不应大幅重写正文或频繁改 URL，而应做小幅、可控的 SERP CTR 优化。

## 核心目标

1. 审计这两篇文章当前的 title、meta description、H1、首屏摘要、CTA 和搜索意图匹配。
2. 输出每篇文章的建议优化稿：
   - 新 title；
   - 新 meta description；
   - 如有必要，轻微调整 H1 或首屏第一段；
   - 首屏 CTA 文案建议。
3. 保持 URL、canonical、发布日期、结构化数据不变。
4. 不直接发布、不直接写数据库、不直接修改后台文章内容。

## Allowed Files To Read

可读取：

- `/Users/mike/Documents/AIFactory/AGENTS.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_compliance_rules.md`
- `/Users/mike/Documents/AIFactory/Code/scripts/update-feishu-dingtalk-post-seo.js`
- `/Users/mike/Documents/AIFactory/Code/services/growth-content-clusters.ts`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/blog-detail/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/posts/[slug]/page.tsx`
- `/Users/mike/Documents/AIFactory/SEODATA/GSC/2026-06-14-Last7Days.xlsx`
- `/Users/mike/Documents/AIFactory/SEODATA/GSC/2026-06-14-last24hours.xlsx`

如需查看生产页面 HTML，可使用已授权的只读网络方式或让 Mike/Codex 提供页面源码摘要。不要读取或输出任何密钥。

## Allowed Files To Modify

只允许写中文执行报告：

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-025-execution-report.md`

本任务不允许修改代码、数据库、后台文章、脚本或 Git。

## 禁止事项

- 禁止直接修改数据库或后台文章状态。
- 禁止发布文章。
- 禁止修改 URL、slug、canonical、发布日期、作者、结构化数据主体。
- 禁止大幅重写正文。
- 禁止制造夸大承诺，例如“100% 提升转化”“官方集成”“替代所有自动化工具”等未经证实表述。
- 禁止把同一关键词机械堆砌到标题和描述中。
- 禁止为了 CTR 写误导性标题。

## 输出要求

报告必须用中文，结构建议如下：

1. **数据判断**
   - 简述为什么这两页属于“高排名低点击”机会页。
2. **当前 SERP 问题假设**
   - 标题是否太泛；
   - description 是否没有说清业务收益；
   - 是否缺少“Webhook / Feishu / DingTalk / Lark / form submissions”等搜索意图词；
   - 是否缺少明确的产品动作。
3. **逐页建议**
   - 原 URL；
   - 建议 title；
   - 建议 meta description；
   - 建议 H1 是否改动；
   - 建议首屏第一段或 TL;DR；
   - 建议 CTA 文案。
4. **风险控制**
   - 为什么这不是大改；
   - 修改后建议冻结观察 3-7 天；
   - 什么时候再考虑正文扩展。
5. **需要 Mike/Codex 决策**
   - 是否批准把建议稿写入后台草稿或执行更新脚本；
   - 是否需要 GSC 请求重新抓取。

## 验收目标

- 输出可直接交给 Mike 或 Codex 审核的标题/描述优化稿。
- 保持 Google SEO 质量规则，不做标题党。
- 不触碰生产数据。
- 明确修改后观察指标：CTR、点击、平均排名、展示。

## Codex 复核结论

Codex 已复核 Gemini 输出的第一版建议稿，结论为：方向可用，但需要进入第二轮“文案克制化返工”，暂不批准写入后台或生产数据库。

返工要求：

1. 保留“Webhook / Feishu / DingTalk / Lark / group bot / retry logs / no-code setup”等搜索意图词。
2. 删除或弱化过度营销表述：
   - `Free plan includes full webhook support`
   - `free webhook delivery`
   - `No middleware required!`
   - `5-minute` 如无产品实际保证，改为 `step-by-step`、`quick setup` 或 `practical setup`
3. 不要把重点放在攻击 Typeform 付费墙，除非正文有充分上下文支撑。可以保留 `without adding a separate automation layer` 这类温和表达。
4. Title 要优先自然、可信、可点击，而不是堆叠卖点。
5. Meta Description 控制在约 140-160 字符，更利于展示完整摘要。
6. 每篇文章给出“保守版”和“稍强转化版”各一套 title/description，由 Codex/Mike 最终选择。
7. 继续保持 REPORT_ONLY，不得改数据库、不得运行更新脚本、不得发布。
