import Link from "next/link";
import moment from "moment";

import { getAdminFormOperationSummary } from "@/services/admin-form-operations";

export default async function AdminFormsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const summary = await getAdminFormOperationSummary();
  const cards = [
    { label: isZh ? "表单总数" : "Forms", value: summary.totals.forms },
    { label: isZh ? "已发布" : "Published", value: summary.totals.published },
    { label: isZh ? "草稿" : "Drafts", value: summary.totals.drafts },
    { label: isZh ? "提交总数" : "Submissions", value: summary.totals.submissions },
    { label: isZh ? "Webhook 失败" : "Webhook Failures", value: summary.totals.webhookFailures },
  ];

  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
          {isZh ? "表单运营" : "Form Operations"}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
          {isZh ? "全局表单运营视图" : "Global Form Operations"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isZh
            ? "查看所有用户创建的表单、发布状态、提交量和 Webhook 异常。"
            : "Review all user-created forms, publish status, submissions, and webhook issues."}
        </p>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <Th>{isZh ? "表单" : "Form"}</Th>
                <Th>{isZh ? "用户" : "Owner"}</Th>
                <Th>{isZh ? "状态" : "Status"}</Th>
                <Th>{isZh ? "提交" : "Submissions"}</Th>
                <Th>{isZh ? "Webhook 失败" : "Webhook Failures"}</Th>
                <Th>{isZh ? "最后提交" : "Last Submission"}</Th>
                <Th>{isZh ? "创建时间" : "Created"}</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.rows.map((row) => (
                <tr key={row.uuid} className="hover:bg-slate-50/70">
                  <Td>
                    <div>
                      <Link
                        href={`/${locale}/forms/${row.uuid}`}
                        className="font-extrabold text-slate-950 hover:text-brand-blue"
                      >
                        {row.title}
                      </Link>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {row.theme} · {row.uuid}
                      </p>
                    </div>
                  </Td>
                  <Td>
                    <Link
                      href={`/${locale}/admin/users/${row.ownerUuid}`}
                      className="font-bold text-brand-blue hover:underline"
                    >
                      {row.ownerEmail}
                    </Link>
                  </Td>
                  <Td>
                    <StatusBadge status={row.status} />
                  </Td>
                  <Td>{row.submissions}</Td>
                  <Td>
                    <span className={row.webhookFailures > 0 ? "font-extrabold text-rose-600" : "font-bold text-slate-500"}>
                      {row.webhookFailures}
                    </span>
                  </Td>
                  <Td>{formatTime(row.lastSubmissionAt)}</Td>
                  <Td>{formatTime(row.createdAt)}</Td>
                </tr>
              ))}
              {summary.rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-400">
                    {isZh ? "暂无表单。" : "No forms yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function formatTime(value?: string) {
  if (!value) return "-";
  return moment(value).format("YYYY-MM-DD HH:mm");
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 text-sm font-semibold text-slate-600">{children}</td>;
}

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "published";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
        isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
