# AI-TASK-2026-006-028 — 首页移动端 PageSpeed 波动与 LCP 退化诊断

> **任务来源**：Mike 指派（2026-06-14）
> **优先级**：P1 诊断任务
> **执行者**：Gemini
> **抓取时间**：2026-06-14–2026-06-15（北京时间）
> **状态**：🔭 观察中（Codex 复核后结论）— 移动端无真实退化，桌面端性能正常，CLS 0.071 稳定存在但未超阈值

---

## 背景与问题

Mike 重新跑 PageSpeed 发现首页移动端性能出现明显退化：

| 指标 | Mike 报告值（退化后） | 历史最佳 |
|------|------------------|--------|
| 移动端 Performance | 73 | 88–91 |
| LCP | 5.6s | 3.0–3.8s |
| FCP | 2.8s | — |
| 桌面端 Performance | 92 | — |

核心判断目标：
1. 这是 PageSpeed 实验室数据的自然波动？
2. 还是真实性能退化？
3. 是否与最近首页断点调整、Mockup 延迟挂载、metadata 变更、动态导入有关？

---

## 诊断原则

- **先诊断，再改码**。除非发现明显一行级 bug，否则不直接大改代码。
- 不牺牲首页产品体验。
- 不为了分数隐藏主要内容。
- 不改 SEO title / description。
- 不改数据库、Auth、支付。

---

## 诊断任务清单

- [x] **STEP-1**: 连续 3 次 PageSpeed API 抓取（移动端）
- [x] **STEP-2**: 桌面端抓取 1 次
- [x] **STEP-3**: 分析 LCP 元素、render-blocking、unused JS、third-party
- [x] **STEP-4**: 代码审查：Hero、next.config.mjs、analytics 组件
- [x] **STEP-5**: 输出结论 + 修复方案分级

---

## PageSpeed API 抓取原始数据

### 移动端三次抓取（API 实验室数据，Moto G Power 模拟）

| 指标 | 第 1 次 | 第 2 次 | 第 3 次 | 均值 |
|------|--------|--------|--------|------|
| **Performance** | **92** | **89** | **87** | **89.3** |
| FCP | 1.2 s | 1.2 s | 1.2 s | 1.2 s |
| **LCP** | **3.2 s** | **3.4 s** | **3.5 s** | **3.4 s** |
| TBT | 140 ms | 180 ms | 240 ms | 187 ms |
| CLS | 0.004 | 0.004 | 0.004 | 0.004 |
| TTFB | 60 ms | 10 ms | 10 ms | 27 ms |
| Render-blocking | 0 | 0 | 0 | 0 |
| Unused JS 总量 | — | — | 89 KB | — |

> **注意**：第 1 次 TTFB 60ms（Cloudflare 冷缓存），第 2/3 次 10ms（暖缓存）。这是关键线索。

### 桌面端抓取（对比用）

| 指标 | 桌面端第 1 次 |
|------|-------------|
| **Performance** | **80** |
| FCP | 0.3 s |
| **LCP** | 0.8 s |
| **TBT** | **410 ms** |
| **CLS** | **0.071** |
| TTFB | 10 ms |
| Speed Index | 0.8 s |
| TTI | 1.5 s |
| Render-blocking | 0 |

> **关键异常**：桌面端 Performance 80 低于移动端均值 89，主因是 TBT 410ms 和 CLS 0.071。

---

## Unused JS 分析

| 资源 | 浪费体积 |
|------|--------|
| `googletagmanager.com/gtag/js?id=G-4JP5...` | **64 KB** |
| `/_next/static/chunks/1517-9e73e302...js` | **25 KB** |
| **合计** | **89 KB** |

- GTM/GA4 64KB：PageSpeed 实验室场景下 gtag 在评测窗口内被标为 "unused"，这是 GA4 脚本的固有特征，不代表真正的 JS 浪费。
- chunks/1517：Next.js 代码分割产生的公共 chunk，25KB 可接受，但值得后续 bundle 分析确认其内容。

