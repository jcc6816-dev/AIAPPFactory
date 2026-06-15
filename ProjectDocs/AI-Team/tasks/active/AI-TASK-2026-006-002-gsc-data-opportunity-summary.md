# 任务说明：GSC 数据机会总结

## 任务元信息

- task_id: AI-TASK-2026-006-002
- status: REVIEW_PASSED
- assignee: Gemini
- reviewer: Codex
- priority: P0
- created_at: 2026-06-06
- due: 当天完成优先
- permission_level: REPORT_ONLY
- language: zh-CN

## 目标

分析最新导出的 Google Search Console 数据，并输出下一步 SEO 动作的简洁机会总结。

## 背景

GenForms.ai 已经开始获得早期曝光，但点击很少或暂时没有点击。团队需要优先关注已经有曝光、接近第一页或具备高意图的查询词和页面组合。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/gsc_indexing_check_plan.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/codex_seo_operations_tracker.md`
- `/Users/mike/Documents/AIFactory/SEOData/`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-002-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件

## 执行步骤

1. 检查 `/Users/mike/Documents/AIFactory/SEOData/` 下可用的数据文件。
2. 找出：
   - 曝光最高的查询词。
   - 平均排名最有机会的查询词。
   - 有曝光但 0 点击的页面。
   - 暗示 title、description、CTA 可优化的查询词/页面组合。
3. 对照 `gsc_indexing_check_plan.md` 和 `codex_seo_operations_tracker.md`。
4. 只推荐 3 个下一步动作，不输出泛泛的长清单。
5. 用中文写入执行报告。

## 验证要求

- 如果无法打开 Excel 文件，必须明确说明，并使用可用 Markdown 记录。
- 不得编造 GSC 数字。
- 不得建议批量生成页面。
- 报告必须中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-002-execution-report.md`

## 验收标准

- 报告包含基于数据的下一步动作。
- 报告区分当前证据和推测。
- 报告符合 Google SEO 质量规则。
- 报告必须中文。

