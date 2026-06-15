# 决策记录：引入 FAST_TRACK 与规划数据中继

> 日期：2026-06-06
> 状态：PROPOSED
> 提议来源：Gemini
> 复核：Codex

## 1. 背景

Gemini 对团队工作模式提出两条优化建议：

1. 对极小、低风险任务引入 `FAST_TRACK`，避免所有事情都走完整任务流程。
2. 规划 GSC / GA4 数据中继能力，减少 Mike 长期手动搬运数据的负担。

## 2. Codex 判断

两条建议都有价值，但成熟度不同：

- `FAST_TRACK` 可以现在纳入协议，因为它只改变流程，不增加安全暴露面。
- 数据中继涉及外部账号、凭证、权限和隐私，应先进入路线图，不立即实现。

## 3. 当前决策

### `FAST_TRACK`

采纳。

已写入：

- `ProjectDocs/AI-Team/protocol.md`
- `ProjectDocs/AI-Team/team-operating-system.md`

适用范围限制：

- 极低风险。
- Codex 明确授权。
- 不部署。
- 不提交。
- 不碰 secrets。
- 不碰认证、支付、数据库、生产脚本。
- 不修改 SEO 观察冻结页面。

### 数据中继能力

暂不实施，先规划。

已写入：

- `ProjectDocs/AI-Team/roadmap/data-relay-api.md`

原因：

- 需要安全设计。
- 需要 Mike 批准。
- 需要确认 GSC / GA4 API 权限和凭证管理方式。
- 需要先证明数据复盘流程稳定。

## 4. 后续动作

- 如果 Mike 认可，`FAST_TRACK` 从协议 0.4 起生效。
- 数据中继先以本地导出文件汇总和周报模板作为第一阶段。
- 未来如果引入 Data Agent，再重新评估只读数据中继实现。
