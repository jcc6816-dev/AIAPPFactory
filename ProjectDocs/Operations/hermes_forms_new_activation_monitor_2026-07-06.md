# Hermes 任务：/forms/new 激活证据链 24 小时监控

> 任务日期：2026-07-06  
> 负责人建议：Hermes Agent  
> 上线版本：G1 `/forms/new` 主动作埋点与游客登录承接实验  
> 目标：用真实外部访客行为判断“模板 preview 后的主动作是否清楚”，而不是凭感觉继续改页面。

## 监控目标

过去 24 小时内，按访客和 session 维度观察 `/forms/new` 激活链路：

1. `forms_new_view`
2. `template_context_loaded`
3. `workspace_preview_ready`
4. `forms_new_primary_action_viewed`
5. `forms_new_primary_action_clicked`
6. `guest_login_intent_started`
7. `guest_login_prompt_shown`
8. `guest_login_intent_returned`
9. `form_created`

## 重点筛选

优先看这些外部高意向 session：

- `path` 包含 `/forms/new`
- `template_id` 不为空且不是 `scratch`
- `metadata_json.is_dev != true`
- 排除明显内部 source，例如 `internal_*`、`deploy_check`、`codex_verify`、`playwright`、`hermes_test`
- Codex / Antigravity / Hermes 做生产验收时，URL 或事件来源必须带内部测试标记，例如 `source=codex_verify`
- 排除 raw IP、本机、测试路径

## 输出格式

每天输出一段中文摘要：

```text
/forms/new 激活监控（YYYY-MM-DD）

1. 数据新鲜度：
- 最新事件时间：
- 统计窗口：

2. 外部高意向样本：
- forms_new_view：
- workspace_preview_ready：
- primary_action_viewed：
- primary_action_clicked：
- guest_login_intent_started：
- guest_login_intent_returned：
- form_created：

3. 判断：
- Pass / Iterate / Stop
- 证据：

3.1 Activation Sample 来源拆分（如有）：
- `activation_sample_*` sessions：
- 各 `content_source` 的 CTA viewed / clicked / login intent / form_created：
- 是否有单一来源反复触发 Iterate：

4. 需要 Codex 介入的事项：
- 仅当出现重复物理 bug、事件断链、或 >=3 个合格访客看到 preview 但不点击主动作时触发。
```

## 判定规则

### Pass

出现至少 1 个外部高意向访客完成：

`workspace_preview_ready -> forms_new_primary_action_clicked -> guest_login_intent_started`

或：

`workspace_preview_ready -> forms_new_primary_action_clicked -> form_created`

### Iterate

满足任一条件：

- >=3 个外部高意向访客触发 `forms_new_primary_action_viewed`，但没有点击 `forms_new_primary_action_clicked`；
- >=2 个访客触发 `guest_login_intent_started`，但没有 `guest_login_intent_returned`；
- 新增事件缺失，导致链路无法判断。

### Stop / Hotfix

满足任一条件：

- `/forms/new` 生产 5xx、重复 404、核心 CTA 不可点击；
- `workspace_preview_ready` 后页面崩溃；
- 登录弹窗无法打开；
- `form_created` 服务端事件异常下降且可复现。

## 注意事项

- 不要把 BetaList、机器人、内部验收、`deploy_check`、`codex_verify`、`playwright`、`hermes_test` 混入外部转化判断。
- 对 `activation_sample_*` 来源单独标记，但不要排除；这是当前小样本验证的核心来源。
- 不要根据单个 1 秒 session 做产品结论。
- 不要因为没有 `ai_generate_submitted` 就判断 AI 生成失败；这只能说明用户没有进入生成提交阶段。
- 如果 Clarity 与增长事件冲突，先检查统计口径和时间窗口。

## 告警处理 SOP

当 Hermes 通过飞书发出 `/forms/new` 激活告警时：

1. 先判断是否为内部测试窗口：如果 30 分钟内 Codex、Antigravity、Mike 正在生产验收，且告警只表现为 `cta=0/N`，先标记为“测试流量疑似误触发”，不要立刻改页面。
2. 如果告警连续 2 次出现，或 Mike 没有进行生产验收，再交给 Codex 复盘：
   - 最近 qualified sessions 是否排除了内部测试；
   - CTA 是否可见、可点；
   - 点击后是否进入登录/创建路径；
   - 登录返回是否丢上下文。
3. 只有当排除测试流量后仍满足 Iterate 条件，才进入产品修复讨论。
4. 5xx、404、CTA 不可点击、登录弹窗打不开属于 Hotfix，不等第二次告警。
