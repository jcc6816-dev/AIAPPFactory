"use client";

import { cn } from "@/lib/utils";
import { FormFieldSchema, FormRecord, FormTheme } from "@/types/form";
import { useTranslations } from "next-intl";

const previewThemes: Record<
  FormTheme,
  {
    frame: string;
    shell: string;
    panel: string;
    panelGlow: string;
    heroGlow: string;
    badge: string;
    title: string;
    text: string;
    subtleText: string;
    field: string;
    fieldMuted: string;
    chip: string;
    accent: string;
    progressTrack: string;
    progressBar: string;
  }
> = {
  minimal: {
    frame:
      "bg-[radial-gradient(circle_at_top,rgba(255,247,237,1),rgba(250,250,249,1)_50%,rgba(245,245,244,1))]",
    shell:
      "border-stone-200/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(247,244,239,0.92)_48%,rgba(243,238,232,0.96))] shadow-[0_36px_120px_-48px_rgba(68,50,24,0.38)]",
    panel:
      "border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_30px_80px_-42px_rgba(88,62,28,0.30)]",
    panelGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(255,193,112,0.24),transparent_42%)]",
    heroGlow:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.12),transparent_45%)]",
    badge: "border-stone-200 bg-stone-50 text-stone-600",
    title: "text-stone-950",
    text: "text-stone-600",
    subtleText: "text-stone-500",
    field: "border-stone-200 bg-white text-stone-900",
    fieldMuted: "border-stone-200/80 bg-stone-50/90 text-stone-500",
    chip: "border-stone-200 bg-white text-stone-700",
    accent: "bg-orange-500",
    progressTrack: "bg-stone-200/85",
    progressBar:
      "bg-[linear-gradient(90deg,rgba(246,125,44,1),rgba(241,167,56,1))]",
  },
  business: {
    frame:
      "bg-[radial-gradient(circle_at_top,rgba(239,246,255,1),rgba(248,250,252,1)_48%,rgba(226,232,240,1))]",
    shell:
      "border-slate-200/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.94)_46%,rgba(226,232,240,0.96))] shadow-[0_40px_120px_-52px_rgba(15,23,42,0.38)]",
    panel:
      "border-white/70 bg-white/86 backdrop-blur-xl shadow-[0_28px_80px_-44px_rgba(15,23,42,0.28)]",
    panelGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_42%)]",
    heroGlow:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_48%)]",
    badge: "border-slate-200 bg-slate-50 text-slate-600",
    title: "text-slate-950",
    text: "text-slate-600",
    subtleText: "text-slate-500",
    field: "border-slate-200 bg-white text-slate-900",
    fieldMuted: "border-slate-200/80 bg-slate-50/90 text-slate-500",
    chip: "border-slate-200 bg-white text-slate-700",
    accent: "bg-blue-600",
    progressTrack: "bg-slate-200/85",
    progressBar:
      "bg-[linear-gradient(90deg,rgba(30,64,175,1),rgba(59,130,246,1))]",
  },
  dark: {
    frame:
      "bg-[radial-gradient(circle_at_top,rgba(30,41,59,1),rgba(15,23,42,1)_42%,rgba(2,6,23,1))]",
    shell:
      "border-slate-700/60 bg-[radial-gradient(circle_at_top,rgba(51,65,85,0.92),rgba(15,23,42,0.95)_42%,rgba(2,6,23,0.98))] shadow-[0_42px_120px_-54px_rgba(2,6,23,0.95)]",
    panel:
      "border-white/8 bg-slate-900/66 backdrop-blur-2xl shadow-[0_24px_70px_-38px_rgba(0,0,0,0.85)]",
    panelGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_38%)]",
    heroGlow:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_42%)]",
    badge: "border-white/10 bg-white/5 text-slate-300",
    title: "text-white",
    text: "text-slate-300",
    subtleText: "text-slate-400",
    field: "border-white/10 bg-white/[0.04] text-slate-50",
    fieldMuted: "border-white/10 bg-white/[0.035] text-slate-400",
    chip: "border-white/10 bg-white/[0.05] text-slate-200",
    accent: "bg-sky-400",
    progressTrack: "bg-white/10",
    progressBar:
      "bg-[linear-gradient(90deg,rgba(56,189,248,1),rgba(129,140,248,1))]",
  },
};

