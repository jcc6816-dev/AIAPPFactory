const fs = require('fs');
const content = `"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  FormAnswers,
  FormFieldSchema,
  FormRecord,
  SubmissionFileValue,
} from "@/types/form";

type ThemePreset = {
  shell: string;
  panel: string;
  panelGlow: string;
  heroGlow: string;
  dotIdle: string;
  dotDone: string;
  dotCurrent: string;
  eyebrow: string;
  progressTrack: string;
  progressBar: string;
  surface: string;
  surfaceMuted: string;
  surfaceActive: string;
  surfaceActiveText: string;
  subtleText: string;
  badge: string;
  actionPrimary: string;
  actionSecondary: string;
  successPanel: string;
};

const themePresets: Record<FormRecord["theme"], ThemePreset> = {
  minimal: {
    shell:
      "border-stone-200/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(247,244,239,0.92)_48%,rgba(243,238,232,0.96))] text-stone-900 shadow-[0_36px_120px_-48px_rgba(68,50,24,0.38)]",
    panel:
      "border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_30px_80px_-42px_rgba(88,62,28,0.30)]",
    panelGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(255,193,112,0.24),transparent_42%)]",
    heroGlow:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.12),transparent_45%)]",
    dotIdle: "bg-stone-200/90",
    dotDone: "bg-amber-300",
    dotCurrent: "bg-orange-500",
    eyebrow: "border-stone-300/70 bg-white/80 text-stone-500",
    progressTrack: "bg-stone-200/85",
    progressBar:
      "bg-[linear-gradient(90deg,rgba(246,125,44,1),rgba(241,167,56,1))]",
    surface: "border-stone-200/80 bg-white/88 text-stone-900",
    surfaceMuted: "border-stone-200/80 bg-stone-50/90 text-stone-700",
    surfaceActive:
      "border-transparent bg-[linear-gradient(135deg,rgba(246,125,44,1),rgba(241,167,56,1))] text-white shadow-[0_18px_40px_-26px_rgba(229,110,38,0.9)]",
    surfaceActiveText: "text-white/88",
    subtleText: "text-stone-500",
    badge: "border-white/80 bg-white/80 text-stone-600",
    actionPrimary:
      "border-0 bg-[linear-gradient(135deg,rgba(246,125,44,1),rgba(241,167,56,1))] text-white shadow-[0_24px_50px_-28px_rgba(229,110,38,0.85)] hover:brightness-105",
    actionSecondary:
      "border-stone-200/80 bg-white/88 text-stone-700 hover:bg-stone-50",
    successPanel:
      "border-emerald-200/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(236,253,245,0.92)_52%,rgba(209,250,229,0.88))] text-stone-900",
  },
  business: {
    shell:
      "border-slate-200/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.94)_46%,rgba(226,232,240,0.96))] text-slate-950 shadow-[0_40px_120px_-52px_rgba(15,23,42,0.38)]",
    panel:
      "border-white/70 bg-white/86 backdrop-blur-xl shadow-[0_28px_80px_-44px_rgba(15,23,42,0.28)]",
    panelGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_42%)]",
    heroGlow:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_48%)]",
    dotIdle: "bg-slate-200/90",
    dotDone: "bg-sky-300",
    dotCurrent: "bg-blue-600",
    eyebrow: "border-slate-300/80 bg-white/80 text-slate-600",
    progressTrack: "bg-slate-200/85",
    progressBar:
      "bg-[linear-gradient(90deg,rgba(30,64,175,1),rgba(59,130,246,1))]",
    surface: "border-slate-200/80 bg-white/90 text-slate-900",
    surfaceMuted: "border-slate-200/80 bg-slate-50/92 text-slate-700",
    surfaceActive:
      "border-transparent bg-[linear-gradient(135deg,rgba(30,64,175,1),rgba(59,130,246,1))] text-white shadow-[0_18px_40px_-26px_rgba(37,99,235,0.9)]",
    surfaceActiveText: "text-white/86",
    subtleText: "text-slate-500",
    badge: "border-white/80 bg-white/86 text-slate-600",
    actionPrimary:
      "border-0 bg-[linear-gradient(135deg,rgba(30,64,175,1),rgba(59,130,246,1))] text-white shadow-[0_24px_50px_-28px_rgba(37,99,235,0.85)] hover:brightness-105",
    actionSecondary:
      "border-slate-200/80 bg-white/90 text-slate-700 hover:bg-slate-50",
    successPanel:
      "border-emerald-200/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(239,246,255,0.92)_44%,rgba(220,252,231,0.88))] text-slate-950",
  },
  dark: {
    shell:
      "border-slate-700/60 bg-[radial-gradient(circle_at_top,rgba(51,65,85,0.92),rgba(15,23,42,0.95)_42%,rgba(2,6,23,0.98))] text-slate-50 shadow-[0_42px_120px_-54px_rgba(2,6,23,0.95)]",
    panel:
      "border-white/8 bg-slate-900/66 backdrop-blur-2xl shadow-[0_24px_70px_-38px_rgba(0,0,0,0.85)]",
    panelGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_38%)]",
    heroGlow:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_42%)]",
    dotIdle: "bg-white/10",
    dotDone: "bg-sky-300/70",
    dotCurrent: "bg-sky-400",
    eyebrow: "border-white/10 bg-white/6 text-slate-300",
    progressTrack: "bg-white/10",
    progressBar:
      "bg-[linear-gradient(90deg,rgba(56,189,248,1),rgba(129,140,248,1))]",
    surface: "border-white/10 bg-white/[0.045] text-slate-50",
    surfaceMuted: "border-white/10 bg-white/[0.035] text-slate-200",
    surfaceActive:
      "border-sky-400/30 bg-[linear-gradient(135deg,rgba(14,165,233,0.9),rgba(99,102,241,0.92))] text-white shadow-[0_18px_40px_-26px_rgba(14,165,233,0.9)]",
    surfaceActiveText: "text-white/86",
    subtleText: "text-slate-400",
    badge: "border-white/10 bg-white/[0.045] text-slate-300",
    actionPrimary:
      "border-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.92),rgba(99,102,241,0.92))] text-white shadow-[0_24px_50px_-28px_rgba(14,165,233,0.82)] hover:brightness-110",
    actionSecondary:
      "border-white/10 bg-white/[0.045] text-slate-100 hover:bg-white/[0.08]",
    successPanel:
      "border-emerald-400/18 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),rgba(15,23,42,0.94)_40%,rgba(2,6,23,0.98))] text-slate-50",
  },
};

function buildInitialAnswers(form: FormRecord): FormAnswers {
  const answers: FormAnswers = {};

  for (const field of form.schema_json.fields) {
    answers[field.key] = field.type === "checkbox" ? [] : "";
  }

  return answers;
}

function isAnswerEmpty(value: FormAnswers[string]) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function renderHelp(field: FormFieldSchema, preset: ThemePreset) {
  if (!field.help_text) {
    return null;
  }

  return <p className={cn("text-sm leading-6", preset.subtleText)}>{field.help_text}</p>;
}

function describeFieldType(
  field: FormFieldSchema,
  t: ReturnType<typeof useTranslations<"forms">>
) {
  switch (field.type) {
    case "textarea":
      return t("field_type_long_answer");
    case "select":
      return t("field_type_choose_one");
    case "radio":
      return t("field_type_single_choice");
    case "checkbox":
      return t("field_type_multiple_choice");
    case "file":
    case "image":
    case "pdf":
      return t("field_type_upload");
    default:
      return t("field_type_quick_answer");
  }
}

export default function FormRunner({ form }: { form: FormRecord }) {
  const t = useTranslations("forms");
  const [answers, setAnswers] = useState<FormAnswers>(() =>
    buildInitialAnswers(form)
  );
  const [files, setFiles] = useState<SubmissionFileValue[]>([]);
  const [fileBlobs, setFileBlobs] = useState<Record<string, File[]>>({});
  const [submittedId, setSubmittedId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const preset = themePresets[form.theme];
  const layoutMode = form.schema_json.layout || "single";

  const fields = form.schema_json.fields;
  const fieldCount = fields.length;
  const currentField = fields[currentIndex];
  const progress =
    fieldCount === 0 ? 100 : Math.round(((currentIndex + 1) / fieldCount) * 100);

  function updateAnswer(key: string, value: FormAnswers[string]) {
    setAnswers((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateFileValue(fieldKey: string, fileList: FileList | null) {
    setFileBlobs((current) => {
      const next = { ...current };
      if (!fileList || fileList.length === 0) {
        delete next[fieldKey];
        return next;
      }

      next[fieldKey] = Array.from(fileList);
      return next;
    });

    setFiles((current) => {
      const next = current.filter((item) => item.field_key !== fieldKey);
      if (!fileList || fileList.length === 0) {
        return next;
      }

      return [
        ...next,
        ...Array.from(fileList).map((file) => ({
          field_key: fieldKey,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
        })),
      ];
    });

    const fileNames = fileList
      ? Array.from(fileList).map((file) => file.name)
      : [];
    updateAnswer(fieldKey, fileNames);
  }

  function handleCheckboxChange(
    fieldKey: string,
    value: string,
    checked: boolean
  ) {
    const current = Array.isArray(answers[fieldKey]) ? answers[fieldKey] : [];
    const next = checked
      ? [...current, value]
      : current.filter((item) => item !== value);

    updateAnswer(fieldKey, next);
  }

  function validateAllFields() {
    for (const field of fields) {
      if (field.required && isAnswerEmpty(answers[field.key])) {
        toast.error(
          t("field_required_message", {
            label: field.label,
          })
        );
        return false;
      }
    }
    return true;
  }

  function validateCurrentField() {
    if (!currentField?.required) {
      return true;
    }

    if (isAnswerEmpty(answers[currentField.key])) {
      toast.error(
        t("field_required_message", {
          label: currentField.label,
        })
      );
      return false;
    }

    return true;
  }

  function handleNext() {
    if (!validateCurrentField()) {
      return;
    }

    setCurrentIndex((index) => Math.min(index + 1, fieldCount - 1));
  }

  function handleBack() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function handleSubmit() {
    if (layoutMode === "long" ? !validateAllFields() : !validateCurrentField()) {
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("answers", JSON.stringify(answers));
        for (const [fieldKey, uploadFiles] of Object.entries(fileBlobs)) {
          for (const uploadFile of uploadFiles) {
            formData.append(\`file:\${fieldKey}\`, uploadFile, uploadFile.name);
          }
        }

        const response = await fetch(\`/api/forms/\${form.share_code}/submit\`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.code !== 0 || !result.data?.uuid) {
          throw new Error(result.message || "submit form failed");
        }

        setSubmittedId(result.data.uuid);
        toast.success(t("submit_success"));
      } catch (error: any) {
        toast.error(error.message || "submit form failed");
      }
    });
  }

  function advanceAfterSelection(nextValue: string) {
    updateAnswer(currentField.key, nextValue);

    if (isLastQuestion || layoutMode === "long") {
      return;
    }

    window.setTimeout(() => {
      setCurrentIndex((index) => Math.min(index + 1, fieldCount - 1));
    }, 180);
  }

  function renderFieldInput(field: FormFieldSchema, isLast: boolean, isLongMode: boolean = false) {
    const currentAnswer = answers[field.key];
    const currentFilesItem = files.filter((item) => item.field_key === field.key);

    return (
      <div className="space-y-4">
        <p className={cn("text-sm leading-6", preset.subtleText)}>
          {isLast && !isLongMode ? t("final_question_hint") : t("question_focus_hint")}
        </p>
        {(field.type === "text" ||
          field.type === "email" ||
          field.type === "date" ||
          field.type === "number") && (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={String(currentAnswer || "")}
            onChange={(event) =>
              updateAnswer(
                field.key,
                field.type === "number"
                  ? event.target.value === ""
                    ? ""
                    : Number(event.target.value)
                  : event.target.value
              )
            }
            className={cn(
              "h-16 rounded-[1.4rem] border px-5 text-lg shadow-none transition-colors placeholder:text-current/35 focus-visible:ring-0",
              preset.surfaceMuted
            )}
          />
        )}

        {field.type === "textarea" && (
          <Textarea
            placeholder={field.placeholder}
            value={String(currentAnswer || "")}
            onChange={(event) =>
              updateAnswer(field.key, event.target.value)
            }
            className={cn(
              "min-h-44 rounded-[1.4rem] border px-5 py-4 text-lg shadow-none transition-colors placeholder:text-current/35 focus-visible:ring-0",
              preset.surfaceMuted
            )}
          />
        )}

        {field.type === "select" && (
          <select
            className={cn(
              "flex h-16 w-full rounded-[1.4rem] border px-5 text-lg transition-colors focus:outline-none",
              preset.surfaceMuted
            )}
            value={String(currentAnswer || "")}
            onChange={(event) =>
              updateAnswer(field.key, event.target.value)
            }
          >
            <option value="">
              {field.placeholder || t("theme_placeholder")}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {field.type === "radio" && (
          <div className="grid gap-3">
            {field.options?.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  updateAnswer(field.key, option.value);
                  if (!isLast && !isLongMode) {
                    window.setTimeout(() => {
                      setCurrentIndex((idx) => Math.min(idx + 1, fieldCount - 1));
                    }, 180);
                  }
                }}
                className={cn(
                  "rounded-[1.35rem] border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5",
                  currentAnswer === option.value
                    ? preset.surfaceActive
                    : preset.surface
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                        currentAnswer === option.value
                          ? "border-white/40 bg-white/15 text-white"
                          : "border-current/15"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{option.label}</p>
                      <p
                        className={cn(
                          "mt-1 text-sm",
                          currentAnswer === option.value
                            ? preset.surfaceActiveText
                            : preset.subtleText
                        )}
                      >
                        {t("tap_to_continue")}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "size-5 rounded-full border",
                      currentAnswer === option.value
                        ? "border-white bg-white/25"
                        : "border-current/25"
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {field.type === "checkbox" && (
          <div className="grid gap-3">
            {field.options?.map((option, index) => {
              const answerValue = answers[field.key];
              const currentValues = Array.isArray(answerValue)
                ? answerValue.map((item) => String(item))
                : [];
              const checked = currentValues.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-4 rounded-[1.35rem] border px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer",
                    checked ? preset.surfaceActive : preset.surface
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      handleCheckboxChange(
                        field.key,
                        option.value,
                        event.target.checked
                      )
                    }
                    className="size-4 hidden"
                  />
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 items-center justify-center rounded-full border text-xs font-semibold shrink-0",
                        checked
                          ? "border-white/40 bg-white/15 text-white"
                          : "border-current/15"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{option.label}</p>
                      <p
                        className={cn(
                          "mt-1 text-sm",
                          checked ? preset.surfaceActiveText : preset.subtleText
                        )}
                      >
                        {checked ? t("selected") : t("tap_to_select")}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {(field.type === "file" ||
          field.type === "image" ||
          field.type === "pdf") && (
          <div className="space-y-3">
            <Input
              type="file"
              accept={
                field.type === "image"
                  ? "image/*"
                  : field.type === "pdf"
                    ? "application/pdf"
                    : undefined
              }
              onChange={(event) =>
                updateFileValue(field.key, event.target.files)
              }
              className={cn(
                "h-16 rounded-[1.4rem] border px-4 shadow-none pt-4",
                preset.surfaceMuted
              )}
            />
            <p className={cn("text-xs leading-6", preset.subtleText)}>
              {t("file_submit_tip")}
            </p>
            {currentFilesItem.length > 0 && (
              <div
                className={cn(
                  "rounded-[1.2rem] border px-4 py-3 text-sm",
                  preset.surface
                )}
              >
                {currentFilesItem.map((f) => f.file_name).join(", ")}
              </div>
            )}
          </div>
        )}
        
        {isLast && !isLongMode && (
          <div
            className={cn(
              "rounded-[1.4rem] border border-dashed px-4 py-3 text-sm mt-4",
              preset.surface
            )}
          >
            <p className={cn("leading-6", preset.subtleText)}>
              {t("review_before_submit")}
            </p>
          </div>
        )}
      </div>
    );
  }

  const currentAnswer = currentField ? answers[currentField.key] : "";
  const canGoBack = currentIndex > 0;
  const isLastQuestion = currentIndex === fieldCount - 1;
  const answeredCount = fields.filter((field) => !isAnswerEmpty(answers[field.key]))
    .length;
  const questionNumber = currentIndex + 1;

  if (!currentField && layoutMode === "single") {
    return (
      <div className={cn("rounded-[2rem] border p-8 text-center", preset.panel)}>
        <p className={cn("text-sm", preset.subtleText)}>{t("empty")}</p>
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className={cn("relative overflow-hidden rounded-[2rem] border p-6 md:p-8", preset.successPanel)}>
        <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.heroGlow)} />
          <div className="space-y-6">
          <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-white/75 text-emerald-600 shadow-sm dark:bg-white/10 animate-in zoom-in-90 duration-500">
            <CheckCircle2 className="size-8" />
          </div>
          <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
            <h3 className="text-3xl font-semibold tracking-tight">
              {t("submit_success")}
            </h3>
            <p className={cn("max-w-xl text-sm leading-7 md:text-base", preset.subtleText)}>
              {t("submitted_message")}
            </p>
          </div>
          <div
            className={cn(
              "rounded-[1.6rem] border p-5 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-700",
              preset.surface
            )}
          >
            <p className={cn("text-[11px] uppercase tracking-[0.24em]", preset.subtleText)}>
              {t("submission_id")}
            </p>
            <p className="mt-3 break-all font-mono text-sm md:text-base">
              {submittedId}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className={cn("rounded-full border px-3 py-1 text-xs font-medium", preset.badge)}>
              {t("share_mobile_first_badge")}
            </div>
            <div className={cn("rounded-full border px-3 py-1 text-xs font-medium", preset.badge)}>
              {t("questions_answered", {
                current: answeredCount,
                total: fieldCount,
              })}
            </div>
            <div className={cn("rounded-full border px-3 py-1 text-xs font-medium", preset.badge)}>
              {t("billing_tip")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layoutMode === "long") {
    return (
      <div className={cn("relative overflow-hidden rounded-[2rem] border px-4 py-6 md:px-6 md:py-8 space-y-8", preset.shell)}>
        <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.panelGlow)} />
        <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.heroGlow)} />
        
        <div className="relative space-y-8">
          {fields.map((field, index) => (
            <div key={field.key} className={cn("rounded-[1.75rem] border p-5 md:p-6", preset.panel)}>
              <div className="flex items-center gap-3 mb-5">
                <div className={cn("inline-flex items-center justify-center size-8 rounded-full border text-sm font-bold", preset.eyebrow)}>
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold md:text-2xl">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-500">*</span>}
                </h2>
              </div>
              {renderHelp(field, preset)}
              <div className="mt-5">
                {renderFieldInput(field, index === fields.length - 1, true)}
              </div>
            </div>
          ))}

          <div className={cn("rounded-[1.75rem] border p-5 md:p-6 text-center", preset.panel)}>
            <p className={cn("text-sm mb-4", preset.subtleText)}>
              {t("review_before_submit")}
            </p>
            <Button
              type="button"
              onClick={() => {
                if (!validateAllFields()) return;
                handleSubmit();
              }}
              disabled={isPending}
              className={cn(
                "h-14 w-full md:w-auto md:min-w-[200px] rounded-[1.3rem] border text-base font-semibold",
                preset.actionPrimary
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  {t("submit")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border px-4 py-4 md:px-5 md:py-5", preset.shell)}>
      <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.panelGlow)} />
      <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.heroGlow)} />

      <div className="relative space-y-5">
        <div className={cn("rounded-[1.75rem] border p-4 md:p-5", preset.panel)}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]", preset.eyebrow)}>
                <span>{describeFieldType(currentField, t)}</span>
                <span className={cn("size-1 rounded-full", form.theme === "dark" ? "bg-sky-300" : "bg-current/60")} />
                <span>{currentField.type}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className={cn("rounded-full border px-3 py-1 text-xs font-medium", preset.badge)}>
                  {currentField.required ? t("required") : t("optional")}
                </div>
                <div className={cn("rounded-full border px-3 py-1 text-xs font-medium", preset.badge)}>
                  {t("questions_answered", {
                    current: answeredCount,
                    total: fieldCount,
                  })}
                </div>
                <div className={cn("rounded-full border px-3 py-1 text-xs font-medium", preset.badge)}>
                  {t("question_index_badge", {
                    current: questionNumber,
                    total: fieldCount,
                  })}
                </div>
              </div>
              <div>
                <p className={cn("text-[11px] uppercase tracking-[0.22em]", preset.subtleText)}>
                  {t("step_counter", {
                    current: currentIndex + 1,
                    total: fieldCount,
                  })}
                </p>
                <h2 className="mt-3 text-[2rem] font-semibold leading-tight md:text-[2.5rem]">
                  {currentField.label}
                  {currentField.required && <span className="ml-1 text-red-500">*</span>}
                </h2>
                <div className="mt-3">{renderHelp(currentField, preset)}</div>
              </div>
            </div>

            <div className="hidden shrink-0 md:flex">
              <div className={cn("rounded-full border px-3 py-2 text-sm font-medium", preset.badge)}>
                {progress}%
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className={cn("h-2.5 overflow-hidden rounded-full", preset.progressTrack)}>
              <div
                className={cn("h-full rounded-full transition-all duration-500", preset.progressBar)}
                style={{ width: \`\${progress}%\` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {fields.map((field, index) => (
                <span
                  key={field.key}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    index < currentIndex
                      ? preset.dotDone
                      : index === currentIndex
                        ? preset.dotCurrent
                        : preset.dotIdle
                  )}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className={cn("font-medium", preset.subtleText)}>
                {fieldCount - currentIndex - 1 > 0
                  ? t("questions_left", {
                      count: fieldCount - currentIndex - 1,
                    })
                  : t("final_step")}
              </p>
              <p className={cn("md:hidden font-medium", preset.subtleText)}>{progress}%</p>
            </div>
          </div>
        </div>

        <div className={cn("rounded-[1.75rem] border p-4 md:p-5", preset.panel)}>
          {renderFieldInput(currentField, isLastQuestion, false)}
        </div>

        <div className={cn("rounded-[1.75rem] border p-4 md:p-5", preset.panel)}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className={cn("text-xs uppercase tracking-[0.22em]", preset.subtleText)}>
              {canGoBack ? t("share_navigation_hint") : t("share_navigation_start")}
            </p>
            <p className={cn("text-xs", preset.subtleText)}>
              {isLastQuestion ? t("share_submit_hint") : t("share_continue_hint")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={!canGoBack || isPending}
              className={cn(
                "h-14 flex-1 rounded-[1.3rem] border text-base font-medium",
                preset.actionSecondary
              )}
            >
              <ArrowLeft className="size-4" />
              {t("back")}
            </Button>

            {isLastQuestion ? (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className={cn(
                  "h-14 flex-[1.4] rounded-[1.3rem] border text-base font-semibold",
                  preset.actionPrimary
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {t("submit")}
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isPending}
                className={cn(
                  "h-14 flex-[1.4] rounded-[1.3rem] border text-base font-semibold",
                  preset.actionPrimary
                )}
              >
                {t("next")}
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('/Users/mike/Documents/AIFactory/Code/components/forms/form-runner.tsx', content);
