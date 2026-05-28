import {
  SupportTicket,
  SupportTicketCategory,
  SupportTicketStatus,
} from "@/types/support-ticket";

import { getIsoTimestr } from "@/lib/time";
import { getSupabaseClient } from "./db";
import { getUniSeq } from "@/lib/hash";

export const SUPPORT_TICKET_CATEGORIES: SupportTicketCategory[] = [
  "general",
  "generation",
  "template",
  "publish",
  "webhook",
  "billing",
  "bug",
  "feature",
];

export const SUPPORT_TICKET_STATUSES: SupportTicketStatus[] = [
  "open",
  "replied",
  "closed",
];

export function normalizeSupportTicketCategory(
  category?: string
): SupportTicketCategory {
  if (
    category &&
    SUPPORT_TICKET_CATEGORIES.includes(category as SupportTicketCategory)
  ) {
    return category as SupportTicketCategory;
  }

  return "general";
}

export function normalizeSupportTicketStatus(
  status?: string
): SupportTicketStatus {
  if (status && SUPPORT_TICKET_STATUSES.includes(status as SupportTicketStatus)) {
    return status as SupportTicketStatus;
  }

  return "open";
}

export async function createSupportTicket(input: {
  user_uuid: string;
  user_email: string;
  category?: string;
  title: string;
  message: string;
}) {
  const now = getIsoTimestr();
  const ticket: SupportTicket = {
    uuid: getUniSeq("ticket_"),
    user_uuid: input.user_uuid,
    user_email: input.user_email,
    category: normalizeSupportTicketCategory(input.category),
    title: input.title.trim(),
    message: input.message.trim(),
    status: "open",
    admin_reply: "",
    admin_email: "",
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .insert(ticket)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as SupportTicket;
}

export async function listSupportTicketsByUser(user_uuid: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_uuid", user_uuid)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data as SupportTicket[];
}

export async function listSupportTickets(status?: string) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status && SUPPORT_TICKET_STATUSES.includes(status as SupportTicketStatus)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  return data as SupportTicket[];
}

export async function replySupportTicket(input: {
  uuid: string;
  admin_email: string;
  reply: string;
  status?: string;
}) {
  const now = getIsoTimestr();
  const status = normalizeSupportTicketStatus(input.status || "replied");
  const updates: Partial<SupportTicket> = {
    status,
    admin_reply: input.reply.trim(),
    admin_email: input.admin_email,
    replied_at: now,
    updated_at: now,
  };

  if (status === "closed") {
    updates.closed_at = now;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .update(updates)
    .eq("uuid", input.uuid)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as SupportTicket;
}
