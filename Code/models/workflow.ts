import { WorkflowRunRecord } from "@/types/workflow";
import { getSupabaseClient, hasSupabaseConfig } from "./db";

import { readDevWorkflowRuns, writeDevWorkflowRuns } from "@/lib/dev-workflow-run-store";

export async function insertWorkflowRun(
  workflowRun: WorkflowRunRecord
): Promise<WorkflowRunRecord> {
  if (!hasSupabaseConfig()) {
    const runs = await readDevWorkflowRuns();
    const nextRun: WorkflowRunRecord = {
      ...workflowRun,
      id: runs.length + 1,
    };
    runs.unshift(nextRun);
    await writeDevWorkflowRuns(runs);
    return nextRun;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .insert({
      ...workflowRun,
      steps_json: workflowRun.steps_json,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as WorkflowRunRecord;
}

export async function findWorkflowRunByUuid(
  uuid: string
): Promise<WorkflowRunRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const runs = await readDevWorkflowRuns();
    return runs.find((run) => run.uuid === uuid);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    return undefined;
  }

  return data as WorkflowRunRecord;
}

export async function updateWorkflowRunByUuid(
  uuid: string,
  updates: Partial<WorkflowRunRecord>
): Promise<WorkflowRunRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const runs = await readDevWorkflowRuns();
    const index = runs.findIndex((run) => run.uuid === uuid);
    if (index < 0) {
      return undefined;
    }

    const nextRun: WorkflowRunRecord = {
      ...runs[index],
      ...updates,
    };
    runs[index] = nextRun;
    await writeDevWorkflowRuns(runs);
    return nextRun;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .update({
      ...updates,
      steps_json: updates.steps_json,
    })
    .eq("uuid", uuid)
    .select("*")
    .single();

  if (error) {
    return undefined;
  }

  return data as WorkflowRunRecord;
}
