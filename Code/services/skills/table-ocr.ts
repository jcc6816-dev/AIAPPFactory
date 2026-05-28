import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { updateFormSubmissionByUuid } from "@/models/form-submission";
import { SkillExecutionResult } from "../skill";

export async function runMockTableOcrSkill(
  form: FormRecord,
  submission: FormSubmissionRecord
): Promise<SkillExecutionResult> {
  const hasFiles = submission.files_json && submission.files_json.length > 0;
  
  if (!hasFiles) {
    return {
      code: "table_ocr",
      title: "Table OCR Extraction",
      status: "completed",
      detail: "No files uploaded. Table OCR skipped.",
    };
  }

  const config = form.generation_meta_json?.artifact?.skillSettings?.table_ocr?.config || {};
  let targetKey = config.target_field || "";

  if (!targetKey) {
    // Find if there is a dynamic table field in the form schema to bind data
    const targetField = form.schema_json.fields.find(
      (field) => field.type === "textarea" || field.key.includes("list") || field.key.includes("table")
    );
    targetKey = targetField?.key || "extracted_items_list";
  }

  // Mock extracted grid data array representing N rows of table columns
  const mockTableRows = [
    { item_name: "MacBook Pro 16", qty: 2, spec: "M3 Max / 64GB / 2TB" },
    { item_name: "Dell UltraSharp U2723QE", qty: 4, spec: "27-inch 4K IPS Black" },
    { item_name: "Herman Miller Aeron", qty: 2, spec: "Size B / Mineral" }
  ];

  const stringifiedValue = JSON.stringify(mockTableRows, null, 2);

  // Update submission answers
  const updatedAnswers = {
    ...submission.answers_json,
    [targetKey]: stringifiedValue,
  };

  // Persist updated answers to simulation DB
  await updateFormSubmissionByUuid(submission.uuid, {
    answers_json: updatedAnswers,
    ocr_status: "completed",
    ocr_provider: "mock_table_ocr",
    ocr_result_json: {
      raw_text: "MacBook Pro 16 x2 | Dell U2723QE x4 | Aeron Aeron x2",
      summary: "Successfully extracted 3 row items from tabular list image.",
      structured_data: {
        table_rows: mockTableRows
      },
      processed_at: new Date().toISOString(),
      processed_files: submission.files_json.map((f) => f.file_name)
    }
  });

  // Mutate local memory model reference
  submission.answers_json = updatedAnswers;

  return {
    code: "table_ocr",
    title: "Table OCR Extraction",
    status: "completed",
    detail: `Table OCR Succeeded: Identified 3 records from tabular asset listing. Injected into field: "${targetKey}".`,
    outputPayload: mockTableRows
  };
}
