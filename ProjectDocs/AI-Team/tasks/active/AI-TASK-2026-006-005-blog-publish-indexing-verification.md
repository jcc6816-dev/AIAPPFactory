# 任务说明：博客发布与索引验证清单

## 任务元信息

- task_id: AI-TASK-2026-006-005
- status: REVIEW_PASSED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-06
- due: 1-2 天内
- permission_level: REPORT_ONLY
- language: zh-CN

## 目标

为 Mike 在 Admin Posts 后台发布博客后要做的检查动作，整理一份可重复执行的验证清单。

## 背景

Mike 会在后台手动发布文章，并在 Google Search Console 请求索引。团队需要一份简单、可重复、不过度操作的清单，避免每次靠记忆执行。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/blog_content_agent_playbook.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/gsc_indexing_check_plan.md`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-005-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件

## 执行步骤

1. 阅读 SEO 和索引相关文档。
2. 产出一份 Mike 发布文章后可执行的短清单。
3. 清单包含：
   - 浏览器检查。
   - metadata 检查。
   - sitemap 检查。
   - GSC 请求索引。
   - 24 小时 / 3 天 / 7 天跟进节奏。
4. 保持操作性和简洁。
5. 用中文写入执行报告。

## 验证要求

- 不要求 Mike 每篇文章都重新提交 sitemap。
- 不要求 Mike 同一天反复请求同一个 URL 索引。
- 遵守 Google SEO 质量规则。
- 报告必须中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-005-execution-report.md`

## 验收标准

- 报告包含可复用清单。
- 清单足够简洁，Mike 可以照着做。
- 清单与现有 GSC 索引计划一致。
- 报告必须中文。

