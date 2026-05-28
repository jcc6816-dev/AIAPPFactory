import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { WorkflowRunRecord } from "@/types/workflow";
import { SkillExecutionResult } from "../skill";
import { updateFormSubmissionByUuid } from "@/models/form-submission";

function collectNumericSignals(answers: Record<string, any>) {
  return Object.entries(answers)
    .map(([key, value]) => ({
      key,
      value:
        typeof value === "number"
          ? value
          : typeof value === "string"
            ? Number(value.replace(/,/g, ""))
            : Number.NaN,
    }))
    .filter((item) => Number.isFinite(item.value));
}

export async function runMockAiInsightsSkill(
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun?: WorkflowRunRecord
): Promise<SkillExecutionResult> {
  const config =
    form.generation_meta_json?.artifact?.skillSettings?.ai_insights?.config ||
    {};
  const summaryStyle = config.summary_style || "business";
  const includeNextActions = config.include_next_actions !== false;
  const answers = submission.answers_json || {};
  const answeredCount = Object.values(answers).filter(
    (value) => value !== null && value !== undefined && String(value).trim() !== ""
  ).length;
  const numericSignals = collectNumericSignals(answers);
  const largestNumber = numericSignals.sort((a, b) => b.value - a.value)[0];
  const completedSkills =
    workflowRun?.steps_json
      ?.filter((step) => step.status === "completed")
      .map((step) => step.code) || [];
  const riskHints: string[] = [];

  if (largestNumber && largestNumber.value >= Number(config.high_value_threshold || 5000)) {
    riskHints.push(`High value detected in ${largestNumber.key}: ${largestNumber.value}`);
  }

  if (completedSkills.includes("ai_pre_audit")) {
    riskHints.push("Compliance pre-audit has been executed.");
  }

  const nextActions = includeNextActions
    ? [
        "Review key fields in the submissions dashboard.",
        riskHints.length > 0
          ? "Prioritize manual review for flagged records."
          : "No urgent follow-up required.",
      ]
    : [];

  const insightPayload = {
    summary: `${form.title} received a submission with ${answeredCount} answered field(s).`,
    summary_style: summaryStyle,
    answered_count: answeredCount,
    numeric_signals: numericSignals,
    risk_hints: riskHints,
    next_actions: nextActions,
    generated_at: new Date().toISOString(),
  };

  await updateFormSubmissionByUuid(submission.uuid, {
    ocr_result_json: {
      ...(submission.ocr_result_json || {}),
      structured_data: {
        ...(submission.ocr_result_json?.structured_data || {}),
        ai_insights: insightPayload,
      },
    },
  });

  return {
    code: "ai_insights",
    title: "AI Summary & Insights",
    status: "completed",
    detail: `AI Insights Succeeded: Generated ${summaryStyle} summary with ${riskHints.length} risk hint(s) and ${nextActions.length} next action(s).`,
    outputPayload: insightPayload,
  };
}
