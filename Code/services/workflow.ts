import { WorkflowRunRecord, WorkflowStepRecord } from "@/types/workflow";

import { FormRecord } from "@/types/form";
import { FormSubmissionRecord } from "@/types/form";
import { executeMockSkill } from "./skill";
import { getIsoTimestr } from "@/lib/time";
import { getUniSeq } from "@/lib/hash";
import { insertWorkflowRun, updateWorkflowRunByUuid } from "@/models/workflow";

function buildInitialWorkflowSteps(): WorkflowStepRecord[] {
  return [
    {
      code: "submission_recorded",
      title: "Submission Recorded",
      status: "completed",
      detail: "The form submission has been stored successfully.",
    },
    {
      code: "ocr",
      title: "OCR Skill",
      status: "pending",
      detail: "This step will be implemented in the next batch.",
    },
    {
      code: "excel_export",
      title: "Excel Export",
      status: "pending",
      detail: "This step will be implemented in the next batch.",
    },
    {
      code: "webhook",
      title: "Webhook Push",
      status: "pending",
      detail: "This step will be implemented in the next batch.",
    },
  ];
}

export async function createWorkflowRunForSubmission(
  form: FormRecord,
  submission: FormSubmissionRecord
): Promise<WorkflowRunRecord> {
  const workflowRun: WorkflowRunRecord = {
    uuid: getUniSeq("run_"),
    form_uuid: form.uuid,
    form_submission_uuid: submission.uuid,
    status: "queued",
    steps_json: buildInitialWorkflowSteps(),
    created_at: getIsoTimestr(),
  };

  return insertWorkflowRun(workflowRun);
}

export async function executeMockWorkflowRun(
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun: WorkflowRunRecord
): Promise<WorkflowRunRecord> {
  const processingSteps: WorkflowStepRecord[] = workflowRun.steps_json.map(
    (step, index) => {
      if (index === 1) {
        return {
          ...step,
          status: "processing",
          detail: "Mock OCR execution is running.",
        };
      }

      return step;
    }
  );

  const processingRun =
    (await updateWorkflowRunByUuid(workflowRun.uuid, {
      status: "processing",
      steps_json: processingSteps,
    })) || workflowRun;

  const completedSteps: WorkflowStepRecord[] = [];
  let hasFailure = false;
  for (const step of processingRun.steps_json) {
    if (step.code === "submission_recorded") {
      completedSteps.push(step);
      continue;
    }

    const currentRunSnapshot: WorkflowRunRecord = {
      ...processingRun,
      steps_json: [...completedSteps, step],
    };
    const result = await executeMockSkill(
      step.code,
      form,
      submission,
      currentRunSnapshot
    );
    completedSteps.push({
      code: result.code,
      title: result.title,
      status: result.status,
      detail: result.detail,
    });

    if (result.status === "failed") {
      hasFailure = true;
    }
  }

  return (
    (await updateWorkflowRunByUuid(workflowRun.uuid, {
      status: hasFailure ? "failed" : "completed",
      steps_json: completedSteps,
      finished_at: getIsoTimestr(),
      error_message: hasFailure ? "One or more workflow steps failed." : "",
    })) || processingRun
  );
}
