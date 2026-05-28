"use client";

import { useState } from "react";
import { FormFieldSchema, FormIllustrationKey, FormRecord, FormTheme } from "@/types/form";
import { useLocale, useTranslations } from "next-intl";
import "./form-preview.css";

// ===== Theme screen backgrounds (applied to phone shell interior) =====
export const themeScreenBgs: Record<FormTheme, string> = {
  minimal: "radial-gradient(circle at top, #fffafb, #fafaf9 50%, #f5f5f4)",
  business: "radial-gradient(circle at top, #eff6ff, #f8fafc 50%, #e2e8f0)",
  dark: "radial-gradient(circle at top, #1e293b, #0f172a 40%, #020617)",
  brutalism: "#fef08a",
  retro: "#f4f1ea",
  moss: "radial-gradient(circle at top, #f4f6f4, #e8ede7 60%, #d8e2d6)",
  sunset: "radial-gradient(circle at top, #fff5f5, #fed7d7 50%, #f9a8d4)",
  neon: "radial-gradient(circle at top, #0c0a09, #1c1917 50%, #000000)",
};

// ===== 8 套内置 SVG 动态插画组件 =====

function IllusAuroraSphere() {
  return (
    <div className="illus-aurora-sphere" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="ring ring-2" />
      <div className="ring ring-1" />
      <div className="sphere-core" />
    </div>
  );
}

function IllusAiPlanetPass() {
  return (
    <div className="illus-ai-planet-pass">
      <div className="planet" />
      <div className="ticket">
        <div className="ticket-line" />
        <div className="ticket-line" />
        <div className="ticket-line" />
      </div>
    </div>
  );
}

function Illus3dEmojiNps() {
  return (
    <div className="illus-3d-emoji-nps">
      <div className="emoji-face">😔</div>
      <div className="emoji-face">😐</div>
      <div className="emoji-face">😄</div>
    </div>
  );
}

function IllusRadarScan() {
  return (
    <div className="illus-radar-scan">
      <div className="radar-bg" />
      <div className="radar-ring" />
      <div className="radar-ring" />
      <div className="radar-ring" />
      <div className="radar-sweep" />
      <div className="radar-dot" />
    </div>
  );
}

