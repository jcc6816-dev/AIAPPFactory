# 执行报告：首页首屏 JS 瘦身与非首屏模块动态加载 (AI-TASK-2026-006-020)

- **任务 ID**：AI-TASK-2026-006-020
- **状态**：已完成 (COMPLETED)
- **执行人**：Gemini
- **复核人**：Codex

---

## 1. 首页模块审计与决策表

通过对首页 `app/[locale]/(default)/page.tsx` 中调用的组件进行全面审计，我们梳理出了以下加载与 SEO 决策：

| 模块名称 | 是否首屏 | 客户端逻辑比重 | 优化策略 | 优化依据说明 |
| :--- | :--- | :--- | :--- | :--- |
| **LandingPageTracker** | 是 | 极轻 (埋点) | 静态导入 | 用于首页 page_view 等基础数据侦测，必须最先加载。 |
| **JsonLd** | 是 | 无 (纯元数据) | 静态导入 | 提供关键的 JSON-LD 搜索信息，由服务端完成输出，无 JS 副作用。 |
| **Hero** | 是 | 重 (交互 Demo) | 静态导入 | 游客首屏呼吁核心，包含 Prompt 表单和动画演示，绝对不应被延迟。 |
| **CorePathSection** | 否 | 极轻 (Server Component) | 静态导入 | 纯静态文本和四主线闭环插图，服务端渲染，无任何客户端 JS 载荷。 |
| **TemplateStarter** | 否 | 重 (主题切换/分类) | **动态加载 (dynamic)** | 包含 5 套卡片主题状态和分类过滤器。折线下方组件，极其适合延迟加载。 |
| **UseCaseEntrySection**| 否 | 无 (Server Component) | 静态导入 | 主要提供场景长尾链接，对 SEO 收录极关键，且自身无客户端 JS 损耗。 |
| **SolutionEntrySection**| 否 | 无 (Server Component) | 静态导入 | 主要提供行业长尾链接，对 SEO 极其关键，无客户端 JS 损耗。 |
| **SkillsGallery** | 否 | 重 (画廊与动作) | **动态加载 (dynamic)** | 包含复杂去重、OCR、智审等功能展示画廊。延迟加载可显著释放首屏主线程。 |
| **Blog** | 否 | 无 (Server Component) | 静态导入 | 服务端根据 Locale 拉取数据渲染，有利于搜索引擎提取文章。 |
| **Pricing** | 否 | 重 (Stripe动态调用) | **动态加载 (dynamic)** | 处于页面底部，且在 019 中已重构为按需导入 Stripe，应异步化处理。 |
| **FAQ** | 否 | 无 (Server Component) | 静态导入 | 服务端渲染的静态折叠文本，对首屏 JS 无任何增加作用。 |
| **CTA** | 否 | 无 (Server Component) | 静态导入 | 静态底部背景及链接，无客户端 JS 开销。 |

---

## 2. 实际动态加载与服务端化的模块

我们对以下三个非首屏重度客户端模块实现了 `next/dynamic` 异步加载：
1. **[TemplateStarter](file:///Users/mike/Documents/AIFactory/Code/components/blocks/template-starter/index.tsx)**
2. **[SkillsGallery](file:///Users/mike/Documents/AIFactory/Code/components/blocks/skills-gallery/index.tsx)**
3. **[Pricing](file:///Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx)**

同时根据 Codex 指示，这三个组件**均保持默认的 SSR 支持**（不传 `ssr: false`），确保搜索引擎爬虫在服务端一次性拉取到的 HTML 仍具备完整、健全的组件文案。

### Fallback 骨架屏配置
为了避免加载时的明显布局抖动（CLS 恶化），我们为上述三个组件配置了结构相似、高度稳定的 `animate-pulse` 骨架图作为加载占位符：
- `TemplateStarter`：占位 600px 灰色骨架（`bg-slate-100`）；
- `SkillsGallery`：占位 384px 黑色骨架（`bg-slate-900`），与原暗黑底色设计对齐；
- `Pricing`：占位 384px 灰色骨架（`bg-slate-100`）。

---

## 3. SEO 风险判断

- **结论**：**无 SEO 风险**。
- **依据**：由于 `next/dynamic` 并没有配置 `ssr: false`，因此组件的服务端生命周期仍然是正常的。Google 爬虫在发起请求时，服务器在 Node 阶段依然会将这三个组件里面的模版文本、价格条款、技能要素全部转化为静态 HTML 标记输出。客户端在收到响应后，仅是在水合（hydration）期间异步下载这些组件的 JS 包，对于爬虫抓取可检索度无任何消极影响。

---

## 4. 验证命令与成效结果

### 1) 类型检查
```bash
npx tsc --noEmit
```
- **执行结果**：**成功通过**，无任何 TypeScript 类型校验异常。

### 2) 单元测试
```bash
npx vitest run app/api/admin/pagespeed/summary/route.test.ts
```
- **执行结果**：**通过**，已有路由的 7 个单元测试未受影响。

### 3) 生产环境构建
```bash
npm run build
```
- **执行结果**：**成功构建**。
- **优化后首页 First Load JS 载荷**：
  - `/[locale]` 页面 Size 为 **25.5 kB**，First Load JS 大小为 **224 kB**。
  - shared chunks 总大小控制在 **106 kB** 左右。

---

## 5. 后续 PageSpeed 复测建议

- 建议在部署测试分支或 Staging 环境后，再次在后台 “PageSpeed 页面性能巡检” Tab 下，拉取首页在 Mobile 策略下的性能分析。
- 重点比对：**TBT (Total Blocking Time)** 与 **FCP (First Contentful Paint)**。得益于本次将重组件移入异步动态水合，Mobile 端的主线程阻塞预计会有较为显著的提分。
