import { describe, expect, it } from "vitest";
import { FormSchema } from "@/types/form";

import {
  moveDraftField,
  normalizeDraftOptions,
  removeDraftField,
  updateDraftField,
} from "./form-draft-editor";

const baseSchema: FormSchema = {
  fields: [
    { key: "name", label: "姓名", type: "text", required: true },
    { key: "type", label: "类型", type: "radio", options: [{ label: "A", value: "a" }] },
    { key: "remark", label: "备注", type: "textarea" },
  ],
};

describe("form-draft-editor", () => {
  it("updates a target field without mutating others", () => {
    const next = updateDraftField(baseSchema, 0, (field) => ({
      ...field,
      label: "申请人姓名",
    }));

    expect(next.fields[0].label).toBe("申请人姓名");
    expect(next.fields[1].label).toBe("类型");
  });

  it("removes a field by index", () => {
    const next = removeDraftField(baseSchema, 1);

    expect(next.fields).toHaveLength(2);
    expect(next.fields.some((field) => field.key === "type")).toBe(false);
  });

  it("moves a field up or down", () => {
    const next = moveDraftField(baseSchema, 2, 1);

    expect(next.fields[1].key).toBe("remark");
    expect(next.fields[2].key).toBe("type");
  });

  it("normalizes option text into labels and values", () => {
    const options = normalizeDraftOptions("高优先级\n处理中\n已完成");

    expect(options).toEqual([
      { label: "高优先级", value: "高优先级" },
      { label: "处理中", value: "处理中" },
      { label: "已完成", value: "已完成" },
    ]);
  });
});
