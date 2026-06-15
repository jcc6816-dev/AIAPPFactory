# 任务说明：模板详情页 CTA、FAQ 与内链审计

## 任务元信息

- task_id: AI-TASK-2026-006-015
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-06
- due: 2026-06-08
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- language: zh-CN
- dependencies:
  - AI-TASK-2026-006-007
  - AI-TASK-2026-006-013
- observation_pages:
  - `/templates/content-download`
  - `/templates/job-application`
  - `/templates/nps-survey`
  - `/templates/lead-capture`
  - `/templates/event-registration`

## 目标

请 Gemini 审计 5 个模板详情页的 CTA、FAQ、内链和搜索意图匹配度，找出最值得 Codex 实现的小改动。

## 背景

6 月增长目标已经 `ACTIVE`。模板详情页是从搜索流量进入创建流程的重要入口，尤其是已经有曝光或接近排名首页的页面。我们不做大改版，而是优先做小而可归因的优化：标题附近的 CTA、FAQ 补充、内链关系和创建路径清晰度。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-007-execution-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/codex-review/AI-TASK-2026-006-007-review-report.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/goals/2026-06-growth-goals.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/roadmap/2026-06-growth-execution-capacity-plan.md`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-015-execution-report.md`

## 禁止触碰的文件和动作

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件
- Git commit
- 生产部署
- secrets、tokens、cookies、API keys

## 执行步骤

1. 基于指定文档，识别模板页当前应服务的搜索意图和转化目标。
2. 对 5 个模板页分别提出：
   - 主要搜索意图
   - 当前可能缺失的 CTA 机会
   - FAQ 是否需要新增或调整
   - 应加入哪些内部链接
   - 是否存在与 SEO 规则冲突的风险
   - Codex 后续实现优先级
3. 特别标记已经接近排名首页或已被索引的页面，提醒后续修改必须进入 3-7 天观察冻结期。
4. 给出第一批最建议 Codex 实现的 3-5 个微调项。
5. 将中文执行报告写入指定路径。

## 验证要求

- 不要修改代码。
- 不要部署。
- 不要提交 Git。
- 不要访问数据库或外部账号。
- 不得建议虚构评价、评分、案例或发布日期。
- 不得建议批量生成重复薄页面。
- 报告必须使用中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-015-execution-report.md`

## 验收标准

- 覆盖 5 个指定模板页。
- 每个页面至少给出 1 个具体可执行优化建议。
- 最终列出 3-5 个 Codex 可实现的优先微调项。
- 明确哪些页面修改后需要观察冻结。
- 结论符合 Google SEO 质量规则。
