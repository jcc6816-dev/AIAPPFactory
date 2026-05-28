import { getUserEmail, getUserUuid } from "@/services/user";
import Stripe from "stripe";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return Response.redirect(`${baseUrl}/${locale}/auth/signin`, 302);
    }

    const user_email = await getUserEmail();
    if (!user_email) {
      return Response.redirect(`${baseUrl}/${locale}/settings?error=no_email`, 302);
    }

    const stripeKey = process.env.STRIPE_PRIVATE_KEY;
    if (!stripeKey) {
      throw new Error("missing stripe config");
    }

    const stripe = new Stripe(stripeKey);

    // Look up the customer by email in Stripe registry
    const customers = await stripe.customers.list({
      email: user_email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      // User has no Stripe customer record, redirect to settings with an alert tag
      return Response.redirect(`${baseUrl}/${locale}/settings?error=no_billing_history`, 302);
    }

    const customerId = customers.data[0].id;

    // Create the billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/${locale}/settings`,
    });

    return Response.redirect(session.url, 302);
  } catch (e: any) {
    console.log("create billing portal session failed: ", e);
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
    return Response.redirect(`${baseUrl}/en/settings?error=portal_failed`, 302);
  }
}
