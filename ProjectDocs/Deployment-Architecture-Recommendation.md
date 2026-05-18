# 部署架构建议

更新时间：2026-05-10

## 1. 当前建议结论

针对当前增强版 MVP，推荐优先采用下面这套部署组合：

- 应用层：`Vercel`
- 数据库：`Supabase`
- 文件存储：`Cloudflare R2`

如果后续更偏企业稳妥路线，可将文件存储替换为：

- 文件存储：`AWS S3`

## 2. 为什么这样选

### 2.1 应用层选择 Vercel

当前主工程是 `Next.js` 单体应用，放在 Vercel 上最顺：

- 对 Next.js 支持最直接
- 环境变量配置简单
- Route Handler 部署自然
- 适合当前 MVP 快速上线与迭代

## 2.2 数据库继续用 Supabase

当前系统已经接入 Supabase，并完成过真实联调：

- `users`
- `credits`
- `forms`
- `form_submissions`
- `workflow_runs`
- `webhook_logs`

继续沿用的好处：

- 当前代码无需重构数据库访问层
- 管理后台和调试体验更顺手
- 适合当前 MVP 的快速验证节奏

### 2.3 文件存储优先用 R2

当前文件上传链路已经按 S3 兼容方向组织。

优先用 `Cloudflare R2` 的原因：

- S3 兼容
- 接入成本低
- 适合当前 MVP 上传图片、OCR 文件留存
- 对公开分享型产品比较友好

如果后续需要更偏企业级、与更多云资源统一，则可以切到 `AWS S3`。

## 3. 推荐架构

### 方案 A：当前优先推荐

- Web / App：Vercel
- DB：Supabase
- Storage：Cloudflare R2

适合：

- 当前 MVP 快速上线
- 快速联调
- 小团队迭代

### 方案 B：偏企业稳妥

- Web / App：Vercel
- DB：Supabase
- Storage：AWS S3

适合：

- 对象存储更偏企业云资源统一
- 后续可能需要和 AWS 生态进一步整合

## 4. 当前不建议的方案

以下方案当前阶段不建议优先投入：

- 自建传统服务器 + 手工部署
- 提前拆 Kubernetes
- 一开始就做多云双活
- 为了未来可能需求先拆复杂微服务

原因：

- 当前仍是 MVP 验证阶段
- 目标是先稳定上线，而不是先把基础设施做重

## 5. 当前部署优先级建议

建议顺序：

1. 先部署 `Vercel + Supabase`
2. 再补 `R2` 或 `S3` 文件存储
3. 再做正式域名、Webhook 外部联调
4. 最后再考虑 OAuth、RLS、安全收口

## 6. 当前适用判断

如果你现在的目标是：

- 尽快上线一个可验证版本
- 持续演示给客户或内部团队
- 保持改动速度

那当前最推荐就是：

`Vercel + Supabase + Cloudflare R2`