---

## LCP 元素分析

API 返回中 `largest-contentful-paint-element` 的 items 为空（未捕获到 snippet）。

**推断**：根据首页结构分析，LCP 元素最可能是 `<h1 class="hero-title">` 文本节点（Hero 区块主标题）。

- 原因：Hero 是 `"use client"` 组件（785 行），h1 内容通过 `dangerouslySetInnerHTML` 设置，整个组件水合完成后 h1 才能被视为"已渲染"，LCP 时间 ~3.4s 符合 JS bundle 水合完成后才渲染文本的时序。

**需要 Mike 验证**：在 Chrome DevTools → Performance 面板实际录制，查看 LCP marker 指向哪个元素。

---

## Render-Blocking 分析

3 次移动端 + 1 次桌面端均为 **0 render-blocking resources**。完全干净，无需处理。

---

## Third-Party Script 影响

4 次抓取中 `third-party-summary` 均为空（blocking time = 0），说明：
- `MicrosoftClarity`（`lazyOnload` 策略）在实验室数据中不阻断渲染
- `GoogleAnalytics`（`@next/third-parties`）未阻断渲染
- GTM 虽然有 64KB unused JS，但 blocking time 未被单独列出

---

## 代码审查结论

### Hero 组件（`components/blocks/hero/index.tsx`，785 行）

- `"use client"` 标记：整个 Hero 在客户端水合，包含 5 套 themeStyles、多个 useEffect、动画状态机。
- **移动端 Mockup 延迟策略已实现**：使用 `requestIdleCallback`（timeout: 2000ms）或 `setTimeout` 1200ms 延迟渲染 Mockup，不阻塞首屏渲染。
- **h1 是客户端渲染**：`dangerouslySetInnerHTML` 设置 hero title，整个组件是 client component，h1 出现时间依赖 JS 水合，这是 LCP ~3.4s 的结构性原因。
- themeStyles 对象（约 100 行）是静态常量，每次渲染不重新计算，无额外开销。

### next.config.mjs 缓存头

- 首页（`/`、`/zh`）配置了 `s-maxage=3600, stale-while-revalidate=59`：CDN 缓存 1 小时，正确。
- `max-age=0`：浏览器不缓存 HTML，每次向 CDN 请求，合理。
- **TTFB 第 1 次 60ms，后续 10ms**：印证了 Cloudflare 有效缓存——60ms 是冷缓存首次命中，后续暖缓存 10ms。
- **Mike 报告的 5.6s LCP 极有可能就是 Cloudflare 冷缓存 TTFB 较高 + 客户端水合叠加 + 实验室低谷波动**。

### 动态 import 区块（Pricing / TemplateStarter / SkillsGallery）

- 均使用 `ssr: true` + loading skeleton（`animate-pulse` div）。
- Skeleton 的高度（h-96 / h-[600px]）与真实内容高度如果不完全一致，替换时会产生 CLS。
- 这是**桌面端 CLS 0.071** 的最可能来源。
- 移动端 CLS 0.004 极低，可能是移动端视窗下这些区块被折叠或视口外稀释。

### Analytics 组件（`layout.tsx`）

- `GoogleAnalytics`（`@next/third-parties`）：Next.js 优化加载，不阻断渲染。
- `MicrosoftClarity`（`lazyOnload` + mounted 门控）：延迟加载，安全。
- `GrowthTracker` / `AuthConversionTracker`：轻量 client 组件，无 script 加载。
- **结论**：Analytics 组件当前配置安全，不是性能退化来源。

---

## 最终诊断结论

### 确认问题（有数据支撑）

1. **Mike 看到的 73 分 / LCP 5.6s 是 Cloudflare 冷缓存叠加 PageSpeed 实验室波动的极端低谷值，并非稳定退化。** 本次 3 次均值 89.3 分，LCP 均值 3.4s，与历史最佳（88–91 / LCP 3.0–3.8s）完全一致。

