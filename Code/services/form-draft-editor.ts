import { FormFieldOption, FormFieldSchema, FormSchema } from "@/types/form";

function cloneField(field: FormFieldSchema): FormFieldSchema {
  return {
    ...field,
    options: field.options ? field.options.map((option) => ({ ...option })) : [],
  };
}

export function updateDraftField(
  schema: FormSchema,
  index: number,
  updater: (field: FormFieldSchema) => FormFieldSchema
): FormSchema {
  return {
    fields: schema.fields.map((field, fieldIndex) =>
      fieldIndex === index ? updater(cloneField(field)) : cloneField(field)
    ),
  };
}

export function removeDraftField(schema: FormSchema, index: number): FormSchema {
  return {
    fields: schema.fields
      .filter((_, fieldIndex) => fieldIndex !== index)
      .map((field) => cloneField(field)),
  };
}

export function moveDraftField(
  schema: FormSchema,
  fromIndex: number,
  toIndex: number
): FormSchema {
  if (
    fromIndex < 0 ||
    fromIndex >= schema.fields.length ||
    toIndex < 0 ||
    toIndex >= schema.fields.length ||
    fromIndex === toIndex
  ) {
    return {
      fields: schema.fields.map((field) => cloneField(field)),
    };
  }

  const nextFields = schema.fields.map((field) => cloneField(field));
  const [moved] = nextFields.splice(fromIndex, 1);
  nextFields.splice(toIndex, 0, moved);

  return {
    fields: nextFields,
  };
}

export function normalizeDraftOptions(input: string): FormFieldOption[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      label: line,
      value:
        line
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "_")
          .replace(/^_+|_+$/g, "") || `option_${index + 1}`,
    }));
}
