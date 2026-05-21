import type { FormSchema } from "@/types/form";

function describeRequired(required?: boolean) {
  return required ? "必填" : "选填";
}

function getOptionValues(field: FormSchema["fields"][number]) {
  return (field.options || []).map((option) => `${option.label}:${option.value}`);
}

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

  const updatedTypes = nextFields
    .map((field) => {
      const previous = previousByKey.get(field.key);
      if (!previous || previous.type === field.type) {
        return "";
      }

      return `${field.label}：${previous.type} → ${field.type}`;
    })
    .filter(Boolean);

  if (updatedTypes.length > 0) {
    changes.push(`调整字段类型：${updatedTypes.join("；")}。`);
  }

  const updatedRequired = nextFields
    .map((field) => {
      const previous = previousByKey.get(field.key);
      if (!previous || Boolean(previous.required) === Boolean(field.required)) {
        return "";
      }

      return `${field.label}：${describeRequired(previous.required)} → ${describeRequired(field.required)}`;
    })
    .filter(Boolean);

  if (updatedRequired.length > 0) {
    changes.push(`调整必填规则：${updatedRequired.join("；")}。`);
  }

  const updatedGuidance = nextFields
    .filter((field) => {
      const previous = previousByKey.get(field.key);
      return (
        previous &&
        ((previous.placeholder || "") !== (field.placeholder || "") ||
          (previous.help_text || "") !== (field.help_text || ""))
      );
    })
    .map((field) => field.label);

  if (updatedGuidance.length > 0) {
    changes.push(`调整填写引导：${updatedGuidance.join("、")}。`);
  }

  const updatedOptions = nextFields
    .filter((field) => {
      const previous = previousByKey.get(field.key);
      if (!previous) {
        return false;
      }

      return getOptionValues(previous).join("|") !== getOptionValues(field).join("|");
    })
    .map((field) => field.label);

  if (updatedOptions.length > 0) {
    changes.push(`调整选项配置：${updatedOptions.join("、")}。`);
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

export function hasNoStructuralChange(changes: string[]) {
  return changes.length === 1 && changes[0].startsWith("字段结构没有明显变化");
}

export function buildFormAgentProgressMessage(input: {
  isRevision: boolean;
  fieldCount: number;
  changes: string[];
}) {
  if (!input.isRevision) {
    return `已生成 ${input.fieldCount} 个字段，正在同步右侧预览沙盒...`;
  }

  if (hasNoStructuralChange(input.changes)) {
    return `已检查当前 ${input.fieldCount} 个字段，未发现需要自动改动的结构变化。`;
  }

  return `已完成 ${input.fieldCount} 个字段的增量调整，正在同步右侧预览沙盒...`;
}

export function buildFormAgentSummaryMessage(isRevision: boolean, changes: string[]) {
  if (!isRevision) {
    return "已生成表单结构摘要。";
  }

  return hasNoStructuralChange(changes) ? "已生成本次检查摘要。" : "已生成本次修改摘要。";
}

export function buildFormAgentDoneMessage(input: {
  isRevision: boolean;
  changes: string[];
  warnings: string[];
}) {
  if (!input.isRevision) {
    return "生成完成，你可以继续用自然语言要求我微调。";
  }

  if (hasNoStructuralChange(input.changes)) {
    return input.warnings.length > 0
      ? "检查完成，草稿未自动改动。你可以根据上方提醒继续让我优化。"
      : "检查完成，草稿未自动改动。当前结构暂未发现明显问题。";
  }

  return "增量修改完成，你可以继续要求我微调字段。";
}
