import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { GrowthEventRecord } from "@/types/growth-event";

const DEV_GROWTH_EVENTS_PATH = path.join(
  process.cwd(),
  "data",
  "dev-growth-events.json"
);

async function ensureStoreDir() {
  await mkdir(path.dirname(DEV_GROWTH_EVENTS_PATH), { recursive: true });
}

export async function readDevGrowthEvents(): Promise<GrowthEventRecord[]> {
  try {
    const content = await readFile(DEV_GROWTH_EVENTS_PATH, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as GrowthEventRecord[];
  } catch {
    return [];
  }
}

export async function writeDevGrowthEvents(events: GrowthEventRecord[]) {
  await ensureStoreDir();
  await writeFile(
    DEV_GROWTH_EVENTS_PATH,
    JSON.stringify(events.slice(0, 5000), null, 2),
    "utf8"
  );
}
