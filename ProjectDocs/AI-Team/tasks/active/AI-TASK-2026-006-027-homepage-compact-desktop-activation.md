# 任务说明：首页 768-1199px 小桌面断点首屏体验修复

## Metadata

- task_id: AI-TASK-2026-006-027
- title: 首页 768-1199px 小桌面断点首屏体验修复
- status: REVIEW_PASSED
- assignee: Gemini
- reviewer: Codex
- created_by: Codex
- created_at: 2026-06-15
- priority: P0
- permission_level: CODE_SCOPED_WRITE
- report_path: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-027-execution-report.md`

## 背景

Mike 从 Microsoft Clarity 真实访客录屏中发现首页在小桌面宽度下首屏体验异常。

真实会话信息：

```text
日期和时间：2026-06-14 17:02
用户 ID：1ozez2k
位置：印度
设备：Chrome / Linux / 电脑
视口：970 x 565
点击：1
页面浏览量：1
用户意向：中等
入口 URL：genforms.ai
退出 URL：genforms.ai
停留时间：9 秒
```

录屏截图显示的问题：

1. 该访客被 Clarity 识别为“电脑”端，但视口宽度只有 970px，属于小桌面 / 小笔记本 / 非全屏浏览器窗口。
2. 首页首屏几乎只看到大标题、说明和 Prompt 输入框。
3. 右侧产品 Mockup / 表单预览没有形成有效首屏展示，出现大片空白或弱产品展示。
4. Suggestions 场景按钮只露出一部分，用户难以直接点击免输入场景。
5. 用户 9 秒离开，没有继续进入 `/forms/new` 或触发更深层激活行为。

Codex 判断：这不是 Pad 或手机问题，而是 768-1199px 小桌面断点的首屏激活问题。该问题属于 **产品激活主线 + SEO 行为质量主线** 的交叉问题。它会影响搜索流量进入后的停留、点击和 `demo_start` 转化。

## 核心目标

修复 768-1199px 小桌面 / 小笔记本 / 非全屏浏览器窗口下的首页首屏体验，让 970 x 565 这类真实 PC 会话中：

1. 主 CTA 可见。
2. Suggestions 场景按钮完整可见或至少明显可见。
3. 产品预览或轻量 Mockup 在首屏可见。
4. 不出现右侧大片空白或“像没加载完”的感觉。
5. 不破坏移动端 LCP 优化。
6. 不大改首页 SEO 主题、title、description。

## 当前设计原则

不要简单用 `<1024px` 就当移动端。建议区分：

- 手机：`< 768px`
- 小桌面 / 平板横屏 / 窄窗口桌面：`768px - 1199px`
- 标准桌面：`>= 1200px`

970px 这种宽度应仍然让用户看到产品价值，不应只展示文字和输入框。

## 需要读取的文件

请先读取：

- `/Users/mike/Documents/AIFactory/AGENTS.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/growth_data_operating_system.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
- `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/Code/components/analytics/landing-page-tracker.tsx`
- `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`

可按需只读：

- `/Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/blocks/template-starter/index.tsx`

## 允许修改的文件

只允许修改以下文件。如发现必须修改其他文件，立即停止并在报告里说明原因，等待 Codex/Mike 追加授权。

- `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- `/Users/mike/Documents/AIFactory/Code/app/typeform-home.css`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-027-execution-report.md`

如果仅靠 CSS 即可修复，优先 CSS；如果需要轻微调整 Hero JSX，也必须保持小范围。

## 禁止事项

- 禁止修改首页 SEO title / meta description / canonical / hreflang。
- 禁止修改数据库、Auth、支付、订阅限制、后台 API、部署脚本。
- 禁止引入新的前端依赖。
- 禁止删除首页核心内容或隐藏主要 SEO 文案。
- 禁止为了小桌面恢复 Mockup 而拖慢真正移动端。
- 禁止破坏 `demo_start`、`demo_complete`、`template_use_click`、`form_generate` 等埋点口径。
- 禁止提交 Git 或部署生产环境。

## 建议技术方向

1. 检查 `Code/components/blocks/hero/index.tsx` 和 `Code/app/typeform-home.css` 中是否存在 `window.innerWidth < 1024`、Tailwind `lg`、CSS media query 或 mockup 延迟挂载策略导致 970px 被当成移动端。
2. 将移动端 Mockup 延迟挂载策略收敛到真正移动端，例如 `<768px`，避免误伤 768-1199px 小桌面区间。
3. 为 768-1199px 做 compact desktop hero：
   - 标题通过 CSS 控制字号、行高和 max-width，不大改文案。
   - 副标题高度更紧凑。
   - Prompt 区域更紧凑。
   - Suggestions 场景按钮在首屏完整露出或明显露出。
   - 右侧或下方必须有轻量高保真预览 / Mockup skeleton。
   - 真实互动 Mockup 可以延迟，但首屏不能看起来空。
4. 如果当前布局在 970px 仍是两栏，但右栏宽度不足，可以考虑在 768-1199px 使用“文字 + Prompt + Suggestions + 预览下置”的 compact 布局，而不是强行保留大桌面双栏。

## 验证要求

必须执行：

```bash
npx tsc --noEmit
npm run build
```

建议使用 Playwright、浏览器或截图方式检查以下 viewport：

- `970 x 565`（核心验收）
- `1024 x 768`
- `1199 x 768`
- `1366 x 768`
- `390 x 844`

验收点：

1. `970 x 565` 下首屏没有大片空白。
2. `970 x 565` 下 Generate Form CTA 可见。
3. `970 x 565` 下至少 3 个 Suggestions 场景按钮完整可见或基本可见。
4. `970 x 565` 下产品预览 / Mockup / 高保真骨架可见。
5. `390 x 844` 移动端仍保持轻量，不恢复重 Mockup 首屏水合。
6. 无明显文本重叠、按钮挤压、布局跳动或横向滚动。
7. 不新增 console error。
8. SEO title / description 未改动。

## 输出要求

报告必须中文，写入：

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-027-execution-report.md`

报告必须包含：

1. 本次修复的问题和证据。
2. 修改文件清单。
3. 具体断点策略。
4. 970x565、1024x768、1199x768、1366x768、390x844 的验证结果。
5. 是否影响 SEO title/description。
6. 是否影响移动端 LCP 策略。
7. 执行了哪些测试。
8. 风险与回滚建议。
9. 是否建议部署上线。

最后必须附上：

```text
【给 Codex 的复核摘要】
1. 本次修改了哪些文件；
2. 具体修复了哪个断点问题；
3. 970x565、1024x768、1199x768、1366x768、390x844 的验证结果；
4. 是否影响 SEO title/description；
5. 是否影响移动端 LCP 策略；
6. 执行了哪些测试；
7. 是否建议部署上线。
```

