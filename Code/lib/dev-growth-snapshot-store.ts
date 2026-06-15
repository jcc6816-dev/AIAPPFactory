import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { GrowthMetricSnapshotRecord } from "@/types/growth-metric-snapshot";

const DEV_GROWTH_SNAPSHOTS_PATH = path.join(
  process.cwd(),
  "data",
  "dev-growth-snapshots.json"
);

async function ensureStoreDir() {
  await mkdir(path.dirname(DEV_GROWTH_SNAPSHOTS_PATH), { recursive: true });
}

export async function readDevGrowthSnapshots(): Promise<GrowthMetricSnapshotRecord[]> {
  try {
    const content = await readFile(DEV_GROWTH_SNAPSHOTS_PATH, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as GrowthMetricSnapshotRecord[];
  } catch {
    return [];
  }
}

export async function writeDevGrowthSnapshots(snapshots: GrowthMetricSnapshotRecord[]) {
  await ensureStoreDir();
  await writeFile(
    DEV_GROWTH_SNAPSHOTS_PATH,
    JSON.stringify(snapshots.slice(0, 5000), null, 2),
    "utf8"
  );
}
