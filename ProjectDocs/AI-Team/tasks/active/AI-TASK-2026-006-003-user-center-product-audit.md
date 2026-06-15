# 任务说明：User Center 产品价值审计

## 任务元信息

- task_id: AI-TASK-2026-006-003
- status: REVIEW_PASSED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-06
- due: 1-2 天内
- permission_level: REPORT_ONLY
- language: zh-CN

## 目标

审计登录后的 User Center 区域，判断它应该保留、简化、合并到 Console，还是改造成账号/账单/设置中心。

## 背景

Mike 反馈登录后的 `user center` 当前价值感不强。GenForms.ai 需要聚焦 AI 表单创建、发布、数据收集和付费转化主链路，因此在修改 UI 前，先做产品审计。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.1-AI-Form-Generator.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_growth_operating_guideline.md`
- `/Users/mike/Documents/AIFactory/Code/app/`
- `/Users/mike/Documents/AIFactory/Code/components/sign/`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-003-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- 生产部署脚本
- 支付、认证、账单、数据库迁移文件

## 执行步骤

1. 梳理当前 User Center 和账号相关页面。
2. 判断哪些页面支持 MVP 漏斗，哪些更像模板残留。
3. 给出建议：
   - 保持现状。
   - 简化导航。
   - 合并到 Console。
   - 改造成账号/账单/设置中心。
4. 给 Codex 提出一个小而安全的后续实现任务，但不要修改代码。
5. 用中文写入执行报告。

## 验证要求

- 发现必须引用实际文件路径。
- 不得提出脱离 MVP 漏斗的大改版。
- 不得修改代码。
- 报告必须中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-003-execution-report.md`

## 验收标准

- 报告清楚说明哪些内容无用或冗余。
- 报告推荐一个小而安全的下一步。
- 报告尊重当前 MVP 范围。
- 报告必须中文。

