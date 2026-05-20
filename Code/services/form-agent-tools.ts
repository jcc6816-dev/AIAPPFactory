import type { FormSchema } from "@/types/form";

export function summarizeFormSchemaChanges(
  previousSchema: FormSchema | null | undefined,
  nextSchema: FormSchema
): string[] {
  if (!previousSchema) {
    return [`创建了 ${nextSchema.fields.length} 个字段的表单草稿。`];
  }

  const previousFields = previousSchema.fields || [];
  const nextFields = nextSchema.fields || [];
  const previousByKey = new Map(previousFields.map((field) => [field.key, field]));
  const nextByKey = new Map(nextFields.map((field) => [field.key, field]));
  const changes: string[] = [];

  const added = nextFields.filter((field) => !previousByKey.has(field.key));
  const removed = previousFields.filter((field) => !nextByKey.has(field.key));

  if (added.length > 0) {
    changes.push(`新增字段：${added.map((field) => field.label).join("、")}。`);
  }

  if (removed.length > 0) {
    changes.push(`移除字段：${removed.map((field) => field.label).join("、")}。`);
  }

  const updatedLabels = nextFields
    .filter((field) => {
      const previous = previousByKey.get(field.key);
      return previous && previous.label !== field.label;
    })
    .map((field) => field.label);

  if (updatedLabels.length > 0) {
    changes.push(`调整字段文案：${updatedLabels.join("、")}。`);
  }

  if (previousFields.length !== nextFields.length) {
    changes.push(`字段数量从 ${previousFields.length} 个变为 ${nextFields.length} 个。`);
  }

  if (changes.length === 0) {
    changes.push("字段结构没有明显变化，可能主要调整了标题、描述、主题或字段细节。");
  }

  return changes;
}

export function validateFormSchemaForAgent(schema: FormSchema): string[] {
  const warnings: string[] = [];

  if (schema.fields.length > 8) {
    warnings.push("当前字段超过 8 个，移动端填写可能偏长。");
  }

  const fieldsMissingGuidance = schema.fields.filter(
    (field) => !field.placeholder && !field.help_text
  );

  if (fieldsMissingGuidance.length > 0) {
    warnings.push(
      `有 ${fieldsMissingGuidance.length} 个字段缺少 placeholder 或 help_text，后续可继续优化填写引导。`
    );
  }

  const invalidChoiceFields = schema.fields.filter(
    (field) =>
      ["select", "radio", "checkbox"].includes(field.type) &&
      (!field.options || field.options.length === 0)
  );

  if (invalidChoiceFields.length > 0) {
    warnings.push("存在选择类字段但没有选项，需要补充选项后再发布。");
  }

  return warnings;
}
