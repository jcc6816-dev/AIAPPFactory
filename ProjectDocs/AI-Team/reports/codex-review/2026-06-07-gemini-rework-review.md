# Codex 复核报告：Gemini R1-R6 返工与深度产出

## 任务 ID

- 返工工作包：`2026-06-07-gemini-rework-and-deep-work-pack`
- 范围：R1-R6

## 复核结论

- 结论：`REVIEW_PASSED_WITH_NOTES`

Gemini 已完成 R1-R6 返工产物，整体质量明显高于上一轮。产出物已经从“报告型”升级为“可发布/可复核/可实现输入型”：

- R1 Webhook 博客已形成后台字段级 payload，可进入 Mike 发布流程。
- R2 AI Lead Capture 博客已形成低竞争长尾版本，建议先作为草稿或延后发布。
- R3 FAQ JSON v2 已加入 `factStatus`，可作为 Codex 后续实现输入，但部分状态仍需在实现前微调。
- R4 工程清单 v2 已去掉上一轮明显重复项，区分了 `needs_build` 与 `already_built_needs_verification`。
- R5 外部推广规则表明确标记 `UNVERIFIED_CURRENT_RULES`，不再伪装为已核验。
- R6 两个内容 brief 有明确搜索意图、内链计划和禁止宣传能力，具备后续写作价值。

## 范围检查

- 未发现 Gemini 修改 `Code/**`。
- 未发现 Git 提交或部署动作。
- 未发现 secrets、认证、支付、数据库迁移或生产脚本访问。
- 返工输出均位于 `ProjectDocs/AI-Team/reports/gemini/` 和 `ProjectDocs/AI-Team/tmp/` 范围内。

## 质量检查

### 通过项

1. Webhook 博客已经修正 generic HMAC 与飞书/钉钉机器人签名的混淆。
2. Webhook 博客使用 “retry where supported” 等保守表述，比上一版更稳。
3. AI Lead Capture 博客标题从大词降为 `AI Lead Capture Form Builder for SaaS Teams`，更符合当前 SEO 冷启动。
4. AI Lead Capture 博客新增 “Who GenForms is NOT For”，有助于减少夸大宣传。
5. 工程清单 v2 正确把 sitemap 和 `template_used` 参数归为“已实现需验证”，不再当作从零实现。
6. 外部平台规则明确写出无法联网核验，符合新诊断机制。

### 仍需注意

1. `template-faq-localized-data.v2.json` 中 `content-download` 的“success page with a direct link to your hosted PDF file”和“trigger a webhook that delivers the resource to their email automatically via your own mail service”不应标记为完全 `confirmed`。更准确应为 `conservative`，因为当前系统支持成功文案/字段/Webhook，但并不等同于内置资源交付或邮件发送。
2. `lead-capture` 中“route captured leads directly to my CRM”虽然正文解释为通过 Zapier 等中继，但问题本身仍可能让用户误解为原生 CRM 直连。后续实现前建议把问题改成 “Can I send captured leads into my CRM workflow?”。
3. 日报中 Indie Hackers 被列为“准备执行”，但规则仍为 `UNVERIFIED_CURRENT_RULES`。更稳的动作是 Mike 先人工核验账号限制和发帖规则，再决定是否发。

## 验证检查

已抽查：

- `/Users/mike/Documents/AIFactory/Code/services/skills/webhook.ts`
- `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/sitemap.ts`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.v2.json`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md`

验证结果：

- Webhook 最大 4 次尝试、5xx 重试、1s/5s/15s 间隔、generic `X-AIFactory-Signature` 基本成立。
- `TemplateUseButton` 已经发送 `cta_text`、`trackingMetadata` 和偏好参数，工程清单 v2 对此已正确降级为验证任务。
- `sitemap.ts` 已遍历 `solutionLandingPages` 与 `useCaseLandingPages`，工程清单 v2 对此已正确降级为生产验证任务。

## 问题归因

- 权限不足：少量存在。Gemini 仍无法验证生产后台 UI 和外部平台规则，所以对手动重试、外部推广只能保守处理。
- 上下文不同步：较上一轮明显改善。已去掉 sitemap 和 `template_used` 从零实现的重复建议。
- 知识过期或外部规则未知：存在于 R5，但 Gemini 已正确标记 `UNVERIFIED_CURRENT_RULES`。
- 推理/判断错误：少量存在，主要是 FAQ `factStatus` 对 `content-download` 和 CRM wording 仍偏强。
- 任务验收不清：已改善。R1/R2 都输出了后台字段级 payload。
- 输出格式问题：基本通过。

## 能力提升建议

- 给 Gemini 增加的必读文件：后续涉及成功页/邮件/资源交付时，应只读 `Code/services/form-templates.ts`、`Code/components/forms/form-generator.tsx` 或相关公开播放器组件。
- 给 Gemini 增加的最小权限：仍维持 `CODE_READ_SCOPED`，不需要扩大到代码写入。
- 下次任务需要更明确的验收标准：所有 FAQ `factStatus=confirmed` 必须对应“产品内置能力”，如果需要用户自备第三方系统或外部服务，应标记为 `conservative`。
- 需要沉淀到模板的规则：外部平台未联网核验时，不能把动作列为“推荐执行”，只能列为“人工核验后可执行”。

## 发现的问题

1. `content-download` FAQ 的资源交付能力标记偏强。
2. `lead-capture` CRM 问题措辞仍可能造成“原生 CRM 直连”误解。
3. Indie Hackers 动作仍不应直接进入执行，应先人工核验。

## 需要返工的内容

不需要整包返工。

Codex 后续实现 FAQ JSON 前，需要对以下文案做小幅修正：

- `content-download` 两条资源交付相关 FAQ 的 `factStatus` 从 `confirmed` 调整为 `conservative`。
- `lead-capture` CRM FAQ 问题改成更保守的 workflow 表述。

## Mike 当前可执行事项

1. 可以执行：发布 Webhook 博客 R1。
2. 可以准备但不建议立即发布：AI Lead Capture 博客 R2，建议作为草稿或等 T1 发布后 24-48 小时再发。
3. 可以执行：提供最新 GSC/GA4 数据。
4. 需要先人工核验：BetaList / Indie Hackers / AlternativeTo 外部动作。

## 最终状态

- R1：`PASSED_READY_FOR_MIKE`
- R2：`PASSED_DRAFT_OR_DELAYED_PUBLISH`
- R3：`PASSED_AS_IMPLEMENTATION_INPUT_WITH_MINOR_NOTES`
- R4：`PASSED`
- R5：`PASSED_AS_MANUAL_VERIFICATION_CHECKLIST`
- R6：`PASSED`
