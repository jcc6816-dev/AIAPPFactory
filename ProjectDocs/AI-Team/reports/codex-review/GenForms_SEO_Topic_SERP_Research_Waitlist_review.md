# Codex Review: Waitlist Form Topic Discover / Validate

> 复核日期：2026-06-27  
> 原报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Waitlist.md`  
> 原始证据：`SEOData/serp_raw/waitlist_batch/`  
> 最终判断：证据可用，报告需带修正使用。

## 1. 最终决策

**Enter Architect as Lead Capture subcluster**。

Waitlist 不应新建一个与 Lead Capture 平级的顶层 Pillar，也不应被简单合并成 Lead Capture 页面里的几个关键词。正确结构是：

- Lead Capture 是母 Topic；
- Waitlist 是有独立搜索意图、现有页面和 GSC 信号的子集群；
- 保留现有 Waitlist Use Case、Template 和 Post；
- 不创建 Gemini 报告建议的重复 URL；
- Architect 阶段只明确页面分工、内链和创建 intent。

## 2. 数据质量验收

### 2.1 通过项

- 7 个关键词均有独立 Google HTML、PNG 和结构化 JSON。
- HTML 标题、Google Search DOM、`gl=us&hl=en&pws=0` 查询 URL 和 `country_name=United States` 证据一致。
- 未发现 CAPTCHA 挑战页替代真实 SERP 的情况。
- JSON 中 URL、标题和主要排名与 HTML 可抽样对上。
- 7 个关键词均获得可用于方向判断的自然结果样本。

### 2.2 数据限制

| 问题 | 证据 | 影响 | 严重度 |
|---|---|---|---|
| 并非每个词都有 Top 10 | JSON 共 59 条；结果数依次为 10、8、9、8、8、8、8 | 不应写成 70/70 或“完整 Top 10” | 中 |
| 截图不是完整 SERP | 7 张 PNG 均为 756×469，只覆盖首屏；多张只显示 Sponsored 区域 | 截图只能证明页面/查询环境，不能独立复核全部自然结果 | 中 |
| 缺少 CTA 字段 | JSON 每条结果没有 `cta_path`，任务要求的字段为 0/59 | 竞品转化判断只能依赖报告中的少量人工样本 | 中 |
| Snippet 不完整 | 16/59 条为 `(No snippet captured)` | 不影响 URL/页面类型主判断，但削弱摘要角度分析 | 低 |
| 地区证据未单独记录出口 IP | 报告只记录参数与“美国出口”声明 | `gl=us` 和 Google DOM 支持 US 定向，但无法独立证明物理 IP | 低 |

因此，数据适合做 Topic 方向决策，但不适合声称“7 个词完整 Top 10 + 完整竞品 CTA 数据”。

## 3. 报告推理问题

### 3.1 重型 waitlist software 被高估

59 条结果中：

- template：28；
- product：20；
- guide：8；
- community：2；
- video：1。

明确以 referral、leaderboard、viral loop 为核心的专用域名主要是 Waitlister、LaunchList、KickoffLabs 和 Waitlistr，约占全部样本的少数，而不是 `waitlist form`、`waitlist form template` 和 `free waitlist form` 的主导意图。

重型能力在 `startup waitlist form` 和 `AI waitlist form builder` 中更强，但不能据此推导所有 Waitlist 用户都有“极其强烈”的 referral/排名预期。

### 3.2 若干声明没有原始证据

- 报告列出的 PAA 和 Related Searches 文案未出现在保存的 HTML 或 JSON 中。
- `free waitlist form` 段落称 Tally 排名很好，但该关键词保存的结果中没有 Tally。
- “满足 80% 极简表单用户”没有计算依据。
- “高颜值单题流具有更高转化率”缺少 GenForms 实验或行业数据，不应作为事实承诺。

这些内容不能进入后续 Brief 的事实层。

### 3.3 新 URL 建议会制造重复页面

拒绝以下建议 URL：

- `/solutions/lead-capture/waitlist-form`
- `/solutions/lead-capture/waitlist-builder`
- `/templates/free-waitlist-form`
- `/use-cases/startup-waitlist-form`
- `/use-cases/product-waitlist-form`
- `/ai-generator/waitlist-form`

原因：现有 `/use-cases/waitlist-form-builder-indie-hackers` 与 `/templates/waitlist` 已能承接主要意图。现在拆多个近义页面会造成 cannibalization、doorway 风险和产品承诺分裂。

## 4. GSC 交叉验证

最新可用 snapshot：2026-06-25。

| Window | Asset / Query | Impressions | Clicks | Avg position | 判断 |
|---|---|---:|---:|---:|---|
| 28d | `/use-cases/waitlist-form-builder-indie-hackers` | 36 | 0 | 25.0 | 已有 Golden Tuning 区信号，证明独立子意图存在 |
| 28d | `/posts/waitlist-form-demand-validation` | 20 | 0 | 10.0 | 已有前 10 小样本，应保护标题/正文 |
| 28d | `/templates/waitlist` | 8 | 0 | 71.1 | 模板意图已被发现，但权重较弱 |
| 28d | `create waitlist` | 1 | 0 | 12.0 | 极小样本，方向正确但不能据此改 title |
| 7d | `/posts/waitlist-form-demand-validation` | 7 | 0 | 15.7 | 仍有可见区信号 |
| 7d | `/templates/waitlist` | 7 | 0 | 80.3 | 需要集群内链，不是 CTR rescue |
| 7d | `/use-cases/waitlist-form-builder-indie-hackers` | 6 | 0 | 57.7 | 短窗口波动大，不能只看 7d 否定 28d 信号 |

GSC 说明 Waitlist 已经是一个可识别的子主题，不应只留在 Topic Universe，也不需要新建页面来验证。

## 5. 修正后的关键词决策

| Keyword | Verdict | Priority | Target URL | Page type | 边界 |
|---|---|---|---|---|---|
| `waitlist form` | 部分同意 | P2 | 现有 Use Case / Template | 混合意图 | 不强打大学候补、线下排队系统 |
| `waitlist form builder` | 同意进入子集群 | P1 | `/use-cases/waitlist-form-builder-indie-hackers` | Use Case | 不承诺 referral、ranking、email campaign |
| `waitlist form template` | 同意进入主线 | P0 | `/templates/waitlist` | Template | 不新建 free 模板 URL |
| `free waitlist form` | 部分同意 | P1/P2 | `/templates/waitlist` | Template | 只写真实免费额度，不写 unlimited free |
| `startup waitlist form` | 部分同意 | P1 | 现有 Waitlist Use Case | Use Case | 定位 pre-launch signup，不定位 viral software |
| `product waitlist form` | 部分同意 | P2 | 现有 Waitlist Use Case / Post | Use Case / Post | 不承诺缺货通知和电商自动化 |
| `AI waitlist form builder` | 同意进入子集群 | P1 | 现有 Waitlist Use Case | Use Case | 主打 AI 建表，不承诺专用 waitlist automation |

没有第三方搜索量数据，因此优先级代表产品契合度和 SERP 机会，不代表绝对搜索量。

## 6. 资产架构

| Layer | Existing asset | Role | Architect action |
|---|---|---|---|
| Parent Pillar | `/use-cases/ai-lead-capture-form-builder` | Lead Capture 母 Topic | 内链到 Waitlist 子场景，不抢模板词 |
| Waitlist Sub-Pillar | `/use-cases/waitlist-form-builder-indie-hackers` | builder / startup / AI waitlist 承接 | 保留 URL；复核首屏、字段、边界和 `waitlist` intent |
| Template | `/templates/waitlist` | waitlist form template / free template | 接受 Use Case/Post 内链，不新建重复模板 |
| Support Post | `/posts/waitlist-form-demand-validation` | demand validation 教程 | 已有排名，保护 title/meta/正文；接入 Topic Cluster |
| Technical support | `/use-cases/webhook-form-builder-retry-logs` | 提交后的 webhook 路径 | 只作为高级后续，不做首屏主卖点 |

## 7. 进入 Architect 的条件与范围

下一 Goal 可以进入 Architect，但范围必须限定为：

1. 不新建 URL。
2. 把 `waitlist-form-demand-validation` 替换为 Waitlist Cluster 的首要支撑 Post。
3. 为 Waitlist Use Case 增加明确的 `intent=waitlist` 创建上下文。
4. 检查 Parent Pillar、Sub-Pillar、Template、Post 的双向内链。
5. 保持 referral、leaderboard、邀请码、邮件 campaign、custom domain、embed、spam protection、CRM native sync、unlimited free 为红线。
6. 不改已有前 10 小样本 Post 的 title/meta/正文。
7. Architect 完成后再决定是否需要很小的 Build；不得因为本报告直接发布新页面。

## 8. 验收结论

- 原始 Google SERP：**通过，带完整性 caveat**。
- Gemini 报告：**Needs revision / 可作为方向材料，不可原样进入 Brief**。
- Topic 决策：**Enter Architect as Lead Capture subcluster**。
- Active Build：**暂不启动，先完成 Architect Brief**。
