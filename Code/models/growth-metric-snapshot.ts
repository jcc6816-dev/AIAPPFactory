import { GrowthMetricSnapshotRecord } from "@/types/growth-metric-snapshot";
import { getSupabaseClient, hasSupabaseConfig } from "./db";
import { getUniSeq } from "@/lib/hash";
import { getIsoTimestr } from "@/lib/time";
import {
  readDevGrowthSnapshots,
  writeDevGrowthSnapshots,
} from "@/lib/dev-growth-snapshot-store";

export async function upsertGrowthMetricSnapshot(
  input: Omit<GrowthMetricSnapshotRecord, "uuid" | "fetched_at" | "created_at">
): Promise<GrowthMetricSnapshotRecord> {
  const nowStr = getIsoTimestr();
  const segment = input.segment || "default";

  if (!hasSupabaseConfig()) {
    // Development fallback
    const snapshots = await readDevGrowthSnapshots();
    const existingIndex = snapshots.findIndex(
      (s) =>
        s.snapshot_date === input.snapshot_date &&
        s.source === input.source &&
        s.range === input.range &&
        s.segment === segment
    );

    const record: GrowthMetricSnapshotRecord = {
      ...input,
      segment,
      uuid: existingIndex >= 0 ? snapshots[existingIndex].uuid : getUniSeq("gms_"),
      fetched_at: nowStr,
      created_at: existingIndex >= 0 ? snapshots[existingIndex].created_at : nowStr,
    };

    if (existingIndex >= 0) {
      snapshots[existingIndex] = record;
    } else {
      snapshots.push(record);
    }

    await writeDevGrowthSnapshots(snapshots);
    return record;
  }

  // Supabase implementation
  const supabase = getSupabaseClient();
  
  // Query to check if a record with the same unique key already exists to preserve its uuid
  const { data: existingRecord, error: selectError } = await supabase
    .from("growth_metric_snapshots")
    .select("uuid")
    .eq("snapshot_date", input.snapshot_date)
    .eq("source", input.source)
    .eq("range", input.range)
    .eq("segment", segment)
    .maybeSingle();

  if (selectError) {
    console.error("Supabase select error in upsertGrowthMetricSnapshot:", selectError);
    throw selectError;
  }

  const activeUuid = existingRecord?.uuid || getUniSeq("gms_");
  
  // We prepare a record for upserting
  const upsertRecord = {
    ...input,
    segment,
    uuid: activeUuid,
    fetched_at: nowStr,
  };

  // Perform upsert with onConflict on unique columns
  // Note: if postgres database unique constraint triggers, it will update existing row.
  const { data, error } = await supabase
    .from("growth_metric_snapshots")
    .upsert(upsertRecord, {
      onConflict: "snapshot_date,source,range,segment",
    })
    .select("*")
    .single();

  if (error) {
    console.error("Supabase upsertGrowthMetricSnapshot error:", error);
    throw error;
  }

  return data as GrowthMetricSnapshotRecord;
}

export async function getGrowthMetricSnapshot(
  snapshot_date: string,
  source: string,
  range: string,
  segment = "default"
): Promise<GrowthMetricSnapshotRecord | null> {
  if (!hasSupabaseConfig()) {
    const snapshots = await readDevGrowthSnapshots();
    const found = snapshots.find(
      (s) =>
        s.snapshot_date === snapshot_date &&
        s.source === source &&
        s.range === range &&
        s.segment === segment
    );
    return found || null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("growth_metric_snapshots")
    .select("*")
    .eq("snapshot_date", snapshot_date)
    .eq("source", source)
    .eq("range", range)
    .eq("segment", segment)
    .maybeSingle();

  if (error) {
    console.error("Supabase getGrowthMetricSnapshot error:", error);
    throw error;
  }

  return data as GrowthMetricSnapshotRecord | null;
}

export async function listGrowthMetricSnapshots(
  source: string,
  limit = 100
): Promise<GrowthMetricSnapshotRecord[]> {
  if (!hasSupabaseConfig()) {
    const snapshots = await readDevGrowthSnapshots();
    return snapshots
      .filter((s) => s.source === source)
      .sort((a, b) => b.snapshot_date.localeCompare(a.snapshot_date))
      .slice(0, limit);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("growth_metric_snapshots")
    .select("*")
    .eq("source", source)
    .order("snapshot_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase listGrowthMetricSnapshots error:", error);
    throw error;
  }

  return (data || []) as GrowthMetricSnapshotRecord[];
}

export async function getLatestSnapshot(
  source: string,
  range: string,
  segment = "default"
): Promise<GrowthMetricSnapshotRecord | null> {
  if (!hasSupabaseConfig()) {
    const snapshots = await readDevGrowthSnapshots();
    const filtered = snapshots
      .filter((s) => s.source === source && s.range === range && s.segment === segment && s.status === "success")
      .sort((a, b) => b.snapshot_date.localeCompare(a.snapshot_date));
    return filtered[0] || null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("growth_metric_snapshots")
    .select("*")
    .eq("source", source)
    .eq("range", range)
    .eq("segment", segment)
    .eq("status", "success")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Supabase getLatestSnapshot error:", error);
    throw error;
  }

  return data as GrowthMetricSnapshotRecord | null;
}
