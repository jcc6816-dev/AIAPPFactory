# GenForms.ai AI 团队工作区

> 版本：0.2
> 负责人：Codex
> 第一执行 Agent：Gemini
> 用途：通过可审计的文件协作机制，协调 Codex、Gemini 以及未来更多 AI Agent。

## 为什么需要这个工作区

GenForms.ai 已经不再是单点开发任务，而是同时存在产品稳定性、SEO 增长、内容质量、数据埋点、后台运营、生产部署和商业化路径等多条工作线。

如果多个 AI 工具直接各做各的，很容易出现：

- 目标不一致。
- 任务边界不清。
- 重复修改同一页面。
- 没有验收就进入生产。
- 事后无法追踪是谁做了什么。

因此，本工作区用于让 Codex 负责规划和复核，让 Gemini 等执行 Agent 读取明确任务、输出中文报告，并由 Codex 统一验收。

## 目录结构

```text
ProjectDocs/AI-Team/
  README.md
  protocol.md
  team-operating-system.md
  team-board.md
  goals/          # 团队共同认可的目标
  roadmap/        # 从目标拆解出的路线图
  sprints/        # 周 周计划 计划
  decisions/      # 重要决策记录
  metrics/        # GSC / GA4 / 产品数据基线与复盘
  risks/          # 风险清单与缓解措施
  tasks/
    backlog/      # Gemini 或其他 Agent 提出的 PROPOSED 候选任务
    active/       # Codex 分配给 Gemini 的任务
    submitted/    # Gemini 提交后的任务归档区
    completed/    # Codex 复核通过后的任务归档区
    rejected/     # Codex 驳回后需要返工的任务
  reports/
    gemini/       # Gemini 中文执行报告
    codex-review/ # Codex 中文复核报告
  templates/
    task-说明.md
    execution-report.zh.md
    review-report.md
```

## 当前基本规则

- 重大目标不是 Codex 写出来就自动生效，必须经过 Mike、Codex 和对应执行 Agent 共同认可。
- Codex 负责任务规划、范围控制、复核和最终验收。
- Gemini 只能执行任务文件允许的范围。
- Gemini 必须输出中文执行报告。
- Codex 必须输出中文复核报告。
- Gemini 完成报告不代表任务完成，只有 Codex 标记 `REVIEW_PASSED` 才算通过。
- Gemini 可以提出 `PROPOSED` 候选任务并写入 `tasks/backlog/`，但不能自行激活或执行。
- Gemini 可以在任务明确授权时获得更细粒度权限，例如 `CODE_READ_SCOPED`、`CONTENT_WRITE_SCOPED`、`SANDBOX_VERIFY`，但必须严格按任务列出的文件和命令执行。
- Codex token 受限时，Mike 可以临时激活低风险文档或审计任务；高风险任务仍必须等待 Codex。
- 任何代码提交、生产部署、敏感数据访问、付费/认证/数据库相关修改，都必须经过 Codex 复核和必要的人类确认。

## 团队操作系统

团队工作方式定义在：

- `team-operating-system.md`

当 Codex 因 token、上下文或时间限制进入低可用状态时，临时协作方式定义在：

- `operations/codex-limited-mode-playbook.md`

当前 6 月增长目标草案：

- `goals/2026-06-growth-goals.md`

当前周 周计划 草案：

- `sprints/2026-06-06-weekly-sprint.md`

任何新任务都应该能追溯到一个目标、里程碑、周计划 或决策记录，避免回到“想到哪做到哪”的零散状态。

## 当前试点

第一轮试点任务包括：

1. 待发布博客 SEO 审计。
2. GSC 数据机会总结。
3. User Center 产品价值审计。
4. 外部目录提交材料审计。
5. 博客发布与索引检查清单。
6. SEO 选题优先级审计。
7. 内链内容簇审计。
8. GA4 / Growth 事件体系审计。
9. 首页激活路径审计。
10. AI-Team 协议复盘。
11. 团队目标共识审计。

这些任务优先以 `REPORT_ONLY` 方式执行，目的是先验证协作机制，再进入实现、测试和部署阶段。
