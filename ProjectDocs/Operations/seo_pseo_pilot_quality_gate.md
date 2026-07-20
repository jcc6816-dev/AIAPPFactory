# GenForms pSEO Pilot Quality Gate

> 版本：V1 / 2026-07-03
> 适用范围：首批 5-10 页 pSEO Pilot
> 原则：manifest 通过结构校验不等于允许发布；人工产品事实、Ownership、差异性和 E2E 必须全部通过。

## 1. Batch 进入 Build 前

- [ ] 只选择一个 Family。
- [ ] 有真实 Google SERP 证据和至少 3 个 query-proven existing assets。
- [ ] 已列出现有 Pillar、Template、Solution、Post owner 与 protected queries。
- [ ] 5-10 个候选页各自拥有独立 user task，不是行业名或关键词替换。
- [ ] 每页映射到真实 `templateId`、Prompt、字段、预览和 CTA。
- [ ] 每页至少 2 个 task-specific fields。
- [ ] 每页至少 1 个独立 workflow、限制或结果模块。
- [ ] 不承诺未上线产品能力。
- [ ] manifest 通过 `seo_pseo_pilot_manifest_schema_v1.json` 校验。

任一项失败：`Hold`；不能减少检查项来让 Batch 通过。

## 2. 逐页 Product Truth

- [ ] Prompt 在当前生成链路可使用。
- [ ] 字段类型在当前 Form Schema 支持范围内。
- [ ] 页面预览与 Template/字段一致。
- [ ] CTA 的 `source / intent / template / prompt` 完整且可追踪。
- [ ] CTA 到 create -> generate -> publish 的路径可完成。
- [ ] 测试提交能在 Dashboard 看到。
- [ ] CSV / Webhook 只在实际支持时描述。
- [ ] 限制说明覆盖该场景最容易误解的能力。

统一禁止写成已上线：iframe/HTML embed、生产邮件通知、条件逻辑、PDF-to-form、WhatsApp 原生集成、CRM 原生同步、自动 lead scoring、票务/支付/核销、unlimited free。

## 3. 逐页 SEO 与 Ownership

- [ ] owning query 与用户任务一致。
- [ ] 不与现有 owner 抢同一主意图。
- [ ] title、H1、首屏承诺不是关键词堆叠。
- [ ] canonical 指向自身且 locale 规则正确。
- [ ] hreflang、sitemap、robots 状态正确。
- [ ] BreadcrumbList 正确。
- [ ] FAQPage 只在可见 FAQ 与 JSON-LD 完全一致时使用。
- [ ] SoftwareApplication / Article 与页面类型一致。
- [ ] 至少 2 条有理由的内链：返回 Family owner，并连接相邻任务页。

## 4. Batch 差异性审查

人工 100% 两两抽查，回答：

1. 去掉关键词后，两页是否仍服务不同任务？
2. 字段、Prompt、预览和 workflow 是否实质不同？
3. 用户能否从一页获得另一页没有的决策信息？
4. 是否存在仅替换行业、角色、城市或场景名的段落？
5. 是否应该合并为一个 Pillar 的 section，而不是独立 URL？

任一候选页无法证明独立价值：从 Pilot 删除或 Merge。首批少于 5 个合格页时，整个 pSEO Batch 保持 Hold，不用薄页补满数量。

## 5. 发布前验证

- [ ] 单元/结构测试通过。
- [ ] `npm run build` 通过。
- [ ] 全站 SEO Gate 通过。
- [ ] 每个新 URL 生产 200；错误/旧 URL 按计划 308。
- [ ] 源站与公网 canonical、hreflang、Schema、CTA 一致。
- [ ] 移动端首屏、字段预览、CTA 和阅读顺序人工验证。
- [ ] 100% 页面人工抽检完成并记录 reviewer。
- [ ] 发布日期、14/28/45 天复盘日期写入 manifest。

## 6. 14/28/45 天决策

### Scale

- 大部分 Pilot 页已索引。
- 至少 3 页出现相关 impressions。
- 至少 1 页或 owning cluster 进入前 30。
- 没有明显 cannibalization。
- 搜索用户至少开始进入 template click / generate；样本极小时只作为方向信号。

### Tune

- 有相关 impressions 且排名 11-30，或前 10 仍无点击。
- 一次只修改一个主变量：SERP snippet、FAQ/信息增益、结果感或内链。

### Hold

- 已索引但样本不足。
- query ownership 受隐私阈值影响或仍不稳定。

### Stop

- 45 天仍无相关 impressions。
- 多页竞争同一 query。
- 页面差异不足或被判定为 doorway/thin content。
- CTA 无法承接 create -> publish -> submit。
- 产品能力与搜索主任务不匹配。

