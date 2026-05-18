"use client";

import { useState } from "react";
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
    title: "text-stone-950 font-bold",
    text: "text-stone-600 font-medium",
    subtleText: "text-stone-500",
    field: "border-stone-200 bg-white text-stone-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100",
    fieldMuted: "border-stone-200/80 bg-stone-50/90 text-stone-500",
    chip: "border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
    accent: "bg-orange-500 text-white",
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
    title: "text-slate-950 font-bold",
    text: "text-slate-600",
    subtleText: "text-slate-500",
    field: "border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
    fieldMuted: "border-slate-200/80 bg-slate-50/90 text-slate-500",
    chip: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    accent: "bg-blue-600 text-white",
    progressTrack: "bg-slate-200/85",
    progressBar:
      "bg-[linear-gradient(90deg,rgba(30,64,175,1),rgba(59,130,246,1))]",
  },
  dark: {
    frame:
      "bg-[radial-gradient(circle_at_top,rgba(30,41,59,1),rgba(15,23,42,1)_42%,rgba(2,6,23,1))]",
    shell:
      "border-slate-700/60 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.85),rgba(2,6,23,0.98))] backdrop-blur-3xl shadow-[0_42px_120px_-54px_rgba(2,6,23,0.95)]",
    panel:
      "border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-[0_24px_70px_-38px_rgba(0,0,0,0.85)]",
    panelGlow:
      "bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_38%)]",
    heroGlow:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_42%)]",
    badge: "border-white/10 bg-white/5 text-slate-300",
    title: "text-white font-bold",
    text: "text-slate-300",
    subtleText: "text-slate-400",
    field: "border-white/10 bg-white/[0.04] text-slate-50 focus:border-sky-400 focus:ring-2 focus:ring-sky-950/40",
    fieldMuted: "border-white/5 bg-white/[0.02] text-slate-450",
    chip: "border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.08]",
    accent: "bg-sky-400 text-slate-950",
    progressTrack: "bg-white/10",
    progressBar:
      "bg-[linear-gradient(90deg,rgba(56,189,248,1),rgba(129,140,248,1))]",
  },
  brutalism: {
    frame:
      "bg-[radial-gradient(circle_at_top,rgba(254,240,138,1),rgba(252,211,77,1)_60%,rgba(245,158,11,1))]",
    shell:
      "border-[3px] border-black bg-[#fef08a] shadow-[8px_8px_0px_rgba(0,0,0,1)]",
    panel:
      "border-[3px] border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]",
    panelGlow: "bg-transparent",
    heroGlow: "bg-transparent",
    badge: "border-[2px] border-black bg-emerald-300 text-black font-black uppercase tracking-[0.12em]",
    title: "text-black font-black font-sans leading-none",
    text: "text-black font-bold",
    subtleText: "text-stone-800 font-medium",
    field: "border-[2px] border-black bg-white text-black font-bold focus:bg-pink-100 focus:ring-0",
    fieldMuted: "border-[2px] border-black bg-stone-50 text-stone-700",
    chip: "border-[2px] border-black bg-cyan-200 text-black font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all",
    accent: "bg-pink-400 border-[2px] border-black text-black font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all",
    progressTrack: "bg-black/10 border-b-[2px] border-black",
    progressBar: "bg-black",
  },
  retro: {
    frame:
      "bg-[#f4f1ea] bg-[radial-gradient(rgba(120,110,90,0.05)_1px,transparent_1px)] bg-[size:16px_16px]",
    shell:
      "border-stone-300 bg-[#fcfaf2] shadow-[0_12px_36px_rgba(68,64,56,0.12)]",
    panel:
      "border-stone-200/80 bg-white/70 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.02)]",
    panelGlow: "bg-transparent",
    heroGlow: "bg-transparent",
    badge: "border-stone-300 bg-stone-100/50 text-stone-600 font-serif italic",
    title: "text-stone-900 font-serif tracking-tight font-medium",
    text: "text-stone-700 font-serif leading-relaxed",
    subtleText: "text-stone-500 font-serif italic",
    field: "border-stone-300 bg-[#faf8f4] text-stone-900 font-serif focus:border-stone-500 focus:ring-2 focus:ring-stone-100",
    fieldMuted: "border-stone-200 bg-[#f9f7f2]/80 text-stone-500 font-serif",
    chip: "border-stone-300 bg-[#faf8f4] text-stone-700 font-serif hover:bg-stone-50",
    accent: "bg-stone-850 text-[#faf8f4] font-serif",
    progressTrack: "bg-stone-200",
    progressBar: "bg-stone-850",
  },
};

