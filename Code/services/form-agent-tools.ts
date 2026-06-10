import type { FormSchema } from "@/types/form";

function describeRequired(required?: boolean) {
  return required ? "必填" : "选填";
}

function getOptionValues(field: FormSchema["fields"][number]) {
  return (field.options || []).map((option) => `${option.label}:${option.value}`);
}

export function summarizeFormSchemaChanges(
  previousSchema: FormSchema | null | undefined,
  nextSchema: FormSchema,
  locale?: string
): string[] {
  const isZh = (locale || "en").toLowerCase().startsWith("zh");

  if (!previousSchema) {
    return [
      isZh
        ? `创建了 ${nextSchema.fields.length} 个字段的表单草稿。`
        : `Created a form draft with ${nextSchema.fields.length} fields.`,
    ];
  }

  const previousFields = previousSchema.fields || [];
  const nextFields = nextSchema.fields || [];
  const previousByKey = new Map(previousFields.map((field) => [field.key, field]));
  const nextByKey = new Map(nextFields.map((field) => [field.key, field]));
  const changes: string[] = [];

  const added = nextFields.filter((field) => !previousByKey.has(field.key));
  const removed = previousFields.filter((field) => !nextByKey.has(field.key));

  if (added.length > 0) {
    changes.push(
      isZh
        ? `新增字段：${added.map((field) => field.label).join("、")}。`
        : `Added fields: ${added.map((field) => field.label).join(", ")}.`
    );
  }

  if (removed.length > 0) {
    changes.push(
      isZh
        ? `移除字段：${removed.map((field) => field.label).join("、")}。`
        : `Removed fields: ${removed.map((field) => field.label).join(", ")}.`
    );
  }

  const updatedLabels = nextFields
    .filter((field) => {
      const previous = previousByKey.get(field.key);
      return previous && previous.label !== field.label;
    })
    .map((field) => field.label);

  if (updatedLabels.length > 0) {
    changes.push(
      isZh
        ? `调整字段文案：${updatedLabels.join("、")}。`
        : `Adjusted field labels: ${updatedLabels.join(", ")}.`
    );
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
    changes.push(
      isZh
        ? `调整字段类型：${updatedTypes.join("；")}。`
        : `Adjusted field types: ${updatedTypes.join("; ")}.`
    );
  }

  const updatedRequired = nextFields
    .map((field) => {
      const previous = previousByKey.get(field.key);
      if (!previous || Boolean(previous.required) === Boolean(field.required)) {
        return "";
      }

      const descReq = (req?: boolean) => req ? (isZh ? "必填" : "Required") : (isZh ? "选填" : "Optional");
      return `${field.label}：${descReq(previous.required)} → ${descReq(field.required)}`;
    })
    .filter(Boolean);

  if (updatedRequired.length > 0) {
    changes.push(
      isZh
        ? `调整必填规则：${updatedRequired.join("；")}。`
        : `Adjusted required rules: ${updatedRequired.join("; ")}.`
    );
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
    changes.push(
      isZh
        ? `调整填写引导：${updatedGuidance.join("、")}。`
        : `Adjusted guidance: ${updatedGuidance.join(", ")}.`
    );
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
    changes.push(
      isZh
        ? `调整选项配置：${updatedOptions.join("、")}。`
        : `Adjusted options: ${updatedOptions.join(", ")}.`
    );
  }

  if (previousFields.length !== nextFields.length) {
    changes.push(
      isZh
        ? `字段数量从 ${previousFields.length} 个变为 ${nextFields.length} 个。`
        : `Field count changed from ${previousFields.length} to ${nextFields.length}.`
    );
  }

  if (changes.length === 0) {
    changes.push(
      isZh
        ? "字段结构没有明显变化，可能主要调整了标题、描述、主题或字段细节。"
        : "No structural changes detected; title, description, theme, or minor details may have been updated."
    );
  }

  return changes;
}

