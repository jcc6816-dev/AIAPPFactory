# GenForms.ai SEO Intent Research Table

> 版本：2026-06-18  
> 状态：v0 候选词盘点，尚未完成逐词 SERP 与竞品拆解  
> 上游方法：`ProjectDocs/Operations/seo_search_intent_research_system.md`  
> 用途：把候选关键词先放进同一张研究表，标注来源、证据等级、用户任务假设、产品匹配度和下一步动作。本文不是页面生产清单，未完成 `serp_checked` 和 `analyzed` 的词不得直接进入页面 Brief。

## 1. 当前结论

本轮先完成第一步：候选关键词收集与证据分级。

重要判断：

- 已有少量 GSC 真实信号，主要集中在品牌词、AI lead form、contact form、testimonial、typeform alternative、job application、Google Forms 对比和 Webhook/Feishu 相关页面。
- 旧的 `low_competition_keyword_map.md` 和 `seo_content_topic_queue.md` 有价值，但只能作为候选来源；未被 GSC 或实时 SERP 验证前，不直接视为“用户真实搜索已验证”。
- Webhook、AI lead capture、contact form、Typeform alternative、Google Forms alternative 是当前最值得进入下一步 SERP 研究的主题簇。
- 本表先保守标注证据等级，避免因为内部经验而把未验证关键词提前推入页面生产。

## 2. 证据等级说明

沿用 `seo_search_intent_research_system.md` 的分级，并增加一个过渡标记：

| 等级 | 定义 | 本表用法 |
| --- | --- | --- |
| A | GSC 已有 query 级 impressions / clicks，且与产品能力相关 | 可优先进入 SERP 与竞品拆解 |
| A-theme | GSC 已有页面或主题级曝光，但缺少完整 query 明细 | 可进入 SERP 研究，但需补 query 证据 |
| B | Google SERP 自动补全、PAA、Related Searches 或竞品多次出现 | 本轮暂不使用，需后续实时 SERP 记录 |
| C | 产品能力、用户任务或内部关键词图强相关，但暂无外部搜索证据 | 候选观察，不直接生产页面 |
| D | 内部灵感或泛行业词，未验证需求 | 仅记录或暂缓 |

## 3. 已使用来源

| 来源 ID | 来源 | 说明 |
| --- | --- | --- |
| GSC-2026-06-07 | `ProjectDocs/AI-Team/metrics/2026-06-07-gsc-performance-review.md` | 有 query、页面、impressions、position 的真实 GSC 复盘 |
| GSC-DROP-2026-06-15 | `ProjectDocs/AI-Team/tasks/active/AI-TASK-2026-006-031-gsc-daily-drop-root-cause.md` | 有 6/08-6/13 GSC 总量和主要掉量页面 |
| LOW-KW-2026-06-04 | `ProjectDocs/Operations/low_competition_keyword_map.md` | 旧低竞争高意图关键词清单，需重新验证 |
| TOPIC-QUEUE-2026-06-03 | `ProjectDocs/Operations/seo_content_topic_queue.md` | 旧内容选题队列，适合作为候选输入 |
| PRODUCT-MVP | `ProjectDocs/Operations/genforms_growth_operating_guideline.md` 与当前 MVP 能力 | AI 表单生成、模板、分享、二维码、Webhook、提交存储、基础数据面板 |

## 4. 候选关键词研究表

