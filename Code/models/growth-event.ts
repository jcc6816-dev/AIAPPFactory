import { GrowthEventRecord } from "@/types/growth-event";
import { getIsoTimestr } from "@/lib/time";
import { getSupabaseClient, hasSupabaseConfig } from "./db";
import { getUniSeq } from "@/lib/hash";
import {
  readDevGrowthEvents,
  writeDevGrowthEvents,
} from "@/lib/dev-growth-event-store";

export async function createGrowthEvent(
  input: Omit<GrowthEventRecord, "uuid" | "created_at">
): Promise<GrowthEventRecord> {
  const event: GrowthEventRecord = {
    ...input,
    uuid: getUniSeq("gevt_"),
    visitor_id: input.visitor_id || "",
    metadata_json: input.metadata_json || {},
    duration_ms: input.duration_ms || 0,
    created_at: getIsoTimestr(),
  };

  if (!hasSupabaseConfig()) {
    const events = await readDevGrowthEvents();
    events.unshift({
      ...event,
      id: events.length + 1,
    });
    await writeDevGrowthEvents(events);
    return event;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("growth_events")
    .insert(event)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as GrowthEventRecord;
}

export async function createGrowthEventSafely(
  input: Omit<GrowthEventRecord, "uuid" | "created_at">
) {
  try {
    return await createGrowthEvent(input);
  } catch (error) {
    console.log("growth event skipped:", error);
    return undefined;
  }
}

export async function listGrowthEvents(limit = 2000): Promise<GrowthEventRecord[]> {
  if (!hasSupabaseConfig()) {
    const events = await readDevGrowthEvents();
    return events.slice(0, limit);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("growth_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data as GrowthEventRecord[];
}
