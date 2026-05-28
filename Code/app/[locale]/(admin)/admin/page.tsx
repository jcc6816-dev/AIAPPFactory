import Link from "next/link";
import { ReactNode } from "react";
import moment from "moment";

import {
  formatRevenue,
  getAdminDashboardMetrics,
} from "@/services/admin-dashboard";
import { generateSparklinePoints } from "@/lib/sparkline";

export default async function AdminHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const metrics = await getAdminDashboardMetrics();
  const kpis: Array<{
    label: string;
    value: string;
    hint?: string;
    href?: string;
    tone?: "neutral" | "warning" | "danger";
    sparklineData?: number[];
  }> = [
    {
      label: isZh ? "用户" : "Users",
      value: metrics.totals.users.toString(),
      href: localizeHref("/admin/users", locale),
      sparklineData: metrics.sparklines?.users,
    },
    {
      label: isZh ? "表单" : "Forms",
      value: metrics.totals.forms.toString(),
      hint: isZh
        ? `${metrics.totals.publishedForms} 个已发布`
        : `${metrics.totals.publishedForms} published`,
      sparklineData: metrics.sparklines?.forms,
    },
    {
      label: isZh ? "提交" : "Submissions",
      value: metrics.totals.submissions.toString(),
      sparklineData: metrics.sparklines?.submissions,
    },
    {
      label: isZh ? "收入" : "Revenue",
      value: formatRevenue(metrics.totals.revenueCents),
      href: localizeHref("/admin/paid-orders", locale),
    },
    {
      label: isZh ? "Webhook 失败" : "Webhook Failures",
      value: metrics.totals.webhookFailed.toString(),
      tone: metrics.totals.webhookFailed > 0 ? "danger" : "neutral",
    },
    {
      label: isZh ? "待处理工单" : "Open Tickets",
      value: metrics.totals.openTickets.toString(),
      href: localizeHref("/admin/support", locale),
      tone: metrics.totals.openTickets > 0 ? "warning" : "neutral",
    },
  ];

  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
          {isZh ? "运营后台" : "Operations"}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
          AI FormFactory Admin
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isZh
            ? "查看 MVP 核心运营信号：用户、已发布表单、提交、收入、Webhook 失败和用户反馈。"
            : "Track the core MVP signals: users, published forms, submissions, revenue, webhook failures, and feedback."}
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => (
          <KpiCard key={item.label} {...item} />
        ))}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel
          title={isZh ? "最近反馈" : "Recent Feedback"}
          href={localizeHref("/admin/support", locale)}
          empty={isZh ? "暂无反馈。" : "No feedback yet."}
          viewAllLabel={isZh ? "查看全部" : "View all"}
        >
          {metrics.recent.tickets.map((ticket) => (
            <Row
              key={ticket.uuid}
              title={ticket.title}
              meta={`${ticket.status} · ${ticket.category}`}
              right={ticket.created_at ? moment(ticket.created_at).fromNow() : ""}
            />
          ))}
        </Panel>

        <Panel
          title={isZh ? "最近付费订单" : "Recent Paid Orders"}
          href={localizeHref("/admin/paid-orders", locale)}
          empty={isZh ? "暂无付费订单。" : "No paid orders yet."}
          viewAllLabel={isZh ? "查看全部" : "View all"}
        >
          {metrics.recent.orders.map((order) => (
            <Row
              key={order.order_no}
              title={order.product_name || order.order_no}
              meta={order.paid_email || order.user_email}
              right={formatRevenue(order.amount || 0, order.currency || "USD")}
            />
          ))}
        </Panel>

        <Panel title={isZh ? "最近表单" : "Recent Forms"} empty={isZh ? "暂无表单。" : "No forms yet."}>
          {metrics.recent.forms.map((form) => (
            <Row
              key={form.uuid}
              title={form.title}
              meta={`${form.status} · ${form.theme}`}
              right={form.created_at ? moment(form.created_at).fromNow() : ""}
            />
          ))}
        </Panel>

        <Panel title={isZh ? "Webhook 失败" : "Webhook Failures"} empty={isZh ? "暂无 Webhook 失败。" : "No webhook failures."}>
          {metrics.recent.webhookFailures.map((log) => (
            <Row
              key={log.uuid}
              title={log.target_url || log.uuid}
              meta={getFriendlyWebhookError(log.response_status, log.error_message, isZh)}
              right={log.created_at ? moment(log.created_at).fromNow() : ""}
            />
          ))}
        </Panel>

        <Panel
          title={isZh ? "最近用户" : "Recent Users"}
          href={localizeHref("/admin/users", locale)}
          empty={isZh ? "暂无用户。" : "No users yet."}
          viewAllLabel={isZh ? "查看全部" : "View all"}
        >
          {metrics.recent.users.map((user) => (
            <Row
              key={user.uuid || user.email}
              title={user.email}
              meta={user.nickname || user.signin_provider || "registered"}
              right={user.created_at ? moment(user.created_at).fromNow() : ""}
            />
          ))}
        </Panel>

        <Panel title={isZh ? "最近提交" : "Recent Submissions"} empty={isZh ? "暂无提交。" : "No submissions yet."}>
          {metrics.recent.submissions.map((submission) => (
            <Row
              key={submission.uuid}
              title={submission.form_title || submission.form_uuid}
              meta={submission.status}
              right={
                submission.created_at
                  ? moment(submission.created_at).fromNow()
                  : ""
              }
            />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function getFriendlyWebhookError(status: number, message?: string, isZh = false) {
  if (status === 401 || status === 403) {
    return isZh ? "对方拒绝访问：请检查 Key / Webhook 密钥配置" : "Access Denied: Check Key / Secret config";
  }
  if (status === 404) {
    return isZh ? "地址不存在：请核对 Webhook 接收端 URL" : "Not Found: Double check Webhook URL";
  }
  if (status >= 500) {
    return isZh ? `接收端服务异常 (HTTP ${status})：请检查端点服务状态` : `Server Error (HTTP ${status}): Check receiver status`;
  }
  if (message) {
    const msg = message.toLowerCase();
    if (msg.includes("fetch failed") || msg.includes("dns") || msg.includes("econnrefused")) {
      return isZh ? "连接失败：域名解析错误或对方服务器关机" : "Connection Failed: DNS error or server unreachable";
    }
    if (msg.includes("timeout")) {
      return isZh ? "连接超时：对方服务器响应超过限时" : "Timeout: Receiver responded too slowly";
    }
    return message;
  }
  return `HTTP ${status}`;
}

function KpiCard({
  label,
  value,
  hint,
  href,
  tone = "neutral",
  sparklineData,
}: {
  label: string;
  value: string;
  hint?: string;
  href?: string;
  tone?: "neutral" | "warning" | "danger";
  sparklineData?: number[];
}) {
  const toneClass =
    tone === "danger"
      ? "text-rose-600 bg-rose-50"
      : tone === "warning"
        ? "text-amber-600 bg-amber-50"
        : "text-brand-blue bg-blue-50";

  const points = sparklineData ? generateSparklinePoints(sparklineData, 100, 32) : "";

  const content = (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-blue/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs font-bold text-slate-400 truncate">{hint}</p>}
        </div>
        <div className="flex flex-col items-end justify-between h-[68px] shrink-0">
          <span className={`rounded-xl px-2.5 py-1 text-[10px] font-extrabold ${toneClass}`}>
            Live
          </span>
          {points && (
            <svg className="w-24 h-8 text-brand-blue" viewBox="0 0 100 32">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function localizeHref(href: string, locale: string) {
  if (!href || href.startsWith("http") || href.startsWith("#")) {
    return href;
  }

  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }

  if (href.startsWith("/en/") || href.startsWith("/zh/")) {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

function Panel({
  title,
  href,
  empty,
  viewAllLabel = "View all",
  children,
}: {
  title: string;
  href?: string;
  empty: string;
  viewAllLabel?: string;
  children: ReactNode | ReactNode[];
}) {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children].filter(Boolean);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-extrabold text-slate-950">{title}</h2>
        {href && (
          <Link href={href} className="text-xs font-extrabold text-brand-blue">
            {viewAllLabel}
          </Link>
        )}
      </div>
      <div className="divide-y divide-slate-100">
        {items.length > 0 ? (
          items
        ) : (
          <div className="py-8 text-center text-sm font-semibold text-slate-400">
            {empty}
          </div>
        )}
      </div>
    </section>
  );
}

function Row({
  title,
  meta,
  right,
}: {
  title: string;
  meta?: string;
  right?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-slate-900">{title}</p>
        {meta && <p className="mt-1 truncate text-xs font-semibold text-slate-400">{meta}</p>}
      </div>
      {right && (
        <span className="shrink-0 text-xs font-bold text-slate-400">{right}</span>
      )}
    </div>
  );
}

