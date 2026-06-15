# 任务说明：首页无障碍与触控目标修复

## Metadata

- task_id: AI-TASK-2026-006-022
- title: 首页无障碍与触控目标修复
- status: ASSIGNED
- assignee: Gemini
- created_by: Codex
- created_at: 2026-06-13
- priority: P1
- permission_level: CODE_SCOPED_WRITE
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-022-execution-report.md`

## 背景

AI-TASK-2026-006-021 已把移动端首页性能显著提升。上线后 PageSpeed 仍提示首页存在无障碍问题，桌面 Accessibility 约 86 分，移动端约 91 分。

Mike 手动提供的 PageSpeed 无障碍问题包括：

- 按钮缺少可供访问的名称。
- 图片元素缺少合适的 `alt` 属性。
- 背景色和前景色对比度不足。
- 触摸目标尺寸或间距不足。
- 标题元素未按顺序降级。

Codex 复测时也看到相同方向的问题，典型节点包括：

- Header 语言切换按钮缺少可访问名称。
- 首页模板筛选 tab 触控目标偏小。
- 深色区块中的灰色编号或弱对比文字对比度不足。
- Hero skeleton 内部视觉标题使用真实 heading，造成标题层级告警。
- 底部 CTA 或按钮/链接嵌套导致触控目标告警。

本任务只修复无障碍、触控目标和轻量语义问题，不做新的性能架构优化。

## 核心目标

1. 将首页 Desktop Accessibility 从约 86 提升到 95+。
2. Mobile Accessibility 保持 90+，尽量提升。
3. SEO 分数保持 100，不破坏结构化数据、title、description、canonical、hreflang。
4. 不改变首页核心视觉风格、不改变 CTA 路径、不改变埋点口径。
5. 不引入新的首屏性能负担。

## Allowed Files To Read

可读取：

- `/Users/mike/Documents/AIFactory/AGENTS.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-021-execution-report.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/template-starter/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/cta/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/faq/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/locale/toggle.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/theme/toggle.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/Code/package.json`

## Allowed Files To Modify

只允许修改以下文件。如发现必须修改其他文件，立即停止并在报告里说明原因，等待 Codex/Mike 追加授权。

- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/template-starter/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/cta/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/faq/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/locale/toggle.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/theme/toggle.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-022-execution-report.md`

## 禁止事项

- 禁止修改 Auth、支付、数据库、Admin API、环境变量、部署脚本。
- 禁止改 SEO 内容策略、博客内容、Solution/Use Case 数据。
- 禁止删除首页 Hero、模板区、技能区、价格区、FAQ、CTA。
- 禁止为了提高分数大幅改变视觉设计。
- 禁止把可见文案改成夸张营销语。
- 禁止把 `demo_started`、`demo_completed`、`template_used`、`form_generate` 等埋点口径改掉。
- 禁止修改 `/Users/mike/Documents/AIFactory/Code/components/sign/toggle.tsx`，除非 Mike 或 Codex 另行追加授权。
- 禁止制造新的交互嵌套问题：不要在 `<a>`、`Link`、`button`、Radix Trigger 内部再放另一个可交互控件。

## 建议修复方向

### 1. 按钮与控件名称

- 给纯图标按钮、语言切换按钮、主题切换按钮补 `aria-label`。
- 如果按钮内有可见文本但 Lighthouse 仍识别不到，检查是否被 SVG、Radix trigger 或 nested element 影响。
- `LocaleToggle` 可在 `SelectTrigger` 上补充明确 `aria-label`，但不得改变语言切换路由逻辑。
- `ThemeToggle` 可把图标点击改为真实 `<button type="button">`，并保留原有 `cacheSet` 与 `setTheme` 行为。

### 2. 图片 alt

- 有语义的图片：补描述性 `alt`。
- 装饰性图片：使用 `alt=""`，避免屏幕阅读器读无意义内容。

### 3. 对比度

- 修复深色背景中的 `text-slate-600`、浅灰小字、弱透明文字。
- 修复蓝色按钮白字临界对比度问题，优先轻微加深蓝色或提高文字粗细。
- 不要用 `opacity-70` 降低正文/按钮文字对比度。

### 4. 触摸目标

- 筛选 tab、主题圆点、小型链接按钮的点击区域至少 24px x 24px，优先 32px+。
- 相邻触摸目标之间要有足够间距。
- 不要把 `<a>` 放进 `<button>`，也不要把交互元素互相嵌套。
- 若模板卡片中的主题圆点位于可点击卡片或 `Link` 内部，必须先调整结构，避免出现“链接里嵌按钮”的新问题；不能只把 `span` 机械替换为 `button`。

### 5. 标题层级

- 检查首页首屏和 skeleton 中的 `h2/h3`。
- 如果只是视觉标题，不承担页面大纲语义，可以改成 `div` 或 `p` 并保留样式。
- 不要为了消除告警破坏主要内容层级：页面仍应只有一个核心 `h1`。

## 验证要求

必须运行：

```bash
npx tsc --noEmit
npm run build
```

如相关测试存在，也请运行最小相关测试。

建议额外执行：

```bash
npx vitest run app/api/admin/pagespeed/summary/route.test.ts
```

## 报告要求

执行报告必须使用中文，写入：

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-022-execution-report.md`

报告至少包含：

1. 修改文件清单。
2. 每类 PageSpeed 无障碍问题对应修复。
3. 是否改变视觉设计或 CTA 行为。
4. 是否影响 SEO、埋点、首页 Demo。
5. 验证命令与结果。
6. 如仍有未解决 PageSpeed 无障碍项，列出原因和建议下一步。
