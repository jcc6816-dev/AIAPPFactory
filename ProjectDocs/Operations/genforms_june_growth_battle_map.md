# GenForms.ai 2026 年 6 月增长作战地图

> 版本：2026-06-15  
> 状态：ACTIVE  
> 适用周期：2026-06-15 至 2026-06-30  
> 总目标：从“项目开发模式”切换到“业务经营模式”，让 GenForms.ai 围绕流量、激活、转化和运营系统形成可持续增长闭环。  
> 关联文件：
> - `ProjectDocs/Operations/growth_data_operating_system.md`
> - `ProjectDocs/Operations/genforms_product_experience_activation_plan.md`
> - `ProjectDocs/AI-Team/goals/2026-06-growth-goals.md`
> - `ProjectDocs/AI-Team/GEMINI_DAILY_EXECUTION_ROUTINE.md`
> - `ProjectDocs/Operations/user_action_tracker.md`

## 1. 战略判断

GenForms.ai 当前已经不是单纯的“继续开发功能”阶段，而是进入早期经营阶段。

过去一段时间已经完成：

- 核心表单生成、模板、发布、分享、提交、Webhook、后台 Growth Dashboard 等基础能力。
- Google / Bing / sitemap / noindex / metadata / 结构化数据等 SEO 基础治理。
- 首页 Demo、游客创建页、模板页预览、Clarity、GA4、PageSpeed 等体验和数据基础。
- Codex + Gemini + Mike 的 AI-Team 协作机制和发布治理。

因此，后续不能再围绕零散优化点推进，而要用统一经营框架判断每天该做什么。

核心经营链路：

```text
搜索发现
-> 到站点击
-> 看懂价值
-> 体验价值
-> 生成表单
-> 发布表单
-> 获得提交
-> 产生注册 / 付费 / 高质量线索
```

所有任务必须说明自己服务这条链路中的哪一段。

## 2. 四条主线

### 主线 A：搜索增长

目标：让更多高意图用户发现 GenForms.ai，并愿意从搜索结果点击进来。

核心问题：

- Google / Bing 是否能发现我们？
- 哪些页面已经有曝光但没有点击？
- 哪些关键词接近第一页？
- 哪些页面需要补内容、内链或 metadata？
- 是否存在 404、参数页索引、重复标题、description 异常、sitemap 异常？

关键指标：

- GSC / Bing 曝光
- 点击
- CTR
- 平均排名
- 已索引页面数
- 排名 8-30 的高潜关键词
- 高曝光低点击页面
- 404 / noindex / metadata 异常

战术动作：

- 优先优化已有曝光页面的 Title / Description / 首屏 TL;DR / CTA。
- 对排名 11-30 的页面补 FAQ、内链、模板链接、Solution 链接。
- 对新页面执行 3-7 天观察冻结，不频繁重复修改。
- 对参数页、404、Bing metadata 异常当天处理。
- 稳定推进 Blog / Template / Solution / Use Case 内容集群。

验收标准：

- 高潜页面进入前 20 / 前 10。
- 至少出现非品牌或半品牌自然点击。
- 已收录页面持续增加，索引异常下降。
- 高曝光低点击页面 CTR 有改善。

### 主线 B：产品激活

目标：让用户快速发现价值、体验价值，并进入真实创建流程。

核心问题：

- 用户 3 秒内是否知道 GenForms.ai 能帮他做什么？
- 用户是否不登录、不输入也能体验一次价值？
- 首页、Blog、Solution、Template 进入 `/forms/new` 后，是否看到匹配入口的表单？
- 游客是否知道下一步该点哪里？
- 移动端、小桌面和创建页是否阻碍用户体验？

关键指标：

- `demo_start`
- `demo_complete`
- `template_use_click`
- `forms_new_view`
- `template_context_loaded`
- `workspace_preview_ready`
- `form_generate`
- `form_publish`
- `form_submit`
- Clarity 停留时间、dead click、rage click、quickback、滚动深度

战术动作：

- 首页首屏保持免输入体验优先，Suggestions 和 Demo 必须可见。
- `/forms/new` 必须承接来源参数，默认展示匹配模板预览。
- 移动端和 768-1023px 小桌面断点持续用 Clarity 复核。
- 登录、保存、发布、付费限制要后置到价值确认之后。
- 发布页继续强化“测试表单 -> 查看数据”闭环。

验收标准：

- 访问首页后出现 `demo_start`。
- 从模板或内容页进入创建页后出现 `template_context_loaded` 和 `workspace_preview_ready`。
- 出现真实 `form_generate`、`form_publish`、`form_submit`。
- Clarity 中首页短停留和创建页快速退出减少。

