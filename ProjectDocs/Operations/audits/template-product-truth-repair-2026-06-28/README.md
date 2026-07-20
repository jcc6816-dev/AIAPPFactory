# Job Application / Consultation Template Product-Truth Repair

## 现状

Google US SERP 复核表明，`job application` 泛词通常伴随文件上传、ATS、合规和招聘流程预期；`consultation booking` 与 `appointment` 泛词通常伴随实时日历、时段占用、提醒和改期预期。GenForms 当前 MVP 不应承诺这些能力。

## 本次修复

- `/templates/job-application` 收窄为轻量候选人意向和初筛模板。
- 删除 PDF 简历上传字段、OCR 和 ATS 正向承诺，改为可选的 LinkedIn、GitHub、个人网站或作品集 URL。
- `/templates/booking-consultation` 收窄为咨询请求收集，时间字段改为偏好时间段，并明确由团队人工确认。
- 删除实时排期、日历邀请、自动确认、提醒、取消和改期承诺。
- 两个 Template-only Topic 不再从模板页自动推荐为 Solution 资产；已存在 URL 暂不粗暴删除，避免制造 404。

## 验证

- `services/form-templates.test.ts` 与 `services/template-product-boundaries.test.ts`：13 项通过。
- `npm run build`：通过，90 个静态页面生成完成。
- 浏览器验证：英文 Job Application 与中文 Consultation Request 页面字段、FAQ 和产品边界一致。
- 两个模板页面均未出现横向溢出，也不再显示自动关联的 Solution 推荐模块。

## 后续边界

- 两个 Topic 进入 Observe / Hold，不扩独立 Pillar、Use Case 或 pSEO。
- 如后续产品真实支持文件上传、ATS、实时日历或提醒，必须重新走 Topic Validate 与产品事实评审，不能直接恢复旧文案。
