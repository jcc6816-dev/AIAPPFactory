"use client";

import { useEffect, useMemo, useState } from "react";
import { SceneTemplate } from "@/services/form-templates";
import FormPreviewPanel, { themeScreenBgs } from "@/components/forms/form-preview-panel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormArtifactPreferences, FormTheme, FormVisualDirection } from "@/types/form";
import { ListChecks, Monitor, Palette, Rows3, Smartphone } from "lucide-react";

interface InteractiveDetailPreviewProps {
  template: SceneTemplate;
  locale: string;
  previewLabel?: string;
  initialTheme?: string;
}

export default function InteractiveDetailPreview({ template, locale, previewLabel, initialTheme }: InteractiveDetailPreviewProps) {
  const isZh = locale.toLowerCase().startsWith("zh");
  const schema = isZh || !template.formSchemaEn ? template.formSchema : template.formSchemaEn;

  const allowedThemes: FormTheme[] = [
    "minimal",
    "business",
    "dark",
    "brutalism",
    "retro",
    "moss",
    "sunset",
    "neon",
  ];
  
  // Set preferred device fallback to 'phone'
  const preferredDevice = schema.aspects?.preferredDevice || "phone";
  
  const [responsiveSize, setResponsiveSize] = useState<"phone" | "desktop">(preferredDevice);
  const [previewLayout, setPreviewLayout] = useState<"single" | "long">("single");
  const [activeTheme, setActiveTheme] = useState<FormTheme>(() => {
    if (initialTheme && allowedThemes.includes(initialTheme as FormTheme)) {
      return initialTheme as FormTheme;
    }
    return template.theme;
  });
  const [activeThemeVariant, setActiveThemeVariant] =
    useState<"default" | "glass" | "gradient-flow">(schema.aspects?.themeVariant || "default");
  const [activeVisualDirection, setActiveVisualDirection] =
    useState<FormVisualDirection>(schema.aspects?.visualDirection || "premium-event");
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const title = isZh ? template.name : (template.nameEn || template.name);
  const description = isZh ? template.description : (template.descriptionEn || template.description);
  const themes: { value: FormTheme; label: string; swatch: string }[] = [
    { value: "minimal", label: isZh ? "极简" : "Minimal", swatch: "#f8fafc" },
    { value: "business", label: isZh ? "商务" : "Business", swatch: "#2563eb" },
    { value: "dark", label: isZh ? "暗色" : "Dark", swatch: "#0f172a" },
    { value: "brutalism", label: isZh ? "野兽" : "Bold", swatch: "#fde047" },
    { value: "retro", label: isZh ? "复古" : "Retro", swatch: "#f59e0b" },
    { value: "moss", label: isZh ? "苔 Moss" : "Moss", swatch: "#2d6a4f" },
    { value: "sunset", label: isZh ? "落日" : "Sunset", swatch: "#db2777" },
    { value: "neon", label: isZh ? "霓虹" : "Neon", swatch: "#a3e635" },
  ];
  const fxStyles = [
    { value: "default", label: isZh ? "默认实心" : "Default Solid" },
    { value: "glass", label: isZh ? "磨砂毛玻璃" : "Glassmorphism" },
    { value: "gradient-flow", label: isZh ? "霓虹极光流光" : "Aurora Flow" },
  ];
  const visualDirections: {
    value: FormVisualDirection;
    label: string;
    theme: FormTheme;
    themeVariant: "default" | "glass" | "gradient-flow";
    preferredDevice: "phone" | "desktop";
  }[] = [
    {
      value: "premium-event",
      label: isZh ? "高端活动转化" : "Premium Event",
      theme: "minimal",
      themeVariant: "glass",
      preferredDevice: "phone",
    },
    {
      value: "corporate-intake",
      label: isZh ? "企业资料收集" : "Corporate Intake",
      theme: "business",
      themeVariant: "default",
      preferredDevice: "desktop",
    },
    {
      value: "creator-launch",
      label: isZh ? "创作者发布页" : "Creator Launch",
      theme: "neon",
      themeVariant: "gradient-flow",
      preferredDevice: "phone",
    },
    {
      value: "finance-ops",
      label: isZh ? "财务运营表单" : "Finance Ops",
      theme: "moss",
      themeVariant: "default",
      preferredDevice: "desktop",
    },
    {
      value: "warm-feedback",
      label: isZh ? "温暖反馈问卷" : "Warm Feedback",
      theme: "sunset",
      themeVariant: "glass",
      preferredDevice: "phone",
    },
  ];
  const previewAspects = {
    ...schema.aspects,
    preferredDevice: responsiveSize,
    themeVariant: activeThemeVariant,
    visualDirection: activeVisualDirection,
  };
  const persistedPreferences = useMemo<FormArtifactPreferences>(
    () => ({
      theme: activeTheme,
      layout: previewLayout,
      themeVariant: activeThemeVariant,
      preferredDevice: responsiveSize,
      visualDirection: activeVisualDirection,
    }),
    [
      activeTheme,
      activeThemeVariant,
      activeVisualDirection,
      previewLayout,
      responsiveSize,
    ]
  );

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        `aiff-template-preferences:${template.id}`,
        JSON.stringify(persistedPreferences)
      );
      window.dispatchEvent(
        new CustomEvent("aiff-template-preferences-changed", {
          detail: {
            templateId: template.id,
            preferences: persistedPreferences,
          },
        })
      );
    } catch {
      // Preview preferences are progressive enhancement; URL defaults still work.
    }
  }, [persistedPreferences, template.id]);

  const handleVisualDirectionSelect = (value: FormVisualDirection) => {
    const direction = visualDirections.find((item) => item.value === value);
    if (!direction) return;
    setActiveVisualDirection(direction.value);
    setActiveTheme(direction.theme);
    setActiveThemeVariant(direction.themeVariant);
    setResponsiveSize(direction.preferredDevice);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Preview toolbar */}
      <div className="flex w-full items-center gap-2 overflow-x-auto border-b border-slate-900/60 pb-4">
        <div className="mr-auto flex shrink-0 items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {previewLabel || (isZh ? "内联高保真插画与交互预览" : "Interactive High-Fidelity Preview")}
          </span>
        </div>

          <div className="flex shrink-0 bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setResponsiveSize("phone")}
              className={`h-8 rounded-lg px-2.5 flex items-center justify-center gap-1.5 transition text-xs font-bold ${
                responsiveSize === "phone" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="size-3.5" />
              {isZh ? "手机预览" : "Phone"}
            </button>
            <button
              type="button"
              onClick={() => setResponsiveSize("desktop")}
              className={`h-8 rounded-lg px-2.5 flex items-center justify-center gap-1.5 transition text-xs font-bold ${
                responsiveSize === "desktop" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Monitor className="size-3.5" />
              {isZh ? "电脑预览" : "Desktop"}
            </button>
          </div>

          <div className="flex shrink-0 bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => {
                setPreviewLayout("single");
                setActivePreviewIndex(0);
              }}
              className={`h-8 rounded-lg px-2.5 flex items-center justify-center gap-1.5 transition text-xs font-bold ${
                previewLayout === "single" ? "bg-emerald-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Rows3 className="size-3.5" />
              {isZh ? "单题流" : "Step Flow"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewLayout("long");
                setActivePreviewIndex(0);
              }}
              className={`h-8 rounded-lg px-2.5 flex items-center justify-center gap-1.5 transition text-xs font-bold ${
                previewLayout === "long" ? "bg-emerald-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ListChecks className="size-3.5" />
              {isZh ? "长表单" : "Long Form"}
            </button>
          </div>

        <Select value={activeTheme} onValueChange={(value) => setActiveTheme(value as FormTheme)}>
          <SelectTrigger
            aria-label={isZh ? "主题" : "Theme"}
            title={isZh ? "主题" : "Theme"}
            className="h-9 w-[118px] shrink-0 rounded-xl border-slate-800 bg-slate-900 px-2 text-[10px] font-bold text-slate-200 focus:ring-0 [&>span]:truncate"
          >
            <Palette className="mr-1.5 size-3.5" />
            <SelectValue placeholder={isZh ? "主题" : "Theme"} />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950 text-xs text-slate-200">
            {themes.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeVisualDirection}
          onValueChange={(value) => handleVisualDirectionSelect(value as FormVisualDirection)}
        >
          <SelectTrigger
            aria-label={isZh ? "视觉方向" : "Direction"}
            title={isZh ? "视觉方向" : "Direction"}
            className="h-9 w-[138px] shrink-0 rounded-xl border-slate-800 bg-slate-900 px-2 text-[10px] font-bold text-slate-200 focus:ring-0 [&>span]:truncate"
          >
            <SelectValue placeholder={isZh ? "视觉方向" : "Direction"} />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950 text-xs text-slate-200">
            {visualDirections.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeThemeVariant}
          onValueChange={(value) =>
            setActiveThemeVariant(value as "default" | "glass" | "gradient-flow")
          }
        >
          <SelectTrigger
            aria-label={isZh ? "视觉效果" : "Visual FX"}
            title={isZh ? "视觉效果" : "Visual FX"}
            className="h-9 w-[122px] shrink-0 rounded-xl border-slate-800 bg-slate-900 px-2 text-[10px] font-bold text-slate-200 focus:ring-0 [&>span]:truncate"
          >
            <SelectValue placeholder={isZh ? "视觉效果" : "Visual FX"} />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950 text-xs text-slate-200">
            {fxStyles.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Render device frame container */}
      <div
        className={`w-full flex justify-center items-start overflow-x-auto transition-all ${
          responsiveSize === "desktop"
            ? "min-h-[640px] pb-6 pt-1"
            : "min-h-[820px] py-6"
        }`}
      >
        {responsiveSize === "phone" ? (
          /* Phone frame */
          <div className="aiff-phone-preview-frame w-[min(430px,calc(100vw-56px))] h-[760px] bg-slate-950 rounded-[3.2rem] border-[10px] border-slate-900 shadow-2xl relative flex flex-col overflow-hidden shrink-0 transition-all duration-300">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-[24px] bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-[40px] h-[3px] bg-slate-800 rounded-full mb-1"></div>
            </div>
            {/* Interior Viewport */}
            <div
              className="aiff-phone-preview-scroll flex-1 overflow-y-auto select-none rounded-[2.45rem] overflow-hidden"
              style={{
                background: themeScreenBgs[activeTheme] || themeScreenBgs.minimal,
                transition: "background 0.3s ease",
              }}
            >
              <FormPreviewPanel
                title={title}
                description={description}
                theme={activeTheme}
                fields={schema.fields}
                layout={previewLayout}
                aspects={previewAspects}
                activeFieldIndex={activePreviewIndex}
                onFieldChange={setActivePreviewIndex}
                showTopProgress={responsiveSize !== "phone"}
              />
            </div>
          </div>
        ) : (
          /* Desktop frame */
          <div className="aiff-desktop-preview-frame w-[min(1180px,calc(100vw-96px))] min-h-[620px] rounded-[2rem] border border-slate-800 bg-slate-900/40 p-4 shadow-2xl transition-all duration-300">
            <FormPreviewPanel
              title={title}
              description={description}
              theme={activeTheme}
              fields={schema.fields}
              layout={previewLayout}
              aspects={previewAspects}
              activeFieldIndex={activePreviewIndex}
              onFieldChange={setActivePreviewIndex}
              showTopProgress
            />
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-slate-500 font-medium">
        {isZh ? "💡 上方为实时可填写的表单沙盒预览，点击按钮可模拟多步跳转" : "💡 This is an interactive sandbox preview. Click buttons to simulate form navigation."}
      </p>
    </div>
  );
}
