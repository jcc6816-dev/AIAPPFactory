"use client";

import { useState } from "react";
import { FormFieldSchema, FormRecord, FormTheme } from "@/types/form";
import { useTranslations } from "next-intl";
import "./form-preview.css";

// ===== Theme screen backgrounds (applied to phone shell interior) =====
export const themeScreenBgs: Record<FormTheme, string> = {
  minimal: "radial-gradient(circle at top, #fffafb, #fafaf9 50%, #f5f5f4)",
  business: "radial-gradient(circle at top, #eff6ff, #f8fafc 50%, #e2e8f0)",
  dark: "radial-gradient(circle at top, #1e293b, #0f172a 40%, #020617)",
  brutalism: "#fef08a",
  retro: "#f4f1ea",
};

// ===== Field Renderer =====
function renderField(
  field: FormFieldSchema,
  value: any,
  onChange: (val: any) => void
) {
  const options = field.options || [];

  // Radio
  if (field.type === "radio") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <div
              key={opt.value}
              className={`fp-option ${selected ? "selected" : ""}`}
              onClick={() => onChange(opt.value)}
            >
              <div className="fp-radio">
                <div className="fp-radio-dot" />
              </div>
              <span className="fp-option-label">{opt.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Checkbox
  if (field.type === "checkbox") {
    const active: string[] = Array.isArray(value) ? value : [];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((opt) => {
          const selected = active.includes(opt.value);
          const toggle = () => {
            onChange(
              selected
                ? active.filter((v) => v !== opt.value)
                : [...active, opt.value]
            );
          };
          return (
            <div
              key={opt.value}
              className={`fp-option ${selected ? "selected" : ""}`}
              onClick={toggle}
            >
              <div className="fp-check">
                {selected && <span>✓</span>}
              </div>
              <span className="fp-option-label">{opt.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Select
  if (field.type === "select") {
    return (
      <div className="fp-select-wrap">
        <select
          className="fp-select"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            {field.placeholder || "请选择一个选项..."}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="fp-select-arrow">▼</div>
      </div>
    );
  }

  // Textarea
  if (field.type === "textarea") {
    return (
      <textarea
        className="fp-textarea"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || "请写下你的回答..."}
        rows={4}
      />
    );
  }

  // File / Image / PDF
  if (field.type === "file" || field.type === "image" || field.type === "pdf") {
    const uploaded = value;
    const simulate = () => {
      onChange({
        name: field.type === "image" ? "photo.png" : field.type === "pdf" ? "document.pdf" : "file.zip",
        size: "2.1 MB",
      });
    };
    const clear = (e: React.MouseEvent) => { e.stopPropagation(); onChange(null); };

    if (uploaded) {
      return (
        <div className="fp-file-drop" style={{ cursor: "default", borderStyle: "solid" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>📄</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--fp-title)" }}>{uploaded.name}</div>
                <div style={{ fontSize: "10px", color: "var(--fp-muted)" }}>{uploaded.size}</div>
              </div>
            </div>
            <button
              onClick={clear}
              style={{
                fontSize: "11px", fontWeight: 700, padding: "4px 10px",
                borderRadius: "6px", border: "1px solid var(--fp-input-border)",
                background: "var(--fp-input-bg)", color: "var(--fp-title)", cursor: "pointer",
              }}
            >
              清除
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fp-file-drop" onClick={simulate}>
        <div className="fp-file-icon">☁️</div>
        <div className="fp-file-text">点击模拟文件上传</div>
        <div className="fp-file-hint">支持图片、PDF 或压缩文件 (最大 10MB)</div>
      </div>
    );
  }

  // Default: text / number / email / date
  return (
    <input
      className="fp-input"
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : "text"}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "请输入你的回答..."}
    />
  );
}

// ===== Main Component =====
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
  const safeIndex = Math.min(Math.max(activeFieldIndex, 0), Math.max(fields.length - 1, 0));
  const activeField = fields[safeIndex];
  const progress = fields.length === 0 ? 0 : Math.round(((safeIndex + 1) / fields.length) * 100);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const updateField = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  // ===== Long Layout (all fields visible) =====
  if (layout === "long") {
    return (
      <div className="fp-root" data-theme={theme}>
        <div className="fp-panel">
          {/* Progress bar */}
          <div className="fp-progress-track">
            <div className="fp-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="fp-glow" />

          {/* Header */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div className="fp-badge">{t("share_fill_out")}</div>
              <div className="fp-index">{safeIndex + 1} / {fields.length}</div>
            </div>
            <div className="fp-title">{title}</div>
            {description && <div className="fp-desc">{description}</div>}
          </div>

          {/* All fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            {fields.map((field, idx) => (
              <div
                key={field.key}
                onClick={() => onFieldChange(idx)}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  border: `1px solid var(--fp-panel-border)`,
                  background: "var(--fp-panel-bg)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  ...(activeFieldIndex === idx ? {
                    boxShadow: `0 0 0 2px var(--fp-accent), 0 8px 24px var(--fp-accent-glow)`,
                  } : {}),
                }}
              >
                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                  <div className="fp-badge">
                    {t("question_index_badge", { current: idx + 1, total: fields.length })}
                  </div>
                  {field.required && <div className="fp-badge">{t("required")}</div>}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--fp-title)", marginBottom: "10px" }}>
                  {field.label}
                </div>
                {field.help_text && <div className="fp-help">{field.help_text}</div>}
                {renderField(field, formData[field.key], (val) => updateField(field.key, val))}
              </div>
            ))}

            {/* Submit button */}
            <button className="fp-btn fp-btn-primary" type="button">
              {t("submit")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== Single Step Layout (wizard mode — default) =====
  if (!activeField) return null;

  return (
    <div className="fp-root" data-theme={theme}>
      <div className="fp-panel">
        {/* Progress bar */}
        <div className="fp-progress-track">
          <div className="fp-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Ambient glow */}
        <div className="fp-glow" />

        {/* Single step content with animation */}
        <div key={safeIndex} className="fp-step-enter" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Top section */}
          <div>
            {/* Badge row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div className="fp-badge">{t("share_fill_out")}</div>
              <div className="fp-index">{safeIndex + 1} / {fields.length}</div>
            </div>

            {/* Form header (only on first step) */}
            {safeIndex === 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div className="fp-title fp-title-lg">{title}</div>
                {description && <div className="fp-desc">{description}</div>}
              </div>
            )}

            {/* Question */}
            <div style={{ marginBottom: "20px" }}>
              <div className="fp-title fp-title-lg">
                {activeField.label}
                {activeField.required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
              </div>
              {activeField.help_text && <div className="fp-help" style={{ marginTop: "8px" }}>{activeField.help_text}</div>}
            </div>

            {/* Field input */}
            <div style={{ marginTop: "8px" }}>
              {renderField(
                activeField,
                formData[activeField.key],
                (val) => updateField(activeField.key, val)
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: "1px solid var(--fp-panel-border)", paddingTop: "16px" }}>
            <button
              className="fp-btn fp-btn-secondary"
              type="button"
              disabled={safeIndex === 0}
              onClick={() => onFieldChange(Math.max(safeIndex - 1, 0))}
            >
              {t("back")}
            </button>
            <button
              className="fp-btn fp-btn-primary"
              type="button"
              disabled={safeIndex === fields.length - 1}
              onClick={() => onFieldChange(Math.min(safeIndex + 1, fields.length - 1))}
              style={{ flex: 1.4 }}
            >
              {safeIndex === fields.length - 1 ? t("submit") : t("next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
