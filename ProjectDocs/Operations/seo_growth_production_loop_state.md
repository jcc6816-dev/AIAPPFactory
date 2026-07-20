# GenForms SEO Growth Production Loop State

> 更新时间：2026-07-07  
> Goal：Active  
> Loop Controller：Codex  
> 当前模式：Ramp-up / 保护冻结数据，同时建立持续生产供给

## 1. Capacity Board

| Lane | 上限 | 当前 | 状态 |
|---|---:|---:|---|
| Data Observe | 不限 | 多个 Batch | Running |
| Research Topic | 3 | 0 | Batch `2026-07-03-R01` Completed / Codex reviewed |
| Brief | 2 | 1 | QR Visual Proof Brief Ready；Build Gate pending 07-05 |
| Build Batch | 1 | 0 | Available，但受冻结/证据 Gate 限制 |
| Frozen Observe Batch | 不限 | Event、Feedback、Lead、Waitlist、Quote、Demo、Course、Community 等 | Running |
| pSEO Pilot | 1 batch | 1 Prepare Review | Event/QR、Lead、Waitlist 预审完成；Publish Gate closed |
| Authority | 1 | 1 Proof Pack | SaaSHub Go；人工审核/提交未开始 |
| Measurement Integrity | 1 repair | Iterate | U-062 已部署且 2026-07-07 完成 3-day quality review；Attribution Gate 继续关闭，等待 internal cohort 与 event/fact discrepancy 修复 |

## 2. Current Portfolio Decision

- Active Build：0。
- Active Research：0；Batch `2026-07-03-R01` 已完成 9 query capture、Gemini 报告和 Codex Evidence Review。
- Prepare Research Batch `2026-07-05_prepare` 已完成 Evidence Repair 并降级为 Medium：6 个 Topic 均为 Existing Tune / Frozen / Hold，没有新 URL 或 Build 授权。
- Active Brief：1；JUL-B01 QR Visual Proof，等待 2026-07-05 GSC Gate。
- 不自动重新打开已关闭的 7 个 Evidence-blocked Topic。
- 不修改冻结至 2026-07-10 至 2026-07-13 的 owning pages。
- 当前可以并行做 Research、Brief 准备、pSEO 数据模型和非重叠内容供给。
- Measurement Audit 已确认 GSC 与产品事实表分别可用；U-062 已将新 acquisition context 持久连接到 Form。2026-07-07 质量审查结论为 Iterate：生产新 Form attribution 覆盖与 PII allowlist 通过，但 internal cohort 未补跑，且存在 `publish_succeeded` event 与 Form publish fact 偏差；继续只报告 counts，不报告 conversion rate。

## 3. First Cycle

### Cycle window

2026-07-03 至 2026-07-17

### Lane A：Observe

- 2026-07-05：复核 QR Pillar 是否仍稳定在 11-30。
- 2026-07-08：复核 Lark/Feishu query 是产品意图还是官方文档意图。
- 2026-07-10 至 2026-07-13：依次复核 Event、Lead、Waitlist、Feedback、Quote、Demo、Course、Community 冻结批次。

### Lane B：Research intake

第一批不从 blocked inventory 随机取 Topic，3 个 Topic 已完成 Research 与 Codex Decide：

1. `JUL-R01`：QR `Existing Tune / Medium`。SERP 是 QR generator、scan-to-fill、how-to、RSVP/event/check-in 混合；Brief 已就绪，Build 等 7 月 5 日 GSC Gate。
2. `JUL-R02`：Lead `Existing Tune / Medium`。AI form generation 与 scoring/qualification/outreach 混合；冻结至 7 月 11 日，不提前改页。
3. `JUL-R03`：Typeform `Authority / Medium-High`。不创建新 URL，不第二次全文重写；Authority Plan 已就绪。

统一研究指令：`gemini_seo_research_batch_prompt_2026-07-03.md`。  
指定交付目录：`ProjectDocs/Operations/seo_growth_production_loop/research_batch_2026-07-03/`。
正式审计：`research_batch_2026-07-03/codex_evidence_review.md`。Gemini 的 High confidence 已按截图证据降级，原始文件保留。

### Lane C：Brief slots

- Slot 1：`seo_brief_qr_scan_to_fill_visual_proof_2026-07.md` 已 Ready；只允许 scan-to-fill visual proof，一个主变量。
- Slot 2：预留给冻结期结束后最强的 Lead 或 Waitlist 动作。
- 若门槛未满足，Slot 保持空，不用弱 Topic 填满。

### Lane D：Build slot

- 当前为空。
- 最早候选：QR 单变量 Golden Tuning Batch。
- 已选择主变量：结果感 / Visual Proof。07-05 GSC Gate 未通过则继续空置。

