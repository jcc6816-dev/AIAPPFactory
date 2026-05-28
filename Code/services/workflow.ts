import { WorkflowRunRecord, WorkflowStepRecord } from "@/types/workflow";

import { FormRecord } from "@/types/form";
import { FormSubmissionRecord } from "@/types/form";
import { executeMockSkill } from "./skill";
import { getIsoTimestr } from "@/lib/time";
import { getUniSeq } from "@/lib/hash";
import { insertWorkflowRun, updateWorkflowRunByUuid } from "@/models/workflow";
import { isFormSkillEnabled } from "./form-skills";

function buildInitialWorkflowSteps(form: FormRecord): WorkflowStepRecord[] {
  const steps: WorkflowStepRecord[] = [
    {
      code: "submission_recorded",
      title: "Submission Recorded",
      status: "completed",
      detail: "The form submission has been stored successfully.",
    },
  ];

  if (isFormSkillEnabled(form, "deduplication")) {
    steps.push({
      code: "deduplication",
      title: "Deduplication Check",
      status: "pending",
      detail: "Scanning payloads for duplicate asset hashes or unique serial numbers.",
    });
  }

  if (isFormSkillEnabled(form, "data_cleaning")) {
    steps.push({
      code: "data_cleaning",
      title: "AI Data Cleaning",
      status: "pending",
      detail: "Normalizing names, email, phone and free-text values before downstream automation.",
    });
  }

  // 2. Append Table OCR / Single OCR if template exists
  if (isFormSkillEnabled(form, "table_ocr")) {
    steps.push({
      code: "table_ocr",
      title: "Table OCR Extraction",
      status: "pending",
      detail: `Extracting table rows from uploaded images.`,
    });
  } else if (form.ocr_template && isFormSkillEnabled(form, "ocr")) {
    steps.push({
      code: "ocr",
      title: "OCR Skill",
      status: "pending",
      detail: `Extracting text fields using OCR template: ${form.ocr_template}.`,
    });
  }

  if (isFormSkillEnabled(form, "ai_pre_audit")) {
    steps.push({
      code: "ai_pre_audit",
      title: "AI Compliance Pre-audit",
      status: "pending",
      detail: "Scanning input values against default corporate limit thresholds.",
    });
  }

  if (isFormSkillEnabled(form, "report_export")) {
    steps.push({
      code: "report_export",
      title: "Report Export",
      status: "pending",
      detail: "Assembling flat and grouped excel templates.",
    });
  }

  if (isFormSkillEnabled(form, "ai_insights")) {
    steps.push({
      code: "ai_insights",
      title: "AI Summary & Insights",
      status: "pending",
      detail: "Generating submission summary, signals and recommended follow-up actions.",
    });
  }

  if (isFormSkillEnabled(form, "email_notification")) {
    steps.push({
      code: "email_notification",
      title: "Email Notification",
      status: "pending",
      detail: "Sending confirmation email to recipients.",
    });
  }

  // 5. Append Webhook Push if enabled
  if (form.webhook_enabled) {
    steps.push({
      code: "webhook",
      title: "Webhook Push",
      status: "pending",
      detail: `Pushing payload to: ${form.webhook_url}.`,
    });
  }

  return steps;
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
    steps_json: buildInitialWorkflowSteps(form),
    created_at: getIsoTimestr(),
  };

  return insertWorkflowRun(workflowRun);
}

export async function executeMockWorkflowRun(
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun: WorkflowRunRecord
): Promise<WorkflowRunRecord> {
  let currentRun = await updateWorkflowRunByUuid(workflowRun.uuid, {
    status: "processing",
  }) || workflowRun;

  const completedSteps: WorkflowStepRecord[] = [];
  let hasFailure = false;

  for (const step of currentRun.steps_json) {
    if (step.code === "submission_recorded") {
      completedSteps.push({
        ...step,
        durationMs: 5,
      });
      continue;
    }

    // Mark current step as processing
    const processingSteps = currentRun.steps_json.map((s) => {
      if (s.code === step.code) {
        return {
          ...s,
          status: "processing" as const,
          detail: `Executing ${s.title}...`,
        };
      }
      const finished = completedSteps.find((cs) => cs.code === s.code);
      if (finished) return finished;
      return s;
    });

    currentRun = await updateWorkflowRunByUuid(workflowRun.uuid, {
      steps_json: processingSteps,
    }) || currentRun;

    const currentRunSnapshot: WorkflowRunRecord = {
      ...currentRun,
      steps_json: processingSteps,
    };

    // Add a small randomized mock latency for realism (80ms - 380ms)
    const mockLatency = Math.floor(Math.random() * 300) + 80;
    await new Promise((resolve) => setTimeout(resolve, mockLatency));

    const startTime = Date.now();
    const result = await executeMockSkill(
      step.code,
      form,
      submission,
      currentRunSnapshot
    );
    const durationMs = (Date.now() - startTime) + mockLatency;

    const finalizedStep: WorkflowStepRecord = {
      code: result.code,
      title: result.title,
      status: result.status === "completed" ? "completed" : "failed",
      detail: result.detail,
      durationMs,
    };

    completedSteps.push(finalizedStep);

    if (result.status === "failed") {
      hasFailure = true;
      // Short-circuit: mark remaining steps as aborted/pending and break
      const remainingSteps = currentRun.steps_json.slice(completedSteps.length).map((s) => ({
        ...s,
        status: "pending" as const,
        detail: `Skipped: Previous step "${step.title}" failed.`,
        durationMs: 0,
      }));
      completedSteps.push(...remainingSteps);
      break;
    }
  }

  return (
    (await updateWorkflowRunByUuid(workflowRun.uuid, {
      status: hasFailure ? "failed" : "completed",
      steps_json: completedSteps,
      finished_at: getIsoTimestr(),
      error_message: hasFailure ? "One or more workflow steps failed." : "",
    })) || currentRun
  );
}