| # | keyword | source | source_detail | user_task_hypothesis | product_fit | commercial_value | evidence_level | research_status | next_action | notes |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | genforms | GSC | GSC-2026-06-07: impressions 2, position 11 | 用户直接找品牌或回访产品 | high | medium | A | candidate | 检查品牌 SERP、title、description | 品牌词要保证首页结果清楚可信 |
| 2 | lead form ai | GSC | GSC-2026-06-07: impressions 2, position 25.5 | 用户想用 AI 创建线索表单 | high | high | A | candidate | 进入 SERP 拆解 | 可承接到 AI lead capture / lead capture template |
| 3 | customizable application forms in ats | GSC | GSC-2026-06-07: impressions 2, position 29.5 | HR 或招聘团队想要可自定义申请表 | medium | medium | A | candidate | 进入 SERP 拆解 | 当前产品可做申请表，但 ATS 语义需谨慎，避免承诺 ATS 集成 |
| 4 | contact form builder | GSC | GSC-2026-06-07: impressions 5, position 54.2 | 网站所有者想创建联系表单 | high | medium | A | candidate | 进入 SERP 拆解 | 竞争可能较强，但与模板和创建动作高度匹配 |
| 5 | ai testimonial collection | GSC | GSC-2026-06-07: impressions 5, position 78.4 | 用户想用 AI 收集客户证言或案例素材 | high | medium | A | candidate | 进入 SERP 拆解 | 需要判断 SERP 是模板、工具还是内容教程 |
| 6 | typeform alternative | GSC | GSC-2026-06-07: related terms about 25+ impressions, weak position | 用户想找 Typeform 替代品 | medium | high | A | candidate | 进入 SERP 拆解，但不急着改旧页 | 竞争强，短期更适合找细分切口 |
| 7 | form builder with webhook | GSC + internal | GSC-2026-06-07: `/posts/form-builder-with-webhook` had 1 impression, position 4; LOW-KW P0 | 用户想把表单提交推到系统 | high | high | A-theme | candidate | 进入 SERP + 竞品拆解 | 样本小但高度匹配差异化能力 |
| 8 | feishu dingtalk webhook notification | GSC + internal | GSC-DROP: `/posts/feishu-dingtalk-webhook-notification` had large impressions around 6/10; LOW-KW P0 | 用户想把表单提交推到飞书/钉钉 | high | medium | A-theme | candidate | 补 query 明细，再做 SERP | 页面曾接近第一页，需遵守观察冻结 |
| 9 | lark feishu form webhook bot | GSC | GSC-DROP: `/posts/lark-feishu-form-webhook-bot` had impressions 22, position 8.32 on 6/09 | 用户想把表单提交发送到 Lark/Feishu bot | high | medium | A-theme | candidate | 补 query 明细，拆英文 SERP | Lark/Feishu 对国际流量是否足够大需要验证 |
| 10 | google forms vs typeform | GSC + topic queue | GSC-2026-06-07: `/posts/google-forms-vs-typeform-vs-genforms` impressions 6, position 37.83; TOPIC P0 | 用户在比较 Google Forms 与 Typeform | medium | high | A-theme | candidate | 进入 SERP 拆解 | 需避免虚假比较，强调适用场景 |
| 11 | webhook logs and retries | GSC + topic queue | TOPIC P0; GSC-DROP shows Webhook pages with active impressions | 用户关心表单 Webhook 失败排查和重试 | high | high | A-theme | candidate | 进入 SERP 拆解 | 与 GenForms 真实差异化功能强相关 |
| 12 | ai lead capture form builder | GSC + internal | GSC-2026-06-07: `/use-cases/ai-lead-capture-form-builder` impressions 2, position 25.5 | 增长团队想用 AI 建线索收集表单 | high | high | A-theme | candidate | 进入 SERP 拆解 | 与 `lead form ai` 可归入同一主题簇 |
| 13 | saas lead capture form | LOW-KW | LOW-KW P0 | SaaS 团队想创建获客表单 | high | high | C | candidate | 待 SERP 验证 | 可能比泛 lead capture 更易切入 |
| 14 | lead capture form template | product/user task | PRODUCT-MVP + template strategy | 用户想直接拿线索表单模板 | high | high | C | candidate | 做实时 SERP/PAA 验证 | 强产品匹配，但本轮未见 GSC 原始 query |
| 15 | event registration form template | product/user task | PRODUCT-MVP + existing template/use-case direction | 用户想快速创建活动报名表 | high | medium | C | candidate | 做实时 SERP/PAA 验证 | 适合模板页，但需判断竞争结果类型 |
| 16 | qr code form builder | LOW-KW | LOW-KW P0 | 用户想用二维码在线下收集数据 | high | medium | C | candidate | 做实时 SERP/PAA 验证 | 与活动/线下场景强相关 |
| 17 | job application form builder | GSC + LOW-KW | GSC-2026-06-07: `/solutions/job-application-form-builder` impressions 7, position 45.43; LOW-KW P1 | 招聘方想创建职位申请表 | high | medium | A-theme | candidate | 补 query 明细，做 SERP | 不承诺 ATS 集成，先定位轻量收集 |
| 18 | newsletter signup form builder | LOW-KW | LOW-KW P1 | 用户想创建邮件订阅表单 | high | medium | C | candidate | 做实时 SERP/PAA 验证 | 需判断是否过泛、是否有模板切口 |
| 19 | customer testimonial form | GSC + LOW-KW | GSC testimonial 主题出现; LOW-KW P1 | 用户想收集客户证言 | high | medium | A-theme | candidate | 补 query 明细，做 SERP | 可与 testimonial collection 主题合并 |
| 20 | portfolio submission form | LOW-KW | LOW-KW P1 | 社区或招聘团队想收集作品集 | high | low-medium | C | candidate | 做实时 SERP/PAA 验证 | 商业价值需验证 |
| 21 | website contact form checklist | TOPIC-QUEUE | TOPIC P1 | 用户想知道网站联系表单该问什么 | high | medium | C | candidate | 做实时 SERP/PAA 验证 | 可作为 contact form builder 支撑内容 |
| 22 | typeform alternative with webhooks | LOW-KW + TOPIC | LOW-KW P2; TOPIC P0 | 用户想找支持 Webhook 的 Typeform 替代品 | high | high | C | candidate | 做实时 SERP/PAA 验证 | 比 `typeform alternative` 更适合 GenForms |
| 23 | google forms alternative with ai | LOW-KW | LOW-KW P2 | 用户想用 AI 升级 Google Forms 工作流 | medium | high | C | candidate | 做实时 SERP/PAA 验证 | 需避免承诺 Google Sheets 双向同步等未上线能力 |
| 24 | google forms alternative with webhooks | TOPIC-derived | TOPIC reports mention Google Forms workflow gap | 用户因 Google Forms 工作流限制寻找替代 | high | high | C | candidate | 做实时 SERP/PAA 验证 | 可能比 generic alternative 更准确 |
| 25 | form webhook retry logs | LOW-KW | LOW-KW P2 | 技术运营想要可靠投递、日志与重试 | high | high | C | candidate | 做实时 SERP/PAA 验证 | 与产品事实强匹配 |
| 26 | ai form builder | TOPIC-QUEUE | TOPIC P0: Best AI Form Builders | 用户想找 AI 表单构建工具 | high | high | C | candidate | 做 SERP，判断是否过强 | 大词，可能先从长尾切入 |
| 27 | ai form generator | product capability | PRODUCT-MVP | 用户想用一句话生成表单 | high | high | C | candidate | 做实时 SERP/PAA 验证 | 核心产品词，但竞争可能强 |
| 28 | webhook form | product capability | PRODUCT-MVP + Webhook content cluster | 用户想创建或理解 Webhook 表单 | high | high | C | candidate | 做实时 SERP/PAA 验证 | 需判断 SERP 偏开发文档还是工具页 |
| 29 | how to create a webhook form | user task | PRODUCT-MVP + tutorial intent | 用户想要具体配置步骤 | high | medium-high | C | candidate | 做实时 SERP/PAA 验证 | 适合教程，但要连接创建动作 |
| 30 | free online rsvp form | external-report example | Mentioned as example in growth dashboard proposal, not verified in GSC source | 用户想免费创建 RSVP 表单 | medium | medium | D | candidate | 仅记录，暂缓 | 目前证据不足，且 RSVP 不是最强产品差异化 |

