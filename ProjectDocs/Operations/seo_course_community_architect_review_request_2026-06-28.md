# Course / Community Architect Review Request

## Product manager prompt

请评审以下两个 SEO Architect 文档：

1. `ProjectDocs/Operations/seo_brief_course_registration_architect.md`
2. `ProjectDocs/Operations/seo_brief_community_application_template_only.md`

背景：Google US SERP 和 GSC 已完成 Validate。Course Registration 的主意图是课程、班级、培训和工作坊报名信息收集，建议归入 Event Registration / Education & Training，而不是 Lead Capture。Community Application 的泛词污染严重、站内信号极弱，建议仅保留 Template 并退役重复 Solution。

请从产品定位和真实承接角度逐项判断：

- Course 是否能真实完成 AI 创建、公开链接/二维码分享、提交收集、数据面板、CSV 和 Webhook/Bot 后续流转。
- Course 是否还存在支付、名额、自动邮件、Redirect、日历、考勤、证书、LMS、embed 等过度承诺。
- `course_registration` 和 `community_application` 两个 intent 是否准确。
- Course 归入 Event Registration / Education & Training 是否合理。
- Community 保留 Template、将 Solution 308 到 Template 是否会损失必要产品入口。
- 两个 Brief 的字段、FAQ、CTA 和创建 Prompt 是否符合当前产品事实。

请输出：同意 / 部分同意 / 不同意、必须修改项、可选项，以及是否允许进入 Build。不要要求新增页面，除非有明确产品和市场证据。

## UX prompt

请基于以下两个 Brief 评审首屏与转化承接，不需要重新设计整站：

1. `ProjectDocs/Operations/seo_brief_course_registration_architect.md`
2. `ProjectDocs/Operations/seo_brief_community_application_template_only.md`

重点检查：

- Course 首屏是否让用户立刻理解这是“课程/培训/工作坊报名信息收集”，而不是支付、票务、名额或 LMS 系统。
- Hero 预览是否必须使用真实 `course-registration` 字段。
- 主 CTA `Create a course registration form` 与二级 CTA `Preview registration fields` 是否清晰。
- 推荐字段、工作流和 FAQ 的阅读顺序是否适合桌面和移动端。
- Event Registration、QR Code Form 和 Webhook 的内链是否自然，不抢走主任务。
- Community Template 是否清楚说明人工审核和外部发送邀请，避免让用户期待自动审批或 Discord/Slack 邀请。
- 退役 Community Solution 后，Template 是否足以承接长尾用户。

请输出：同意 / 部分同意 / 不同意、桌面/移动端必须修改项、可选优化项，以及是否允许进入 Build。