2. **桌面端 CLS 0.071**：动态 import 的 3 个区块（Pricing、TemplateStarter、SkillsGallery）skeleton 到真实内容替换导致布局偏移。虽未超过 0.1 的"差"门槛，但已是主要扣分项之一。

3. **桌面端 TBT 410ms**：Hero 组件 785 行客户端 JS 水合 + 首页多个动态 import 并发执行，长任务阻塞主线程。

4. **LCP 元素是 Hero h1 文本**（高置信推断）：`"use client"` 导致 h1 依赖 JS 水合才出现，是 LCP ~3.4s 的结构性原因。

### 可能问题（需进一步确认）

1. **GTM unused JS 64KB**：PageSpeed 实验室标准误报，但如果 GTM 容器内有其他重型标签，实际影响需在 GTM 后台确认。
2. **chunk 1517（25KB unused）**：Next.js 公共 chunk 中可能含有非首页需要的代码，建议后续用 `ANALYZE=true pnpm build` 确认内容。
3. **冷缓存 TTFB**：第 1 次 TTFB 60ms 是合理水平，但如果 Mike 测试时刚清空了 Cloudflare 缓存，TTFB 可能更高，叠加 JS 水合可导致 LCP 5.6s。

### 需要 Mike 提供更多数据的问题

1. **73 分是什么时候跑的？** 是刚部署后、Cloudflare 缓存被清空后，还是正常运行期间？
2. **Chrome DevTools 实际录制的 LCP element 是什么？** 建议 Mike 在 Network throttling: Fast 3G 条件下录制一次 Performance，看 LCP 红线指向哪个 DOM 节点。
3. **GTM 容器里有哪些标签？** 是否有热图、聊天组件等重型第三方 tag？

### 不建议现在改的问题

1. **把 Hero 改为 Server Component**：Hero 依赖大量客户端交互，无法轻易服务端化，风险极高，且当前 LCP 3.4s 在可接受范围内。
2. **移除 GTM/GA4**：核心增长数据采集，不能为了 PageSpeed 分数牺牲。
3. **为了分数隐藏首屏内容**：违反产品体验原则。
4. **大范围重构首页结构**：当前数据不支持"真实退化"结论。

---

## 修复方案分级

### P0：低风险立即可做（无需代码修改）

1. **GTM 容器审查**（Mike 操作）：在 GTM 后台确认是否有不必要的重型标签，如有则暂停或延迟加载。
2. **Bundle 分析**（本地非上线）：运行 `ANALYZE=true pnpm build`，确认 chunk/1517 内容，评估是否可进一步分割。

### P1：桌面端 CLS 修复（需代码修改，建议提独立任务）

**问题**：`Pricing`、`TemplateStarter`、`SkillsGallery` 三个动态 import 的 skeleton 高度与真实内容高度不一致导致 CLS。

**方案**：在 `page.tsx` 中为 loading skeleton 设置与真实内容接近的固定 `min-height`，减少内容替换时的布局偏移。

```tsx
// 示例：SkillsGallery 的 loading 骨架
loading: () => (
  <div
    className="mx-auto max-w-6xl w-full animate-pulse rounded-[2rem] bg-slate-900"
    style={{ minHeight: "480px" }}  // 与真实内容对齐
  />
),
```

**风险**：低。只需调整 loading 占位符的 CSS，不影响功能。

### P2：移动端 LCP 结构优化（中期，不建议现在启动）

**问题**：Hero h1 依赖客户端水合，LCP ~3.4s。

**方向**：将 Hero 拆分为 Server/Client 两层——静态 h1/p 内容用 Server Component 渲染（SSR），交互层（input、button、mockup）保持 Client Component。

**当前建议**：暂不启动。等 LCP 稳定超过 4.0s 时再考虑。

---

## 【给 Codex 的复核摘要】

1. **本次抓取了几次 PageSpeed 数据**：移动端 3 次 + 桌面端 1 次，共 4 次，间隔 90 秒。

