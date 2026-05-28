import Link from "next/link";

export default async function PayFailedPage({
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
          {isZh ? "支付确认失败" : "Payment Confirmation Failed"}
        </h1>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
          {isZh
            ? "我们没有成功确认这笔订单。你可以稍后查看订单页，或通过反馈支持告诉管理员。"
            : "We could not confirm this order. You can check your orders later or contact support from the feedback page."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}/my-orders`}
            className="rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white"
          >
            {isZh ? "查看订单" : "View Orders"}
          </Link>
          <Link
            href={`/${locale}/support`}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-700"
          >
            {isZh ? "联系支持" : "Contact Support"}
          </Link>
        </div>
      </section>
    </main>
  );
}
