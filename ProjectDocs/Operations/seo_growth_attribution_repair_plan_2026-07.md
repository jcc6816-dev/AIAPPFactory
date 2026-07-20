# GenForms SEO Growth Attribution Repair Plan — 2026-07

> 阶段：Implemented / Deployed，3-day quality observation active
> 目标：让 organic click/content source 能可靠连接 create -> publish -> non-test submit，同时避免 PII、双报和内部流量污染。
> 范围：测量与归因；不改变公开 SEO 页面内容，不新增产品功能。

> 执行记录：Mike 于 2026-07-03 确认；Code、测试、构建和受控 PM2 部署已完成。生产 release-state 与 SEO gate 通过。internal cohort 因浏览器无可复用登录会话尚未补跑，因此 Attribution Gate 暂不标记 Pass。

## 1. Planned Files

| File | 作用 |
|---|---|
| `Code/lib/growth.ts` | 建立 30-minute session、first/last non-direct context、search source normalization；继续清理敏感参数 |
| `Code/types/growth-event.d.ts` | 补齐当前实际事件名与 attribution 类型 |
| `Code/types/form.d.ts` | 在 `GenerationMeta` 中增加非 PII `attribution` 结构 |
| `Code/components/forms/form-creation-manager.tsx` | create/publish 请求携带已规范化 attribution context |
| `Code/components/forms/form-generator.tsx` | generate 事件和 generation metadata 使用同一 content source/intent/template context |
| `Code/app/api/forms/route.ts` | 校验 attribution，持久写入 Form；server outcome event 复用同一 context |
| `Code/services/form-artifact.ts` | 保留 attribution，不被 artifact 更新覆盖 |
| `Code/lib/growth-attribution.ts` | 新增纯函数：normalize、expire、merge first/last non-direct、PII allowlist |
| `Code/services/seo-growth-attribution.ts` | 用 Form 与 non-test Submission 计算 create/publish/value-realized cohort，不 sum 同名事件 |
| `Code/app/api/admin/growth/seo-attribution/route.ts` | 中文优先的只读 Admin 汇总 API |
| 对应 `.test.ts` 文件 | 覆盖正常、缺参、过期、内部流量、重复事件、外部依赖/DB 失败 |
| `Code/.env.example` | 只有新增配置时才更新；本方案默认不新增变量 |

## 2. Database Change

Phase 1 不新增表或列：

- attribution 写入现有 `forms.generation_meta_json.attribution`。
- 当前数据量下 JSONB 足够，避免不必要 migration。
- `form_submissions.form_uuid` 连接 value realization。

Phase 2 只有在查询量或 qualified lead workflow 明确后才考虑：

- 独立 attribution fact table / indexed columns。
- `lead_outcomes` 或 CRM sync 状态。

未经产品经理定义 qualified lead criteria，不创建伪 `qualified_lead` event。

## 2.1 Third-party Dependencies

- 不新增 npm package、分析 SDK 或外部数据服务。
- 继续复用现有 GA4、GSC、Supabase、Next.js 和 Growth Event 能力。
- Attribution 失败必须 graceful degradation，不能让第三方分析服务成为产品 create/publish/submit 的可用性依赖。

## 3. API Contract

### POST `/api/forms`

Request 的 `generation` 增加：

```json
{
  "attribution": {
    "channel": "organic_search",
    "search_engine": "google",
    "landing_path": "/use-cases/qr-code-form-builder",
    "content_source": "usecase_qr-code-form-builder",
    "intent": "qr_form",
    "template_id": "event-registration",
    "first_touch_at": "2026-07-03T00:00:00.000Z",
    "last_non_direct_at": "2026-07-03T00:00:00.000Z"
  }
}
```

Rules：

- 只接受 allowlist 字段与受限长度字符串。
- `landing_path` 再次执行 URL param sanitization。
- 不接收 prompt、email、answers、token、完整 referrer query。
- attribution 缺失时 Form 正常创建，状态标记为 unattributed；analytics 不能阻断产品流程。
- Response 结构保持不变。

