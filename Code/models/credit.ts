import { Credit } from "@/types/credit";
import { getSupabaseClient, hasSupabaseConfig } from "@/models/db";

import { readDevCredits, writeDevCredits } from "@/lib/dev-credit-store";

export async function insertCredit(credit: Credit) {
  if (!hasSupabaseConfig()) {
    const credits = await readDevCredits();
    credits.unshift(credit);
    await writeDevCredits(credits);
    return credit;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("credits").insert(credit);

  if (error) {
    throw error;
  }

  return data;
}

export async function findCreditByTransNo(
  trans_no: string
): Promise<Credit | undefined> {
  if (!hasSupabaseConfig()) {
    const credits = await readDevCredits();
    return credits.find((credit) => credit.trans_no === trans_no);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("credits")
    .select("*")
    .eq("trans_no", trans_no)
    .limit(1)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function findCreditByOrderNo(
  order_no: string
): Promise<Credit | undefined> {
  if (!hasSupabaseConfig()) {
    const credits = await readDevCredits();
    return credits.find((credit) => credit.order_no === order_no);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("credits")
    .select("*")
    .eq("order_no", order_no)
    .limit(1)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function getUserValidCredits(
  user_uuid: string
): Promise<Credit[] | undefined> {
  if (!hasSupabaseConfig()) {
    const now = new Date().toISOString();
    const credits = await readDevCredits();
    return credits
      .filter(
        (credit) =>
          credit.user_uuid === user_uuid &&
          (!credit.expired_at || credit.expired_at >= now)
      )
      .sort((a, b) => (a.expired_at || "").localeCompare(b.expired_at || ""));
  }

  const now = new Date().toISOString();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("credits")
    .select("*")
    .eq("user_uuid", user_uuid)
    .gte("expired_at", now)
    .order("expired_at", { ascending: true });

  if (error) {
    return undefined;
  }

  return data;
}

export async function getCreditsByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<Credit[] | undefined> {
  if (!hasSupabaseConfig()) {
    const credits = await readDevCredits();
    return credits
      .filter((credit) => credit.user_uuid === user_uuid)
      .slice((page - 1) * limit, page * limit);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("credits")
    .select("*")
    .eq("user_uuid", user_uuid)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    return undefined;
  }

  return data;
}
