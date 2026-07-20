# Lead Capture Topic Validate / Decide

> 日期：2026-06-27  
> Loop 阶段：Validate / Decide -> Architect / Build -> Ship / Observe  
> 数据截止：GSC snapshot 2026-06-25  
> 结论：进入独立 Topic Cluster，不再重复做泛关键词研究。

## 1. 决策摘要

Lead Capture 已同时满足市场、Google 和产品三层验证：

- Google US SERP 已覆盖 5 个核心词，`lead capture form builder` 与 `lead capture form template` 均为明确产品/模板意图。
- GSC 已出现 `lead form ai`、`lead capture forms`、`lead generation form builder`、`lead capture templates` 等真实 query。
- GenForms 已具备 AI 生成、公开链接、二维码、提交面板、CSV、Webhook 日志与重试的完整轻量承接路径。
- 现有 Use Case、Template、Solution 和两篇 Post 已形成资产基础，不需要再新建一个同义 Pillar。

当前瓶颈不是“有没有这个 Topic”，而是资产角色不清、Pillar 与支撑 Post 没有形成稳定内链，以及 Post 创建入口缺少明确的 `lead_capture` 上下文。

## 2. 证据

### 2.1 Google US SERP

来源：`AI-TASK-2026-006-038-google-serp-keyword-batch-final-zh.md`。

| Keyword | SERP 意图 | 决策 |
|---|---|---|
| `lead capture form builder` | 产品工具 + 对比 | P0，Pillar 主词 |
| `lead capture form template` | 模板下载/直接使用 | P0，Template 主词 |
| `AI lead capture form builder` | 产品、教程、免费工具混合 | P1，Pillar AI 差异化词 |
| `lead generation form builder` | 产品 + 教程 | P1，并入 Pillar/支撑 Post |
| `SaaS lead capture form` | 对比、列表、营销方法混合 | P2，由 Solution/Post 承接，不单独建 Pillar |

### 2.2 GSC 真实信号

近 7 天 query：

| Query | Impressions | Clicks | Avg position | 判断 |
|---|---:|---:|---:|---|
| `lead form ai` | 10 | 0 | 18.8 | Golden Tuning 信号，但需 query+page 维度确认归属 |
| `lead capture forms` | 3 | 0 | 84.0 | 已被识别，Authority Needed |
| `lead generation form builder` | 3 | 0 | 81.7 | 已被识别，Authority Needed |
| `create lead capture forms` | 2 | 0 | 79.0 | 任务意图清晰 |
| `lead capture form` | 2 | 0 | 82.5 | 主词仍在早期测试 |
| `lead capture templates` | 1 | 0 | 57.0 | Template 已获得初始信号 |

近 7 天页面：

| URL | Impressions | Clicks | Avg position | 角色判断 |
|---|---:|---:|---:|---|
| `/use-cases/ai-lead-capture-form-builder` | 26 | 0 | 49.3 | Pillar，Authority Needed |
| `/templates/lead-capture` | 14 | 0 | 80.1 | Template，需集群输血 |
| `/solutions/saas-lead-capture-form-builder` | 9 | 0 | 77.8 | SaaS 场景承接，不抢泛主词 |
| `/posts/ai-lead-capture-form-builder-saas` | 4 | 0 | 7.0 | 已有前 10 小样本，冻结 title/meta/正文 |
| `/posts/saas-lead-capture-form` | 2 | 0 | 3.5 | 已有前 10 小样本，冻结 title/meta/正文 |

限制：当前快照把 query 和 page 分开保存，无法证明 `lead form ai` 具体由哪一个 URL 获得。后续监控应补 query+page 组合维度，避免误判页面归属。

## 3. Topic 资产架构

| 资产 | URL | 唯一职责 | 当前动作 |
|---|---|---|---|
| Pillar Use Case | `/use-cases/ai-lead-capture-form-builder` | 承接 `lead capture form builder`、`AI lead capture form builder`，进入创建 | 保留正文；接入两篇支撑 Post |
| Template | `/templates/lead-capture` | 承接 `lead capture form template`，直接使用模板 | 先接受集群内链，暂不重写 |
| SaaS Solution | `/solutions/saas-lead-capture-form-builder` | 承接 SaaS 团队、字段与工作流场景 | 保持场景化，不抢 Pillar 泛词 |
| Educational Post | `/posts/ai-lead-capture-form-builder-saas` | 解释 AI 生成、单题流、Webhook 与适用边界 | 加入 Topic Cluster；正文冻结 |
| Workflow Post | `/posts/saas-lead-capture-form` | 解释字段、资格判断、提交后跟进 | 加入 Topic Cluster；正文冻结 |

不新增第三个同义的 `lead capture form builder` 页面，也不把每个近义词拆成独立页。

## 4. 产品事实边界

可以明确承诺：

- AI 生成线索表单
- 单题流填写体验
- 公开分享链接与二维码
- 提交收集、数据面板、CSV 导出
- 通用 Webhook、日志、失败重试
- Feishu / DingTalk / WeCom / Slack Bot 后续路径

不能承诺：

- HubSpot / Salesforce 原生同步
- AI SDR 或自动销售跟进
- 生产级邮件自动化
- spam protection
- iframe / HTML embed
- unlimited free

## 5. 本轮 Build 范围

只做三个可归因动作：

1. Lead Capture Pillar 的 Related guides 优先展示两篇真实 Lead Post。
2. 两篇 Post 的侧边创建入口统一为 `template=lead-capture`、`intent=lead_capture`，并保留独立 source。
3. 更新 Topic Loop、页面观察和核心关键词台账。

本轮不改 title、meta、正文、slug、canonical，也不创建新页面。

## 6. 观察与下一状态

本轮 Build 已于 2026-06-27 部署生产，定向测试、Next.js 构建、发布前门禁、PM2 部署与源站检查均通过。当前进入 `Ship / Observe`：

- 冻结 7-14 天。
- 观察 Pillar、Template、Solution、两篇 Post 的 impressions、clicks、position。
- 观察 `forms_new_view`、`template_context_loaded`、`ai_generate_submitted`、`form_publish` 中的 `lead_capture` source/intent。
- 如果 Pillar 进入 11-30 且 impressions 稳定，再进入 Golden Tuning。
- 如果两篇 Post 持续前 10 而 Pillar 不动，优先增加指向 Pillar 的正文内链或外链，不先重写 Post。
- `lead capture form template` 有稳定 query 后，再单独启动 Template Page 优化 Goal。

## 7. 下一批 Topic Research

Lead Capture 完成本轮 Build 后，Active Research 不再占用它。下一项 SERP Research 应回到尚未验证的 Topic，例如 Beta / Product Feedback；Lead Capture 转入观察，不重复研究。
