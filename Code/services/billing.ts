import {
  getOrdersByPaidEmail,
  getOrdersByUserUuid,
} from "@/models/order";

import {
  CreditsAmount,
  CreditsTransType,
  decreaseCredits,
  getUserCredits,
} from "@/services/credit";
import { FormRecord } from "@/types/form";
import { Order } from "@/types/order";

export interface BillingPlanSummary {
  planName: "Free" | "Pro";
  isPaidUser: boolean;
  leftCredits: number;
  latestOrder?: Order;
  paidOrders: Order[];
  statusLabel: string;
  renewalLabel: string;
  benefits: string[];
}

function sortOrdersByCreatedAt(orders: Order[]) {
  return [...orders].sort((a, b) => {
    const left = a.created_at ? new Date(a.created_at).getTime() : 0;
    const right = b.created_at ? new Date(b.created_at).getTime() : 0;
    return right - left;
  });
}

export function buildBillingPlanSummary(input: {
  paidOrders: Order[];
  leftCredits: number;
  isPaidUser?: boolean;
}): BillingPlanSummary {
  const paidOrders = sortOrdersByCreatedAt(input.paidOrders);
  const latestOrder = paidOrders[0];
  const isPaidUser = Boolean(input.isPaidUser || paidOrders.length > 0);

  return {
    planName: isPaidUser ? "Pro" : "Free",
    isPaidUser,
    leftCredits: input.leftCredits,
    latestOrder,
    paidOrders,
    statusLabel: isPaidUser ? "Active" : "Free allowance",
    renewalLabel: latestOrder?.expired_at
      ? `Valid until ${latestOrder.expired_at.slice(0, 10)}`
      : isPaidUser
        ? "Active paid access"
        : "Upgrade when you need more published forms",
    benefits: isPaidUser
      ? [
          "More AI forms",
          "Webhook delivery and retry logs",
          "Advanced visual directions",
          "Priority product support",
        ]
      : [
          "1 published form",
          "Template-based generation",
          "Share link and QR code",
          "Basic submissions dashboard",
        ],
  };
}

export async function getBillingPlanSummary(
  user_uuid: string,
  user_email?: string
) {
  const [credits, ordersByUuid, ordersByPaidEmail] = await Promise.all([
    getUserCredits(user_uuid),
    getOrdersByUserUuid(user_uuid).catch(() => []),
    user_email
      ? getOrdersByPaidEmail(user_email).catch(() => [])
      : Promise.resolve(undefined),
  ]);

  const orderMap = new Map<string, Order>();
  [...(ordersByUuid || []), ...(ordersByPaidEmail || [])].forEach((order) => {
    orderMap.set(order.order_no, order);
  });

  return buildBillingPlanSummary({
    paidOrders: Array.from(orderMap.values()),
    leftCredits: credits.left_credits,
    isPaidUser: credits.is_recharged || credits.is_pro,
  });
}

export async function chargeFormSubmissionCredits(form: FormRecord) {
  const credits = await getUserCredits(form.user_uuid);
  if (credits.left_credits <= 0) {
    return;
  }

  await decreaseCredits({
    user_uuid: form.user_uuid,
    trans_type: CreditsTransType.FormSubmit,
    credits: CreditsAmount.FormSubmitCost,
  });
}
