import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { Credit } from "@/types/credit";

const DEV_CREDITS_PATH = path.join(process.cwd(), "data", "dev-credits.json");

async function ensureStoreDir() {
  await mkdir(path.dirname(DEV_CREDITS_PATH), { recursive: true });
}

export async function readDevCredits(): Promise<Credit[]> {
  try {
    const content = await readFile(DEV_CREDITS_PATH, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Credit[];
  } catch {
    return [];
  }
}

export async function writeDevCredits(credits: Credit[]) {
  await ensureStoreDir();
  await writeFile(DEV_CREDITS_PATH, JSON.stringify(credits, null, 2), "utf8");
}
