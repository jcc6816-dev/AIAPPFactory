"use client";

import { useState } from "react";
import { SceneTemplate } from "@/services/form-templates";
import FormPreviewPanel, { themeScreenBgs } from "@/components/forms/form-preview-panel";
import { Smartphone, Monitor } from "lucide-react";

interface InteractiveDetailPreviewProps {
  template: SceneTemplate;
  locale: string;
}

export default function InteractiveDetailPreview({ template, locale }: InteractiveDetailPreviewProps) {
  const isZh = locale.toLowerCase().startsWith("zh");
  const schema = isZh || !template.formSchemaEn ? template.formSchema : template.formSchemaEn;
  
  // Set preferred device fallback to 'phone'
  const preferredDevice = schema.aspects?.preferredDevice || "phone";
  
  const [responsiveSize, setResponsiveSize] = useState<"phone" | "desktop">(preferredDevice);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const title = isZh ? template.name : (template.nameEn || template.name);
  const description = isZh ? template.description : (template.descriptionEn || template.description);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Device Mode Switcher */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setResponsiveSize("phone")}
          className={`h-8 rounded-lg px-3 flex items-center justify-center gap-1.5 transition text-xs font-bold ${
            responsiveSize === "phone" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Smartphone className="size-3.5" />
          {isZh ? "手机预览" : "Phone"}
        </button>
        <button
          type="button"
          onClick={() => setResponsiveSize("desktop")}
          className={`h-8 rounded-lg px-3 flex items-center justify-center gap-1.5 transition text-xs font-bold ${
            responsiveSize === "desktop" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Monitor className="size-3.5" />
          {isZh ? "电脑预览" : "Desktop"}
        </button>
      </div>

      {/* Render device frame container */}
      <div className="w-full flex justify-center items-center overflow-x-auto py-4 min-h-[620px] transition-all">
        {responsiveSize === "phone" ? (
          /* Phone frame */
          <div className="w-[340px] h-[580px] bg-slate-950 rounded-[2.8rem] border-[10px] border-slate-900 shadow-2xl relative flex flex-col overflow-hidden shrink-0 transition-all duration-300">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-[24px] bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-[40px] h-[3px] bg-slate-800 rounded-full mb-1"></div>
            </div>
            {/* Interior Viewport */}
            <div
              className="flex-1 overflow-y-auto pt-8 pb-4 px-2 select-none"
              style={{
                background: themeScreenBgs[template.theme] || themeScreenBgs.minimal,
                transition: "background 0.3s ease",
              }}
            >
              <FormPreviewPanel
                title={title}
                description={description}
                theme={template.theme}
                fields={schema.fields}
                aspects={schema.aspects}
                activeFieldIndex={activePreviewIndex}
                onFieldChange={setActivePreviewIndex}
              />
            </div>
          </div>
        ) : (
          /* Desktop frame */
          <div className="w-full max-w-[840px] min-h-[500px] rounded-[2rem] border border-slate-800 bg-slate-900/40 p-4 shadow-2xl transition-all duration-300">
            <FormPreviewPanel
              title={title}
              description={description}
              theme={template.theme}
              fields={schema.fields}
              layout="long"
              aspects={schema.aspects}
              activeFieldIndex={activePreviewIndex}
              onFieldChange={setActivePreviewIndex}
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
