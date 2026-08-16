"use client";

import { ArrowDown, ArrowUp, ChevronLeft, Loader2, Monitor, Pencil, Plus, Smartphone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormFieldSchema, FormTheme, GeneratedFormDraft } from "@/types/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getCreationCanvasState } from "./form-creation-canvas-state";

export { getCreationCanvasState } from "./form-creation-canvas-state";

const DEMO_FIELDS: FormFieldSchema[] = [
  { key: "name", label: "您的姓名", type: "text", required: true, placeholder: "请输入您的姓名" },
  { key: "phone", label: "手机号码", type: "text", required: true, placeholder: "请输入您的手机号码" },
  { key: "company", label: "公司", type: "text", required: false, placeholder: "请输入您的公司名称" },
  { key: "role", label: "职位", type: "text", required: false, placeholder: "请输入您的职位" },
];

const PROMPT_CHIPS = [
  {
    id: "demo-request",
    icon: "🚀",
    labelZh: "产品试用申请",
    labelEn: "Product Demo",
    promptZh: "创建一份产品试用申请表，包含姓名、公司邮箱、公司规模和业务需求。",
    promptEn: "Create a product demo request form with name, work email, company size, and main use case.",
  },
  {
    id: "lead-capture",
    icon: "💼",
    labelZh: "潜客意向收集",
    labelEn: "Lead Capture",
    promptZh: "创建一份线索收集表，包含联系人、公司、需求描述、预算范围与采购时间。",
    promptEn: "Create a lead capture form with contact name, company, need, budget range, and timeline.",
  },
  {
    id: "feedback",
    icon: "💬",
    labelZh: "客户满意度调查",
    labelEn: "Feedback Survey",
    promptZh: "创建一份客户满意度调查表，包含总体评分、最满意的功能、改进建议和联系意愿。",
    promptEn: "Create a customer satisfaction survey with overall rating, favorite features, suggestions, and contact consent.",
  },
  {
    id: "support",
    icon: "🛠️",
    labelZh: "售后支持工单",
    labelEn: "Support Ticket",
    promptZh: "创建一份售后技术支持工单表，包含问题主题、紧急程度、问题描述和联系电话。",
    promptEn: "Create a technical support ticket form with issue subject, priority, description, and phone number.",
  },
] as const;

