import Link from "next/link";
import Stripe from "stripe";
import { handleOrderSession } from "@/services/order";
import { redirect } from "next/navigation";

export default async function PaySuccessPage({
  params,
}: {
  params: Promise<{ locale: string; session_id: string }>;
}) {
  const { locale, session_id } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");

  try {
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
    const session = await stripe.checkout.sessions.retrieve(session_id);
    await handleOrderSession(session);

    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
        <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
            ✓
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
            {isZh ? "支付成功" : "Payment Successful"}
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            {isZh
              ? "你的订单已确认，套餐权益会同步到当前账户。你可以回到工作台继续创建和发布表单。"
              : "Your order has been confirmed and plan benefits are now linked to your account. You can return to the console to keep creating and publishing forms."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}/settings`}
              className="rounded-xl bg-brand-blue px-5 py-3 text-sm font-extrabold text-white"
            >
              {isZh ? "查看套餐状态" : "View Plan Status"}
            </Link>
            <Link
              href={`/${locale}/forms`}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-700"
            >
              {isZh ? "返回工作台" : "Back to Console"}
            </Link>
          </div>
        </section>
      </main>
    );
  } catch {
    redirect(`/${locale}/pay-failed`);
  }
}
