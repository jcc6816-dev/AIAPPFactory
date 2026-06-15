import { FormRecord, FormSubmissionRecord, WebhookLogRecord } from "@/types/form";

import { Order } from "@/types/order";
import { SupportTicket } from "@/types/support-ticket";
import { User } from "@/types/user";
import { getFormSubmissions } from "@/models/form-submission";
import { getForms } from "@/models/form";
import { getPaiedOrders } from "@/models/order";
import { getUsers } from "@/models/user";
import { getWebhookLogs } from "@/models/webhook-log";
import { listSupportTickets } from "@/models/support-ticket";

export interface AdminDashboardMetrics {
  totals: {
    users: number;
    forms: number;
    publishedForms: number;
    submissions: number;
    paidOrders: number;
    revenueCents: number;
    webhookFailed: number;
    openTickets: number;
  };
  sparklines?: {
    users: number[];
    forms: number[];
    submissions: number[];
  };
  recent: {
    users: User[];
    forms: FormRecord[];
    orders: Order[];
    submissions: FormSubmissionRecord[];
    tickets: SupportTicket[];
    webhookFailures: WebhookLogRecord[];
  };
}

function sumPaidRevenue(orders: Order[]) {
  return orders.reduce((sum, order) => sum + (order.amount || 0), 0);
}

function sortByCreatedAt<T extends { created_at?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = a.created_at ? new Date(a.created_at).getTime() : 0;
    const right = b.created_at ? new Date(b.created_at).getTime() : 0;
    return right - left;
  });
}

function getPast7DaysCounts<T extends { created_at?: string }>(items: T[]): number[] {
  const counts = Array(7).fill(0);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (const item of items) {
    if (!item.created_at) continue;
    const date = new Date(item.created_at);
    const itemDayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    
    const diffDays = Math.floor((todayStart - itemDayStart) / oneDayMs);
    if (diffDays >= 0 && diffDays < 7) {
      counts[6 - diffDays] += 1;
    }
  }
  return counts;
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const [allUsers, forms, submissions, webhookLogs, orders, tickets] =
    await Promise.all([
      getUsers(1, 1000, true),
      getForms(1, 500),
      getFormSubmissions(1, 1000),
      getWebhookLogs(1, 1000),
      getPaiedOrders(1, 500),
      listSupportTickets(),
    ]);

  const safeAllUsers = allUsers || [];
  const testUserUuids = new Set(
    safeAllUsers
      .filter((user) => user.email && user.email.includes("local.aifactory"))
      .map((user) => user.uuid)
  );

  const prodUsers = safeAllUsers.filter((user) => !testUserUuids.has(user.uuid));
  const prodForms = (forms || []).filter((form) => !testUserUuids.has(form.user_uuid));
  const prodFormUuids = new Set(prodForms.map((form) => form.uuid));

  const prodSubmissions = (submissions || []).filter((sub) => prodFormUuids.has(sub.form_uuid));
  const prodOrders = (orders || []).filter(
    (order) =>
      !testUserUuids.has(order.user_uuid) &&
      !(order.user_email && order.user_email.includes("local.aifactory"))
  );
  const prodWebhookLogs = (webhookLogs || []).filter((log) => prodFormUuids.has(log.form_uuid));
  const failedWebhookLogs = prodWebhookLogs.filter((log) => log.status === "failed");
  const prodTickets = (tickets || []).filter(
    (ticket) =>
      !testUserUuids.has(ticket.user_uuid) &&
      !(ticket.user_email && ticket.user_email.includes("local.aifactory"))
  );

  return {
    totals: {
      users: prodUsers.length,
      forms: prodForms.length,
      publishedForms: prodForms.filter((form) => form.status === "published").length,
      submissions: prodSubmissions.length,
      paidOrders: prodOrders.length,
      revenueCents: sumPaidRevenue(prodOrders),
      webhookFailed: failedWebhookLogs.length,
      openTickets: prodTickets.filter((ticket) => ticket.status === "open").length,
    },
    sparklines: {
      users: getPast7DaysCounts(prodUsers),
      forms: getPast7DaysCounts(prodForms),
      submissions: getPast7DaysCounts(prodSubmissions),
    },
    recent: {
      users: sortByCreatedAt(prodUsers).slice(0, 5),
      forms: sortByCreatedAt(prodForms).slice(0, 5),
      orders: sortByCreatedAt(prodOrders).slice(0, 5),
      submissions: sortByCreatedAt(prodSubmissions).slice(0, 5),
      tickets: sortByCreatedAt(prodTickets).slice(0, 5),
      webhookFailures: sortByCreatedAt(failedWebhookLogs).slice(0, 5),
    },
  };
}

export function formatRevenue(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

