# GenForms SEO Batch 3 产品事实与证据 QA 复核

日期：2026-06-29  
复核角色：产品经理 / Codex  
范围：Service Request & Complaint、Volunteer Application、Vendor & Supplier Registration

## 总体判断

**部分同意 Gemini 的最终方向，但原报告需要修订后才能作为 Architect 输入。**

- 产品方向基本成立：Service Request / Complaint 应收敛为轻量信息收集；Volunteer Application 适合 Template-only；Vendor / Supplier Registration 当前应拒绝。
- SERP 原始文件真实存在，18 个查询均有 HTML、首屏截图、JSON 和 manifest，可以支持 Topic 级方向判断。
- 三份报告关于“标题、URL、摘要 100% 对齐”“截图完整覆盖”的说法不成立。截图均为 756×469 首屏，部分只显示 AI Overview 或广告；JSON 中也存在缺失摘要，以及无法在 HTML 或报告表格中逐项复现的结果。因此不得把具体名次、占比和所谓 100% 完整性作为 Build 决策依据。
- 本轮允许进入的范围仅限一个 Volunteer Application 模板 Architect，以及一个并入现有 Contact Form / Customer Feedback 体系的轻量服务请求模板评估；不允许批量新增 Solution、Use Case 或 Post。

## 产品结论表

| Track | 产品结论 | 必要字段 | 可承诺 | 禁止承诺 | 建议承接 | 产品缺口 | 是否允许进入 Architect |
|---|---|---|---|---|---|---|---|
| A：Service Request / Complaint | **部分支持。** GenForms 能完成轻量服务请求或投诉信息的创建、分享、收集、查看、导出和 Webhook/团队提醒，但不能完成工单处理闭环。该 Track 混入了 `work request form` 等维修/派工意图，不应全部并入 Contact Us。 | 姓名、联系方式、请求/投诉类型、相关产品或服务、问题描述、期望解决方式、首选联系渠道。订单号或客户编号只能可选，且不得索取密码、完整支付信息或身份凭证。 | AI 生成、移动端单题流、公开链接、二维码、提交收集、数据面板、CSV、通用 Webhook、Webhook 日志/重试、Feishu/DingTalk/WeCom/Slack Incoming Webhook 提醒。 | Helpdesk、工单编号/状态、SLA、自动分派、支持邮箱系统、文件上传、自动解决、原生 CRM 同步；不能把 Bot 通知表述为“工单分派”。 | **Merge into existing Topic + Template-only。** 只承接轻量 `support request intake` 或 `customer service request`；并入 Contact Form / Customer Feedback。排除或 Hold `work request`、维修派工与 SLA 意图。 | 文件上传、邮件通知、工单状态、责任人分派、SLA、原生 CRM/Helpdesk。 | **有条件允许。** 仅允许一个模板的精简 Architect；不得新建独立 Solution/Use Case/Post，也不建议一次建立两个近重复模板。 |
| B：Volunteer Application | **已支持核心申请/意向收集任务。** 可完整完成 AI 创建、链接/二维码分享、提交、数据面板、CSV 和 Webhook/团队提醒；不支持排班和名额管理。 | 姓名、Email/电话、感兴趣的岗位或领域、技能/经验、参与动机、一般可参与时间偏好、地点/线上线下偏好、后续联系同意。`availability` 必须表达为偏好，不得表现为可预订时段。 | AI 生成、移动端单题流、公开链接、二维码、提交收集、数据面板、CSV、通用 Webhook、Webhook 日志/重试、支持的团队 Bot 提醒。 | 班次排期、时段锁定、名额限制、背景调查、自动审核/录取、文件上传、电子签名、志愿者管理系统、考勤或证书。紧急联系人、出生日期、健康/无障碍信息、推荐人等敏感字段不得默认启用。 | **Template-only。** 模板应命名为 `Volunteer Application Form` 或 `Volunteer Interest Form`，不建议使用 `volunteer-signup`，因为 signup SERP 更偏排班和 slot capacity。 | 排班、容量限制、文件上传、背景调查、审批、电子签名、自动邮件。 | **允许。** 仅进入一个 Template Architect；不新增 Solution/Use Case/Post。应从 CTA、intent 和 Prompt 中排除 scheduling/slot 承诺。 |
| C：Vendor / Supplier Registration | **当前不支持核心任务。** 虽然可完成普通字段收集与后续 Webhook，但无法完成供应商准入、材料验证、采购审批和财务建档，因此不构成真实承接。 | 若未来只做非敏感供应商意向登记，最多包括企业名称、联系人、服务类别、官网、服务区域和简介。本轮不应建立模板。EIN/TIN、W-9、银行账号、证件、保险/资质文件、签名和支付信息不得默认收集。 | 不应以现有通用表单能力包装成完整 Vendor Registration。只有在未来独立验证“非敏感 vendor interest form”后，才可描述通用创建、分享和提交能力。 | 供应商资质验证、采购审批、文档管理、W-9/证照收集、供应商生命周期、合规认证、ERP/AP/CRM 同步、电子签名、支付或银行资料处理。 | **Reject（当前 MVP）。** 不做 Template、Solution、Use Case 或 Post。`event vendor application` 可能是更轻的独立意图，但必须另做市场验证，不能借本 Track 直接 Build。 | 文件上传、敏感数据安全与合规、审批、电子签名、供应商主数据、ERP/AP 集成、生命周期管理。 | **不允许。** 保持 Reject；未来产品能力和独立市场证据同时具备后再重新 Discover。 |