### GET `/api/admin/growth/seo-attribution`

Query：`from`、`to`、可选 `content_source`、`intent`。

Response：

- organic attributed forms created。
- published creators/forms。
- forms with non-test submission。
- upgrade intent（只有事件有可靠 user attribution 时）。
- unattributed rate、internal exclusion count、data quality warnings。

Admin 中文文案优先；不返回用户邮箱、submission answers 或 prompt。

## 4. Event and Deduplication Rules

- GSC clicks 不由站内事件重建。
- CTA/generate 使用 unique visitor + content source + intent + window 去重。
- Create/publish 以 Form UUID 和数据库状态为准。
- Submit 以 unique non-test submission UUID 为准。
- 客户端 success event 保留 UX 诊断价值，但不得与 server event 相加作为 outcome。
- 事件 payload 增加 client event id 仅作为 Phase 2 候选；Phase 1 无需依赖它计算业务结果。

## 5. Session and Attribution Behavior

- visitor id：长期 first-party id，继续存在本地。
- session id：改为 30 分钟 inactivity expiry；每次事件刷新 last activity。
- first touch：首次 non-direct context，30 天内不被 direct 覆盖。
- last non-direct：新的 campaign/referral/organic context 可以更新。
- content source：优先 URL `source` 参数或明确 CTA metadata。
- channel：来自 UTM/referrer；Google/Bing host 归一化，不把 `google.com.hk` 当新 channel。

## 6. Retry and Failure Strategy

- tracking/storage 失败不阻断 create/publish/submit。
- server attribution validation 失败时删除无效字段并记录 sanitized warning，不返回敏感原文。
- Admin report DB 查询失败返回明确 error，不回退到 GA4 伪装为 product truth。
- recent partition 到数延迟时标记 freshness，不填 0。
- API 不重试产品写入；现有 product request 成功后，业务事实仍由 Form/Submission table 保留。

## 7. Tests

### Unit

- Google/Bing/direct/referral normalization。
- 30-minute session rollover。
- first touch 不被 direct 覆盖，last non-direct 可更新。
- prompt/email/token/answer 不进入 attribution。
- URL `source/intent/template` 正确映射。
- missing context 返回 unattributed，不抛错。

### API

- 正常 attribution 创建 Form。
- 缺失/错误 attribution 仍创建 Form，但不保存非法字段。
- DB 失败返回现有错误语义。
- Admin API 排除 internal/test，按 Form UUID 去重。

### Integration / Manual

1. 从带 `source/intent/template` 的 SEO CTA 进入 `/forms/new`。
2. generate、publish、test submit、view first result。
3. 检查 Form JSON 只含安全 attribution。
4. 检查 Admin report 计 1 create、1 publish、0 real submit。
5. 用另一浏览器公开提交，检查变为 1 value-realized form。
6. 验证客户端/server 双报不会把 create/publish/submit 计为 2。

## 8. Risks

- Local storage attribution 可被用户清理：允许 unattributed，不做 fingerprinting。
- Search referrer 可能缺失：GSC clicks 仍是搜索 source of truth。
- JSONB attribution 查询未来可能变慢：规模增长后再迁移 indexed columns。
- Internal staff 仍可能从公网访问：需要 user allowlist / admin path / dev flag 联合过滤。
- qualified lead 如果定义过早，会把试用或普通 submission 错当商机；继续 Hold。

## 9. Release Gate

进入 Code 前需 Mike 确认本 Plan。实现后必须：

- 全部相关 unit/API tests 通过。
- `npm run build` 通过。
- 受控部署后完成一条 internal test cohort，不混入 external KPI。
- 观察 3 天 unknown attribution、duplicate outcome、API error。
- 通过后才允许 pSEO Pilot 使用 publish/submit outcome 做 Scale 决策。