## 5. 主题簇初步归类

### 5.1 已有 GSC 信号，优先进入 SERP 研究

| 主题簇 | 关键词 | 研究价值 |
| --- | --- | --- |
| AI lead capture | `lead form ai`, `ai lead capture form builder` | 搜索词和产品能力高度贴合，排名进入 25 左右，有优化空间 |
| Webhook workflow | `form builder with webhook`, `webhook logs and retries`, `form webhook retry logs` | 样本小但差异化强，可验证 Google 偏教程、产品页还是开发文档 |
| Contact form | `contact form builder`, `website contact form checklist` | 已有 GSC query，适合判断模板页和教程页组合 |
| Competitor alternative | `typeform alternative`, `google forms vs typeform`, `typeform alternative with webhooks` | 商业价值高，但竞争强，需要找细分切口 |
| Testimonial collection | `ai testimonial collection`, `customer testimonial form` | 已被 Google 试探，需验证真实搜索意图和页面形态 |
| Job application | `customizable application forms in ats`, `job application form builder` | 有 GSC 信号，但要控制 ATS 承诺边界 |

### 5.2 强产品匹配，但需补外部搜索证据

| 主题簇 | 关键词 | 暂不直接生产页面的原因 |
| --- | --- | --- |
| Templates | `lead capture form template`, `event registration form template` | 产品匹配强，但本轮缺少 GSC/实时 SERP 证据 |
| QR code/offline | `qr code form builder` | 内部判断高价值，仍需看 SERP 是否偏工具页、二维码生成器还是表单工具 |
| Google Forms upgrade | `google forms alternative with ai`, `google forms alternative with webhooks` | 商业价值高，但需避免夸大未上线集成 |
| Core AI product | `ai form builder`, `ai form generator` | 大词价值高，但新站短期可能需要长尾承接 |

