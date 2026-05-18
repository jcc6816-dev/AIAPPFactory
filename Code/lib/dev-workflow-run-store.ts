import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { WorkflowRunRecord } from "@/types/workflow";

const DEV_WORKFLOW_RUNS_PATH = path.join(
  process.cwd(),
  "data",
  "dev-workflow-runs.json"
);

async function ensureStoreDir() {
  await mkdir(path.dirname(DEV_WORKFLOW_RUNS_PATH), { recursive: true });
}

export async function readDevWorkflowRuns(): Promise<WorkflowRunRecord[]> {
  try {
    const content = await readFile(DEV_WORKFLOW_RUNS_PATH, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as WorkflowRunRecord[];
  } catch {
    return [];
  }
}

export async function writeDevWorkflowRuns(runs: WorkflowRunRecord[]) {
  await ensureStoreDir();
  await writeFile(
    DEV_WORKFLOW_RUNS_PATH,
    JSON.stringify(runs, null, 2),
    "utf8"
  );
}
