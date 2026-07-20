# Codex Review: Client Intake / Project Request + Quote Request

> 复核日期：2026-06-27  
> Track A 报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Client_Intake_Project_Request.md`  
> Track B 报告：`ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Quote_Request.md`

## 1. 总体判断

| Track | 数据质量 | 报告质量 | 修正后决策 |
|---|---|---|---|
| Client Intake / Project Request | 可用于方向判断，不能称 100% 完整 | Share with caveats / Needs wording revision | 泛词继续保留 Topic Universe；保护现有 Web Design 子场景，不马上扩 Creative Agency / Consulting 页面 |
| Quote Request | 可用于 Architect，需排除错误 URL 与混合词 | Share with caveats | Enter Architect as Lead Capture subcluster，仅承接在线询价需求收集，不承接自动报价 |

## 2. 数据质量验收

### 2.1 通过项

- 12 个关键词均有独立 Google HTML、PNG 和结构化 JSON。
- HTML title、Google Search DOM、`gl=us&hl=en&pws=0` 与报告环境一致。
- 未发现 CAPTCHA 或 unusual traffic 页面代替 SERP。
- Track A 54/57 条标题、55/57 条域名可在对应 HTML 中匹配。
- Track B 43/58 条标题、56/58 条域名可在对应 HTML 中匹配。
- URL 格式正常的主要竞品、页面类型和重复域名足以支持 Topic 方向判断。

### 2.2 不能接受的完整性声明

| 问题 | Track A | Track B | 影响 |
|---|---:|---:|---|
| 实际结果行数 | 57 | 58 | 不能写成 60/60 或“每词完整 Top 10” |
| 单词结果数 | 8-12 | 8-11 | 保存的是可提取自然样本，不是统一 Top 10 |
| 缺少 snippet | 12 | 21 | 摘要和细节意图判断需降级 |
| HTML 中可匹配完整 URL | 42/57 | 40/58 | `/goto?url=` 还原不能声称 100% 可验证 |
| 截图尺寸 | 全部 756x469 | 全部 756x469 | 只覆盖首屏，部分未显示传统自然结果 |

明显错误记录包括：

- Track A `project intake form` Rank 1：`https://8comments·5yearsago`。
- Track A `creative agency client intake form` Rank 4：`https://9comments·2yearsago`。
- Track B `request a quote form` Rank 9：`https://34.4K+views·5yearsago`。
- Track B `price quote request form` Rank 9：`https://1.3K+views·10monthsago`。

这些是 Reddit / YouTube 展示文本被误识别成 URL，不是有效外部目标。另有多个 Monday、Jotform、123FormBuilder、Gravity Forms 等 URL 只恢复到泛目录，不应称为精确页面 URL。

### 2.3 页面类型分类限制

JSON 把部分 PDF、政府表单、Reddit、YouTube 和 SaaS 指南统一标成 `product`。因此页面类型分布只能作粗粒度参考，不能直接用来计算精确意图占比。

## 3. Track A 修正结论

### 3.1 Google 实际信号

- 泛 `client intake form` 混合在线表单、PDF、医疗/理疗、法律和通用服务场景。
- `project intake form` / `project request form` 明显混入 PMO、审批、资源安排、文档和项目管理工具意图。
- `creative agency client intake form` 与已上线 Web Design 子场景高度重叠。
- `consulting client intake form` 存在轻量模板机会，但结果同时出现 PDF、预约和专业服务流程预期。

### 3.2 为什么不接受“并入 Web Design 后横向建两页”

Web Design、Creative Agency 和 Consulting 是 Professional Services Intake 下的兄弟子场景，不应把后两者塞进 Web Design 页面，也不应因为本轮报告马上创建两个近义 Solution。

修正决策：

1. `/solutions/web-design-client-intake-form-template` 保持现有独立子场景并冻结观察。
2. 不创建泛 `/solutions/client-intake-form`。
3. 不创建 Project Intake / Project Request 页面。
4. Creative Agency / Consulting 保留 Topic Universe；需要独立产品字段、SERP 差异和现有页面数据后再进入 Architect。
5. 医疗、法务和需要合规/冲突检查的场景不承接。

## 4. Track B 修正结论

### 4.1 可进入 Architect 的词

| 关键词 | 决策 | 页面角色 |
|---|---|---|
| `quote request form` | P1 / Enter Architect | Lead Capture 子集群主意图 |
| `request a quote form` | P1 / Enter Architect | 与主意图合并 |
| `quote request form template` | P1 | Template 意图 |
| `service quote request form` | P1/P2 | 主页面字段/FAQ 支撑，不先建独立页 |

### 4.2 不进入主页面的词

| 关键词 | 决策 | 原因 |
|---|---|---|
| `price quote request form` | P2 / Mixed | 同时包含邮件、RFQ、模板和采购意图 |
| `estimate request form` | Reject as owning keyword | 退休金估算、政府表单和行业估价意图混杂 |

### 4.3 产品边界

可以写：AI 生成询价需求表、服务类型、需求范围、预算、时间、联系方式、公开链接、二维码、数据面板、CSV、Webhook/Bot 后续流转。

不能写：即时报价计算、正式报价单/PDF 生成、文件/图纸上传、支付/订金/发票、现场估价、排班派单、CRM 原生同步、生产级邮件通知或 unlimited free。

报告中的“完美闭环”“高转化”“大幅提高”“小企业最看重”和“用户不要求自动报价”等措辞缺少实验或定量证据，不进入 Brief。

## 5. URL 与架构修正

不采用 Gemini 建议的 `/solutions/lead-capture/quote-request-form`：当前站点没有这一嵌套路由结构，也不应为了一个 Topic 新建第二套路由体系。

Architect 应在以下两个方案中二选一：

- `/use-cases/quote-request-form-builder`
- `/solutions/quote-request-form`

Template 只有在真实 `quote-request` 模板字段和产品承接完成后，才允许建立 `/templates/quote-request`。第一阶段不创建 `/templates/service-quote-request`。

## 6. 最终验收

- Track A：**证据可用但结论需修正；Keep in Topic Universe / protect existing Web Design subtopic**。
- Track B：**证据可用且方向通过；Enter Architect as Lead Capture subcluster**。
- 两个 Gemini 报告都不能原样作为上线 Brief，必须使用本复核中的数据限制、关键词归属和产品边界。