### pSEO preparation

- 可以设计结构和质量测试，但当前不发布。
- 候选 Family：Event/QR、Lead Capture、Waitlist。
- 2026-07-13 Portfolio Review 后只选择一个 Family 进入 5-10 页 Pilot Brief；若没有 3 个同族资产的有效 impressions，则继续 Hold。
- 2026-07-03 预审：Event/QR 与 Lead 达到 3 个 query-proven asset 的结构门槛，均为 Conditional Pass；Waitlist 只有 2 个 query-proven asset，保持 Hold。
- 已建立 `seo_pseo_family_prepare_2026-07.md`、`seo_pseo_pilot_manifest_schema_v1.json` 和 `seo_pseo_pilot_quality_gate.md`；这些文件不授权生成或发布 URL。

## 4. Throughput Ramp

| 周期 | 目标 |
|---|---|
| 2026-07-03 至 07-09 | 完成 3 个 Research Topic、最多 1 个 Brief、0-1 个小调 Batch |
| 2026-07-10 至 07-16 | 冻结批次集中复盘；选择 1 个 Editorial Batch 和 1 个 pSEO Prepare Family |
| 2026-07-17 至 07-31 | 在 Gate 通过时完成 2-4 个新/优化资产；决定首批 5-10 页 pSEO 是否发布 |
| 2026-08 起 | 稳定到每月 12-20 个高质量内容动作；通过 Scale Gate 后提高到 20-30 |

## 5. Current Guardrails

- 多语言 SEO 页面继续 Hold；es-419 只是产品 Pilot 优先方向。
- Contact Form 不因高 impressions 低排名继续重写，优先 Authority + 产品 Embed/邮件依赖。
- Typeform Alternatives 不做第二轮全文重写。
- Webhook/Lark 前十排名需先区分官方文档意图。
- QR event intent 含 ticket/check-in 分支；公开内容只能承接 scan-to-fill，不能用“event QR”泛化票务/核销能力。
- Lead AI intent 含 scoring/SDR/outreach；公开内容只能承接 prompt-to-form 与 qualification context 收集。
- Typeform 对外分发必须使用当前真实价格 Free / $19 monthly / $180 yearly / Business custom；禁止 buyout/lifetime/unlimited-free claim。
- Authority 目标修复结论：SaaSHub Go；AlternativeTo Blocked；Formgrid、TinyCommand Reject。只有 SaaSHub Proof Pack 可进入人工提交审核。
- 产品激活 P0-A 的 publish/test submission/result loop 优先级高于扩大 SEO 页面库存。
- U-062 Attribution Gate 通过前，Scale 决策仍只使用 GSC、明确 query ownership 和全站 product facts；`Qualified lead` 显示 N/A，不填 0、不推断。
- pSEO Publish Gate 新增 Attribution Gate：Form 必须持久保存安全的 organic/content source/intent context，并能连接 non-test submission。

## 6. Current Batch and Next Controller Action

当前 Batch：`2026-07-03-R01`。

- Backlog：`seo_growth_production_backlog_2026-07.md`
- Gemini 单一批处理提示词：`gemini_seo_research_batch_prompt_2026-07-03.md`
- Research WIP：0/3；首批已完成，下一批不自动补满
- Brief WIP：1/2；QR Ready，Lead/Waitlist Slot 继续等冻结复盘
- Build WIP：0/1；所有 Gate 仍关闭
- Measurement：U-062 Code/Verify/Deploy 已完成；3-day quality review 结论为 Iterate；internal cohort 待可用登录会话补跑，event-vs-fact discrepancy 待诊断

Codex 下一步：

1. 2026-07-05 读取最新 GSC 7d/28d，决定 QR Brief 是否进入 Build。
2. Typeform Authority：SaaSHub Proof Pack 已 Ready；如需人工提交，由 Mike 单独执行或授权，不自动发送。其他三个候选不推进。
3. 2026-07-08 更新 Webhook/Lark intent 分区。
4. 只有 Evidence、Product、Ownership、Freeze Gate 全部通过才打开 Build Batch。
5. 2026-07-10 至 07-13 按 Backlog 集中完成冻结 Batch Portfolio Decide。
6. U-062 2026-07-07 质量审查已完成：生产 attribution 覆盖与 PII allowlist 通过，但 internal cohort 未补跑，且 publish event 与 Form fact 存在偏差；下一步是用可用登录会话补跑 `internal create -> publish -> test submit excluded -> real submit included`，并诊断 `publish_succeeded` 缺失。
7. QR / Event 内链缺口已形成 Gate-ready action map；只在 07-05 QR Gate 通过后并入 `JUL-P01`，不提前制造第二个 mutation。
