export type WorkflowRunStatus = "queued" | "processing" | "completed" | "failed";

export type WorkflowStepStatus =
  | "completed"
  | "processing"
  | "pending"
  | "failed";

export interface WorkflowStepRecord {
  code: string;
  title: string;
  status: WorkflowStepStatus;
  detail?: string;
  durationMs?: number;
}

export interface WorkflowRunRecord {
  id?: number;
  uuid: string;
  form_uuid: string;
  form_submission_uuid: string;
  status: WorkflowRunStatus;
  steps_json: WorkflowStepRecord[];
  error_message?: string;
  created_at?: string;
  finished_at?: string;
}
