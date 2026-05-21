import Link from "next/link";
import { redirect } from "next/navigation";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import ShareLinkCard from "@/components/forms/share-link-card";
import ShareQrCard from "@/components/forms/share-qr-card";
import WebhookSettingsForm from "@/components/forms/webhook-settings-form";
import OcrSettingsForm from "@/components/forms/ocr-settings-form";
import { buildFormPublishAgentResponses } from "@/services/form-publish-agent";
import { getFormByUuidForUser } from "@/services/form";
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
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const form = await getFormByUuidForUser(user_uuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_WEB_URL || ""}/${locale}/f/${form.share_code}`;
  const webhookLogs = await listWebhookLogs(form);
  const publishAgentResponses = buildFormPublishAgentResponses(
    form,
    webhookLogs,
    shareUrl
  );

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
          agentTitle="AI 发布与集成助手"
          agentDescription="这里管理表单分享链接、二维码和 Webhook 数据推送。后续可以继续增强飞书、钉钉、企业微信等配置引导。"
          inputPlaceholder="例如：帮我配置一个钉钉群机器人 Webhook..."
          examples={[
            {
              label: "检查发布配置",
              icon: "RiSearchEyeLine",
              response: publishAgentResponses.readiness,
            },
            {
              label: "查看分享链接",
              icon: "RiLink",
              response: publishAgentResponses.share,
            },
            {
              label: "诊断 Webhook 配置",
              icon: "RiPlug2Line",
              response: publishAgentResponses.webhook,
            },
          ]}
          staticResponses={[
            {
              keywords: ["检查", "发布", "上线", "准备", "配置"],
              response: publishAgentResponses.readiness,
            },
            {
              keywords: ["分享", "链接", "二维码"],
              response: publishAgentResponses.share,
            },
            {
              keywords: ["webhook", "推送", "钉钉", "飞书", "企微", "企业微信"],
              response: publishAgentResponses.webhook,
            },
            {
              keywords: ["ocr", "识别", "图片", "票据", "发票", "证件"],
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
            连接与发布 / Connect & Publish
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            当前场景：<b className="text-slate-900">{form.title}</b> · 状态：<span className="text-brand-blue font-bold">{form.status}</span>
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ShareLinkCard
            shareUrl={shareUrl}
            openHref={`/${locale}/f/${form.share_code}`}
          />
          <ShareQrCard shareUrl={shareUrl} />
        </div>

        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-950">
              Webhook 数据推送
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              保存目标地址、认证模式和关键词后，新提交会自动推送。
            </p>
          </div>
          <WebhookSettingsForm
            form={{
              uuid: form.uuid,
              webhook_enabled: form.webhook_enabled,
              webhook_url: form.webhook_url,
              webhook_provider: form.webhook_provider,
              webhook_auth_mode: form.webhook_auth_mode,
              webhook_header_name: form.webhook_header_name,
            }}
          />
        </div>

        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-950">
              {t("detail_section_ocr_title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              启用图像智能识别，允许用户上传照片后自动填充表单。
            </p>
          </div>
          <OcrSettingsForm
            form={{
              uuid: form.uuid,
              ocr_template: form.ocr_template,
            }}
          />
        </div>

        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 md:p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-extrabold text-slate-900">
            <i className="ri-history-line text-brand-blue" /> 推送历史日志 / Delivery Logs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr>
                  <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">时间 (Timestamp)</th>
                  <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">状态 (Status)</th>
                  <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">目标地址</th>
                  <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">响应 (Response)</th>
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
                          成功 ({log.response_status})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-rose-500">
                          <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          失败 ({log.response_status})
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
                    <td colSpan={4} className="py-8 text-center text-slate-400">暂无推送日志</td>
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