export function validateFormSchemaForAgent(schema: FormSchema, locale?: string): string[] {
  const isZh = (locale || "en").toLowerCase().startsWith("zh");
  const warnings: string[] = [];

  if (schema.fields.length > 8) {
    warnings.push(
      isZh
        ? "当前字段超过 8 个，移动端填写可能偏长。"
        : "Form has more than 8 fields, which might feel long on mobile devices."
    );
  }

  const fieldsMissingGuidance = schema.fields.filter(
    (field) => !field.placeholder && !field.help_text
  );

  if (fieldsMissingGuidance.length > 0) {
    warnings.push(
      isZh
        ? `有 ${fieldsMissingGuidance.length} 个字段缺少 placeholder 或 help_text，后续可继续优化填写引导。`
        : `There are ${fieldsMissingGuidance.length} fields missing placeholder or help_text. Guidance can be optimized further.`
    );
  }

  const invalidChoiceFields = schema.fields.filter(
    (field) =>
      ["select", "radio", "checkbox"].includes(field.type) &&
      (!field.options || field.options.length === 0)
  );

  if (invalidChoiceFields.length > 0) {
    warnings.push(
      isZh
        ? "存在选择类字段但没有选项，需要补充选项后再发布。"
        : "Some choice fields are missing options. Please add options before publishing."
    );
  }

  return warnings;
}

export function hasNoStructuralChange(changes: string[]) {
  return (
    changes.length === 1 &&
    (changes[0].startsWith("字段结构没有明显变化") ||
      changes[0].startsWith("No structural changes"))
  );
}

export function buildFormAgentProgressMessage(
  input: {
    isRevision: boolean;
    fieldCount: number;
    changes: string[];
  },
  locale?: string
) {
  const isZh = (locale || "en").toLowerCase().startsWith("zh");
  if (!input.isRevision) {
    return isZh
      ? `已生成 ${input.fieldCount} 个字段，正在同步右侧预览沙盒...`
      : `Generated ${input.fieldCount} fields, syncing preview sandbox...`;
  }

  if (hasNoStructuralChange(input.changes)) {
    return isZh
      ? `已检查当前 ${input.fieldCount} 个字段，未发现需要自动改动的结构变化。`
      : `Checked ${input.fieldCount} fields, no structural changes needed.`;
  }

  return isZh
    ? `已完成 ${input.fieldCount} 个字段的增量调整，正在同步右侧预览沙盒...`
    : `Completed incremental adjustments for ${input.fieldCount} fields, syncing preview sandbox...`;
}

export function buildFormAgentSummaryMessage(isRevision: boolean, changes: string[], locale?: string) {
  const isZh = (locale || "en").toLowerCase().startsWith("zh");
  if (!isRevision) {
    return isZh ? "已生成表单结构摘要。" : "Form structure summary generated.";
  }

  return hasNoStructuralChange(changes)
    ? (isZh ? "已生成本次检查摘要。" : "Check summary generated.")
    : (isZh ? "已生成本次修改摘要。" : "Modification summary generated.");
}

export function buildFormAgentDoneMessage(
  input: {
    isRevision: boolean;
    changes: string[];
    warnings: string[];
  },
  locale?: string
) {
  const isZh = (locale || "en").toLowerCase().startsWith("zh");
  if (!input.isRevision) {
    return isZh
      ? "生成完成，你可以继续用自然语言要求我微调。"
      : "Generation complete. You can continue asking me to refine fields using natural language.";
  }

  if (hasNoStructuralChange(input.changes)) {
    return input.warnings.length > 0
      ? (isZh
          ? "检查完成，草稿未自动改动。你可以根据上方提醒继续让我优化。"
          : "Check complete. No changes made. You can continue optimizing based on warnings.")
      : (isZh
          ? "检查完成，草稿未自动改动。当前结构暂未发现明显问题。"
          : "Check complete. No changes made. No issues detected in the current structure.");
  }

  return isZh
    ? "增量修改完成，你可以继续要求我微调字段。"
    : "Incremental modifications complete. You can continue asking me to refine fields.";
}
