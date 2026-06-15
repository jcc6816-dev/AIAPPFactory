# Codex 复核报告：AI-TASK-2026-006-016

## 任务信息

- 任务 ID：AI-TASK-2026-006-016
- 任务名称：Growth / GA4 关键事件参数补强设计
- 执行者：Gemini
- 复核者：Codex
- 复核日期：2026-06-06
- 复核结论：REVIEW_PASSED

## 复核范围

本次复核检查 Gemini 是否基于 `AI-TASK-2026-006-008` 事件体系审计，设计第一批关键事件参数，并遵守隐私边界和不改代码要求。

## 复核结果

Gemini 报告满足任务要求，可以通过。

报告定义了 7 个关键事件：

- `ai_generate_submitted`
- `clarification_shown`
- `clarification_submitted`
- `user_signed_up`
- `form_created`
- `form_published`
- `public_form_submitted`

其中本周 P0 建议为：

- `user_signed_up`
- `form_published`
- `ai_generate_submitted`

该优先级符合 6 月增长目标：先打通 SEO 入口到注册、创建和发布的核心漏斗，再推进终端提交和澄清问答等精细化事件。

## 隐私与安全判断

报告明确禁止采集以下敏感信息：

- Prompt 正文明文。
- 澄清问题回答明文。
- 用户邮箱、手机号、姓名、密码。
- 公开表单提交中的姓名、邮箱、电话、意见、上传文件名等明文内容。
- 表单标题、描述、字段名称等可能包含用户业务信息的文本。

该边界符合增长分析和隐私安全要求。

## Codex 独立核验

Codex 简要核验了本地现状：

- `Code/lib/growth.ts` 已有 GA4 映射和站内 Growth 事件采集基础。
- `form_published` 当前已有部分前后端上报，但参数不足，缺少 `template_id`、`is_ai_generated`、`fields_count` 等关键分析字段。
- `public_form_submitted` 当前已有客户端上报基础，但参数仍较少。

因此 Gemini 报告可以转化为 Codex 后续实现任务。

## 注意事项

后续实现时，Codex 需要特别注意：

- 不通过 `JSON.stringify(fields)`、`JSON.stringify(answers)` 或类似方式把用户输入明文送入 GA4 或站内 Growth 事件。
- `form_uuid` 可用于内部链路分析，但应避免在 GA4 中造成不必要的用户级追踪。若后续数据规模扩大，可考虑只在站内事件表保留，GA4 仅保留聚合维度。
- 注册事件的 `entry_point` 需要结合实际登录触发来源实现，不能凭空推断。

## 后续动作

- 将 `AI-TASK-2026-006-016` 状态更新为 `REVIEW_PASSED`。
- 创建或选择 Codex 实现任务，优先补强 `ai_generate_submitted`、`user_signed_up`、`form_published` 三个事件。
