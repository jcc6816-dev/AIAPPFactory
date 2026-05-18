import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { WebhookLogRecord } from "@/types/form";

const DEV_WEBHOOK_LOGS_PATH = path.join(
  process.cwd(),
  "data",
  "dev-webhook-logs.json"
);

async function ensureStoreDir() {
  await mkdir(path.dirname(DEV_WEBHOOK_LOGS_PATH), { recursive: true });
}

export async function readDevWebhookLogs(): Promise<WebhookLogRecord[]> {
  try {
    const content = await readFile(DEV_WEBHOOK_LOGS_PATH, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as WebhookLogRecord[];
  } catch {
    return [];
  }
}

export async function writeDevWebhookLogs(logs: WebhookLogRecord[]) {
  await ensureStoreDir();
  await writeFile(
    DEV_WEBHOOK_LOGS_PATH,
    JSON.stringify(logs, null, 2),
    "utf8"
  );
}