## 最小资产包

### Track A：轻量服务请求

若进入 Architect，仅建立一个模板资产：

- 建议名称：`Customer Service Request Form` 或 `Support Request Intake Form`
- 建议 intent：`service_request_intake`
- 归属：Contact Form / Customer Feedback
- CTA：直接进入预配置创建路径，继承模板、来源、intent 和场景 Prompt
- Prompt 边界：生成信息收集表单，不生成工单编号、状态、SLA、责任人、附件或自动分派字段
- 不建立独立 SEO 页面；`work request`、维修请求与投诉处理系统意图暂缓

### Track B：志愿者申请

本轮最适合进入 Build 的资产：

- 建议名称：`Volunteer Application Form`
- 建议 intent：`volunteer_application`
- 字段重点：兴趣岗位、技能经验、参与动机和一般时间偏好
- CTA：直接进入预配置模板创建路径
- Prompt 边界：明确为 application/intake，不生成 shift、slot、capacity、background check、approval、attachment 或 signature 能力
- 只建 Template，不建独立 Solution/Use Case/Post

### Track C：供应商注册

不建立最小资产包，不进入 Architect。保留研究记录即可。

## 证据 QA 修订项

1. 三份 Gemini 报告应删除或改写“100% 标题/URL/摘要完全匹配”“截图完整覆盖”的结论。现有截图仅覆盖首屏，且部分页面只显示 AI Overview 或 Sponsored 结果。
2. 报告中的排名表不能视为原始 JSON 的逐行转录。后续若需要引用具体排名或竞品占比，必须重新由 JSON 与 HTML 做逐项核验。
3. Vendor 报告不得声称收集 EIN、W-9 或银行资料本身就会自动触发 Google 钓鱼判定或域名封禁。Google 的相关政策针对欺骗、冒充、诈骗和诱导泄露信息；本 Topic 的拒绝理由应是 GenForms 当前产品与安全能力不足，而非未经证实的必然处罚。
4. Vendor 报告中的“银行资料需要 PCI 级能力”应删除。PCI DSS 针对支付卡持卡人数据和敏感认证数据，不能作为一般银行账号或 W-9 收集的准确合规结论。
5. Volunteer 报告应将 `volunteer-signup` 改为 `volunteer-application` 或 `volunteer-interest`。前者容易把用户预期带向班次、名额和 slot capacity，超出当前能力。

## 最终决策

1. **最佳下一 Build 候选：Volunteer Application Template-only，P0。** 申请/意向收集任务清晰，当前产品可以完成端到端主流程；只需严格避开排班、名额、背景调查和自动审批。
2. **Service Request / Complaint：Merge + Template-only，P1。** 仅承接轻量服务请求 intake，合并到 Contact Form / Customer Feedback；不建立独立营销页，`work request` 等工单/派工意图 Hold。
3. **Vendor / Supplier Registration：Reject，当前不进入路线图。** 核心任务与 MVP 能力差距过大，且涉及敏感资料和采购流程，不应以通用表单能力勉强承接。

## Build Gate

- Volunteer Application：修正命名、字段、Prompt 和禁止承诺后，**允许进入 Template Architect 与 Build**。
- Service Request / Complaint：收敛为单一轻量模板，并明确归属和排除词后，**允许进入 Template Architect；不允许新增独立 SEO 页面**。
- Vendor / Supplier Registration：**不允许进入 Architect 或 Build**。

