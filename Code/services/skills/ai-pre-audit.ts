import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { SkillExecutionResult } from "../skill";

export async function runMockAiPreAuditSkill(
  form: FormRecord,
  submission: FormSubmissionRecord
): Promise<SkillExecutionResult> {
  const config = form.generation_meta_json?.artifact?.skillSettings?.ai_pre_audit?.config || {};
  const maxAmount = Number(config.max_amount) || 5000;
  const policyRules = (config.policy_rules || "").trim();

  // Check if amount or total numbers exceed maxAmount in text/number fields
  let totalAmount = 0;
  let hasLimitViolation = false;

  for (const [key, value] of Object.entries(submission.answers_json)) {
    const num = Number(value);
    if (Number.isFinite(num) && (key.includes("amount") || key.includes("price") || key.includes("cost") || key.includes("total"))) {
      totalAmount = Math.max(totalAmount, num);
    }
  }

  // Check limit threshold
  if (totalAmount > maxAmount) {
    hasLimitViolation = true;
  }

  // Check custom policy rules (e.g. check if a justification keyword is missing when required)
  let policyViolationMsg = "";
  if (policyRules) {
    const stringifiedAnswers = JSON.stringify(submission.answers_json).toLowerCase();
    
    // Simulate auditing rules
    const ruleLower = policyRules.toLowerCase();
    if (ruleLower.includes("justification") || ruleLower.includes("事由") || ruleLower.includes("原因")) {
      const hasJustificationField = Object.keys(submission.answers_json).some(k => k.includes("reason") || k.includes("justification") || k.includes("purpose") || k.includes("事由"));
      const justificationVal = Object.entries(submission.answers_json).find(([k]) => k.includes("reason") || k.includes("justification") || k.includes("purpose") || k.includes("事由"))?.[1];
      
      if (!hasJustificationField || !justificationVal || String(justificationVal).trim().length < 3) {
        hasLimitViolation = true;
        policyViolationMsg = `Missing or incomplete business justification as required by policy: "${policyRules}".`;
      }
    }
    
    // Check if user inputs generic blocked keywords
    if (stringifiedAnswers.includes("macbook") || stringifiedAnswers.includes("expensive") || stringifiedAnswers.includes("duplicate")) {
      hasLimitViolation = true;
      policyViolationMsg = `Detected suspicious purchase keywords ("macbook"/"expensive") violating custom audit rules: "${policyRules}".`;
    }
  }

  if (hasLimitViolation) {
    return {
      code: "ai_pre_audit",
      title: "AI Compliance Pre-audit",
      status: "completed",
      detail: policyViolationMsg 
        ? `AI Audit WARNING: ${policyViolationMsg} Flagged for review.`
        : `AI Audit WARNING: Submission exceeds expenditure limit threshold ($${maxAmount} limit, found item worth $${totalAmount}). Automatically flagged for priority review by Finance Director.`,
    };
  }

  return {
    code: "ai_pre_audit",
    title: "AI Compliance Pre-audit",
    status: "completed",
    detail: policyRules
      ? `AI Audit PASSED: Inputs verified against custom policy guidelines ("${policyRules}") and single-item limit of $${maxAmount}.`
      : `AI Audit PASSED: Form inputs validated against basic corporate policies. Zero compliance warnings issued.`,
  };
}