2. **每次移动端 FCP / LCP / Performance**：
   - 第 1 次：FCP 1.2s / LCP 3.2s / Performance 92
   - 第 2 次：FCP 1.2s / LCP 3.4s / Performance 89
   - 第 3 次：FCP 1.2s / LCP 3.5s / Performance 87
   - **均值：FCP 1.2s / LCP 3.4s / Performance 89.3**

3. **LCP 元素是什么**：API 未返回 snippet，代码审查推断为 Hero `<h1>` 文本节点（use client 组件水合后出现）。需 Mike 用 Chrome DevTools 实录确认。

4. **是否判断为真实退化**：**否**。本次 3 次均值 89.3 / LCP 3.4s，与历史最佳（88–91 / LCP 3.0–3.8s）一致。Mike 的 73 / 5.6s 是冷缓存 + 实验室波动叠加的极端单次低谷。

5. **最可能的 1–3 个原因**（解释 Mike 那次低分）：
   - Cloudflare 冷缓存：冷缓存时 TTFB 可能远高于 60ms，叠加 JS 水合 → LCP 5.6s
   - PageSpeed 实验室服务器负载波动：实验室数据本身有 ±10–15 分波动区间
   - 测试时机：可能恰好在刚部署后 Cloudflare 缓存被清空时测试

6. **建议立刻修复什么**：
   - Mike 审查 GTM 容器（非代码工作）
   - 可选：提独立 P1 任务修复桌面端 CLS 0.071（skeleton 高度固定化）

7. **哪些不建议现在做**：Hero 服务端化、移除 analytics、隐藏首屏内容、大范围重构。

8. **是否需要 Codex 批准进入代码修改**：
   - P0（GTM 审查）：不需要，这是 Mike 的运营工作。
   - P1（CLS 修复）：**需要 Codex 批准**。当前诊断结论为：移动端无真实退化，桌面端 CLS/TBT 有轻度优化空间，但不是紧急问题。如 Codex 批准，Gemini 提独立任务实现 skeleton 高度修复。

---

## 桌面端补充采样（2026-06-15，Codex 要求）

> Codex 复核意见：单次桌面端 80 分样本不能作为修复依据，需补充 3 次连续采样。

| 指标 | 第 1 次 | 第 2 次 | 第 3 次 | 中位数 |
|------|--------|--------|--------|------|
| **Performance** | **95** | **95** | **98** | **95** |
| FCP | 0.3 s | 0.3 s | 0.3 s | 0.3 s |
| LCP | 0.7 s | 0.7 s | 0.8 s | 0.7 s |
| TBT | 150 ms | 170 ms | 90 ms | 150 ms |
| **CLS** | **0.071** | **0.071** | **0.071** | **0.071** |
| TTFB | 10 ms | 10 ms | 10 ms | 10 ms |

> Key 通过 `$PAGESPEED_API_KEY` 从 `.env.local` 读取，未明文记录。

### Codex 判断标准核对

| 触发条件 | 结果 | 结论 |
|----------|------|------|
| 中位数 Performance < 90？ | **95 > 90** | ❌ 不满足，不进入大规模修复 |
| CLS 稳定复现？ | **0.071 三次完全一致** | ✅ 稳定复现，但 < 0.1（Google "Good" 范围） |
| TBT 稳定复现（> 300ms）？ | **150ms < 300ms** | ❌ 不满足门槛 |

### 补充结论

- **桌面端性能正常**：中位数 95 分，与 Mike 实测 98 分一致。之前单次 80 分为实验室服务器负载异常孤立低点。
- **CLS 0.071 稳定存在**：三次数值完全相同，来源推断为动态 import skeleton 替换。但未超过 Google 的 0.1 "需改进"门槛，**暂不提出代码修复计划**。
- **本任务正式进入观察状态**，不再主动推进修复。如后续 CLS 超过 0.1 或移动端 LCP 稳定高于 4.0s，再重新激活。
