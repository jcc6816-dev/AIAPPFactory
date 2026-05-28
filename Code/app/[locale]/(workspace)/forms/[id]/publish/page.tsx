import Link from "next/link";
import { redirect } from "next/navigation";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import ShareLinkCard from "@/components/forms/share-link-card";
import ShareQrCard from "@/components/forms/share-qr-card";
import IntegrationsSkillsCenter from "@/components/forms/integrations-skills-center";
import PublishPaywall from "@/components/forms/publish-paywall";
import { getBillingPlanSummary } from "@/services/billing";
import {
  answerFormPublishAgentQuery,
  buildFormPublishAgentResponses,
} from "@/services/form-publish-agent";
import { validateFormRecordForPublish } from "@/services/form-publish-check";
import { getFormByUuidForUser } from "@/services/form";
import { getFormSkillSettings } from "@/services/form-skills";
import { getTranslations } from "next-intl/server";
import { getUserUuid } from "@/services/user";
import { listWebhookLogs } from "@/services/webhook-log";
import moment from "moment";

export default async function ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = await getTranslations("forms");
  const user_uuid = await getUserUuid();
  const { id, locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const form = await getFormByUuidForUser(user_uuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }

  const billingSummary = await getBillingPlanSummary(user_uuid);

  const skillSettings = getFormSkillSettings(form);
  const hasProSkills =
    Boolean(skillSettings.table_ocr?.enabled) ||
    Boolean(skillSettings.ai_pre_audit?.enabled) ||
    Boolean(skillSettings.report_export?.enabled) ||
    Boolean(skillSettings.email_notification?.enabled) ||
    Boolean(skillSettings.data_cleaning?.enabled) ||
    Boolean(skillSettings.ai_insights?.enabled);
  const isPublishBlocked = hasProSkills && !billingSummary.isPaidUser;

  const shareUrl = `${process.env.NEXT_PUBLIC_WEB_URL || ""}/${locale}/f/${form.share_code}`;
  const webhookLogs = await listWebhookLogs(form);
  const publishAgentResponses = buildFormPublishAgentResponses(
    form,
    webhookLogs,
    shareUrl
  );
  const publishCheck = validateFormRecordForPublish(form);
  const artifact = form.generation_meta_json?.artifact;
  const artifactHistory = [...(artifact?.history || [])].reverse().slice(0, 6);
  const eventLabels: Record<string, string> = {
    generated: isZh ? "AI 生成" : "AI Generated",
    template_applied: isZh ? "套用模板" : "Template Applied",
    visual_changed: isZh ? "视觉调整" : "Visual Updated",
    schema_edited: isZh ? "结构编辑" : "Schema Edited",
    draft_saved: isZh ? "保存草稿" : "Draft Saved",
    published: isZh ? "已发布" : "Published",
    unpublished: isZh ? "取消发布" : "Unpublished",
  };
  const readinessItems = [
    {
      key: "title",
      label: isZh ? "标题" : "Title",
      ok: Boolean(form.title?.trim()),
      detail: isZh ? "表单标题已设置" : "Form title is set",
    },
    {
      key: "fields",
      label: isZh ? "字段" : "Fields",
      ok: form.schema_json.fields.length > 0,
      detail: isZh
        ? `${form.schema_json.fields.length} 个字段可填写`
        : `${form.schema_json.fields.length} fillable fields`,
    },
    {
      key: "choices",
      label: isZh ? "选项题" : "Choice Fields",
      ok: !publishCheck.issues.some((issue) =>
        ["choice_options_required", "choice_option_incomplete"].includes(
          issue.code
        )
      ),
      detail: isZh ? "选择题选项完整" : "Choice options are complete",
    },
    {
      key: "webhook",
      label: "Webhook",
      ok: !publishCheck.issues.some(
        (issue) => issue.code === "webhook_url_required"
      ),
      detail: form.webhook_enabled
        ? isZh
          ? "Webhook 已启用并完成基础配置"
          : "Webhook is enabled and configured"
        : isZh
          ? "Webhook 未启用，仍可发布收集数据"
          : "Webhook is off; publishing still works",
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SceneSubnav
        locale={locale}
        formId={form.uuid}
        formTitle={form.title}
        active="publish"
      />
      <div className="flex-1 flex flex-col min-h-0">
        <AgentWorkspace
          agentTitle={isZh ? "AI 发布与集成助手" : "AI Publish & Integration Assistant"}
          agentDescription={isZh ? "这里管理表单分享链接、二维码和 Webhook 数据推送。我可以帮你检查配置、解释失败日志，并给出飞书/钉钉/企微的安全模式建议。" : "Manage form sharing links, QR codes, and Webhook data push. I can help check configurations, explain logs, and suggest security settings for Feishu, Slack, and DingTalk."}
          inputPlaceholder={isZh ? "例如：帮我配置一个钉钉群机器人 Webhook..." : "e.g. Help me configure a DingTalk robot webhook..."}
          examples={[
            {
              label: isZh ? "检查发布配置" : "Check publish config",
              icon: "RiSearchEyeLine",
              response: publishAgentResponses.readiness,
            },
            {
              label: isZh ? "查看分享链接" : "View share links",
              icon: "RiLink",
              response: publishAgentResponses.share,
            },
            {
              label: isZh ? "钉钉机器人怎么配置" : "How to configure DingTalk",
              icon: "RiPlug2Line",
              response: answerFormPublishAgentQuery(
                isZh ? "钉钉机器人怎么配置" : "How to configure DingTalk",
                publishAgentResponses
              ),
            },
            {
              label: isZh ? "测试 Webhook 前检查" : "Pre-test Webhook check",
              icon: "RiPlug2Line",
              response: publishAgentResponses.testWebhook,
            },
          ]}
          staticResponses={[
            {
              keywords: isZh ? ["检查", "发布", "上线", "准备", "配置"] : ["check", "publish", "ready", "config"],
              response: publishAgentResponses.readiness,
            },
            {
              keywords: isZh ? ["分享", "链接", "二维码"] : ["share", "link", "qr"],
              response: publishAgentResponses.share,
            },
            {
              keywords: isZh ? ["webhook", "推送", "钉钉", "飞书", "企微", "企业微信"] : ["webhook", "push", "dingtalk", "feishu", "wecom"],
              response: publishAgentResponses.webhook,
            },
            {
              keywords: isZh ? ["ocr", "识别", "图片", "票据", "发票", "证件"] : ["ocr", "recognize", "image", "invoice", "receipt"],
              response: publishAgentResponses.ocr,
            },
          ]}
          defaultResponse={publishAgentResponses.defaultResponse}
          agentEndpoint={`/api/forms/${form.uuid}/publish-agent`}
          agentPayload={{ locale }}
        >

      <div className="p-6 space-y-6">
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-extrabold text-brand-blue uppercase tracking-widest">Publish</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            {isZh ? "连接与发布 / Connect & Publish" : "Connect & Publish"}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {isZh ? "当前场景：" : "Current Scene: "} <b className="text-slate-900">{form.title}</b> · {isZh ? "状态：" : "Status: "} <span className="text-brand-blue font-bold">{form.status}</span>
          </p>
        </div>

        <div className={`rounded-[1.6rem] border p-5 shadow-sm ${
          publishCheck.ready
            ? "border-emerald-200 bg-emerald-50/40"
            : "border-amber-200 bg-amber-50/50"
        }`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className={`text-[11px] font-extrabold uppercase tracking-widest ${
                publishCheck.ready ? "text-emerald-700" : "text-amber-700"
              }`}>
                {isZh ? "发布前检查" : "Publish Readiness"}
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950">
                {publishCheck.ready
                  ? isZh
                    ? "当前表单已具备发布条件"
                    : "This form is ready to publish"
                  : isZh
                    ? "发布前还有配置需要处理"
                    : "Some items need attention before publishing"}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {publishCheck.ready
                  ? isZh
                    ? "关键字段、选项与集成配置均通过基础检查。"
                    : "Core fields, choice options, and integrations passed the basic check."
                  : isZh
                    ? "请先修复下方问题，再切回设计页同步并发布。"
                    : "Fix the issues below, then return to Design and publish again."}
              </p>
            </div>
            <div className={`rounded-2xl px-4 py-2 text-xs font-black ${
              publishCheck.ready
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 text-slate-950"
            }`}>
              {publishCheck.ready
                ? isZh
                  ? "Ready"
                  : "Ready"
                : `${publishCheck.issues.length} ${
                    isZh ? "项问题" : "issues"
                  }`}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {readinessItems.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-white/70 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-900">
                    {item.label}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    item.ok
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {item.ok ? (isZh ? "通过" : "OK") : (isZh ? "待处理" : "Check")}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          {publishCheck.issues.length > 0 && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-white/80 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-black uppercase tracking-wider text-amber-700">
                  {isZh ? "需要修复" : "Needs Fixing"}
                </p>
                <Link
                  href={`/${locale}/forms/${form.uuid}`}
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-brand-blue"
                >
                  {isZh ? "回到设计页修复" : "Fix in Design"}
                </Link>
              </div>
              <div className="mt-3 grid gap-2">
                {publishCheck.issues.map((issue) => (
                  <div
                    key={`${issue.code}-${issue.fieldKey || "form"}`}
                    className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
                Artifact History
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950">
                {isZh ? "创作过程记录" : "Creation Timeline"}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {isZh
                  ? "记录最近的生成、视觉调整、草稿保存和发布动作，帮助你确认这个表单是否已经进入可发布状态。"
                  : "Recent generation, visual, draft, and publish events help you understand whether this form is ready to ship."}
              </p>
            </div>
            {artifact?.visualSettings && (
              <div className="grid min-w-[260px] grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold text-slate-600">
                <span>{isZh ? "主题" : "Theme"}</span>
                <span className="text-right text-slate-950">{artifact.visualSettings.theme}</span>
                <span>{isZh ? "视觉效果" : "Visual FX"}</span>
                <span className="text-right text-slate-950">{artifact.visualSettings.themeVariant}</span>
                <span>{isZh ? "显示方式" : "Flow"}</span>
                <span className="text-right text-slate-950">{artifact.visualSettings.layout}</span>
                <span>{isZh ? "设备" : "Device"}</span>
                <span className="text-right text-slate-950">{artifact.visualSettings.preferredDevice}</span>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3">
            {artifactHistory.length > 0 ? (
              artifactHistory.map((event, index) => (
                <div
                  key={event.id}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div className="flex flex-col items-center">
                    <span className={`h-3 w-3 rounded-full ${
                      index === 0 ? "bg-brand-blue" : "bg-slate-300"
                    }`} />
                    {index < artifactHistory.length - 1 && (
                      <span className="mt-2 h-full min-h-8 w-px bg-slate-200" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-black text-slate-950">
                        {eventLabels[event.type] || event.type}
                      </p>
                      <time className="text-[11px] font-bold text-slate-400">
                        {moment(event.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </time>
                    </div>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                      {event.summary}
                    </p>
                    {event.snapshot?.visualSettings && (
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {event.snapshot.visualSettings.visualDirection || "custom"} · {event.snapshot.visualSettings.theme} · {event.snapshot.visualSettings.themeVariant}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                {isZh
                  ? "这个表单还没有可展示的 Artifact 历史。下一次保存、视觉调整或发布后会自动记录。"
                  : "No Artifact history is available yet. Future saves, visual changes, and publish actions will be recorded automatically."}
              </div>
            )}
          </div>
        </div>

        <div className="relative rounded-[2.2rem] overflow-hidden">
          {isPublishBlocked && (
            <PublishPaywall locale={locale} formUuid={form.uuid} />
          )}
          
          <div className={`grid gap-5 xl:grid-cols-2 ${isPublishBlocked ? "pointer-events-none opacity-30 select-none" : ""}`}>
            <ShareLinkCard
              shareUrl={shareUrl}
              openHref={`/${locale}/f/${form.share_code}`}
            />
            <ShareQrCard shareUrl={shareUrl} />
          </div>
        </div>

        <IntegrationsSkillsCenter
          form={form}
          isPaidUser={billingSummary.isPaidUser}
          locale={locale}
        />

        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 md:p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-extrabold text-slate-900">
            <i className="ri-history-line text-brand-blue" /> {isZh ? "推送历史日志 / Delivery Logs" : "Webhook Delivery Logs"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr>
                  <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "时间 (Timestamp)" : "Time (Timestamp)"}</th>
                  <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "状态 (Status)" : "Status"}</th>
                  <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "目标地址" : "Target URL"}</th>
                  <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "响应 (Response)" : "Response"}</th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-bold text-slate-700">
                {webhookLogs.length > 0 ? webhookLogs.slice(0, 10).map((log) => (
                  <tr key={log.uuid} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                    <td className="py-4 text-slate-500">{moment(log.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td className="py-4">
                      {log.status === "completed" ? (
                        <span className="flex items-center gap-1.5 text-emerald-500">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {isZh ? "成功" : "Success"} ({log.response_status})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-rose-500">
                          <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          {isZh ? "失败" : "Failed"} ({log.response_status})
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-mono text-[11px] text-slate-500 max-w-[200px] truncate" title={log.target_url}>
                      {log.target_url}
                    </td>
                    <td className="py-4 font-mono text-[11px] text-slate-500 max-w-[200px] truncate" title={log.response_body || log.error_message}>
                      {log.response_body || log.error_message || "-"}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">{isZh ? "暂无推送日志" : "No webhook delivery logs found"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AgentWorkspace>
  </div>
</div>
  );
}
