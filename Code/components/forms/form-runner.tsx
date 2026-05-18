"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

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
  brutalism: {
    shell:
      "border-[3px] border-black bg-[#fef08a] text-black shadow-[8px_8px_0px_rgba(0,0,0,1)]",
    panel:
      "border-[3px] border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]",
    panelGlow: "bg-transparent",
    heroGlow: "bg-transparent",
    dotIdle: "bg-black/15",
    dotDone: "bg-emerald-300 border-[2px] border-black",
    dotCurrent: "bg-pink-400 border-[2px] border-black",
    eyebrow: "border-[2px] border-black bg-emerald-300 text-black font-black uppercase tracking-[0.1em]",
    progressTrack: "bg-black/10 border-b-[2px] border-black",
    progressBar: "bg-black",
    surface: "border-[2px] border-black bg-white text-black font-bold",
    surfaceMuted: "border-[2px] border-black bg-stone-50 text-stone-700",
    surfaceActive:
      "border-[2px] border-black bg-pink-400 text-black font-black shadow-[3px_3px_0px_rgba(0,0,0,1)]",
    surfaceActiveText: "text-black",
    subtleText: "text-stone-800 font-medium",
    badge: "border-[2px] border-black bg-cyan-200 text-black font-black",
    actionPrimary:
      "border-[2px] border-black bg-pink-400 text-black font-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all",
    actionSecondary:
      "border-[2px] border-black bg-cyan-200 text-black font-black hover:bg-cyan-300",
    successPanel:
      "border-[3px] border-black bg-[#fef08a] text-black shadow-[8px_8px_0px_rgba(0,0,0,1)]",
  },
  retro: {
    shell:
      "border-stone-300 bg-[#fcfaf2] text-stone-900 shadow-[0_12px_36px_rgba(68,64,56,0.12)]",
    panel:
      "border-stone-200/80 bg-white/70 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.02)]",
    panelGlow: "bg-transparent",
    heroGlow: "bg-transparent",
    dotIdle: "bg-stone-200",
    dotDone: "bg-stone-400",
    dotCurrent: "bg-stone-800",
    eyebrow: "border-stone-300 bg-stone-100/50 text-stone-600 font-serif italic",
    progressTrack: "bg-stone-200",
    progressBar: "bg-stone-850",
    surface: "border-stone-300 bg-[#faf8f4] text-stone-900 font-serif",
    surfaceMuted: "border-stone-200 bg-[#f9f7f2]/80 text-stone-500 font-serif",
    surfaceActive:
      "border-stone-500 bg-stone-800 text-[#faf8f4] font-serif shadow-sm",
    surfaceActiveText: "text-stone-200 font-serif",
    subtleText: "text-stone-500 font-serif italic",
    badge: "border-stone-300 bg-stone-100/50 text-stone-600 font-serif",
    actionPrimary:
      "border-0 bg-stone-850 text-[#faf8f4] font-serif shadow-md hover:bg-stone-800",
    actionSecondary:
      "border-stone-300 bg-[#faf8f4] text-stone-700 font-serif hover:bg-stone-50",
    successPanel:
      "border-stone-350 bg-[#fcfaf2] text-stone-900 shadow-[0_12px_36px_rgba(68,64,56,0.12)]",
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

export default function FormRunner({ form, isPublic = false }: { form: FormRecord; isPublic?: boolean }) {
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
  const [showWelcome, setShowWelcome] = useState(isPublic && layoutMode === "single");
  const [ticketTiltStyle, setTicketTiltStyle] = useState<React.CSSProperties>({});

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
            formData.append(`file:${fieldKey}`, uploadFile, uploadFile.name);
          }
        }

        const response = await fetch(`/api/forms/${form.share_code}/submit`, {
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
              "h-14 md:h-16 rounded-2xl border px-5 text-base md:text-lg shadow-none transition-all placeholder:text-current/35 focus:border-current/30 focus:bg-current/[0.01] focus-visible:ring-0",
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
              "min-h-24 md:min-h-36 rounded-2xl border px-5 py-4 text-base md:text-lg shadow-none transition-all placeholder:text-current/35 focus:border-current/30 focus:bg-current/[0.01] focus-visible:ring-0",
              preset.surfaceMuted
            )}
          />
        )}

        {field.type === "select" && (
          <select
            className={cn(
              "flex h-14 md:h-16 w-full rounded-2xl border px-5 text-base md:text-lg transition-all focus:outline-none focus:border-current/30",
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
          <div className="grid gap-2.5">
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
                  "rounded-2xl border px-4 py-3 md:py-4 text-left transition-all duration-200 hover:-translate-y-0.5 shadow-sm",
                  currentAnswer === option.value
                    ? preset.surfaceActive
                    : preset.surface
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex size-7 md:size-8 items-center justify-center rounded-full border text-xs font-semibold shrink-0",
                        currentAnswer === option.value
                          ? "border-white/40 bg-white/15 text-white"
                          : "border-current/15"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <p className="text-base font-semibold leading-tight">{option.label}</p>
                      <p
                        className={cn(
                          "mt-0.5 text-xs md:text-sm leading-tight",
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
                      "size-4 md:size-5 rounded-full border shrink-0",
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
          <div className="grid gap-2.5">
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
                    "flex items-center gap-4 rounded-2xl border px-4 py-3 md:py-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-sm",
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
                        "mt-0.5 flex size-7 md:size-8 items-center justify-center rounded-full border text-xs font-semibold shrink-0",
                        checked
                          ? "border-white/40 bg-white/15 text-white"
                          : "border-current/15"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <p className="text-base font-semibold leading-tight">{option.label}</p>
                      <p
                        className={cn(
                          "mt-0.5 text-xs md:text-sm leading-tight",
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
                "h-14 md:h-16 rounded-2xl border px-4 shadow-none pt-3 md:pt-4",
                preset.surfaceMuted
              )}
            />
            <p className={cn("text-xs leading-6", preset.subtleText)}>
              {t("file_submit_tip")}
            </p>
            {currentFilesItem.length > 0 && (
              <div
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-sm",
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
              "rounded-xl border border-dashed px-4 py-2.5 text-xs mt-3",
              preset.surface
            )}
          >
            <p className={cn("leading-6 text-center", preset.subtleText)}>
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

  function getAnswerText(value: FormAnswers[string]) {
    if (Array.isArray(value)) {
      return value.join(" / ");
    }

    if (value === null || value === undefined || value === "") {
      return "";
    }

    return String(value);
  }

  function getPrimaryAnswer(pattern: RegExp) {
    const matchedField = fields.find(
      (field) => pattern.test(field.key) || pattern.test(field.label)
    );

    if (!matchedField) {
      return "";
    }

    return getAnswerText(answers[matchedField.key]);
  }

  function getTicketName() {
    const firstAnsweredValue = Object.values(answers).find(
      (value) => !isAnswerEmpty(value)
    );

    return (
      getPrimaryAnswer(/name|姓名|名称|participant|attendee|applicant|customer/i) ||
      getAnswerText(firstAnsweredValue ?? "") ||
      t("submit_success")
    );
  }

  function getTicketMeta() {
    return (
      getPrimaryAnswer(/company|公司|organization|部门|role|职位|mobile|phone|电话|email|邮箱/i) ||
      form.title
    );
  }

  function handleTicketMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = (x - rect.width / 2) / (rect.width / 2);
    const dy = (y - rect.height / 2) / (rect.height / 2);

    setTicketTiltStyle({
      transform: `perspective(900px) rotateX(${-dy * 8}deg) rotateY(${dx * 10}deg) translateY(-2px)`,
      transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
      boxShadow: `${-dx * 12}px ${18 - dy * 8}px 42px rgba(15, 23, 42, 0.22)`,
    });
  }

  function resetTicketTilt() {
    setTicketTiltStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms ease",
      boxShadow: "0 24px 70px -34px rgba(15, 23, 42, 0.35)",
    });
  }

  function renderSuccessTicket() {
    const shortId = submittedId.slice(0, 8).toUpperCase();

    return (
      <div
        onMouseMove={handleTicketMouseMove}
        onMouseLeave={resetTicketTilt}
        style={ticketTiltStyle}
        className={cn(
          "relative overflow-hidden rounded-[1.8rem] border p-5 md:p-6 backdrop-blur-xl transition-transform will-change-transform",
          preset.surface
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.38),transparent)] opacity-70" />
        <div className="relative flex items-start justify-between gap-4 border-b border-current/10 pb-5">
          <div>
            <p className={cn("text-[10px] font-black uppercase tracking-[0.28em]", preset.subtleText)}>
              AI AgentFactory Pass
            </p>
            <h3 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
              {getTicketName()}
            </h3>
            <p className={cn("mt-1 text-sm leading-6", preset.subtleText)}>
              {getTicketMeta()}
            </p>
          </div>
          <div className={cn("rounded-2xl border px-3 py-2 text-right", preset.badge)}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em]">Verified</p>
            <p className="mt-1 font-mono text-sm font-black">{shortId}</p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-4 py-5 text-sm">
          <div>
            <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", preset.subtleText)}>
              Scene
            </p>
            <p className="mt-1 line-clamp-2 font-bold">{form.title}</p>
          </div>
          <div>
            <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", preset.subtleText)}>
              Answers
            </p>
            <p className="mt-1 font-bold">
              {answeredCount} / {fieldCount}
            </p>
          </div>
        </div>

        <div className="relative border-t border-current/10 pt-5">
          <div className="h-10 w-full rounded-xl bg-[repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_6px,currentColor_6px_9px,transparent_9px_14px)] opacity-70" />
          <p className={cn("mt-2 text-center font-mono text-[10px] tracking-[0.32em]", preset.subtleText)}>
            {submittedId.replace(/-/g, "").slice(0, 20).toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        if (showWelcome) {
          event.preventDefault();
          setShowWelcome(false);
          return;
        }

        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === "textarea") {
          return;
        }

        event.preventDefault();
        if (isLastQuestion) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [showWelcome, currentIndex, isLastQuestion]);

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
        <div className="relative grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
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

          <div
            className={cn(
              "rounded-[1.6rem] border p-5 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-700 lg:hidden",
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

          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            {renderSuccessTicket()}
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
            <div key={field.key} className={cn("rounded-[1.75rem] border p-5 md:p-6 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none", preset.panel)}>
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

          <div className={cn("rounded-[1.75rem] border p-5 md:p-6 text-center max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none", preset.panel)}>
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

  if (showWelcome) {
    return (
      <div className={cn("relative overflow-hidden rounded-[2rem] border px-6 py-8 md:px-10 md:py-10 min-h-[460px] flex flex-col justify-between max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none", preset.shell)}>
        <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.panelGlow)} />
        <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.heroGlow)} />

        <div className="relative flex-1 flex flex-col justify-between space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out">
          <div className="space-y-6 my-auto">
            <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]", preset.eyebrow)}>
              {t("share_fill_out")}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className={cn("text-base md:text-lg leading-relaxed max-w-xl opacity-80", preset.subtleText)}>
                  {form.description}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-current/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Button
                type="button"
                onClick={() => setShowWelcome(false)}
                className={cn(
                  "h-12 md:h-14 px-8 flex-1 md:flex-none rounded-2xl text-sm md:text-base font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2",
                  preset.actionPrimary
                )}
              >
                <span>{t("start_filling_out") || "Start"}</span>
                <ArrowRight className="size-4" />
              </Button>
              <span className={cn("hidden md:inline text-xs font-semibold opacity-60", preset.subtleText)}>
                {t("press_enter_hint") || "press Enter ↵"}
              </span>
            </div>
            <div className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-md opacity-60", preset.badge)}>
              {fieldCount} {t("fields") || "questions"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border px-6 py-8 md:px-10 md:py-10 min-h-[460px] flex flex-col justify-between max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none", preset.shell)}>
      <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.panelGlow)} />
      <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.heroGlow)} />

      {/* 极简精致顶部进度条 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden rounded-t-[2rem] bg-current/5">
        <div
          className={cn("h-full transition-all duration-500 ease-out", preset.progressBar)}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div key={currentIndex} className="relative flex-1 flex flex-col justify-between space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out">
        {/* 问题头部与输入区 (合二为一，消除卡片嵌套) */}
        <div className="space-y-6">
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]", preset.eyebrow)}>
                <span>{describeFieldType(currentField, t)}</span>
              </div>
              <div className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-md", preset.badge)}>
                {currentIndex + 1} / {fieldCount}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl md:text-3xl font-black leading-snug tracking-tight">
                {currentField.label}
                {currentField.required && <span className="ml-1 text-red-500">*</span>}
              </h2>
              {currentField.help_text && (
                <div className="mt-2.5">{renderHelp(currentField, preset)}</div>
              )}
            </div>
          </div>

          {/* 字段输入区 */}
          <div className="pt-2">
            {renderFieldInput(currentField, isLastQuestion, false)}
          </div>
        </div>

        {/* 底部操作区 (融为一体) */}
        <div className="pt-6 border-t border-current/5">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={!canGoBack || isPending}
              className={cn(
                "h-12 md:h-14 flex-1 rounded-2xl border text-sm md:text-base font-semibold shadow-sm transition-all",
                preset.actionSecondary
              )}
            >
              <ArrowLeft className="size-4 mr-1.5" />
              {t("back")}
            </Button>

            {isLastQuestion ? (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className={cn(
                  "h-12 md:h-14 flex-[1.4] rounded-2xl border text-sm md:text-base font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all",
                  preset.actionPrimary
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-1.5" />
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
                  "h-12 md:h-14 flex-[1.4] rounded-2xl border text-sm md:text-base font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all",
                  preset.actionPrimary
                )}
              >
                {t("next")}
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
