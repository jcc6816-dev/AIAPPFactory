import Link from "next/link";
import moment from "moment";
import { notFound } from "next/navigation";

import { formatRevenue } from "@/services/admin-dashboard";
import { getAdminUserDetail } from "@/services/admin-user-detail";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ locale: string; uuid: string }>;
}) {
  const { locale, uuid } = await params;
  const isZh = locale === "zh";
  const detail = await getAdminUserDetail(uuid);

  if (!detail.user) {
    notFound();
  }

  const user = detail.user;
  const cards = [
    { label: isZh ? "表单" : "Forms", value: detail.totals.forms },
    { label: isZh ? "已发布" : "Published", value: detail.totals.publishedForms },
    { label: isZh ? "提交" : "Submissions", value: detail.totals.submissions },
    { label: "Webhook", value: detail.totals.webhookFailures },
    { label: isZh ? "付费订单" : "Paid Orders", value: detail.totals.paidOrders },
    { label: isZh ? "收入" : "Revenue", value: formatRevenue(detail.totals.revenueCents) },
  ];

  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="mb-8">
        <Link
          href={`/${locale}/admin/users`}
          className="text-xs font-extrabold text-brand-blue hover:underline"
        >
          {isZh ? "返回用户列表" : "Back to users"}
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-xl font-black text-white">
            {(user.nickname || user.email || "U").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
              {isZh ? "用户详情" : "User Detail"}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">
              {user.email}
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-400">
              {user.nickname || "-"} · {user.signin_provider || "auth"} · {formatTime(user.created_at)}
            </p>
          </div>
        </div>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={isZh ? "用户表单" : "Forms"}>
          <SimpleList
            empty={isZh ? "该用户暂无表单。" : "No forms for this user."}
            rows={detail.forms.slice(0, 10).map((form) => ({
              title: form.title,
              meta: `${form.status} · ${form.theme}`,
              href: `/${locale}/forms/${form.uuid}`,
              right: formatTime(form.created_at),
            }))}
          />
        </Panel>

        <Panel title={isZh ? "最近提交" : "Recent Submissions"}>
          <SimpleList
            empty={isZh ? "暂无提交。" : "No submissions yet."}
            rows={detail.recentSubmissions.map((submission) => ({
              title: submission.form_title || submission.form_uuid,
              meta: submission.status,
              right: formatTime(submission.created_at),
            }))}
          />
        </Panel>

        <Panel title={isZh ? "付费订单" : "Paid Orders"}>
          <SimpleList
            empty={isZh ? "暂无订单。" : "No paid orders yet."}
            rows={detail.orders.slice(0, 10).map((order) => ({
              title: order.product_name || order.order_no,
              meta: `${order.status} · ${order.interval}`,
              right: formatRevenue(order.amount || 0, order.currency || "USD"),
            }))}
          />
        </Panel>

        <Panel title={isZh ? "Webhook 失败" : "Webhook Failures"}>
          <SimpleList
            empty={isZh ? "暂无 Webhook 失败。" : "No webhook failures."}
            rows={detail.recentWebhookFailures.map((log) => ({
              title: log.target_url || log.uuid,
              meta: log.error_message || `HTTP ${log.response_status}`,
              right: formatTime(log.created_at),
            }))}
          />
        </Panel>

        <Panel title={isZh ? "最近增长事件" : "Recent Growth Events"}>
          <SimpleList
            empty={isZh ? "暂无增长事件。" : "No growth events yet."}
            rows={detail.recentEvents.map((event) => ({
              title: event.event_name,
              meta: event.path || event.template_id || event.form_uuid || "",
              right: formatTime(event.created_at),
            }))}
          />
        </Panel>
      </div>
    </div>
  );
}

function formatTime(value?: string) {
  if (!value) return "-";
  return moment(value).format("YYYY-MM-DD HH:mm");
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-extrabold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function SimpleList({
  rows,
  empty,
}: {
  rows: Array<{ title: string; meta?: string; right?: string; href?: string }>;
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-sm font-semibold text-slate-400">
        {empty}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {rows.map((row) => (
        <div key={`${row.title}-${row.meta}-${row.right}`} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            {row.href ? (
              <Link href={row.href} className="truncate text-sm font-extrabold text-slate-900 hover:text-brand-blue">
                {row.title}
              </Link>
            ) : (
              <p className="truncate text-sm font-extrabold text-slate-900">{row.title}</p>
            )}
            {row.meta && (
              <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                {row.meta}
              </p>
            )}
          </div>
          {row.right && (
            <span className="shrink-0 text-xs font-bold text-slate-400">
              {row.right}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
