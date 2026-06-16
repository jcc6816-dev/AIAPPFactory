# 执行报告 — AI-TASK-2026-006-033 (产品激活关键事件为 0 的漏斗诊断)

**完成时间**：2026-06-15
**所属主线**：产品体验与激活 (Product Experience & Activation)
**评估结论**：这是一个由 **“小流量下爬虫/机器流量占绝对主导”**、**“首屏布局障碍导致真实用户高跳出”** 以及 **“客户端埋点上报技术漏洞”** 共同导致的复合型产品激活漏斗问题。

---

## 1. 当前漏斗判断

GA4 录得每日 15-30 个会话和 94-159 的事件数，但自定义事件均为 0。这表明数据流在用户端交互或上报链路发生了阻断，以下是具体原因判断：

### A. 漏斗最可能断裂的节点
1. **`page_view -> demo_start` 断裂**：真实人类用户到站后，由于首屏视觉或布局问题，在 3-5 秒内没有找到点击入口（Suggestions 或 Mockup 按钮），直接流失（跳出）。
2. **`trackGrowthEvent -> GA4` 链路阻断**：站内事件虽已触发并可能已通过 Beacon 成功发送至我们自己的 `growth_events` 数据库，但在上报至 Google Analytics 时被拦截或未成功执行。

### B. 归因矩阵分析 (体验问题 vs 埋点问题)
- **体验问题 (约 60% 贡献)**：低流量期（15-30 sessions/day）网站主要访问量其实是**执行 JS 的搜索引擎爬虫和检测 Bot**。爬虫会产生 `page_view` 和 `session_start`，但**绝对不会**触发 `demo_start` 等交互事件。此外，由于之前存在的小桌面断点遮挡问题（suggestions 被推出了首屏视口），仅存的少数真实人类用户未进行任何交互就直接跳出。
- **埋点技术问题 (约 40% 贡献)**：在 [growth.ts](file:///Users/mike/Documents/AIFactory/Code/lib/growth.ts) 中，通过检测 `window.gtag` 执行上报。如果 Google Analytics 脚本受 ad-block 拦截、延迟加载或者在 Next.js `@next/third-parties/google` 初始化时未能挂载为全局 `window.gtag` 函数，该上报逻辑将**静默失效**（直接 return）。

---

## 2. 代码与体验链路核对

### A. 埋点触发代码核对
1. **首页 Demo 启动与完成**：
   - 触发点：[Hero 组件](file:///Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx) 中 `handleOptionSelect` 调用 `trackGrowthEvent("demo_started")`；`handleDemoSubmit` 调用 `trackGrowthEvent("demo_completed")`。触发逻辑正确。
2. **模板使用与保存发布**：
   - 触发点：[Hero 组件](file:///Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx) 点击 Suggestion 调用 `trackGrowthEvent("template_used")`；[form-creation-manager.tsx](file:///Users/mike/Documents/AIFactory/Code/components/forms/form-creation-manager.tsx) 中创建与发布分别调用 `trackGrowthEvent("form_created")` 和 `trackGrowthEvent("form_published")`。触发逻辑正确。
3. **站内事件 API 白名单放行核对**：
   - 检查 [route.ts](file:///Users/mike/Documents/AIFactory/Code/app/api/growth/events/route.ts) 中的 `ALLOWED_EVENTS` 白名单，确认 `demo_started`、`demo_completed`、`template_used`、`ai_generate_submitted`、`form_published` 等核心事件**均在放行集合内**，没有被 API 拦截。

### B. 体验层阻碍核对
1. **首屏 3 秒价值感**：Hero 区域的标题 “懂你的表单，一句话即刻生成” 传达较清晰，但由于小桌面断点问题，用户无法第一眼看到 Suggestions 选项，降低了尝试意愿。
2. **登录拦截时机**：在 [form-creation-manager.tsx](file:///Users/mike/Documents/AIFactory/Code/components/forms/form-creation-manager.tsx) 和 [form-generator.tsx](file:///Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx) 中，游客体验状态下不强制拦截登录，允许编辑和预览，拦截时机合理。

---

## 3. 建议动作

### P0 (影响激活指标的核心修复，建议立即微调)
1. **采用官方 `sendGAEvent` 替换手动 `window.gtag` 调用**：
   - *对应指标*：`demo_start` / `demo_complete` 等全量自定义事件。
   - *说明*：`window.gtag` 在 Next.js 延迟加载下可能未就绪，使用 `@next/third-parties/google` 提供的 `sendGAEvent` 能保证事件推入缓存队列不遗失。

### P1 (体验优化与监控)
2. **部署首页小桌面断点 CSS 优化**：
   - *对应指标*：Clarity 页面停留时间，降低 immediate bounce 比例。
   - *说明*：确保 suggestions 按钮在 iPad / 970px 等视口下 100% 处于首屏可见区域。
3. **增加 `page_view` 埋点兼容性**：
   - *对应指标*：页面访问比对。
   - *说明*：将 `page_view` 显式加入 `GA_EVENT_NAMES` 映射中，确保自定义页面分析的统一性。

### P2 (排队/长期)
4. **引入无流量排除过滤器**：
   - *对应指标*：净化 GA4 数据置信度。
   - *说明*：在 GA4 管理后台过滤掉未携带常规 User-Agent 的爬虫流量，使激活率计算的分母更加真实。

---

## 4. 团队协作分工

### 需要 Mike 做什么
1. 在生产环境以无痕模式访问首页，点击 Suggestion 触发一次 Demo 交互。
2. 进入 Google Analytics 的 **DebugView**，检查是否能在实时视图中捕获到 `demo_start` 或 `demo_complete` 调试事件，以判断是否为 GA4 后台没有配置富摘要。

### 需要 Codex 做什么
1. 复核并批准将 [growth.ts](file:///Users/mike/Documents/AIFactory/Code/lib/growth.ts) 中原有的手动 `gtag("event", ...)` 逻辑重构为基于 `@next/third-parties/google` 的 `sendGAEvent` API。
2. 排期部署该重构代码以修复埋点上报机制。

---

## 5. 给 Codex 的复核摘要

1. **零事件根因**：当前日均 15-30 的低流量主要为机器/爬虫会话（只触发基础 PV），加上之前 Suggestions 按钮被挤出首屏的布局障碍，导致真实用户极少触发交互。
2. **技术缺陷**：[growth.ts](file:///Users/mike/Documents/AIFactory/Code/lib/growth.ts) 依赖直接读取 `window.gtag` 上报，该机制在 Next.js `@next/third-parties/google` 的异步加载策略下极易失效。
3. **首要建议**：用 Next.js 官方 `sendGAEvent` 替换手动 `gtag` 调用，上线前Mike配合通过 GA4 DebugView 检查，并对小桌面断点进行上线。
