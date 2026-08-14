# GenForms SEO 恢复监测与会话审计运行手册

更新时间：2026-08-09
适用范围：服务器迁移/恢复后，GenForms MVP 的技术 SEO、GSC 与 Clarity 复盘。
边界：本手册不授权修改线上文案、导航、sitemap 或索引指令；所有 GSC/Clarity 操作均为只读，除“请求重新抓取”外。

## 1. 已确认基线

- 2026-08-09 从公网只读复核：首页、模板、解决方案、创建页及三篇历史高曝光文章均为 HTTP 200。
- 历史事故是 sitemap 中 20 篇文章详情返回 500；当前最重要的预防动作是每次发布后全量检查 sitemap，而不是再次批量改标题。
- 本地候选环境没有 Supabase、GSC 或 Clarity 凭证；不得将历史 2026-07 数据伪装为本周期数据。

置信度：技术页面抽样高；“全部 sitemap URL”须由下述脚本每次验证。

## 2. 发布后 10 分钟内的硬门禁

在可信网络和目标环境执行：

```bash
cd Code
pnpm monitor:sitemap https://genforms.ai
```

验收：脚本输出 `PASS every sitemap URL returned HTTP 200`。任一 URL 非 200 时：停止内容/设计改动，记录 URL 与部署版本，先恢复路由或运行时依赖；不要从 sitemap 静默删除受影响文章来掩盖故障。

该脚本只读目标的 `/sitemap.xml`，仅访问 sitemap 中与目标同源的 URL；不会提交、删除或请求索引。

## 3. GSC：D0、D7、D14

### D0（当前恢复完成后）

管理员在 GSC URL Inspection 中对以下高曝光历史 URL 逐个执行“请求编入索引”：

1. `https://genforms.ai/posts/form-builder-with-webhook`
2. `https://genforms.ai/posts/lark-feishu-form-webhook-bot`
3. `https://genforms.ai/posts/feishu-dingtalk-webhook-notification`
4. `https://genforms.ai/posts/typeform-alternatives`

记录每个 URL 的检查时间、可抓取状态、规范 URL 和请求提交结果。不提交提示词、用户邮箱或凭证到任何文档。

### D7 与 D14（同一口径）

- 窗口：最近 7 天与前一等长窗口；同时保留最近 28 天作低样本背景。
- 维度：页面、查询、展示、点击、CTR、平均排名；重点看四篇 URL，不能只看站点总数。
- 决策：先确认抓取与页面可用性；仅在同一页面/意图的低 CTR 或错配持续两个窗口后，才由 SEO 提交单页 title/description/内链建议，等待负责人确认。

## 4. Clarity 最近 7 天分层审计

前提：项目管理员授予只读访问，或在受控连接器中配置只读 token；凭证不得进入仓库、聊天或截图。

1. 固定最近 7×24 小时；排除 internal/codex/deploy_check/playwright、Admin、localhost、原始 IP、机器人和 ≤1 秒会话。
2. A 组：外部进入 `/forms/new` 的全部会话；不足 10 条则全量。按 Google/UTM/模板来源分层。
3. B 组：补足内容/模板页 `<15 秒`、CTA 悬停、Dead/Rage Click 标记会话。
4. 每条仅记录：来源、落地页→关键路径、CTA 可见/点击、输入停顿 >10 秒、生成开始/等待、登录开始/返回、创建、404/Dead/Rage/脚本错误。禁止记录 prompt、邮箱或答卷。
5. 只有 ≥3 条合格外部会话重复出现同一问题，才进入产品迭代；鉴权、404、核心 CTA 失效、严重 CLS 例外，立即热修。

## 5. 当前阻塞与责任

| 项目 | 当前状态 | 责任人 | 解锁条件 |
| --- | --- | --- | --- |
| sitemap 全量监测 | 已提供自动化脚本 | 工程/运维 | 每次候选或生产发布后执行 |
| GSC D0 请求重新抓取 | 待执行 | SEO + 管理员 | 在已登录 GSC 的账号完成操作 |
| GSC D7/D14 复盘 | 待执行 | SEO | D0 记录与新数据到期 |
| Clarity 分层录屏审计 | 待执行 | 增长负责人 | 获得只读访问 |
