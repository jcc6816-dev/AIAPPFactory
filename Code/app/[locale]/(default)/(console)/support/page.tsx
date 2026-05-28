import SupportTicketForm from "@/components/support/support-ticket-form";
import { getUserEmail, getUserUuid } from "@/services/user";
import { listSupportTicketsByUser } from "@/models/support-ticket";
import moment from "moment";
import { redirect } from "next/navigation";

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const user_uuid = await getUserUuid();
  const user_email = await getUserEmail();

  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/support`)}`);
  }

  const tickets = await listSupportTicketsByUser(user_uuid);

  return (
    <div className="p-6 space-y-6">
      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
          Support
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
          {isZh ? "反馈与支持" : "Feedback & Support"}
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
          {isZh
            ? "提交生成、模板、发布、Webhook、支付或 Bug 反馈。管理员回复后会显示在这里。"
            : "Submit generation, template, publishing, Webhook, billing or bug feedback. Admin replies will appear here."}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900">
            {isZh ? "提交新反馈" : "Submit Feedback"}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {isZh ? `当前账户：${user_email || user_uuid}` : `Current account: ${user_email || user_uuid}`}
          </p>
          <div className="mt-6">
            <SupportTicketForm isZh={isZh} />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900">
            {isZh ? "我的反馈记录" : "My Feedback"}
          </h2>
          <div className="mt-5 space-y-4">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <article
                  key={ticket.uuid}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-blue">
                          {ticket.category}
                        </span>
                        <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                          {ticket.status}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-extrabold text-slate-950">
                        {ticket.title}
                      </h3>
                    </div>
                    <time className="text-xs font-bold text-slate-400">
                      {ticket.created_at
                        ? moment(ticket.created_at).format("YYYY-MM-DD HH:mm")
                        : ""}
                    </time>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-600">
                    {ticket.message}
                  </p>
                  {ticket.admin_reply && (
                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">
                        {isZh ? "管理员回复" : "Admin Reply"}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-emerald-950">
                        {ticket.admin_reply}
                      </p>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-400">
                {isZh ? "暂无反馈记录" : "No feedback yet"}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