### 主线 C：商业转化

目标：让用户理解为什么值得注册、发布、升级和付费。

核心问题：

- 免费版是否足够让用户体验价值？
- 付费墙是否出现在用户已经理解价值之后？
- Pro 的价值是否从“功能限制”转化为“业务收益”？
- 后端是否兜住免费额度、付费权益和管理员边界？
- Pricing、模板、Webhook、OCR、导出、自动化是否形成付费理由？

关键指标：

- 注册用户数
- 创建表单用户数
- 发布表单用户数
- 触达付费墙次数
- Billing Portal 点击
- 购买 / 订阅事件
- 高质量业务线索

战术动作：

- 保持免费版能体验价值，但不能替代 Pro。
- Pricing 文案围绕业务价值：更多表单、更多提交量、去品牌、Webhook、OCR、导出、团队协作、高级主题、数据分析。
- 付费提示优先放在保存、发布、高级自动化、去品牌、额度超限等真实业务节点。
- 定期复核 Pro / Free 后端权限，避免前端提示与后端约束不一致。

验收标准：

- 免费用户能完成体验闭环。
- 发布、Webhook、导出、去品牌等节点能形成升级理由。
- 至少出现付费意图或高质量业务线索。

### 主线 D：运营系统

目标：让 Mike / Codex / Gemini 每天知道该看什么、做什么、谁负责、何时复盘。

核心问题：

- 今天网站表现正常吗？
- 哪条主线掉队？
- 今天最值得做的 1-3 件事是什么？
- Mike、Gemini、Codex 各自应该做什么？
- 哪些任务可以上线，哪些必须观察，哪些不能做？

关键数据源：

- GSC
- Bing Webmaster
- GA4
- Clarity
- PageSpeed
- Admin Growth Dashboard
- 后台注册、表单、提交、付费数据
- `user_action_tracker.md`

战术动作：

- Codex 每日做总判断，不让 Gemini 重复做全局巡检。
- Gemini 读取上下文后执行具体任务或提出候选任务。
- Mike 负责外部账号动作、内容发布、GSC/Bing 请求索引、Cloudflare 等人工操作。
- 所有上线必须经过发布门禁和干净工作区检查。

验收标准：

- 每天有 1-3 个清晰动作。
- 每周至少有 SEO、产品激活、商业转化各一个推进项。
- 任务、报告、复核、上线状态可追踪。
- 不再出现脏发布、旧版本覆盖、未经复核上线。

## 3. 6 月阶段目标

### 阶段 1：稳定基线（6 月 15 日 - 6 月 17 日）

目标：确认网站技术、发布、索引和关键体验不再反复倒退。

重点动作：

- 保持发布基线干净，所有发布通过 `release-preflight.sh`。
- 验证 Bing metadata 修复是否生效。
- 观察 `/forms/new` noindex 治理是否生效。
- 观察首页小桌面断点修复是否改善 Clarity 会话。
- 确认 Admin Growth 的 GSC / GA4 / PageSpeed / Clarity 数据能稳定读取。

验收：

- 生产首页无旧 CTA / 旧徽标回滚。
- Bing 首页 metadata 异常下降或等待刷新。
- GSC 不再新增 `/forms/new?template=...` 类型参数页索引。
- 发布门禁可以在干净工作区通过。

### 阶段 2：搜索点击突破（6 月 18 日 - 6 月 23 日）

目标：从“有曝光”推进到“有点击”。

重点动作：

- 选择 3-5 个已有曝光页面做 CTR 优化，不大规模改稳定文章主体。
- 重点跟踪 Webhook、Typeform alternative、lead magnet、NPS、job application 等高意图词。
- 为排名 11-30 的页面补内链和 FAQ。
- 准备 Bing IndexNow 实现方案，但只对 canonical、有价值页面提交。

验收：

- 至少 1-3 个页面出现自然点击。
- 至少 1 个非品牌或半品牌词进入前 20 或前 10。
- 高曝光低点击页面 CTR 有改善迹象。

### 阶段 3：激活路径突破（6 月 20 日 - 6 月 26 日）

目标：让进入首页、模板页和创建页的用户更快触发产品价值事件。

重点动作：

- 用 Clarity 复核首页、`/forms/new`、移动端、小桌面断点。
- 确认从 Blog / Solution / Template 进入创建页时，模板上下文一致。
- 优化登录拦截、保存、发布、测试提交闭环。
- 如果样本显示创建页流失严重，安排 Gemini 做页面体验专项。

验收：

- 出现或增加 `demo_start`、`workspace_preview_ready`、`form_generate`。
- Clarity 中创建页快速退出减少。
- 至少出现从非 Direct 来源进入创建页的用户。

