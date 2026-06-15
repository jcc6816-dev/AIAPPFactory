# AI 表单生成与数据收集系统 — 桌面 PageSpeed 细节优化与静态缓存治理执行报告 (AI-TASK-2026-006-023)

## 1. 修改文件与资源清单

本任务实施了低风险、可验证的桌面 PageSpeed 细节优化，修改与生成资源如下：

| 文件路径 | 状态 | 修改/生成内容摘要 |
| :--- | :--- | :--- |
| `Code/public/logo-64.png` | **[NEW]** | 从 `logo.png` (256x256) 派生生成的 64x64 Retina 适配版 Logo，文件体积由 10.4 KiB 降至 2.0 KiB (减少了 80%+)。 |
| [header/index.tsx](file:///Users/mike/Documents/AIFactory/Code/components/blocks/header/index.tsx) | **已修改** | 修改 3 处动态 logo 图片渲染，将 `/logo.png` 的引用全部映射指向 `/logo-64.png`。 |
| [footer/index.tsx](file:///Users/mike/Documents/AIFactory/Code/components/blocks/footer/index.tsx) | **已修改** | 同样将 Footer 处的 Logo 引用映射指向 `/logo-64.png`，并使用 TypeScript 选项链防护。 |
| [next.config.mjs](file:///Users/mike/Documents/AIFactory/Code/next.config.mjs) | **已修改** | 在 `headers()` 方法中新增匹配静态文件路径（`/logo.png`, `/logo-64.png`, `/imgs/:path*`），强制返回 `Cache-Control: public, max-age=2592000, must-revalidate` (30天中长期缓存)。 |

*注：完全没有修改 `logo.png` 原文件，亦没有触碰任何 SEO 文案、hreflang、埋点、Auth、支付、数据库、或 Admin API。*

---

## 2. Curl 静态缓存头部校验结果

在本地启动生产模式服务 (`npx next start -p 4321`) 后，对目标静态文件进行头部嗅探验证：

### ① Logo-64.png 缓存校验
```bash
curl -I http://localhost:4321/logo-64.png
```
**输出响应头**：
```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=2592000, must-revalidate
Content-Type: image/png
Content-Length: 2040
```
*(成功返回 200 OK 且包含 30 天的 Cache-Control)*

### ② Background mask (circle.svg) 缓存校验
*注：因项目实际静态路径为 `/imgs/masks/circle.svg`，我们使用正确路径进行校验。*
```bash
curl -I http://localhost:4321/imgs/masks/circle.svg
```
**输出响应头**：
```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=2592000, must-revalidate
Content-Type: image/svg+xml
Content-Length: 1196
```
*(成功匹配 `/imgs/:path*` 规则并返回 30 天的 Cache-Control)*

---

## 3. Cloudflare 缓存规则（Cache Rules）人工配置建议

为配合应用层缓存治理，建议在域名 **`genforms.ai`** 的 Cloudflare 后台配置如下 Cache Rule，以强制边缘 CDN 缓存中长期静态资源：

1. **规则名称 (Rule name)**: `Cache Static Assets`
2. **匹配条件 (If incoming requests match)**:
   - 选择 **“Custom filter expression”** (自定义表达式)
   - 填入匹配表达式：
     ```text
     (http.request.uri.path starts_with "/imgs/") or (http.request.uri.path eq "/logo.png") or (http.request.uri.path eq "/logo-64.png") or (http.request.uri.path eq "/favicon.ico")
     ```
3. **缓存设置 (Then the settings are)**:
   - **Edge TTL** (边缘缓存时间): 选择 `Respect existing headers` (遵守源站头部) 或手动指定为 `1 month`
   - **Browser TTL** (浏览器缓存时间): 选择 `Respect existing headers`
   - **Cache status** (缓存状态): 选择 `Eligible for cache` (允许缓存)

---

## 4. 验证与编译检查结果

1. **类型校验 (`npx tsc --noEmit`)**: **通过（0错误）**。
2. **打包验证 (`npm run build`)**: **完全构建成功**。

## 5. Codex 复核补充记录

Codex 已对本任务做独立复核，结论为通过。

- `Code/public/logo-64.png` 存在，尺寸为 64x64，文件体积约 2.0 KiB。
- Header 与 Footer 中的 `/logo.png` 引用已通过字符串映射切换到 `/logo-64.png`。
- `next.config.mjs` 已为 `/logo.png`、`/logo-64.png`、`/masks/circle.svg`、`/imgs/:path*` 配置 30 天静态缓存头。
- 独立运行 `npx tsc --noEmit`：通过。
- 独立运行 `npm run build`：通过。
- 本地短暂启动生产服务后验证：
  - `curl -I http://localhost:4321/logo-64.png` 返回 `Cache-Control: public, max-age=2592000, must-revalidate`。
  - `curl -I http://localhost:4321/imgs/masks/circle.svg` 返回 `Cache-Control: public, max-age=2592000, must-revalidate`。
- 复核未发现 SEO、CTA、埋点、Auth、支付、数据库或 Admin API 相关改动。