## 6. 下一步 SERP 研究队列

建议先做 10 个词，不超过这个数量，避免一次研究过宽：

| 优先级 | keyword | 为什么先研究 |
| --- | --- | --- |
| P0 | lead form ai | GSC query 级证据，排名 25.5，贴合 AI lead capture |
| P0 | contact form builder | GSC query 级证据，适合模板 + 支撑内容组合 |
| P0 | form builder with webhook | 差异化最强，已有页面信号 |
| P0 | typeform alternative with webhooks | 泛 `typeform alternative` 竞争强，需要验证细分切口 |
| P0 | google forms alternative with webhooks | 对比意图 + Webhook 差异化，商业价值高 |
| P1 | ai testimonial collection | GSC query 级证据，但商业价值需验证 |
| P1 | job application form builder | 有页面曝光，模板转化路径明确 |
| P1 | ai form generator | 核心产品词，需判断竞争强度和 SERP 类型 |
| P1 | lead capture form template | 转化路径最自然，但缺少本轮 GSC 证据 |
| P1 | how to create a webhook form | 适合教程入口，能导向创建动作 |

## 7. SERP 研究输出要求

对上面 10 个词逐个补充：

```yaml
keyword:
checked_at:
locale: en-US
device: desktop
dominant_result_type:
serp_features:
top_results:
  - rank:
    url:
    brand:
    page_type:
    title:
    visible_angle:
google_intent_read:
intent_confidence:
competitor_advantages:
  - 
competitor_gaps:
  - 
genforms_opening:
recommended_page_type:
recommended_cta:
decision: build | optimize_existing | observe | reject
```

## 8. 当前不做

- 不直接新增 SEO 页面。
- 不修改已有页面标题、description、FAQ 或 CTA。
- 不把旧关键词清单中的 P0/P1 自动视为当前 P0/P1。
- 不对已有 GSC 观察页面做连续大改。
- 不把没有真实产品能力承接的关键词推进 Brief。
