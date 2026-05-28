import AdminTicketReplyForm from "@/components/support/admin-ticket-reply-form";
import { listSupportTickets } from "@/models/support-ticket";
import moment from "moment";

export default async function AdminSupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const tickets = await listSupportTickets();

  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
          {isZh ? "反馈运营" : "Support Operations"}
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          {isZh ? "用户反馈" : "User Feedback"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isZh
            ? "查看客户反馈，在产品内回复，并跟进已处理的问题。"
            : "Review customer feedback, reply in-product, and close handled issues."}
        </p>
      </div>

      <div className="grid gap-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <article
              key={ticket.uuid}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                      {ticket.category}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
                      {ticket.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {ticket.user_email || ticket.user_uuid}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-extrabold text-slate-950">
                    {ticket.title}
                  </h2>
                </div>
                <time className="text-xs font-bold text-slate-400">
                  {ticket.created_at
                    ? moment(ticket.created_at).format("YYYY-MM-DD HH:mm")
                    : ""}
                </time>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {ticket.message}
              </p>

                  {ticket.admin_reply && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">
                    {isZh ? "已有回复" : "Existing Reply"}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-emerald-950">
                    {ticket.admin_reply}
                  </p>
                </div>
              )}

              <AdminTicketReplyForm
                ticketId={ticket.uuid}
                defaultReply={ticket.admin_reply || ""}
              />
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            {isZh ? "暂无用户反馈。" : "No support tickets yet."}
          </div>
        )}
      </div>
    </div>
  );
}