function renderFieldPreview(
  field: FormFieldSchema,
  theme: (typeof previewThemes)[FormTheme],
  value: any,
  onChange: (val: any) => void
) {
  // Option rendering helper
  const optionItems = field.options || [];

  if (field.type === "radio") {
    return (
      <div className="space-y-2.5">
        {optionItems.map((option) => {
          const isSelected = value === option.value;
          return (
            <div
              key={`${field.key}-${option.value}`}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3.5 cursor-pointer transition-all hover:bg-black/[0.02] active:scale-[0.99] select-none",
                isSelected ? theme.field : theme.fieldMuted
              )}
            >
              <div
                className={cn(
                  "size-4.5 rounded-full border flex items-center justify-center transition-all",
                  isSelected ? "border-current" : "border-current/30"
                )}
              >
                {isSelected && (
                  <div
                    className={cn(
                      "size-2.5 rounded-full",
                      theme.accent.includes("bg-black") ? "bg-black" : theme.accent.split(" ")[0]
                    )}
                  />
                )}
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (field.type === "checkbox") {
    const activeValues = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2.5">
        {optionItems.map((option) => {
          const isSelected = activeValues.includes(option.value);
          const handleCheckboxToggle = () => {
            if (isSelected) {
              onChange(activeValues.filter((v) => v !== option.value));
            } else {
              onChange([...activeValues, option.value]);
            }
          };
          return (
            <div
              key={`${field.key}-${option.value}`}
              onClick={handleCheckboxToggle}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3.5 cursor-pointer transition-all hover:bg-black/[0.02] active:scale-[0.99] select-none",
                isSelected ? theme.field : theme.fieldMuted
              )}
            >
              <div
                className={cn(
                  "size-4.5 rounded border flex items-center justify-center transition-all",
                  isSelected ? "border-current bg-current/5" : "border-current/30"
                )}
              >
                {isSelected && <span className="text-[10px] leading-none font-black">✓</span>}
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 transition-all appearance-none cursor-pointer pr-10",
            theme.field
          )}
        >
          <option value="" disabled className="text-stone-400">
            {field.placeholder || "请选择一个选项..."}
          </option>
          {optionItems.map((option) => (
            <option key={option.value} value={option.value} className="text-stone-900 bg-white">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          ▼
        </div>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || "请写下你的回答..."}
        rows={4}
        className={cn(
          "w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 transition-all resize-none",
          theme.field
        )}
      />
    );
  }

  if (field.type === "file" || field.type === "image" || field.type === "pdf") {
    const fileUploaded = value;
    const simulateUpload = () => {
      onChange({
        name: field.type === "image" ? "event_badge_draft.png" : field.type === "pdf" ? "personal_cv.pdf" : "application_details.zip",
        size: "2.1 MB"
      });
    };
    const clearUpload = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    };

    return (
      <div
        onClick={fileUploaded ? undefined : simulateUpload}
        className={cn(
          "rounded-2xl border border-dashed px-4 py-6 text-center text-sm transition-all select-none cursor-pointer flex flex-col items-center justify-center gap-2",
          fileUploaded ? theme.field : `${theme.fieldMuted} hover:border-current/40 hover:bg-black/[0.02]`
        )}
      >
        {fileUploaded ? (
          <div className="flex items-center gap-3 w-full justify-between px-2">
            <div className="flex items-center gap-2 text-left">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-bold text-xs truncate max-w-[170px]">{fileUploaded.name}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{fileUploaded.size}</p>
              </div>
            </div>
            <button
              onClick={clearUpload}
              className="text-xs hover:text-red-500 font-bold bg-black/5 hover:bg-black/10 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              清除
            </button>
          </div>
        ) : (
          <>
            <span className="text-2xl opacity-60">☁️</span>
            <div>
              <p className="font-bold text-xs">点击模拟文件上传</p>
              <p className="text-[10px] opacity-50 mt-1">支持图片、PDF 或压缩文件 (最大 10MB)</p>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "请输入你的回答..."}
      className={cn(
        "w-full h-12 md:h-14 rounded-2xl border px-4 text-sm font-medium outline-none focus:ring-2 transition-all",
        theme.field
      )}
    />
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
  const previewTheme = previewThemes[theme] || previewThemes.minimal;
  const safeIndex = Math.min(Math.max(activeFieldIndex, 0), Math.max(fields.length - 1, 0));
  const activeField = fields[safeIndex];
  const progress =
    fields.length === 0 ? 0 : Math.round(((safeIndex + 1) / fields.length) * 100);

  // Real interactive form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const handleFieldValueChange = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2.2rem] border px-6 py-8 md:px-10 md:py-10 min-h-[480px] flex flex-col justify-between max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        previewTheme.shell
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0 opacity-100", previewTheme.panelGlow)} />
      <div className={cn("pointer-events-none absolute inset-0 opacity-100", previewTheme.heroGlow)} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-white/20 blur-3xl" />

      {/* 极简精致顶部进度条 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden bg-current/[0.04]">
        <div
          className={cn("h-full transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]", previewTheme.progressBar)}
          style={{ width: `${progress}%` }}
        />
      </div>

      {layout === "long" ? (
        <div className="relative space-y-5">
          <div
            className={cn(
              "rounded-[1.75rem] border p-4 md:p-5 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none",
              previewTheme.panel
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 w-full">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]",
                      previewTheme.badge
                    )}
                  >
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
              <div
                key={field.key}
                className={cn(
                  "rounded-[1.75rem] border p-4 md:p-5 transition-all max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none cursor-pointer",
                  previewTheme.panel,
                  activeFieldIndex === index ? "ring-2 ring-blue-500/70 ring-offset-2 scale-[1.01] shadow-[0_24px_80px_-44px_rgba(37,99,235,0.65)]" : "hover:-translate-y-0.5"
                )}
                onClick={() => onFieldChange(index)}
              >
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
                          previewTheme.badge
                        )}
                      >
                        {t("question_index_badge", {
                          current: index + 1,
                          total: fields.length,
                        })}
                      </div>
                      {field.required && (
                        <div
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                            previewTheme.badge
                          )}
                        >
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
                    {renderFieldPreview(
                      field,
                      previewTheme,
                      formData[field.key],
                      (val) => handleFieldValueChange(field.key, val)
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div
              className={cn(
                "rounded-[1.75rem] border p-4 md:p-5 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none",
                previewTheme.panel
              )}
            >
              <button
                type="button"
                className={cn(
                  "w-full rounded-2xl border px-4 py-4 text-sm font-semibold transition hover:opacity-90 text-white shadow-md active:scale-[0.98]",
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
          <div
            key={safeIndex}
            className="relative flex-1 flex flex-col justify-between space-y-8 animate-in fade-in slide-in-from-bottom-5 zoom-in-[0.98] duration-500 [animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
          >
            <div className="space-y-6">
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]",
                      previewTheme.badge
                    )}
                  >
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
                {renderFieldPreview(
                  activeField,
                  previewTheme,
                  formData[activeField.key],
                  (val) => handleFieldValueChange(activeField.key, val)
                )}
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
                    "flex-1 h-12 md:h-14 rounded-2xl border text-sm font-semibold transition flex items-center justify-center gap-1.5 active:scale-[0.98]",
                    safeIndex === 0 ? "cursor-not-allowed opacity-50" : "hover:opacity-90",
                    previewTheme.chip
                  )}
                >
                  {t("back")}
                </button>
                <button
                  type="button"
                  disabled={safeIndex === fields.length - 1}
                  onClick={() => onFieldChange(Math.min(safeIndex + 1, fields.length - 1))}
                  className={cn(
                    "flex-[1.4] h-12 md:h-14 rounded-2xl border text-sm font-bold transition text-white shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]",
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