function IllusCozyCalendar() {
  const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
  return (
    <div className="illus-cozy-calendar">
      <div className="cal-body">
        <div className="cal-header">MAY 2025</div>
        <div className="cal-grid">
          {days.map((d) => (
            <div key={d} className={`cal-day${d === 15 ? " active" : ""}`}>
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IllusInvoiceStack() {
  return (
    <div className="illus-invoice-stack">
      <div className="invoice-card">
        <div className="inv-line accent" />
        <div className="inv-line full" />
        <div className="inv-line half" />
      </div>
      <div className="invoice-card">
        <div className="inv-line accent" />
        <div className="inv-line full" />
        <div className="inv-line half" />
      </div>
      <div className="invoice-card">
        <div className="inv-line accent" />
        <div className="inv-line full" />
        <div className="inv-line half" />
      </div>
      <div className="scan-line" />
    </div>
  );
}

function IllusTerminalLog() {
  return (
    <div className="illus-terminal-log">
      <div className="term-window">
        <div className="term-titlebar">
          <div className="term-dot" />
          <div className="term-dot" />
          <div className="term-dot" />
        </div>
        <div className="term-body">
          <div className="term-line">
            <span className="prompt">$</span>
            <span className="cmd">report --type bug</span>
          </div>
          <div className="term-line">
            <span className="info">INFO</span>
            <span>Connecting to server...</span>
          </div>
          <div className="term-line">
            <span className="error">ERR</span>
            <span>Timeout: 503</span>
          </div>
          <div className="term-line">
            <span className="prompt">$</span>
            <span className="term-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IllusWaitlistRocket() {
  return (
    <div className="illus-waitlist-rocket">
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="rocket">🚀</div>
      <div className="exhaust">
        <div className="exhaust-particle" />
        <div className="exhaust-particle" />
        <div className="exhaust-particle" />
      </div>
    </div>
  );
}

// 插画映射表
const illustrationMap: Record<FormIllustrationKey, () => JSX.Element> = {
  "aurora-sphere": IllusAuroraSphere,
  "ai-planet-pass": IllusAiPlanetPass,
  "3d-emoji-nps": Illus3dEmojiNps,
  "radar-scan": IllusRadarScan,
  "cozy-calendar": IllusCozyCalendar,
  "invoice-stack": IllusInvoiceStack,
  "terminal-log": IllusTerminalLog,
  "waitlist-rocket": IllusWaitlistRocket,
};

// ===== 插画海报侧组件 =====
function PosterSide({
  illustrationKey,
  themeVariant = "default",
  theme,
}: {
  illustrationKey: FormIllustrationKey;
  themeVariant?: string;
  theme: FormTheme;
}) {
  const IllusComponent = illustrationMap[illustrationKey];
  return (
    <div
      className="fp-poster-side"
      data-variant={themeVariant}
    >
      <div className="fp-poster-glow" />
      <div className="fp-illustration">
        <div className="fp-illustration-inner">
          {IllusComponent ? <IllusComponent /> : null}
        </div>
      </div>
    </div>
  );
}

// ===== Field Renderer =====
function renderField(
  field: FormFieldSchema,
  value: any,
  onChange: (val: any) => void,
  isZh: boolean
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
            {field.placeholder || (isZh ? "请选择一个选项..." : "Select an option...")}
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
        placeholder={field.placeholder || (isZh ? "请写下你的回答..." : "Type your answer here...")}
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
              {isZh ? "清除" : "Clear"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fp-file-drop" onClick={simulate}>
        <div className="fp-file-icon">☁️</div>
        <div className="fp-file-text">{isZh ? "点击模拟文件上传" : "Click to simulate file upload"}</div>
        <div className="fp-file-hint">{isZh ? "支持图片、PDF 或压缩文件 (最大 10MB)" : "Supports images, PDFs or archives (Max 10MB)"}</div>
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
      placeholder={field.placeholder || (isZh ? "请输入你的回答..." : "Type your answer here...")}
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
  aspects,
  activeFieldIndex,
  onFieldChange,
  onSubmitPreview,
  showTopProgress = true,
}: {
  title: string;
  description?: string;
  theme: FormTheme;
  fields: FormRecord["schema_json"]["fields"];
  layout?: "single" | "long";
  aspects?: FormRecord["schema_json"]["aspects"];
  activeFieldIndex: number;
  onFieldChange: (index: number) => void;
  onSubmitPreview?: () => void;
  showTopProgress?: boolean;
}) {
  const t = useTranslations("forms");
  const locale = useLocale();
  const isZh = locale.toLowerCase().startsWith("zh");
  const safeIndex = Math.min(Math.max(activeFieldIndex, 0), Math.max(fields.length - 1, 0));
  const activeField = fields[safeIndex];
  const progress = fields.length === 0 ? 0 : Math.round(((safeIndex + 1) / fields.length) * 100);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const updateField = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const [prevIndex, setPrevIndex] = useState(activeFieldIndex);
  const [direction, setDirection] = useState<"next" | "back">("next");

  if (activeFieldIndex !== prevIndex) {
    setDirection(activeFieldIndex > prevIndex ? "next" : "back");
    setPrevIndex(activeFieldIndex);
  }


  const hasIllustration = !!aspects?.welcomeImage;
  const themeVariant = aspects?.themeVariant || "default";
  const illustrationKey = aspects?.welcomeImage;

  // ===== The inner form panel (shared between split and non-split) =====
  const formPanel = (isSplit: boolean) => (
    <div
      className="fp-root"
      data-theme={theme}
      data-variant={themeVariant}
      style={isSplit ? { flex: 1, borderRadius: 0, boxShadow: "none" } : undefined}
    >
      {!isSplit && (
        <>
          <div className="fp-glow-layer-1" />
          <div className="fp-glow-layer-2" />
          <div className="fp-blueprint-grid" />
          <div className="fp-dot-grid" />
        </>
      )}

      <div className="fp-panel" style={isSplit ? { borderRadius: 0, flex: 1 } : undefined}>
        {/* Desktop progress bar. Phone previews can hide it for a cleaner app-like feel. */}
        {showTopProgress && (
          <div className="fp-progress-track">
            <div className="fp-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        {layout === "long" ? (
          /* Long Layout (all fields visible) */
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div className="fp-badge">{t("share_fill_out")}</div>
              <div className="fp-index">{safeIndex + 1} / {fields.length}</div>
            </div>
            <div className="fp-title">{title}</div>
            {description && <div className="fp-desc">{description}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, marginTop: "16px" }}>
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
                  {renderField(field, formData[field.key], (val) => updateField(field.key, val), isZh)}
                </div>
              ))}
              <button
                className="fp-btn fp-btn-primary"
                type="button"
                onClick={onSubmitPreview}
              >
                {t("submit")}
              </button>
            </div>
          </div>
        ) : activeField ? (
          /* Single Step Layout */
          <div
            key={safeIndex}
            className={direction === "back" ? "fp-step-back" : "fp-step-next"}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="fp-badge">{t("share_fill_out")}</div>
                <div className="fp-index">{safeIndex + 1} / {fields.length}</div>
              </div>

              {safeIndex === 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <div className="fp-title fp-title-lg">{title}</div>
                  {description && <div className="fp-desc">{description}</div>}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <div className="fp-title fp-title-lg">
                  {activeField.label}
                  {activeField.required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
                </div>
                {activeField.help_text && <div className="fp-help" style={{ marginTop: "8px" }}>{activeField.help_text}</div>}
              </div>

              <div style={{ marginTop: "8px" }}>
                {renderField(
                  activeField,
                  formData[activeField.key],
                  (val) => updateField(activeField.key, val),
                  isZh
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: "1px solid var(--fp-panel-border)", paddingTop: "16px" }}>
              <button
                className="fp-btn fp-btn-secondary"
                type="button"
                disabled={safeIndex === 0}
                onClick={() => onFieldChange(Math.max(safeIndex - 1, 0))}
                style={{ flex: 1 }}
              >
                {t("back")}
              </button>
              <button
                className="fp-btn fp-btn-primary"
                type="button"
                onClick={() => {
                  if (safeIndex === fields.length - 1) {
                    onSubmitPreview?.();
                    return;
                  }

                  onFieldChange(Math.min(safeIndex + 1, fields.length - 1));
                }}
                style={{ flex: 1.4 }}
              >
                {safeIndex === fields.length - 1 ? t("submit") : t("next")}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  // ===== Split layout (when illustration is configured) =====
  if (hasIllustration && illustrationKey) {
    return (
      <div className="fp-container-query-parent" style={{ width: "100%" }}>
        <div
          className="fp-split-wrapper"
          data-theme={theme}
          style={{ minHeight: "460px" }}
        >
          <PosterSide
            illustrationKey={illustrationKey}
            themeVariant={themeVariant}
            theme={theme}
          />
          <div className="fp-content-side">
            {formPanel(true)}
          </div>
        </div>
      </div>
    );
  }

  // ===== Standard single-column layout =====
  return (
    <div className="fp-container-query-parent" style={{ width: "100%" }}>
      {formPanel(false)}
    </div>
  );
}