### 阶段 4：商业闭环准备（6 月 24 日 - 6 月 30 日）

目标：让付费价值和运营能力可以承接后续流量。

重点动作：

- 复核免费 / Pro 权益、后端额度、Billing Portal、Pricing 文案。
- 包装 Pro 价值：Webhook、去品牌、更多提交、导出、自动化、数据洞察。
- 准备首批外部目录 / Product Hunt / 社区发布前检查清单。
- 根据 6 月数据重设 7 月目标。

验收：

- 免费体验路径通畅。
- 付费触发点清楚。
- 至少出现升级意图、支付点击或高质量线索。
- 7 月增长计划有数据依据。

## 4. 每日经营例程

Codex 每天负责总判断，输出：

1. 今日总判断：正常 / 观察 / 风险 / 紧急。
2. 做对了什么：哪些页面、体验或数据有正向信号。
3. 最大问题：今天最阻碍增长或转化的一件事。
4. 今日 1-3 个动作：必须有主线、指标、负责人。
5. Mike 要做什么。
6. Gemini 要做什么。
7. Codex 要复核、部署或继续观察什么。
8. 是否更新 `user_action_tracker.md`。

Gemini 每天不重复做全局巡检。Gemini 只做：

- 执行 Codex / Mike 指派任务。
- 无任务时提出 1-3 个候选任务。
- 完成后写中文执行报告和“给 Codex 的复核摘要”。

Mike 每天优先做：

- 外部账号动作：GSC、Bing、GA4、Cloudflare、Clarity。
- 内容发布和请求索引。
- 产品体验主观判断。
- 付费、定价、商业边界决策。

## 5. 任务准入规则

任何新任务必须回答五个问题：

1. 属于哪条主线？
2. 服务哪个指标或漏斗节点？
3. 证据来自哪里？GSC / GA4 / Clarity / PageSpeed / 后台 / 用户反馈？
4. 预计影响是什么？
5. 是否值得现在做？

不符合以下任一条件的任务，默认不做：

- 不能服务流量、激活、转化或运营系统。
- 没有数据、用户反馈或明确战略理由。
- 只是“看起来可以优化”。
- 会引入高风险发布或大范围重构。
- 与 MVP AI Form Generator 主线无关。

## 6. 分工表

| 角色 | 主要职责 | 不应承担 |
| --- | --- | --- |
| Mike | 最终目标确认、外部账号操作、内容发布、GSC/Bing 请求索引、Cloudflare 操作、产品与商业判断 | 低价值数据搬运、重复检查代码细节 |
| Codex | 增长总指挥、产品架构、商业判断、任务优先级、代码实现/复核、发布治理、每日经营判断 | 只做局部修补、不看全局目标 |
| Gemini | 高吞吐执行、调研、审计、内容草案、低风险代码实现、报告输出 | 自行做全局经营判断、未经授权上线、高风险权限改动 |

## 7. 当前优先级

截至 2026-06-15，优先级如下：

### P0

- 保持生产发布基线干净，避免旧版本覆盖。
- 验证 Bing metadata 修复与首页小桌面修复是否生效。
- 继续观察 GSC 曝光与排名波动，不因单日波动盲目大改页面。
- 确认 `/forms/new` noindex 治理效果。

### P1

- 用 GSC 找 3-5 个有曝光无点击页面做 CTR 优化。
- 用 Clarity 观察首页和 `/forms/new` 是否形成体验闭环。
- 推进 IndexNow，但必须做 canonical URL 过滤。
- 建立 SEO 内容质量台账。

### P2

- 外链与目录提交。
- 中文市场材料。
- Product Hunt 或外部发布准备。

## 8. 复盘节奏

每日：

- 10-20 分钟经营巡检。
- 输出 1-3 个动作。

每周：

- 复盘四条主线是否都有推进。
- 更新 `user_action_tracker.md`。
- 冻结观察已优化页面，不反复修改。

每两周：

- 判断 6 月目标是否需要调整。
- 决定是否进入更大规模外部发布。

月底：

- 输出 6 月增长复盘。
- 制定 7 月目标：流量、激活、商业转化、运营系统。

## 9. 决策原则

GenForms.ai 的增长不靠一次大爆发，而靠每天持续做对高杠杆动作。

后续所有任务必须从商业目标倒推：

```text
更多高意图用户
-> 更多人看懂产品
-> 更多人体验创建
-> 更多人发布表单
-> 更多真实提交
-> 更多注册、付费和高质量线索
```

如果一个任务不能推动这条链路，就不应该占用团队产能。
