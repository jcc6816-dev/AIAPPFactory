# 任务说明：首页首屏 JS 瘦身与非首屏模块动态加载

## Metadata

- task_id: AI-TASK-2026-006-020
- title: 首页首屏 JS 瘦身与非首屏模块动态加载
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-13
- priority: P0
- permission_level: CODE_SCOPED_WRITE
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-020-execution-report.md`

## 背景

在 017 完成低风险 accessibility 修复、018 接入 PageSpeed 后，下一步要继续解决首页首屏 JS 偏重的问题。PageSpeed/Lighthouse 已提示首页存在较多 unused JavaScript。019 处理第三方脚本，本任务处理站内首页模块本身的加载边界。

本任务服务于产品体验与激活主线：

```text
page_view -> demo_start -> demo_complete -> template_use_click -> form_generate -> form_publish -> form_submit
```

目标是让首页首屏更快出现核心价值：AI Prompt、免输入 Demo、Mockup 预览、主 CTA。首屏以外的营销/内容模块不应该和 Hero 抢首屏 JS。

## 目标

1. 保持首页首屏 Hero 体验稳定，不破坏免输入 Demo、Mockup、CTA、埋点。
2. 对首页折叠线以下模块进行动态加载或服务端/静态渲染化，减少首屏客户端 JS。
3. 不影响 SEO 内容可索引性。对重要 SEO 文案，不得因为客户端懒加载导致 Google 无法读取核心文本。
4. 保持页面设计统一，不引入明显 Loading 闪烁或布局跳动。

## Allowed Files To Read

可读取：

- `/Users/mike/Documents/AIFactory/AGENTS.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/**`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/landing-page-tracker.tsx`
- `/Users/mike/Documents/AIFactory/Code/services/form-templates.ts`
- `/Users/mike/Documents/AIFactory/Code/package.json`

## Allowed Files To Modify

仅允许修改以下范围。若需要超出范围，立即停止并报告。

- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/skills-gallery/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/template-starter/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/cta/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/faq/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/testimonial/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/feature/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/feature1/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/feature2/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/feature3/index.tsx`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-020-execution-report.md`

## 禁止事项

- 禁止修改数据库、Auth、支付、Admin API、环境变量。
- 禁止删除 SEO 关键内容来换性能分。
- 禁止让首页变成只有 Hero 的“空页面”。
- 禁止破坏 `demo_start`、`demo_complete`、`template_use_click`、`form_generate` 等事件口径。
- 禁止部署生产、提交 Git。

## 实施步骤

### 1. 首页模块审计

先阅读 `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`，列出首页当前模块顺序，并判断：

- 哪些是首屏必须保留的模块。
- 哪些是首屏以下模块，适合 `next/dynamic` 延迟加载。
- 哪些模块包含 SEO 文案，必须保留服务端可读内容或提供稳定 fallback。

### 2. 动态加载策略

建议优先处理：

- `SkillsGallery`
- `TemplateStarter`
- `Pricing`
- `FAQ`
- `Testimonials`
- 其他首屏以下重交互模块

要求：

- 使用 `next/dynamic` 时，提供稳定的轻量 fallback，避免页面大幅跳动。
- 不要对 Hero 核心交互做动态加载。
- 如某个模块是 Server Component 或已很轻，不要为了形式强行动态加载。

### 3. SEO 安全

首页必须继续保留：

- 可抓取的主标题与核心描述。
- 主要 CTA。
- 关键产品能力的基础文本信号。

如果对某个 SEO 文案模块做客户端动态加载，必须在报告里说明为什么不会影响可索引性；若有风险，则不要改。

### 4. 验证

必须执行：

```bash
npx tsc --noEmit
npm run build
```

构建后从 `npm run build` 输出中记录首页 First Load JS 变化。如果无法获得前后对比，请至少记录优化后的首页 First Load JS。

建议执行：

```bash
npx vitest run
```

## 验收标准

- 首页 Hero、免输入 Demo、Mockup、CTA 正常。
- 首页首屏以下模块不会抢首屏 JS。
- `npm run build` 通过。
- 报告必须包含：
  - 首页模块审计表
  - 实际动态加载或服务端化的模块
  - 首页 First Load JS 变化
  - SEO 风险判断
  - 后续 PageSpeed 复测建议