export default function FormCreationCanvas({
  locale,
  prompt,
  onPromptChange,
  onGenerate,
  generated,
  isGenerating,
  previewDevice,
  onPreviewDeviceChange,
  theme,
  onPublish,
  isSaving,
  isGuest,
  templateName,
  templateFields,
  generationError,
  onGeneratedChange,
  onThemeChange,
  onTitleChange,
  onDescriptionChange,
}: {
  locale: string;
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  generated: GeneratedFormDraft | null;
  isGenerating: boolean;
  previewDevice: "phone" | "desktop";
  onPreviewDeviceChange: (device: "phone" | "desktop") => void;
  theme: FormTheme;
  onPublish?: () => void;
  isSaving: boolean;
  isGuest: boolean;
  templateName?: string;
  templateFields?: FormFieldSchema[];
  generationError?: string | null;
  onGeneratedChange: (updater: (current: GeneratedFormDraft | null) => GeneratedFormDraft | null) => void;
  onThemeChange: (theme: FormTheme) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}) {
  const isZh = locale.toLowerCase().startsWith("zh");
  const state = getCreationCanvasState({ generated, isGenerating });
  const fields = generated?.schema.fields || templateFields || DEMO_FIELDS;
  const formTitle = generated?.title || templateName || (isZh ? "新表单" : "New form");
  const isTemplatePreview = !generated && Boolean(templateName);
  const formDescription = generated?.description || (isTemplatePreview
    ? (isZh ? "模板预览 · 生成后会按你的描述调整字段" : "Template preview · Generate to tailor fields to your description.")
    : (isZh ? "由 AI 根据描述生成" : "Generated from your description"));

  return (
    <section
      className="relative h-[100dvh] overflow-hidden bg-[#071220]"
      data-clarity-mask="true"
      data-testid="creation-canvas"
    >
      <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-[url('/imgs/form-creation-banner.png')] bg-cover bg-center opacity-[0.045] mix-blend-screen lg:block" />
      <div className="relative grid h-full min-h-0 lg:grid-cols-[.94fr_1.06fr]">
        <div className="relative flex min-h-0 items-center overflow-hidden px-6 py-8 text-white sm:px-12 lg:px-[clamp(48px,7vw,110px)] lg:py-[clamp(32px,5vh,64px)]">
          <a href={`/${locale}`} className="absolute left-6 top-6 text-xl font-black tracking-tight text-white sm:left-12 lg:left-8 lg:top-7" aria-label="GenForms.ai">
            GenForms<span className="text-blue-500">.ai</span>
          </a>
          <div className="w-full max-w-[620px]">
            {state === "brief" ? (
              <>
                <p className="relative mb-[clamp(2rem,5vh,3rem)] w-fit text-sm font-bold text-slate-200 after:absolute after:-bottom-4 after:left-0 after:h-[3px] after:w-9 after:rounded-full after:bg-blue-500">
                  {templateName
                    ? (isZh ? `已选择模板：${templateName}` : `Template selected: ${templateName}`)
                    : (isZh ? "从描述开始创建" : "Start from a description")}
                </p>
                <h1 className="font-serif text-[clamp(2.7rem,4.4vw,4.5rem)] font-medium leading-[1.12] tracking-[-0.06em] text-white">
                  {isZh ? <>告诉我<span className="text-blue-500">你要收集什么</span></> : <>Describe <span className="text-blue-500">what you need to collect</span></>}
                </h1>
                <p className="mt-[clamp(1rem,2.4vh,1.5rem)] text-base leading-7 text-slate-300 sm:text-lg">
                  {isZh ? "我会生成表单、填写体验和可分享链接。" : "I will create the form, filling experience, and shareable link."}
                </p>
                <div className="relative mt-[clamp(2rem,5vh,3rem)] rounded-xl border border-slate-500/40 bg-slate-950/40 p-5 shadow-inner shadow-white/[0.03]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-sm leading-6 text-slate-400" htmlFor="form-generation-prompt">
                      {isZh ? "例如：创建一个活动报名表，收集姓名、邮箱、公司和参会日期。" : "Example: create an event signup form that collects name, email, company, and attendance date."}
                    </label>
                    <span className="text-xs text-slate-500">
                      {isZh ? "快捷示例：" : "Quick suggestions:"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {PROMPT_CHIPS.map((chip) => {
                      const chipLabel = isZh ? chip.labelZh : chip.labelEn;
                      const chipPrompt = isZh ? chip.promptZh : chip.promptEn;
                      const isActive = prompt === chipPrompt;
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => onPromptChange(chipPrompt)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                            isActive
                              ? "border-blue-500 bg-blue-500/20 text-blue-300 font-semibold shadow-xs"
                              : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <span>{chip.icon}</span>
                          <span>{chipLabel}</span>
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    id="form-generation-prompt"
                    value={prompt}
                    onChange={(event) => onPromptChange(event.target.value)}
                    placeholder={isZh ? "描述你要收集的信息…" : "Describe the information you need to collect…"}
                    className="mt-3 min-h-[72px] w-full resize-none border-0 bg-transparent p-0 text-base leading-7 text-white outline-none placeholder:text-slate-500"
                    maxLength={500}
                  />
                  <button
                    type="button"
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="ml-auto flex min-h-11 items-center rounded-lg border border-blue-400 bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    {isGenerating
                      ? (isZh ? "正在生成…" : "Generating…")
                      : (isZh ? "生成表单" : "Generate form")}
                  </button>
                </div>
                <p className="mt-5 text-sm text-slate-400">{isZh ? "生成后可继续调整" : "You can keep refining it after generation."}</p>
                {generationError ? <div role="alert" className="mt-4 rounded-lg border border-amber-300/40 bg-amber-100/10 px-4 py-3 text-sm leading-6 text-amber-100"><strong>{isZh ? "这次生成未完成。" : "This generation did not finish."}</strong><span className="ml-1">{isZh ? "请检查描述后重试。" : "Check the description and try again."}</span></div> : null}
              </>
            ) : state === "generating" ? (
              <GeneratingState isZh={isZh} prompt={prompt} />
            ) : (
              <CompleteState
                isZh={isZh}
                generated={generated}
                fields={fields}
                theme={theme}
                onGenerate={onGenerate}
                onGeneratedChange={onGeneratedChange}
                onThemeChange={onThemeChange}
                onTitleChange={onTitleChange}
                onDescriptionChange={onDescriptionChange}
                onPublish={onPublish}
                isSaving={isSaving}
                isGuest={isGuest}
              />
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden bg-[#f5f2ec] px-5 py-5 sm:px-10 lg:px-[clamp(16px,2vw,32px)] lg:py-[clamp(20px,3vh,32px)]">
          <PreviewDeviceSwitch
            isZh={isZh}
            previewDevice={previewDevice}
            onPreviewDeviceChange={onPreviewDeviceChange}
          />
          <div
            className={`flex min-h-0 flex-1 justify-center ${
              previewDevice === "phone" ? "items-start pt-3" : "items-center"
            }`}
          >
            <FormExperiencePreview
              device={previewDevice}
              title={formTitle}
              description={formDescription}
              fields={fields}
              theme={theme}
              isZh={isZh}
              isTemplatePreview={isTemplatePreview}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewDeviceSwitch({ isZh, previewDevice, onPreviewDeviceChange }: { isZh: boolean; previewDevice: "phone" | "desktop"; onPreviewDeviceChange: (device: "phone" | "desktop") => void }) {
  return <div className="mx-auto flex shrink-0 rounded-lg bg-stone-200/70 p-1" data-testid="preview-device-switch">
    <button type="button" onClick={() => onPreviewDeviceChange("phone")} className={`flex h-9 items-center gap-1.5 rounded-md px-4 text-xs font-bold ${previewDevice === "phone" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
      <Smartphone className="size-3.5" />{isZh ? "手机预览" : "Phone"}
    </button>
    <button type="button" onClick={() => onPreviewDeviceChange("desktop")} className={`flex h-9 items-center gap-1.5 rounded-md px-4 text-xs font-bold ${previewDevice === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
      <Monitor className="size-3.5" />{isZh ? "桌面预览" : "Desktop"}
    </button>
  </div>;
}

function FormExperiencePreview({ device, title, description, fields, theme, isZh, isTemplatePreview }: { device: "phone" | "desktop"; title: string; description: string; fields: FormFieldSchema[]; theme: FormTheme; isZh: boolean; isTemplatePreview: boolean }) {
  const [previewFieldIndex, setPreviewFieldIndex] = useState(0);
  useEffect(() => {
    setPreviewFieldIndex((current) => Math.max(0, Math.min(current, fields.length - 1)));
  }, [fields.length]);

  const primaryField = fields[previewFieldIndex] || fields[0];
  const isPhone = device === "phone";
  const isDark = theme === "dark";
  const isBusiness = theme === "business";
  const themeSurface = isDark ? "border-slate-700 bg-slate-900" : isBusiness ? "border-[#b8c9e4] bg-[#f8fbff]" : "border-[#d6cdbf] bg-[#fffdfa]";
  const themeHeader = isDark ? "border-slate-700" : isBusiness ? "border-[#cbd8ed]" : "border-stone-200";
  const themeTitle = isDark ? "text-white" : "text-slate-900";
  const themeMuted = isDark ? "text-slate-300" : "text-slate-500";
  const themeInput = isDark ? "border-slate-600 bg-slate-800 text-slate-400" : isBusiness ? "border-[#c8d5e8] bg-white text-slate-500" : "border-[#d9dee7] bg-white text-slate-400";
  const themeButton = isDark ? "bg-cyan-500" : isBusiness ? "bg-[#1d4ed8]" : "bg-[#2563eb]";

  const preview = <article
    className={`mx-auto flex w-full flex-col overflow-hidden border shadow-[0_24px_54px_rgba(40,32,20,.16)] ${themeSurface} ${isPhone ? "h-[min(880px,calc(100dvh-140px))] rounded-[28px]" : "h-full max-h-[620px] max-w-[780px] rounded-[20px]"}`}
    data-testid={isPhone ? "phone-form-preview" : "desktop-form-preview"}
    data-theme={theme}
  >
    <img src="/imgs/form-creation-banner.png" alt="" className={`w-full shrink-0 object-cover ${isPhone ? "h-[clamp(108px,15vh,124px)]" : "h-[clamp(96px,18vh,180px)]"}`} />
    <header className={`${isPhone ? "px-6 pb-[18px] pt-5" : "px-[clamp(1.5rem,4vw,3rem)] py-[clamp(1rem,2.6vh,2rem)]"} border-b ${themeHeader}`}>
      {isTemplatePreview ? <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">{isZh ? "模板预览" : "Template preview"}</p> : null}
      <h2 className={`min-w-0 break-words font-serif font-semibold leading-[1.2] tracking-[-0.025em] ${themeTitle} ${isPhone ? "text-[clamp(1.2rem,2vw,1.6rem)]" : "text-[clamp(1.5rem,3vw,2.125rem)]"}`}>{title}</h2>
      <p className={`mt-2 text-sm ${themeMuted}`}>{description}</p>
    </header>
    <div className={`${isPhone ? "flex min-h-0 flex-1 flex-col px-6 py-6" : "mx-auto w-full max-w-[560px] px-[clamp(1.5rem,4vw,2rem)] py-[clamp(.9rem,2.5vh,2rem)]"}`}>
      <div className={`flex items-center justify-between text-xs font-medium ${themeMuted}`}><span>{isZh ? `第 ${previewFieldIndex + 1} 题` : `Question ${previewFieldIndex + 1}`}</span><span>{previewFieldIndex + 1} / {fields.length}</span></div>
      <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-[#e7edf7]"><div className="h-full rounded-full bg-[#2563eb] transition-[width]" style={{ width: `${Math.max(1, ((previewFieldIndex + 1) / fields.length) * 100)}%` }} /></div>
      <div className={`${isPhone ? "mt-7" : "mt-[clamp(1rem,3vh,1.75rem)]"}`}>
        <label className={`font-semibold ${themeTitle} ${isPhone ? "text-lg" : "text-xl"}`}>{primaryField?.label}{primaryField?.required ? <span className="ml-1 text-red-500">*</span> : null}</label>
        <div className={`mt-3 flex h-[52px] items-center rounded-[10px] border px-4 text-sm ${themeInput}`}>{primaryField?.placeholder || (isZh ? "请输入您的回答" : "Type your answer")}</div>
      </div>
      <div className={isPhone ? "mt-auto pt-6" : "mt-[clamp(1rem,3vh,1.75rem)]"}>
        <div className="flex items-center gap-2">
          <button type="button" aria-label={isZh ? "预览上一题" : "Previous preview question"} onClick={() => setPreviewFieldIndex((current) => Math.max(0, current - 1))} disabled={previewFieldIndex === 0} className="flex size-[52px] shrink-0 items-center justify-center rounded-[10px] border border-slate-300 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
          <button
            type="button"
            onClick={() => setPreviewFieldIndex((current) => Math.min(fields.length - 1, current + 1))}
            disabled={previewFieldIndex === fields.length - 1}
            className={`${isPhone ? "w-full" : "min-w-[184px]"} flex h-[52px] items-center justify-center rounded-[10px] ${themeButton} px-8 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {previewFieldIndex === fields.length - 1
              ? (isZh ? "预览完成" : "Preview complete")
              : (isZh ? "预览下一题" : "Preview next question")}
          </button>
        </div>
        <p className={`mt-[clamp(.75rem,1.8vh,1.25rem)] text-center text-xs ${themeMuted}`}>{isZh ? `第 ${previewFieldIndex + 1} 题，共 ${fields.length} 题` : `Question ${previewFieldIndex + 1} of ${fields.length}`}</p>
      </div>
    </div>
    {!isPhone && <div className="mt-auto h-[clamp(20px,4vh,40px)] shrink-0 border-t-2 border-[#e4dccc] bg-[#f8f3eb]" aria-hidden="true" />}
  </article>;

  if (!isPhone) return preview;

  // The preview scales its width from its available height so it retains a
  // phone-like portrait ratio on regular laptop viewports as well as tall screens.
  return <div
    className="relative mx-auto shrink-0 rounded-[36px] border-[7px] border-slate-900 bg-slate-900 p-[3px] shadow-[0_26px_58px_rgba(15,23,42,.24)]"
    data-testid="phone-preview-device"
    style={{ width: "min(calc(100% - 2rem), 500px, calc((100dvh - 140px) * 0.565))" }}
  >
    <span aria-hidden="true" className="absolute left-1/2 top-1.5 z-10 h-1 w-14 -translate-x-1/2 rounded-full bg-slate-950/85" />
    {preview}
  </div>;
}

function GeneratingState({ isZh, prompt }: { isZh: boolean; prompt: string }) {
  return <><p className="relative mb-12 w-fit text-sm font-bold text-slate-200 after:absolute after:-bottom-4 after:left-0 after:h-[3px] after:w-9 after:rounded-full after:bg-blue-500">{isZh ? "正在创建" : "Creating"}</p><h1 className="font-serif text-5xl font-medium leading-[1.12] tracking-[-0.06em] text-white sm:text-6xl">{isZh ? <>正在整理<br /><span className="text-blue-500">你的表单体验</span></> : <>Building your<br /><span className="text-blue-500">form experience</span></>}</h1><div className="mt-10 rounded-xl border border-slate-500/30 bg-slate-950/40 p-5 text-sm leading-6 text-slate-300"><b className="text-white">{isZh ? "你的描述" : "Your description"}</b><p className="mt-2 line-clamp-3">{prompt}</p></div><ol className="mt-9 grid gap-5 text-sm text-slate-400"><li className="text-white">●　{isZh ? "提取表单字段" : "Extracting fields"}</li><li className="text-blue-300">◌　{isZh ? "组织单题流体验" : "Composing the flow"}</li><li>○　{isZh ? "应用表单外观" : "Applying visual style"}</li></ol></>;
}

function CompleteState({
  isZh,
  generated,
  fields,
  theme,
  onGenerate,
  onGeneratedChange,
  onThemeChange,
  onTitleChange,
  onDescriptionChange,
  onPublish,
  isSaving,
  isGuest,
}: {
  isZh: boolean;
  generated: GeneratedFormDraft | null;
  fields: FormFieldSchema[];
  theme: FormTheme;
  onGenerate: () => void;
  onGeneratedChange: (updater: (current: GeneratedFormDraft | null) => GeneratedFormDraft | null) => void;
  onThemeChange: (theme: FormTheme) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPublish?: () => void;
  isSaving: boolean;
  isGuest: boolean;
}) {
  const [isAdjusting, setIsAdjusting] = useState(false);

  const updateDraft = (updater: (draft: GeneratedFormDraft) => GeneratedFormDraft) => {
    onGeneratedChange((current) => current ? updater(current) : current);
  };

  const updateTitle = (value: string) => {
    onTitleChange(value);
    updateDraft((draft) => ({ ...draft, title: value }));
  };

  const updateDescription = (value: string) => {
    onDescriptionChange(value);
    updateDraft((draft) => ({ ...draft, description: value }));
  };

  const updateFieldLabel = (index: number, label: string) => {
    updateDraft((draft) => ({
      ...draft,
      schema: {
        ...draft.schema,
        fields: draft.schema.fields.map((field, fieldIndex) => fieldIndex === index ? { ...field, label } : field),
      },
    }));
  };

  const addField = () => {
    updateDraft((draft) => ({
      ...draft,
      schema: {
        ...draft.schema,
        fields: [...draft.schema.fields, {
          key: `field_${Date.now()}`,
          label: isZh ? "新问题" : "New question",
          type: "text",
          required: false,
          placeholder: isZh ? "请输入您的回答" : "Enter your answer",
        }],
      },
    }));
  };

  const removeField = (index: number) => {
    if (fields.length <= 1) return;
    updateDraft((draft) => ({
      ...draft,
      schema: { ...draft.schema, fields: draft.schema.fields.filter((_, fieldIndex) => fieldIndex !== index) },
    }));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    updateDraft((draft) => {
      const nextFields = [...draft.schema.fields];
      const [field] = nextFields.splice(index, 1);
      nextFields.splice(targetIndex, 0, field);
      return { ...draft, schema: { ...draft.schema, fields: nextFields } };
    });
  };

  const toggleFieldRequired = (index: number) => {
    updateDraft((draft) => ({
      ...draft,
      schema: {
        ...draft.schema,
        fields: draft.schema.fields.map((field, fieldIndex) => fieldIndex === index ? { ...field, required: !field.required } : field),
      },
    }));
  };

  const selectTheme = (nextTheme: FormTheme) => {
    onThemeChange(nextTheme);
    updateDraft((draft) => ({ ...draft, theme: nextTheme }));
  };

  return <>
    <p className="relative mb-12 w-fit text-sm font-bold text-slate-200 after:absolute after:-bottom-4 after:left-0 after:h-[3px] after:w-9 after:rounded-full after:bg-blue-500">{isZh ? "草稿已就绪" : "Draft ready"}</p>
    <h1 className="font-serif text-5xl font-medium leading-[1.12] tracking-[-0.06em] text-white sm:text-6xl">{isZh ? <>表单<br /><span className="text-blue-500">已经准备好了</span></> : <>Your draft is<br /><span className="text-blue-500">ready to publish</span></>}</h1>
    <div className="mt-8 flex flex-wrap gap-2">{fields.slice(0, 6).map((field) => <span key={field.key} className="rounded-full border border-blue-300/30 px-3 py-2 text-sm text-blue-100">{field.label}</span>)}</div>
    <button type="button" onClick={onPublish} disabled={isSaving || !onPublish} className="mt-11 flex min-h-12 w-full items-center justify-center rounded-lg border border-blue-400 bg-blue-600 px-5 text-base font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}{isZh ? "发布并获取链接" : "Publish and get link"}</button>
    <button type="button" onClick={() => setIsAdjusting(true)} className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-500/60 bg-slate-900/30 px-5 text-sm font-bold text-slate-100 transition hover:border-blue-300 hover:bg-slate-800"><Pencil className="size-4" />{isZh ? "调整表单" : "Adjust form"}</button>
    <p className="mt-5 text-center text-sm text-slate-400">{isGuest ? (isZh ? "登录后保存并发布 · 无需信用卡" : "Save and publish after sign in · No card required") : (isZh ? "发布后获取公开链接和二维码" : "Publish to get a public link and QR code")}</p>
    <Sheet open={isAdjusting} onOpenChange={setIsAdjusting}>
      {generated ? <SheetContent side="left" overlayClassName="bg-black/60 sm:bg-transparent" className="flex h-[100dvh] w-full max-w-[460px] flex-col overflow-hidden border-slate-200 bg-[#fffdfa] p-0 sm:max-w-[460px]" data-testid="form-adjustment-panel">
      <SheetHeader className="shrink-0 border-b border-stone-200 px-6 py-5 pr-12">
        <div className="flex items-center gap-2">
          <SheetTitle>{isZh ? "调整表单" : "Adjust form"}</SheetTitle>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700" role="status">{isZh ? "已同步预览 · 发布时保存" : "Synced to preview · Saved on publish"}</span>
        </div>
        <SheetDescription>{isZh ? "修改会立即显示在右侧预览；发布时保存草稿。关闭后可继续发布。" : "Changes appear in the preview immediately and save when published. Close this panel to continue publishing."}</SheetDescription>
      </SheetHeader>
      <section className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5" aria-label={isZh ? "调整表单" : "Adjust form"}>
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
        {isZh ? "可调整标题、说明、字段顺序和必填状态。题型、选项和逻辑设置暂不提供。" : "Adjust the title, description, field order, and required state. Question types, options, and logic are not included here."}
      </p>
      <div>
        <label htmlFor="canvas-form-title" className="text-xs font-bold text-slate-700">{isZh ? "表单标题" : "Form title"}</label>
        <input id="canvas-form-title" value={generated.title} onChange={(event) => updateTitle(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-400 focus:ring-2" />
      </div>
      <div>
        <label htmlFor="canvas-form-description" className="text-xs font-bold text-slate-700">{isZh ? "表单说明" : "Form description"}</label>
        <textarea id="canvas-form-description" value={generated.description} onChange={(event) => updateDescription(event.target.value)} className="mt-2 min-h-[70px] w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none ring-blue-400 focus:ring-2" />
      </div>
      <div>
        <div className="flex items-center justify-between"><p className="text-xs font-bold text-slate-700">{isZh ? "基础字段调整" : "Basic field adjustments"}</p><span className="text-xs text-slate-500">{fields.length} {isZh ? "个字段" : "fields"}</span></div>
        <div className="mt-2 space-y-2">{fields.map((field, index) => <div key={field.key} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-2"><div className="flex shrink-0 flex-col rounded border border-slate-200 bg-white"><button type="button" onClick={() => moveField(index, "up")} disabled={index === 0} className="rounded-t p-1 text-slate-400 hover:text-blue-700 disabled:opacity-30" aria-label={isZh ? `上移${field.label}` : `Move ${field.label} up`} title={isZh ? "上移字段" : "Move field up"}><ArrowUp className="size-3.5" /></button><button type="button" onClick={() => moveField(index, "down")} disabled={index === fields.length - 1} className="border-t border-slate-100 rounded-b p-1 text-slate-400 hover:text-blue-700 disabled:opacity-30" aria-label={isZh ? `下移${field.label}` : `Move ${field.label} down`} title={isZh ? "下移字段" : "Move field down"}><ArrowDown className="size-3.5" /></button></div><input aria-label={`${isZh ? "字段" : "Field"} ${index + 1}`} value={field.label} onChange={(event) => updateFieldLabel(index, event.target.value)} className="h-10 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-400 focus:ring-2" /><button type="button" onClick={() => removeField(index)} disabled={fields.length <= 1} className="rounded-md p-2 text-slate-500 hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label={isZh ? `删除${field.label}` : `Delete ${field.label}`} title={isZh ? "删除字段" : "Delete field"}><Trash2 className="size-4" /></button></div><div className="mt-2 flex items-center justify-between"><span className="text-xs text-slate-500">{field.type === "text" ? (isZh ? "文本" : "Text") : field.type}</span><button type="button" onClick={() => toggleFieldRequired(index)} aria-pressed={Boolean(field.required)} className={`rounded-full px-2.5 py-1 text-xs font-bold ${field.required ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-600"}`}>{field.required ? (isZh ? "必填" : "Required") : (isZh ? "选填" : "Optional")}</button></div></div>)}</div>
        <div className="sticky bottom-0 mt-2 bg-[#fffdfa] py-2"><button type="button" onClick={addField} className="flex min-h-10 w-full items-center justify-center gap-1 rounded-lg border border-blue-200 bg-white text-xs font-bold text-blue-700 hover:border-blue-300 hover:bg-blue-50"><Plus className="size-3.5" />{isZh ? "添加字段" : "Add field"}</button></div>
      </div>
      <details className="rounded-lg border border-slate-200 bg-white p-3">
        <summary className="cursor-pointer text-xs font-bold text-slate-700">{isZh ? "外观（可选）" : "Appearance (optional)"}</summary>
        <div className="mt-3 grid grid-cols-3 gap-2">{(["minimal", "business", "dark"] as FormTheme[]).map((choice) => <button type="button" key={choice} onClick={() => selectTheme(choice)} className={`min-h-9 rounded-md border px-2 text-xs font-bold ${theme === choice ? "border-blue-300 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"}`}>{choice === "minimal" ? (isZh ? "简洁" : "Minimal") : choice === "business" ? (isZh ? "商务" : "Business") : (isZh ? "深色" : "Dark")}</button>)}</div>
      </details>
      <div><button type="button" onClick={onGenerate} className="flex min-h-10 w-full items-center justify-center rounded-lg border border-blue-300 bg-blue-50 px-4 text-sm font-bold text-blue-700 hover:bg-blue-100">{isZh ? "根据当前说明重新生成" : "Regenerate from this description"}</button><p className="mt-2 text-xs leading-5 text-slate-500">{isZh ? "重新生成会更新当前草稿，手动修改可能被覆盖。" : "Regenerating updates this draft and may overwrite manual changes."}</p></div>
      </section>
      </SheetContent> : null}
    </Sheet>
  </>;
}
