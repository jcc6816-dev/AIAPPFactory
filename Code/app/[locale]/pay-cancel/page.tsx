import Link from "next/link";

export default async function PayCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {isZh ? "支付已取消" : "Payment Cancelled"}
        </h1>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
          {isZh
            ? "你还没有完成支付，当前账户仍会保持原套餐。需要更多表单或 Webhook 能力时，可以随时回到价格区升级。"
            : "You have not completed payment, so your account remains on the current plan. You can return to pricing whenever you need more forms or Webhook capacity."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}/#pricing`}
            className="rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white"
          >
            {isZh ? "返回价格区" : "Back to Pricing"}
          </Link>
          <Link
            href={`/${locale}/forms`}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-700"
          >
            {isZh ? "继续使用免费版" : "Continue Free"}
          </Link>
        </div>
      </section>
    </main>
  );
}
