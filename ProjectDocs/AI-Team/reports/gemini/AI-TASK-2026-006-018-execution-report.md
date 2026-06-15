# AI-TASK-2026-006-018 执行与复核报告

## 结论

已完成，可以进入后续 019、020 性能专项任务。

本任务原目标是把 Google PageSpeed Insights 接入 Admin Growth 后台，形成可重复使用的页面性能巡检能力。Codex 复核时发现：后端 API 与测试已存在，但前端 `pagespeed-tab.tsx` 文件缺失，`growth-dashboard-shell.tsx` 中已有引用但无法正常构建。因此 Codex 补齐了前端面板、增长建议联动与 Route Handler 构建问题。

## 本次补齐内容

### 1. PageSpeed 后台接口构建修复

修改文件：

- `/Users/mike/Documents/AIFactory/Code/app/api/admin/pagespeed/summary/route.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/admin/pagespeed/summary/cache.ts`
- `/Users/mike/Documents/AIFactory/Code/app/api/admin/pagespeed/summary/route.test.ts`

修复点：

- 原 `route.ts` 导出了 `_cacheMap`，Next.js Route Handler 不允许导出非标准字段，导致 `npm run build` 失败。
- 已将缓存迁移到独立 `cache.ts`，Route Handler 仅保留 Next.js 允许的导出。
- 测试改为从 `cache.ts` 导入并清理缓存。

### 2. Admin Growth 新增 PageSpeed Tab

新增文件：

- `/Users/mike/Documents/AIFactory/Code/components/admin/pagespeed-tab.tsx`

能力：

- 支持巡检白名单内核心页面：
  - `https://genforms.ai/`
  - `https://genforms.ai/templates`
  - `https://genforms.ai/posts/typeform-alternatives`
  - `https://genforms.ai/forms/new`
- 支持移动端 / 桌面端切换。
- 展示 Performance、Accessibility、Best Practices、SEO 四类评分。
- 展示 FCP、LCP、TBT、CLS、TTI、Speed Index、资源体积和请求数。
- 展示 PageSpeed 返回的主要优化机会。
- 中文为第一优先，同时保留英文 fallback。

### 3. Growth Actions 接入 PageSpeed 已加载数据

修改文件：

- `/Users/mike/Documents/AIFactory/Code/components/admin/growth-actions-tab.tsx`
- `/Users/mike/Documents/AIFactory/Code/components/admin/growth-dashboard-shell.tsx`

规则：

- 只有管理员主动在 PageSpeed Tab 拉取过数据后，Growth Actions 才消费该结果。
- 不会因为打开后台自动刷 PageSpeed API 配额。
- 当性能分低于 80、可访问性/最佳实践低于 90、或存在 JavaScript 优化机会时，输出克制的后台诊断建议。

### 4. 环境变量样例补齐

修改文件：

- `/Users/mike/Documents/AIFactory/Code/.env.example`

新增：

```env
PAGESPEED_API_KEY = ""
```

## 验证结果

已执行：

```bash
npx vitest run app/api/admin/pagespeed/summary/route.test.ts
npx tsc --noEmit
npm run build
```

结果：

- PageSpeed API 单元测试：7/7 通过。
- TypeScript 类型检查：通过。
- Next.js 生产构建：通过，构建产物包含 `/api/admin/pagespeed/summary` 与 `/[locale]/admin/growth`。

## 风险说明

- PageSpeed API 有配额成本，因此后台不会自动为所有页面批量拉取，只在管理员打开 PageSpeed Tab 后按当前页面与设备主动拉取，并依赖后端 12 小时缓存。
- 本任务不解决实际性能瓶颈，只提供可观测能力。真正优化继续由 019（第三方脚本延迟加载）和 020（首页 JS 瘦身）推进。

