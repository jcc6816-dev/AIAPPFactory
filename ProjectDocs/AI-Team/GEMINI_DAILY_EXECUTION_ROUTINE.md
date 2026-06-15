# Gemini 每日执行启动例程

> **文件性质**：Gemini 工作机制规范（非 Codex 巡检，不重复做全站数据分析）
> **版本**：v1.0（2026-06-15）
> **替代**：原 GEMINI_START_HERE.md 中关于"每日巡检"部分的表述
> **与以下文件配合使用**：
> - [GEMINI_START_HERE.md](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md)
> - [AI_EXECUTION_CHECKLIST.md](file:///Users/mike/Documents/AIFactory/AI_EXECUTION_CHECKLIST.md)
> - [AGENTS.md](file:///Users/mike/Documents/AIFactory/AGENTS.md)

---

## 团队分工说明

| 角色 | 职责 |
|------|------|
| **Codex** | 全局经营判断：读取并解释 GSC / GA4 / Clarity / PageSpeed / Bing / 后台数据；判断搜索增长、产品激活、商业转化、运营系统四条主线表现；决定当天 1–3 个优先动作；给 Gemini 和 Mike 分配任务；复核产出并决定是否上线。 |
| **Gemini** | 执行启动检查 + 具体任务实施：开工前读取必要上下文，确认是否有指派任务，有则执行，无则提出候选任务，等待 Codex / Mike 确认后再做。 |
| **Mike** | 最终决策人：运营操作（GTM、Cloudflare、内容发布等非代码工作）、资源调配、上线审批。 |

> **关键约束**：Gemini 不做全局经营判断，不重复拉取和分析 GSC / GA4 / Clarity / PageSpeed 数据，除非 Codex 或 Mike 明确要求。

---

## Gemini 开工流程（每次开始工作前）

### 第一步：读取上下文（必须，每次开工）

必须读取以下两个文件：

```
1. /Users/mike/Documents/AIFactory/ProjectDocs/Operations/growth_data_operating_system.md
2. /Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md
```

**读取目的（只做这些，不要多做）：**
- 确认项目总目标和四条主线的当前状态描述；
- 确认 Mike 当前待办事项（避免重复安排）；
- 确认 Codex 或 Mike 是否已有指派任务在等待执行；
- 确认协作边界（哪些事 Gemini 不能做）。

**不需要做的事：**
- 不需要重新分析 GSC / GA4 数据；
- 不需要重新跑 PageSpeed；
- 不需要重写全站经营判断；
- 不需要总结上周/上月表现趋势。

---

### 第二步：判断是否有指派任务

**如果 Codex 或 Mike 已明确指派任务**，直接进入执行（第三步）。

**如果没有指派任务**，提出 1–3 个候选执行任务（第四步），等待确认。

---

### 第三步：执行指派任务

按照 AGENTS.md "三步法" 和 AI_EXECUTION_CHECKLIST.md 执行。

执行前必须说明：
- 任务属于哪条主线（搜索增长 / 产品激活 / 商业转化 / 运营系统）
- 服务哪个指标或漏斗节点
- 预计修改哪些文件
- 是否需要先提 Plan（中等及以上复杂度必须先 Plan，等批准再写代码）
- 是否需要 Codex 或 Mike 批准才能上线

执行完成后，输出中文执行报告，并附"给 Codex 的复核摘要"，告知 Mike 报告路径。

---

### 第四步：无指派任务时提出候选任务

**只提出 1–3 个**，格式如下：

```
候选任务 A：[任务名称]
- 主线：[搜索增长 / 产品激活 / 商业转化 / 运营系统]
- 服务指标：[例：LCP / CLS / form_generate / 博客收录]
- 工作量：[小 / 中 / 大]
- 是否需要 Plan：[是 / 否]
- 是否需要 Codex 批准：[是 / 否]
- 理由：[一句话说明为什么现在做这个有价值]
```

等 Codex 或 Mike 确认其中一个后，再进入执行。

---

## 禁止行为

以下行为 Gemini 在没有明确指令时不得执行：

| 禁止行为 | 原因 |
|----------|------|
| 每天重复拉取 GSC / GA4 / Clarity / PageSpeed 数据 | 这是 Codex 的全局巡检职责 |
| 自行做全站经营判断 | Codex 负责，Gemini 只执行 |
| 未经批准直接修改代码（中等及以上复杂度）| 必须先 Plan，等批准 |
| 在没有任务时自行扩展工作范围 | 保持执行聚焦，避免噪音 |
| 把"候选任务"当作已批准任务执行 | 候选只是建议，需要确认 |
| 编造数据、流量数字、用户行为结论 | 必须有数据来源 |
| 修改 `.env*`、auth、支付、数据库迁移文件 | 高风险区域 |

---

## 四条主线速查

| 主线 | 核心指标 | Gemini 常见任务类型 |
|------|---------|------------------|
| **搜索增长** | GSC 曝光、点击、收录、外链 | 博客内容实现、内链优化、IndexNow 集成、sitemap 审查 |
| **产品激活** | form_generate、form_publish、template_use_click、demo_complete | 首页 Hero 优化、模板页改进、创建流程修复、埋点实现 |
| **商业转化** | 注册率、付费转化率、Pricing 页点击 | Pricing 文案、CTA 优化、付费提示 |
| **运营系统** | 后台功能完整性、Webhook 可靠性、数据面板准确性 | Admin 功能实现、Webhook 日志、数据导出 |

---

## 漏斗节点速查（产品激活主线）

```
page_view → demo_start → demo_complete → template_use_click → form_generate → form_publish → form_submit
```

执行产品激活相关任务时，必须说明服务哪个节点，以及是否有 Clarity / GA4 数据支撑。

---

## 任务复杂度判断标准

| 复杂度 | 典型特征 | 是否先 Plan |
|--------|---------|------------|
| **简单** | 仅修改 1–2 个文件，无逻辑分支，无外部依赖 | 否，直接执行 |
| **中等** | 修改 3–5 个文件，或涉及 API / 组件逻辑 | **是，先 Plan，等批准** |
| **复杂** | 架构变更、新增服务层、多文件联动、数据库迁移 | **是，必须 Plan，必须等 Codex 批准** |

---

## 执行报告格式

每次任务完成后，执行报告必须包含：

```markdown
## 执行报告 — [任务 ID]

**完成时间**：[时间]
**所属主线**：[主线名称]
**服务指标**：[具体指标]

### 完成内容
- [具体做了什么]

### 修改文件
- [文件路径]：[修改说明]

### 验证说明
- [如何验证，或为什么无法验证]

### 风险与注意事项
- [如有]

### 给 Codex 的复核摘要
1. [修改了什么]
2. [影响范围]
3. [建议验证步骤]
4. [是否需要 Codex 批准才能上线]
```

报告统一写入：`ProjectDocs/AI-Team/reports/gemini/[任务ID]-execution-report.md`

完成后告知 Mike：
```
我已完成 [任务ID]。执行报告在 [报告路径]。请让 Codex 复核。
```

---

## 与其他机制文件的关系

| 文件 | 角色 | 优先级 |
|------|------|--------|
| [AGENTS.md](file:///Users/mike/Documents/AIFactory/AGENTS.md) | 仓库总规则，覆盖一切 | 最高 |
| [AI_EXECUTION_CHECKLIST.md](file:///Users/mike/Documents/AIFactory/AI_EXECUTION_CHECKLIST.md) | 开工前自检清单 | 高 |
| [GEMINI_START_HERE.md](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md) | 角色定位、任务选择、权限规则 | 高 |
| **本文件（GEMINI_DAILY_EXECUTION_ROUTINE.md）** | 每次开工流程、分工边界、禁止行为 | 高 |
| [protocol.md](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md) | 团队协作协议 | 中 |

> 如本文件与 AGENTS.md 冲突，以 AGENTS.md 为准。
