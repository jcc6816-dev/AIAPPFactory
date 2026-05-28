import { FormRecord, FormSubmissionRecord, WebhookLogRecord } from "@/types/form";
import { GrowthEventRecord } from "@/types/growth-event";
import { Order } from "@/types/order";
import { User } from "@/types/user";
import { findUserByUuid } from "@/models/user";
import { getFormSubmissions } from "@/models/form-submission";
import { getFormsByUserUuid } from "@/models/form";
import { getOrdersByUserEmail, getOrdersByUserUuid } from "@/models/order";
import { getWebhookLogs } from "@/models/webhook-log";
import { listGrowthEvents } from "@/models/growth-event";

export interface AdminUserDetail {
  user?: User;
  totals: {
    forms: number;
    publishedForms: number;
    submissions: number;
    webhookFailures: number;
    paidOrders: number;
    revenueCents: number;
    growthEvents: number;
  };
  forms: FormRecord[];
  orders: Order[];
  recentSubmissions: FormSubmissionRecord[];
  recentWebhookFailures: WebhookLogRecord[];
  recentEvents: GrowthEventRecord[];
}

export function buildAdminUserDetail(input: {
  user?: User;
  forms: FormRecord[];
  submissions: FormSubmissionRecord[];
  webhookLogs: WebhookLogRecord[];
  orders: Order[];
  events: GrowthEventRecord[];
}): AdminUserDetail {
  const formUuids = new Set(input.forms.map((form) => form.uuid));
  const userSubmissions = input.submissions.filter((submission) =>
    formUuids.has(submission.form_uuid)
  );
  const userWebhookLogs = input.webhookLogs.filter((log) =>
    formUuids.has(log.form_uuid)
  );
  const paidOrders = input.orders.filter((order) => order.status === "paid");

  return {
    user: input.user,
    totals: {
      forms: input.forms.length,
      publishedForms: input.forms.filter((form) => form.status === "published").length,
      submissions: userSubmissions.length,
      webhookFailures: userWebhookLogs.filter((log) => log.status === "failed").length,
      paidOrders: paidOrders.length,
      revenueCents: paidOrders.reduce((total, order) => total + (order.amount || 0), 0),
      growthEvents: input.events.length,
    },
    forms: input.forms,
    orders: input.orders,
    recentSubmissions: userSubmissions.slice(0, 10),
    recentWebhookFailures: userWebhookLogs
      .filter((log) => log.status === "failed")
      .slice(0, 10),
    recentEvents: input.events.slice(0, 20),
  };
}

export async function getAdminUserDetail(userUuid: string) {
  const user = await findUserByUuid(userUuid);
  if (!user) {
    return buildAdminUserDetail({
      user,
      forms: [],
      submissions: [],
      webhookLogs: [],
      orders: [],
      events: [],
    });
  }

  const forms = await getFormsByUserUuid(userUuid);
  const [submissions, webhookLogs, ordersByUuid, ordersByEmail, events] =
    await Promise.all([
      getFormSubmissions(1, 1000),
      getWebhookLogs(1, 1000),
      getOrdersByUserUuid(userUuid),
      getOrdersByUserEmail(user.email),
      listGrowthEvents(1000),
    ]);

  const orderMap = new Map<string, Order>();
  for (const order of [...(ordersByUuid || []), ...(ordersByEmail || [])]) {
    orderMap.set(order.order_no, order);
  }

  const userEvents = events.filter(
    (event) => event.user_uuid === userUuid || event.user_email === user.email
  );

  return buildAdminUserDetail({
    user,
    forms,
    submissions,
    webhookLogs,
    orders: Array.from(orderMap.values()),
    events: userEvents,
  });
}
