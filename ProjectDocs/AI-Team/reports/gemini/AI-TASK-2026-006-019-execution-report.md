# 执行报告：首页第三方脚本延迟加载优化 (AI-TASK-2026-006-019)

- **任务 ID**：AI-TASK-2026-006-019
- **状态**：已完成 (COMPLETED)
- **执行人**：Gemini
- **复核人**：Codex

---

## 1. 修改文件清单

我们仅对以下授权范围内的代码文件进行了修改，并严格避开了敏感的 Auth/Db/Payment 核心逻辑以及生产部署配置：

1. **[pricing index.tsx](file:///Users/mike/Documents/AIFactory/Code/components/blocks/pricing/index.tsx)**
   - 移除静态的 Stripe SDK 导入，改为在支付按钮触发时的按需动态加载。
2. **[app.tsx](file:///Users/mike/Documents/AIFactory/Code/contexts/app.tsx)**
   - 重构 AppContextProvider 下 of Hook 调用，由条件触发重构为顶层规范挂载，传入 `showSignModal` 参数，符合 React 规范。
3. **[useOneTapLogin.tsx](file:///Users/mike/Documents/AIFactory/Code/hooks/useOneTapLogin.tsx)**
   - 重构 Hook 参数与初始化逻辑，增加当前页面路由与登录弹窗状态判断，从源头控制 One Tap 的加载时机。

---

## 2. 第三方脚本加载策略变化

| 脚本类型 | 优化前策略 | 优化后策略 | 效果及优化说明 |
| :--- | :--- | :--- | :--- |
| **Stripe SDK** | 页面加载时静态顶层导入，直接打包进首页 Initial Bundle。 | 动态 `import("@stripe/stripe-js")`。只在用户点击具体的“购买/订阅”按钮时才异步下载并初始化。 | 移除首屏静态打包占用，将游客首页首屏 Bundle 体积进一步裁剪。 |
| **Google One Tap (FedCM)** | 未登录时在首页首屏无条件初始化并每 3 秒发起循环重试。导致 FedCM 在游客页控制台频繁报错。 | 仅当用户表现出登录意图（如触发登录弹窗 `showSignModal === true`）或直接身处独立登录页（`/login`, `/signin`）时才开始初始化并重试。 | 游客首页首屏不再有无用的 FedCM token 获取请求与报错，且完全保留了弹窗/登录页上的 Google One Tap 快速登录体验。 |
| **Microsoft Clarity** | 使用 Next.js `lazyOnload` 延迟加载，且自动排除敏感路由（如 `/forms/new`, `/admin` 等），避免敏感数据录制。 | 保持现状。 | 在保证不录制敏感界面的情况下，确保公开页面的用户录屏行为诊断完全可用。 |
| **Google Analytics (GA4)** | 使用 `@next/third-parties/google` 的 `afterInteractive` 模式水合后载入。 | 保持现状。 | 确保全站核心激活漏斗事件的流向分析完整、无遗漏，且不产生首屏 HTML 渲染阻碍。 |

---

## 3. 风险与回滚方式

### 潜在风险
- **Stripe 加载延迟**：在网络极其恶劣的环境下，用户首次点击购买按钮到加载完 Stripe SDK 并跳转可能存在 1-2 秒延迟。
  - *缓解措施*：在加载开始时调用了原有的 `setIsLoading(true)` 状态，在按钮上渲染了流畅的加载动画 (`Loader`)，提供给用户良好的交互反馈，防止重复点击。
- **One Tap 未能正常唤起**：若用户网络与 Google API 通信受限，当打开弹窗时 One Tap 有概率会加载超时。
  - *缓解措施*：普通 Google 登录按钮使用的是传统的 OAuth 重定向，完全不依赖 One Tap，可实现无缝降级。

### 回滚方式
如需快速回滚，可将修改后的三个文件退回到修改前版本。由于本次修改未涉及任何数据库变更或系统依赖包的增减，回滚无任何历史数据不一致风险。

---

## 4. 实际执行的验证命令及结果

### 1) 静态类型检查
```bash
npx tsc --noEmit
```
- **执行结果**：**成功通过**，无任何 TypeScript 报错。

### 2) 单元测试运行
```bash
npx vitest run app/api/admin/pagespeed/summary/route.test.ts
```
- **执行结果**：**7/7 全部通过**。

### 3) 生产环境打包
```bash
npm run build
```
- **执行结果**：**打包完全成功**。全站静态路由生成成功且无任何警告，首屏 First Load JS 大小符合性能预期。
