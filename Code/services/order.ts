import {
  CreditsTransType,
  increaseCredits,
  updateCreditForOrder,
} from "./credit";
import { findOrderByOrderNo, updateOrderStatus, updateOrderSubscription, findOrderBySubId } from "@/models/order";
import { getIsoTimestr, getOneYearLaterTimestr } from "@/lib/time";

import Stripe from "stripe";
import { updateAffiliateForOrder } from "./affiliate";

export async function handleOrderSession(session: Stripe.Checkout.Session) {
  try {
    if (
      !session ||
      !session.metadata ||
      !session.metadata.order_no ||
      session.payment_status !== "paid"
    ) {
      throw new Error("invalid session");
    }

    const order_no = session.metadata.order_no;
    const paid_email =
      session.customer_details?.email || session.customer_email || "";
    const paid_detail = JSON.stringify(session);

    const order = await findOrderByOrderNo(order_no);
    if (!order || order.status !== "created") {
      throw new Error("invalid order");
    }

    const paid_at = getIsoTimestr();

    if (session.mode === "subscription" && session.subscription) {
      const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);

      await updateOrderSubscription(
        order_no,
        sub.id,
        sub.items.data[0]?.plan?.interval_count || 1,
        sub.billing_cycle_anchor,
        sub.current_period_end,
        sub.current_period_start,
        "paid",
        paid_at,
        1,
        paid_email,
        paid_detail
      );
    } else {
      await updateOrderStatus(order_no, "paid", paid_at, paid_email, paid_detail);
    }

    if (order.user_uuid) {
      if (order.credits > 0) {
        // increase credits for paied order
        await updateCreditForOrder(order);
      }

      // update affiliate for paied order
      await updateAffiliateForOrder(order);
    }

    console.log(
      "handle order session successed: ",
      order_no,
      paid_at,
      paid_email,
      paid_detail
    );
  } catch (e) {
    console.log("handle order session failed: ", e);
    throw e;
  }
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (!invoice.subscription) {
      return;
    }

    const subscriptionId = invoice.subscription as string;
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
    const sub = await stripe.subscriptions.retrieve(subscriptionId);

    const order = await findOrderBySubId(subscriptionId);
    if (!order) {
      console.log(`handleInvoicePaymentSucceeded: subscription order not found in db: ${subscriptionId}`);
      return;
    }

    const paid_at = getIsoTimestr();
    const nextTimes = (order.sub_times || 1) + 1;
    const paid_email = invoice.customer_email || invoice.customer_name || order.paid_email || "";
    const paid_detail = JSON.stringify(invoice);

    await updateOrderSubscription(
      order.order_no,
      sub.id,
      order.sub_interval_count || 1,
      sub.billing_cycle_anchor,
      sub.current_period_end,
      sub.current_period_start,
      "paid",
      paid_at,
      nextTimes,
      paid_email,
      paid_detail
    );

    console.log(
      "handleInvoicePaymentSucceeded successed: ",
      order.order_no,
      subscriptionId,
      sub.current_period_end
    );
  } catch (e) {
    console.log("handleInvoicePaymentSucceeded failed: ", e);
    throw e;
  }
}

export async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  try {
    const order = await findOrderBySubId(sub.id);
    if (!order) {
      console.log(`handleSubscriptionDeleted: order not found for sub: ${sub.id}`);
      return;
    }

    const paid_at = getIsoTimestr();
    await updateOrderStatus(
      order.order_no,
      "expired",
      order.paid_at || paid_at,
      order.paid_email || "",
      JSON.stringify(sub)
    );

    console.log(
      "handleSubscriptionDeleted successed, subscription marked as expired: ",
      order.order_no,
      sub.id
    );
  } catch (e) {
    console.log("handleSubscriptionDeleted failed: ", e);
    throw e;
  }
}
