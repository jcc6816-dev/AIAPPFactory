# 桌面 PageSpeed 细节优化与静态资源缓存治理实施计划 (AI-TASK-2026-006-023)

根据 Codex 的初步判断与桌面端优化“低风险、可验证”的原则，我们对 Google PageSpeed 桌面端建议进行了逐一评估与决策。

---

## 1. PageSpeed 建议评估与决策

| 诊断建议 | 预计收益 / 现状影响 | 决策意见 | 理由与方案简述 |
| :--- | :--- | :--- | :--- |
| **A. Logo 图片传输过大** (显示 32x32，实际 256x256, 10.4 KiB) | 减小首屏核心图片传输体积，规避 PageSpeed 尺寸不匹配告警。 | **立即处理** | 使用 macOS 原生 `sips` 图像命令生成 Retina 适配的 `logo-64.png` (体积降至 1-2 KiB)，直接在组件中引入，零运行时开销。 |
| **B. 本地静态资源缓存周期短** (`/logo.png`, `/masks/circle.svg`) | 提升本地静态资源在浏览器和边缘 CDN 的缓存有效期，避免重复拉取。 | **立即处理** | 在 `next.config.mjs` 中的 `headers()` 增加匹配静态图片及背景的路径，返回 30天以上的 `Cache-Control: public, max-age=2592000, must-revalidate`，同时建议在 Cloudflare 后台补充 Cache Rules 边缘规则。 |
| **C. 第三方资源缓存周期短** (Clarity, Cloudflare beacon, email decode) | 不对项目本身构成加载瓶颈。 | **不建议处理** | 其 TTL 纯粹由第三方 CDN (谷歌、微软、CF) 控制，强行代理会增加网络链路开销且破坏脚本统计真实性。 |
| **D. 渲染阻塞 CSS 请求** (预计影响约 190ms) | Next.js/Tailwind 构建的产物，对首屏展现至关重要。 | **不建议处理** | 强行重构 CSS 异步化会导致页面在水合前出现严重的闪动（FOUC）和累积布局偏移（CLS），风险极高且收益甚微。 |
| **E. 旧版 JavaScript/polyfill** (约 11 KiB) | 影响极小，主要为了向下兼容老旧浏览器环境。 | **暂缓观察** | 缩减 polyfill 需要深入定制构建参数与支持的 browserslist，容易导致低版本浏览器或微信端网页白屏，当前不予改动。 |

---

## 2. 具体实施策略

### 1) Logo 优化方案 (64x64 适配)
- **物理资源**：使用 macOS 系统自带的 0 依赖图像缩放命令 `sips` 从 `logo.png` (256x256) 派生出一张 Retina 2x 标准的 `logo-64.png` (64x64)：
  ```bash
  sips -z 64 64 Code/public/logo.png --out Code/public/logo-64.png
  ```
- **引用重构**：
  - 修改 [header/index.tsx](file:///Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx)，将 Logo 图片的 src 从 `/logo.png` 修改为 `/logo-64.png`，保持 `width={32}` 和 `height={32}` 不变，确保视觉清晰度不变但体积减少约 90%。
  - 修改 [footer/index.tsx](file:///Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx) 同步更新。
- **为什么不使用 next/image**：首屏核心 Logo 在 Header 中静态渲染能够规避动态图片客户端编译和额外的占位跳动，直引 `/logo-64.png` 稳定且性能最高。

### 2) 缓存优化方案 (next.config.mjs / Cloudflare)
- **应用层配置**：
  在 `Code/next.config.mjs` 中的 `headers()` 函数中增加对本地静态资源路径（`/logo.png`、`/logo-64.png`、`/masks/circle.svg`）的匹配，返回长期缓存头部：
  ```javascript
  // 匹配本地核心静态资源及静态图片目录
  const staticAssetPaths = [
    "/logo.png",
    "/logo-64.png",
    "/masks/circle.svg",
    "/imgs/:path*"
  ];

  const staticCacheHeader = {
    key: "Cache-Control",
    value: "public, max-age=2592000, must-revalidate", // 30天缓存，配合强校验
  };

  // 合并到已有的 headers 返回列表中
  ```
- **CDN 边缘配置建议**：
  在 Cloudflare 仪表板配置一条 Cache Rules，对 `jcc6816-dev/AIAPPFactory` 域名下的静态资源进行边缘缓存周期覆盖（设置为 1 个月）。

---

## 3. 业务影响评估
- **SEO 影响**：**无**。没有修改任何 HTML 语义、canonical 标签或元数据，无 SEO 风险。
- **视觉/CTA/埋点**：**完全无影响**。Logo 清晰度依然保持 2x Retina 标准（64x64 图渲染在 32px 容器内），交互路径与数据监控流保持 100% 一致。

---

## 4. 验证与测试方式

### ① 编译与构建检查
运行以下命令确保无编译报错：
```bash
npx tsc --noEmit
npm run build
```

### ② 静态缓存头部校验
使用 `curl` 命令行发出本地请求，检验返回的静态文件 `Cache-Control` 属性：
```bash
curl -I http://localhost:3000/logo-64.png
curl -I http://localhost:3000/masks/circle.svg
```
*(确认 Header 中是否正确包含 `Cache-Control: public, max-age=2592000`)*

### ③ 视觉对比检查
在本地和 Staging 启动后，人工检验 Header 和 Footer 处的 Logo，确保无任何模糊或拉伸变形问题。