function renderFieldPreview(
  field: FormFieldSchema,
  theme: (typeof previewThemes)[FormTheme]
) {
  const optionItems = field.options?.slice(0, 3) || [];

  if (field.type === "radio" || field.type === "checkbox") {
    return (
      <div className="space-y-3">
        {optionItems.map((option, optionIndex) => (
          <div
            key={`${field.key}-${option.value}`}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3",
              optionIndex === 0 ? theme.field : theme.fieldMuted
            )}
          >
            <div className={cn("size-2.5 rounded-full", optionIndex === 0 ? theme.accent : "bg-current/30")} />
            <span className="text-sm font-medium">{option.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={cn("rounded-2xl border px-4 py-4 text-sm", theme.fieldMuted)}>
        {field.placeholder || "Select an option"}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={cn("min-h-28 rounded-2xl border px-4 py-4 text-sm", theme.fieldMuted)}>
        {field.placeholder || "Write your answer here"}
      </div>
    );
  }

  if (field.type === "file" || field.type === "image" || field.type === "pdf") {
    return (
      <div className={cn("rounded-2xl border border-dashed px-4 py-6 text-center text-sm", theme.fieldMuted)}>
        Upload area
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border px-4 py-4 text-sm", theme.fieldMuted)}>
      {field.placeholder || "Type your answer"}
    </div>
  );
}

export default function FormPreviewPanel({
  title,
  description,
  theme,
  fields,
  layout = "single",
  activeFieldIndex,
  onFieldChange,
}: {
  title: string;
  description?: string;
  theme: FormTheme;
  fields: FormRecord["schema_json"]["fields"];
  layout?: "single" | "long";
  activeFieldIndex: number;
  onFieldChange: (index: number) => void;
}) {
  const t = useTranslations("forms");
  const previewTheme = previewThemes[theme];
  const safeIndex = Math.min(Math.max(activeFieldIndex, 0), Math.max(fields.length - 1, 0));
  const activeField = fields[safeIndex];
  const progress =
    fields.length === 0 ? 0 : Math.round(((safeIndex + 1) / fields.length) * 100);

  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border px-6 py-8 md:px-10 md:py-10 min-h-[460px] flex flex-col justify-between max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none", previewTheme.shell)}>
      <div className={cn("pointer-events-none absolute inset-0 opacity-100", previewTheme.panelGlow)} />
      <div className={cn("pointer-events-none absolute inset-0 opacity-100", previewTheme.heroGlow)} />

      {/* 极简精致顶部进度条 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden rounded-t-[2rem] bg-current/5">
        <div
          className={cn("h-full transition-all duration-500 ease-out", previewTheme.progressBar)}
          style={{ width: `${progress}%` }}
        />
      </div>

      {layout === "long" ? (
        <div className="relative space-y-5">
          <div className={cn("rounded-[1.75rem] border p-4 md:p-5 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none", previewTheme.panel)}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 w-full">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]", previewTheme.badge)}>
                    {t("share_fill_out")}
                  </div>
                  <div className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-md", previewTheme.badge)}>
                    {safeIndex + 1} / {fields.length}
                  </div>
                </div>
                <div>
                  <h3 className={cn("text-xl md:text-2xl font-bold leading-snug tracking-tight", previewTheme.title)}>
                    {title}
                  </h3>
                  {description && (
                    <p className={cn("mt-1.5 text-xs md:text-sm leading-relaxed opacity-75", previewTheme.text)}>
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.key} className={cn("rounded-[1.75rem] border p-4 md:p-5 transition-all max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none", previewTheme.panel, activeFieldIndex === index ? "ring-2 ring-brand-blue ring-offset-2" : "")} onClick={() => onFieldChange(index)}>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]", previewTheme.badge)}>
                        {t("question_index_badge", {
                          current: index + 1,
                          total: fields.length,
                        })}
                      </div>
                      {field.required && (
                        <div className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", previewTheme.badge)}>
                          {t("required")}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={cn("text-base font-semibold md:text-lg", previewTheme.title)}>
                        {field.label}
                      </p>
                      {field.help_text && (
                        <p className={cn("mt-1 text-sm leading-6", previewTheme.text)}>
                          {field.help_text}
                        </p>
                      )}
                    </div>
                    {renderFieldPreview(field, previewTheme)}
                  </div>
                </div>
              </div>
            ))}

            <div className={cn("rounded-[1.75rem] border p-4 md:p-5 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none", previewTheme.panel)}>
              <button
                type="button"
                className={cn(
                  "w-full rounded-2xl border px-4 py-4 text-sm font-semibold transition hover:opacity-90 text-white shadow-md",
                  previewTheme.accent
                )}
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        activeField && (
          <div key={safeIndex} className="relative flex-1 flex flex-col justify-between space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out">
            <div className="space-y-6">
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]", previewTheme.badge)}>
                    <span>{t("share_fill_out")}</span>
                  </div>
                  <div className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-md", previewTheme.badge)}>
                    {safeIndex + 1} / {fields.length}
                  </div>
                </div>
                <div>
                  <h3 className={cn("text-2xl md:text-3xl font-black leading-snug tracking-tight", previewTheme.title)}>
                    {activeField.label}
                    {activeField.required && <span className="ml-1 text-red-500">*</span>}
                  </h3>
                  {activeField.help_text && (
                    <p className={cn("mt-2 text-sm leading-6 opacity-75", previewTheme.text)}>
                      {activeField.help_text}
                    </p>
                  )}
                </div>
              </div>

              {/* 字段输入区 */}
              <div className="pt-2">
                {renderFieldPreview(activeField, previewTheme)}
              </div>
            </div>

            {/* 底部操作区 */}
            <div className="pt-6 border-t border-current/5">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => onFieldChange(Math.max(safeIndex - 1, 0))}
                  className={cn(
                    "flex-1 h-12 md:h-14 rounded-2xl border text-sm font-semibold transition flex items-center justify-center gap-1.5",
                    safeIndex === 0 ? "cursor-not-allowed opacity-50" : "hover:opacity-90",
                    previewTheme.chip
                  )}
                >
                  {t("back")}
                </button>
                <button
                  type="button"
                  disabled={safeIndex === fields.length - 1}
                  onClick={() =>
                    onFieldChange(Math.min(safeIndex + 1, fields.length - 1))
                  }
                  className={cn(
                    "flex-[1.4] h-12 md:h-14 rounded-2xl border text-sm font-bold transition text-white shadow-md flex items-center justify-center gap-1.5",
                    safeIndex === fields.length - 1
                      ? "cursor-not-allowed opacity-50 bg-stone-400"
                      : "hover:opacity-95",
                    previewTheme.accent
                  )}
                >
                  {t("next")}
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
