# 任务说明：Homepage Activation Audit

## 任务元信息

- task_id: AI-TASK-2026-006-009
- status: ASSIGNED
- assignee: Gemini
- reviewer: Codex
- priority: P1
- created_at: 2026-06-06
- due: within 1-2 days
- permission_level: REPORT_ONLY
- language: zh-CN

## 目标

审计首页首屏和主要 CTA 是否足够支持“游客看到价值 -> 尝试创建表单 -> 注册/发布”的激活路径。

## 背景

GenForms.ai 当前主要瓶颈是流量发现和初始激活。首页已经有模板、技能、定价等模块，但需要确认首屏是否足够聚焦，不要变成信息很多但行动不明确。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_growth_operating_guideline.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/template-starter/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/i18n/pages/landing/en.json`
- `/Users/mike/Documents/AIFactory/Code/i18n/pages/landing/zh.json`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-009-execution-report.md`

## 禁止触碰的文件

- `.env*`
- `WorkBuddy/**`
- `Code/**`
- production deployment scripts
- payment/auth/billing/database files

## 执行步骤

1. 阅读首页和相关组件/文案文件。
2. 评估首屏主张是否清楚，CTA 是否明确，是否和 SEO 流量入口一致。
3. 找出最多 5 个改进点，按影响排序。
4. 每个改进点给出具体建议文案或 UI 方向，但不修改代码。
5. 输出中文报告。

## 验证要求

- 不要建议做大改版。
- 不要建议加营销式空话。
- 建议必须服务创建/使用模板/注册/发布的主链路。
- 报告必须中文。

## 报告路径

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-009-execution-report.md`

## 验收标准

- 报告最多列 5 个首页激活改进点。
- 每个建议有清晰的转化目的。
- 建议可转化为后续 Codex 小任务。

