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
  const [users, forms, submissions, webhookLogs, orders, tickets] =
    await Promise.all([
      getUsers(1, 200),
      getForms(1, 200),
      getFormSubmissions(1, 500),
      getWebhookLogs(1, 500),
      getPaiedOrders(1, 200),
      listSupportTickets(),
    ]);

  const safeUsers = users || [];
  const safeOrders = orders || [];
  const failedWebhookLogs = webhookLogs.filter((log) => log.status === "failed");

  return {
    totals: {
      users: safeUsers.length,
      forms: forms.length,
      publishedForms: forms.filter((form) => form.status === "published").length,
      submissions: submissions.length,
      paidOrders: safeOrders.length,
      revenueCents: sumPaidRevenue(safeOrders),
      webhookFailed: failedWebhookLogs.length,
      openTickets: tickets.filter((ticket) => ticket.status === "open").length,
    },
    sparklines: {
      users: getPast7DaysCounts(safeUsers),
      forms: getPast7DaysCounts(forms),
      submissions: getPast7DaysCounts(submissions),
    },
    recent: {
      users: sortByCreatedAt(safeUsers).slice(0, 5),
      forms: sortByCreatedAt(forms).slice(0, 5),
      orders: sortByCreatedAt(safeOrders).slice(0, 5),
      submissions: sortByCreatedAt(submissions).slice(0, 5),
      tickets: sortByCreatedAt(tickets).slice(0, 5),
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

