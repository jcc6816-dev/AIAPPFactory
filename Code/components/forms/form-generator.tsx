"use client";

import { FormFieldSchema, FormTheme, GeneratedFormDraft } from "@/types/form";
import FormPreviewPanel from "./form-preview-panel";
import { 
  ArrowDown, 
  ArrowLeft, 
  ArrowRightLeft, 
  ArrowUp, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Trash2, 
  Smartphone, 
  Monitor, 
  Eye, 
  Settings2, 
  Database, 
  ExternalLink, 
  RefreshCw,
  Award,
  Calendar,
  Building,
  UserCheck
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  moveDraftField,
  normalizeDraftOptions,
  removeDraftField,
  updateDraftField,
} from "@/services/form-draft-editor";

const themes: { value: FormTheme; label: string }[] = [
  { value: "minimal", label: "✨ 极简陶瓷白" },
  { value: "business", label: "💼 商务精英蓝" },
  { value: "dark", label: "🌃 赛博毛玻璃" },
  { value: "brutalism", label: "⚡ 新野兽主义" },
  { value: "retro", label: "📜 复古羊皮纸" },
];

// Demo form shown when no form generated yet
const DEMO_FIELDS = [
  { key: "name", label: "你叫什么名字？", type: "text" as const, required: true, placeholder: "请输入你的姓名..." },
  { key: "role", label: "你的职位是？", type: "radio" as const, required: true, options: [
    { label: "产品经理", value: "pm" },
    { label: "前端工程师", value: "fe" },
    { label: "UI/UX 设计师", value: "ux" },
  ]},
  { key: "feedback", label: "有什么想对我们说的？", type: "textarea" as const, required: false, placeholder: "随便写写..." },
];

export default function FormGenerator({
  canCreate = true,
  generated,
  onGeneratedChange,
  isSaving,
  handleSave,
  theme,
  onThemeChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  onGeneratedPromptChange,
  saveButtonText = "保存场景",
  showSaveAction = true,
}: {
  canCreate?: boolean;
  generated: GeneratedFormDraft | null;
  onGeneratedChange: (updater: (current: GeneratedFormDraft | null) => GeneratedFormDraft | null) => void;
  isSaving: boolean;
  handleSave: () => void;
  theme: FormTheme;
  onThemeChange: (theme: FormTheme) => void;
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  onGeneratedPromptChange?: (prompt: string) => void;
  saveButtonText?: string;
  saveButtonIcon?: string;
  showSaveAction?: boolean;
}) {
  const t = useTranslations("forms");
  
  const examplePrompts = [
    t("generator_example_1"),
    t("generator_example_2"),
    t("generator_example_3"),
  ];

  // --- Local Interactive Workspace States ---
  const [prompt, setPrompt] = useState("");
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isGenerating, startGenerating] = useTransition();

  // --- v0 Sandbox Interactive Layout States ---
  const [sandboxTab, setSandboxTab] = useState<"preview" | "architect" | "json">("preview");
  const [responsiveSize, setResponsiveSize] = useState<"phone" | "desktop">("phone");
  const [successSubmitted, setSuccessSubmitted] = useState(false); // Controls simulated electronic Badge ticket
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // --- AI Reasoning Timeline Animation States ---
  const [isTimelineAnimating, setIsTimelineAnimating] = useState(false);
  const [timelineStep, setTimelineStep] = useState(0);

  // --- Simulated Electronic Badge success Ticket Card component ---
  function renderGratificationTicket() {
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const dx = (x - xc) / xc;
      const dy = (y - yc) / yc;
      
      // Rotate up to 12 degrees
      const rotateX = -dy * 12;
      const rotateY = dx * 12;
      
      setTiltStyle({
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`,
        transition: "transform 0.1s ease-out",
        boxShadow: `${-dx * 12}px ${-dy * 12}px 28px rgba(0, 0, 0, 0.25)`,
      });
    };

    const handleMouseLeave = () => {
      setTiltStyle({
        transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 0.5s ease-out",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      });
    };

    return (
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 text-center text-white flex flex-col items-center gap-4 shadow-xl animate-in zoom-in-95 duration-300 select-none">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center text-lg">
          ✓
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-100">签到登记成功！</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">您的电子参会胸牌已经实时生成完毕</p>
        </div>

        {/* High Fidelity Attendee Badge Card with 3D Parallax */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
          className="w-full bg-white rounded-2xl shadow-2xl p-4 text-left text-slate-900 relative overflow-hidden cursor-pointer select-none origin-center transform-gpu"
        >
          
          {/* Card notch punches */}
          <div className="absolute top-1/2 -left-2 size-4 rounded-full bg-slate-950 -translate-y-1/2"></div>
          <div className="absolute top-1/2 -right-2 size-4 rounded-full bg-slate-950 -translate-y-1/2"></div>

          {/* Header */}
          <div className="border-b border-dashed border-slate-200 pb-3 flex justify-between items-center">
            <div className="text-[10px] font-black text-blue-600 flex items-center gap-1">
              <Award className="size-3.5" />
              TECHCONF 2026
            </div>
            <div className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 uppercase">
              VIP ACCESS
            </div>
          </div>

          {/* Attendee Metadata */}
          <div className="py-4 text-center">
            <div className="text-lg font-black text-slate-950">Mike Admin</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-center gap-1">
              <Building className="size-3 text-slate-400" />
              Google Deepmind
            </div>
            
            {/* 2x2 Info Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-left border-t border-slate-100 pt-3.5">
              <div>
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">胸牌编号</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5 block">TC-90218</span>
              </div>
              <div>
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">参会席位</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5 block">VIP 贵宾席</span>
              </div>
              <div>
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">午餐类型</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5 block">素食偏好 (Veg)</span>
              </div>
              <div>
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">登记时间</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5 block flex items-center gap-1 mt-1">
                  <Calendar className="size-3 text-slate-400" />
                  05.18 20:53
                </span>
              </div>
            </div>
          </div>

          {/* Barcode representation */}
          <div className="border-t border-slate-100 pt-4 flex flex-col items-center gap-1.5">
            {/* Barcode lines */}
            <div className="w-full h-8 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 bg-[size:12px_100%] opacity-90"></div>
            <span className="text-[9px] font-mono text-slate-400 tracking-[0.2em] font-semibold">20260518 90218 0115</span>
          </div>

        </div>

        <button 
          onClick={() => setSuccessSubmitted(false)}
          className="text-[10px] text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <RefreshCw className="size-3" />
          重新模拟填写
        </button>
      </div>
    );
  }

  // --- Helper placeholder for empty workspace tabs ---
  function renderEmptyWorkspacePlaceholder() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
        <Database className="size-8 text-slate-300 mb-2 animate-pulse" />
        <span className="text-xs">工作区尚未同步，请先在左侧下发 Prompt 语义生成指令。</span>
      </div>
    );
  }

  function syncDraft(nextDraft: GeneratedFormDraft) {
    onGeneratedChange(() => nextDraft);
    onTitleChange(nextDraft.title);
    onDescriptionChange(nextDraft.description);
    onThemeChange(nextDraft.theme);
    setActivePreviewIndex(0);
  }

  function selectExamplePrompt(value: string) {
    setPrompt(value);
  }

  // --- Concurrent API Fetch & Thinking Chain Simulation ---
  function handleGenerate() {
    const submittedPrompt = prompt.trim();

    if (!submittedPrompt) {
      toast.error(t("prompt_required"));
      return;
    }

    setIsTimelineAnimating(true);
    setTimelineStep(1);
    setSuccessSubmitted(false);

    let apiResult: any = null;
    let apiError: any = null;

    // 1. Fire Next.js backend generate API route asynchronously
    startGenerating(async () => {
      try {
        const response = await fetch("/api/forms/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: submittedPrompt,
            theme,
            existingSchema: generated?.schema || null,
          }),
        });
        apiResult = await response.json();
      } catch (error) {
        apiError = error;
      }
    });

    // 2. Play the 5-step dynamic reasoning timeline animation smoothly
    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep <= 5) {
        setTimelineStep(currentStep);
      } else {
        clearInterval(interval);
        
        // Final synchronization hook: wait for API response if still pending
        const checkFinish = setInterval(() => {
          if (apiResult || apiError) {
            clearInterval(checkFinish);
            setIsTimelineAnimating(false);
            setTimelineStep(0);

            if (apiError) {
              toast.error(apiError.message || "generate form failed");
              return;
            }

            if (apiResult.code !== 0 || !apiResult.data) {
              toast.error(apiResult.message || "generate form failed");
              return;
            }

            onGeneratedPromptChange?.(submittedPrompt);
            syncDraft(apiResult.data as GeneratedFormDraft);
            toast.success(generated ? t("regenerate_success") : t("generate_success"));
          }
        }, 200);
      }
    }, 1000);
  }

  function resetDraft() {
    onGeneratedChange(() => null);
    onTitleChange("");
    setPrompt("");
    onDescriptionChange("");
    setActivePreviewIndex(0);
    setSuccessSubmitted(false);
  }

  function updateGeneratedSchema(
    updater: (current: GeneratedFormDraft) => GeneratedFormDraft
  ) {
    onGeneratedChange((current) => {
      if (!current) {
        return null;
      }
      return updater(current);
    });
  }

  function editField(
    index: number,
    updater: (field: FormFieldSchema) => FormFieldSchema
  ) {
    updateGeneratedSchema((current) => ({
      ...current,
      schema: updateDraftField(current.schema, index, updater),
    }));
  }

  function handleRemoveField(index: number) {
    if (!generated || generated.schema.fields.length <= 1) {
      toast.error(t("field_delete_guard"));
      return;
    }

    updateGeneratedSchema((current) => ({
      ...current,
      schema: removeDraftField(current.schema, index),
    }));
    setActivePreviewIndex((currentIndex) => Math.max(0, Math.min(currentIndex, generated.schema.fields.length - 2)));
  }

  function handleMoveField(index: number, direction: "up" | "down") {
    if (!generated) {
      return;
    }

    const nextIndex = direction === "up" ? index - 1 : index + 1;
    updateGeneratedSchema((current) => ({
      ...current,
      schema: moveDraftField(current.schema, index, nextIndex),
    }));
    setActivePreviewIndex(nextIndex);
  }

  const activeField = generated?.schema.fields[activePreviewIndex];

  // --- Thinking Steps Timeline Config ---
  const thinkingSteps = [
    { id: 1, text: "正在解析 Prompt 语义并提取核心组件..." },
    { id: 2, text: "构建分步状态机与结构化 Schema 模板..." },
    { id: 3, text: "自适应匹配 GenUI 质感配色与毛玻璃阴影系统..." },
    { id: 4, text: "注入前端必填项规则与输入有效性校验..." },
    { id: 5, text: "封装 JSON 数据模型并同步构建沙盒画幅..." }
  ];

  return (
    <div className="h-[calc(100vh-52px)] w-full overflow-hidden bg-slate-950 lg:flex">
      {/* 
        ========================================================================
        v0.app 风格双栏极客分屏：左侧 (AI 交互舱) | 右侧 (Interactive Sandbox 浏览器)
        ========================================================================
      */}
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden lg:flex-row">
        
         {/* ================= LEFT COLUMN: AI AGENT INTERACTIVE CONSOLE ================= */}
         <aside className="flex h-[42vh] w-full shrink-0 flex-col justify-between overflow-hidden border-b border-slate-200 bg-slate-50 lg:h-full lg:w-[380px] lg:border-b-0 lg:border-r">
          
           {/* Identity Header */}
           <div className="p-5 border-b border-slate-200 flex items-center gap-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
             <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-50">
               <Sparkles className="size-4 animate-pulse" />
             </div>
             <div>
               <h3 className="font-bold text-slate-800 text-sm">ShipAny AI Form Assistant</h3>
               <p className="text-[10px] text-slate-400 font-black tracking-wider uppercase">Agentic Builder Mode</p>
             </div>
           </div>

           {/* Chat / Timeline Area */}
           <div className="flex-1 p-5 overflow-y-auto space-y-4">
             
             {/* AI Greeting Bubble */}
             {!isTimelineAnimating && !generated && (
               <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-600 text-sm leading-relaxed space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                 <p>
                   你好！我是你的 <strong>AI 场景表单助手</strong>。我能将一句话的需求转化成优雅自适应的分步表单页面。
                 </p>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   点击下方预设场景或直接在底栏下达指令，即刻体验高级 GenUI 的实时生成与沙盒修改：
                 </p>

                 {/* Suggestions Cards */}
                 <div className="space-y-2 pt-2 border-t border-slate-100">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">💡 点击生成示例</span>
                   {examplePrompts.map((item) => (
                     <button
                       key={item}
                       type="button"
                       onClick={() => selectExamplePrompt(item)}
                       className="w-full rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-3.5 py-2.5 text-left text-xs leading-5 text-slate-700 hover:text-brand-blue transition-all hover:translate-x-1 flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                     >
                       <span className="text-brand-blue">✨</span>
                       <span className="line-clamp-2 font-medium">{item}</span>
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {/* Live Thinking Chain Visualizer */}
             {isTimelineAnimating && (
               <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-in fade-in duration-300">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">AI 表单生成规划决策链</div>
                 <div className="space-y-3.5">
                   {thinkingSteps.map((step) => {
                     const isDone = timelineStep > step.id;
                     const isActive = timelineStep === step.id;
                     return (
                       <div 
                         key={step.id} 
                         className={`flex items-center gap-3 text-xs transition-colors duration-300 ${
                           isActive ? "text-slate-800 font-black" : isDone ? "text-slate-400 font-medium" : "text-slate-300"
                         }`}
                       >
                         <div className="size-4 flex items-center justify-center">
                           {isActive ? (
                             <Loader2 className="size-3.5 text-blue-600 animate-spin" />
                           ) : isDone ? (
                             <CheckCircle2 className="size-3.5 text-emerald-500" />
                           ) : (
                             <div className="size-1.5 rounded-full bg-slate-300"></div>
                           )}
                         </div>
                         <span>{step.text}</span>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}

             {/* Complete Result Details */}
             {!isTimelineAnimating && generated && (
               <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3.5 shadow-sm animate-in fade-in duration-500">
                 <div className="flex items-center gap-2 text-xs font-black text-emerald-600">
                   <CheckCircle2 className="size-4" />
                   表单组件已在沙盒中成功生成！
                 </div>
                 <div className="text-xs text-slate-500 leading-relaxed space-y-1.5">
                   <div className="flex justify-between">
                     <span>生成源:</span>
                     <span className="font-mono text-slate-700 font-bold">{generated.source}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>生成模型:</span>
                     <span className="font-mono text-slate-700 font-bold">{generated.model}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>表单字段数:</span>
                     <span className="text-slate-700 font-bold">{generated.schema.fields.length} 个</span>
                   </div>
                   <div className="flex justify-between">
                     <span>当前主题风格:</span>
                     <span className="text-slate-700 font-bold capitalize">{theme}</span>
                   </div>
                 </div>

                 <div className="border-t border-slate-100 pt-3 flex gap-2">
                   <Button
                     variant="ghost"
                     size="sm"
                     className="flex-1 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl"
                     onClick={resetDraft}
                   >
                     <ArrowLeft className="mr-1.5 size-3" />
                     重置工作区
                   </Button>
                 </div>
               </div>
             )}
           </div>

           {/* Chat Sticky Bottom Input */}
           <div className="p-4 bg-white border-t border-slate-200 space-y-3 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 flex flex-col gap-2 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
               <Textarea
                 value={prompt}
                 onChange={(event) => setPrompt(event.target.value)}
                 placeholder="描述你想要的表单场景...（例如：创建一个带电子胸牌的会议签到表，商务风格）"
                 className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-xs focus-visible:ring-0 min-h-[50px] resize-none"
               />
               <div className="flex justify-between items-center px-1">
<Select
                   value={theme}
                   onValueChange={(value) => onThemeChange(value as FormTheme)}
                 >
                   <SelectTrigger className="w-[140px] h-7 bg-white border-slate-200 text-[10px] text-slate-600 rounded-lg focus:ring-0 hover:bg-slate-50 transition">
                     <SelectValue placeholder="切换主题风格" />
                   </SelectTrigger>
                   <SelectContent className="bg-white border-slate-200 text-slate-600 text-xs">
                     {themes.map((item) => (
                       <SelectItem key={item.value} value={item.value} className="text-xs">
                         {item.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>

                 <Button
                   onClick={handleGenerate}
                   disabled={isGenerating || isTimelineAnimating || !prompt.trim()}
                   size="sm"
                   className="rounded-lg h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                 >
                   {isGenerating || isTimelineAnimating ? (
                     <Loader2 className="size-3 animate-spin" />
                   ) : (
                     <Sparkles className="size-3 mr-1" />
                   )}
                   生成
                 </Button>
               </div>
             </div>
             
             {/* Save Form Actions */}
             {showSaveAction && generated && (
               <div className="flex gap-2">
                 <Button
                   onClick={handleSave}
                   disabled={isSaving || !canCreate}
                   className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-5 border border-slate-200"
                 >
                   {isSaving ? (
                     <Loader2 className="size-4 animate-spin mr-1.5" />
                   ) : (
                     <UserCheck className="size-4 mr-1.5 text-blue-600" />
                   )}
                   {saveButtonText}
                 </Button>
               </div>
             )}
             
             <p className="text-[10px] text-center text-slate-400">
               订阅：{canCreate ? "PRO 尊享版 (无限创建)" : "配额达到上限 (请升级)"}
             </p>
           </div>
         </aside>

        {/* ================= RIGHT COLUMN: WEBVM INTERACTIVE SANDBOX ================= */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-900">
          
          {/* Simulated Browser Shell wrapper - Full bleed, no rounded border, full height */}
          <div className="bg-white overflow-hidden h-full flex flex-col">
            
            {/* Mock Browser Header (Titlebar & Tabs Switcher) */}
            <div className="h-12 bg-slate-50 border-b border-slate-200 px-5 flex items-center justify-between flex-shrink-0">
              <div className="flex gap-1.5 items-center w-16">
                <div className="size-2.5 rounded-full bg-red-500"></div>
                <div className="size-2.5 rounded-full bg-yellow-500"></div>
                <div className="size-2.5 rounded-full bg-green-500"></div>
              </div>

              {/* View switch tabs pills */}
              <div className="flex bg-slate-200/70 p-0.5 rounded-xl gap-0.5">
                <button
                  type="button"
                  onClick={() => setSandboxTab("preview")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 ${
                    sandboxTab === "preview" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Eye className="size-3" />
                  实时预览
                </button>
                <button
                  type="button"
                  onClick={() => setSandboxTab("architect")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 ${
                    sandboxTab === "architect" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Settings2 className="size-3" />
                  字段架构
                </button>
                <button
                  type="button"
                  onClick={() => setSandboxTab("json")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 ${
                    sandboxTab === "json" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Database className="size-3" />
                  JSON Schema
                </button>
              </div>

              <div className="w-16"></div>
            </div>

            {/* Simulated Browser Control Navigation Bar */}
            <div className="h-10 bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-4 flex-shrink-0">
              <div className="flex gap-2.5 text-slate-400 text-xs cursor-pointer">
                <ArrowLeft className="size-3.5 hover:text-slate-800" />
                <ArrowRightLeft className="size-3.5 hover:text-slate-800 rotate-90" />
              </div>

              {/* URL bar path representation */}
              <div className="flex-1 bg-white border border-slate-200 rounded-lg h-7 px-3 flex items-center justify-between text-[11px] text-slate-600 font-mono select-none">
                <span>http://localhost:3000/forms/preview</span>
                <ExternalLink className="size-3 text-slate-400 cursor-pointer hover:text-slate-700" />
              </div>

              {/* Mobile / Desktop responsive toggler */}
              <div className="flex bg-slate-200 p-0.5 rounded-lg gap-0.5">
                <button
                  type="button"
                  aria-label="手机预览"
                  title="手机预览"
                  onClick={() => setResponsiveSize("phone")}
                  className={`h-6 rounded-md px-2 flex items-center justify-center gap-1 transition text-[10px] font-bold ${
                    responsiveSize === "phone" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                  }`}
                >
                  <Smartphone className="size-3.5" />
                  手机
                </button>
                <button
                  type="button"
                  aria-label="电脑预览"
                  title="电脑预览"
                  onClick={() => setResponsiveSize("desktop")}
                  className={`h-6 rounded-md px-2 flex items-center justify-center gap-1 transition text-[10px] font-bold ${
                    responsiveSize === "desktop" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                  }`}
                >
                  <Monitor className="size-3.5" />
                  电脑
                </button>
              </div>
            </div>

            {/* Virtual Browser Canvas Canvas */}
            <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
              
              {/* -------------------- 1. LIVE PREVIEW TAB -------------------- */}
              {sandboxTab === "preview" && (
                <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center items-center relative">
                  
                  {generated ? (
                    <div className="flex flex-col items-center">
                      
                      {/* Desktop / Mobile Conditional Wrapper rendering */}
                      {responsiveSize === "phone" ? (
                        
                        /* Simulated High fidelity Smartphone mockup frame */
                        <div className="w-[340px] h-[580px] bg-slate-950 rounded-[2.8rem] border-[10px] border-slate-900 shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300">
                          {/* Notch area */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-[24px] bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                            <div className="w-[40px] h-[3px] bg-slate-800 rounded-full mb-1"></div>
                          </div>
                          {/* Inside Device screen viewport */}
                          <div className="flex-1 overflow-y-auto pt-8 pb-4 px-2 select-none">
                            {successSubmitted ? (
                              renderGratificationTicket()
                            ) : (
                              <FormPreviewPanel
                                title={title || t("draft_preview")}
                                description={description || t("draft_preview_description")}
                                theme={theme}
                                fields={generated.schema.fields}
                                activeFieldIndex={activePreviewIndex}
                                onFieldChange={setActivePreviewIndex}
                              />
                            )}
                          </div>
                        </div>

                      ) : (
                        /* Desktop full canvas view */
                        <div className="w-full max-w-[1040px] min-h-[620px] rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl transition-all duration-300">
                          {successSubmitted ? (
                            renderGratificationTicket()
                          ) : (
                            <FormPreviewPanel
                              title={title || t("draft_preview")}
                              description={description || t("draft_preview_description")}
                              theme={theme}
                              fields={generated.schema.fields}
                              layout="long"
                              activeFieldIndex={activePreviewIndex}
                              onFieldChange={setActivePreviewIndex}
                            />
                          )}
                        </div>

                      )}

                      {/* Interactive Float Controls to Simulate submit */}
                      <div className="mt-5 flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSuccessSubmitted(!successSubmitted)}
                          className="rounded-xl border-slate-200 bg-white text-xs text-slate-700 font-semibold shadow-sm hover:bg-slate-50 flex items-center gap-1.5"
                        >
                          <Eye className="size-3.5 text-blue-500" />
                          {successSubmitted ? "返回填写模式 (Edit Fields)" : "模拟提交表单 (Submit & View VIP Badge)"}
                        </Button>
                      </div>

                    </div>
                  ) : (
                    
                    /* Demo Preview — show live theme switching even before generating */
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                        <Sparkles className="size-3 text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-700">演示预览 — 切换左侧主题可实时对比效果</span>
                      </div>
                      {responsiveSize === "phone" ? (
                        <div className="w-[340px] h-[580px] bg-slate-950 rounded-[2.8rem] border-[10px] border-slate-900 shadow-2xl relative flex flex-col overflow-hidden">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-[24px] bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                            <div className="w-[40px] h-[3px] bg-slate-800 rounded-full mb-1"></div>
                          </div>
                          <div className="flex-1 overflow-y-auto pt-8 pb-4 px-2 select-none">
                            <FormPreviewPanel
                              title="快速体验演示表单"
                              description="切换左下角主题风格，实时预览 5 种极致视觉效果"
                              theme={theme}
                              fields={DEMO_FIELDS}
                              activeFieldIndex={0}
                              onFieldChange={() => {}}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full max-w-[1040px] min-h-[620px] rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl">
                          <FormPreviewPanel
                            title="快速体验演示表单"
                            description="切换左下角主题风格，实时预览 5 种极致视觉效果"
                            theme={theme}
                            fields={DEMO_FIELDS}
                            layout="long"
                            activeFieldIndex={0}
                            onFieldChange={() => {}}
                          />
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 text-center max-w-xs leading-5">
                        在左侧输入提示词并点击「生成」，AI 将把你的想法编排成真实可用的表单页面
                      </p>
                    </div>

                  )}

                </div>
              )}

              {/* -------------------- 2. SCHEMA EDITOR TAB -------------------- */}
              {sandboxTab === "architect" && (
                <div className="flex-1 flex overflow-hidden bg-white animate-in fade-in duration-300">
                  
                  {generated ? (
                    <>
                      {/* Outline Fields Sidebar list */}
                      <div className="w-[220px] border-r border-slate-200 bg-slate-50 flex flex-col flex-shrink-0 select-none">
                        <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase p-3 border-b border-slate-200 bg-slate-100/50">
                          字段大纲 (OUTLINE)
                        </div>
                        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                          {generated.schema.fields.map((field, index) => (
                            <button
                              key={field.key}
                              type="button"
                              onClick={() => setActivePreviewIndex(index)}
                              className={`w-full rounded-xl border px-3 py-2 text-left transition flex items-center justify-between gap-1.5 ${
                                activePreviewIndex === index
                                  ? "border-blue-500/30 bg-blue-50/50 text-blue-900 shadow-sm"
                                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-[10px] font-mono font-bold text-slate-400">
                                  {index + 1}
                                </span>
                                <span className="text-xs font-semibold truncate">{field.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Detail Inspector and property form */}
                      <div className="flex-1 p-5 overflow-y-auto">
                        <div className="text-xs font-bold text-slate-800 uppercase border-b border-dashed border-slate-200 pb-2 mb-4 flex justify-between items-center">
                          <span>字段属性编辑器 (PROPERTIES)</span>
                          {activeField && (
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              KEY: {activeField.key}
                            </span>
                          )}
                        </div>

                        {activeField ? (
                          <div className="space-y-4 max-w-lg">
                            
                            {/* Layout operations inside properties */}
                            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl justify-between">
                              <div className="text-xs text-slate-500 font-medium">排序与删除操作</div>
                              <div className="flex gap-1.5">
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="size-7 rounded-lg"
                                  disabled={activePreviewIndex === 0}
                                  onClick={() => handleMoveField(activePreviewIndex, "up")}
                                >
                                  <ArrowUp className="size-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="size-7 rounded-lg"
                                  disabled={activePreviewIndex === generated.schema.fields.length - 1}
                                  onClick={() => handleMoveField(activePreviewIndex, "down")}
                                >
                                  <ArrowDown className="size-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="size-7 rounded-lg"
                                  onClick={() => handleRemoveField(activePreviewIndex)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-slate-700">字段标签名称 (Field Label)</Label>
                              <Input
                                value={activeField.label}
                                onChange={(event) =>
                                  editField(activePreviewIndex, (current) => ({
                                    ...current,
                                    label: event.target.value,
                                  }))
                                }
                                className="h-9 rounded-xl bg-white border-slate-200 text-xs"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-slate-700">输入占位符提示 (Placeholder)</Label>
                              <Input
                                value={activeField.placeholder || ""}
                                onChange={(event) =>
                                  editField(activePreviewIndex, (current) => ({
                                    ...current,
                                    placeholder: event.target.value,
                                  }))
                                }
                                className="h-9 rounded-xl bg-white border-slate-200 text-xs"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-slate-700">解释说明文本 (Help Text)</Label>
                              <Input
                                value={activeField.help_text || ""}
                                onChange={(event) =>
                                  editField(activePreviewIndex, (current) => ({
                                    ...current,
                                    help_text: event.target.value,
                                  }))
                                }
                                className="h-9 rounded-xl bg-white border-slate-200 text-xs"
                              />
                            </div>

                            {/* Required constraints toggle */}
                            <div className="space-y-1.5">
                              <Label className="text-xs text-slate-700">填写约束</Label>
                              <button
                                type="button"
                                onClick={() =>
                                  editField(activePreviewIndex, (current) => ({
                                    ...current,
                                    required: !current.required,
                                  }))
                                }
                                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs transition ${
                                  activeField.required
                                    ? "border-blue-300 bg-blue-50/50 text-slate-900"
                                    : "border-slate-200 bg-white text-slate-600"
                                }`}
                              >
                                <span>{activeField.required ? "必填字段 (Required)" : "非必填 (Optional)"}</span>
                                <ArrowRightLeft className="size-3.5" />
                              </button>
                            </div>

                            {/* Options manager if field is multi choice */}
                            {(activeField.type === "select" ||
                              activeField.type === "radio" ||
                              activeField.type === "checkbox") && (
                              <div className="space-y-1.5">
                                <Label className="text-xs text-slate-700">可选项配置列表 (Options - 一行一个)</Label>
                                <Textarea
                                  value={(activeField.options || []).map((option) => option.label).join("\n")}
                                  onChange={(event) =>
                                    editField(activePreviewIndex, (current) => ({
                                      ...current,
                                      options: normalizeDraftOptions(event.target.value),
                                    }))
                                  }
                                  className="min-h-[80px] rounded-xl bg-white border-slate-200 text-xs"
                                />
                                <p className="text-[10px] text-slate-400">
                                  通过回车换行分隔每一个可选项，例如：<br />无要求<br />素食偏好
                                </p>
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="text-slate-400 text-xs">暂无选中的活动字段，点击左栏大纲中的选项。</div>
                        )}
                      </div>
                    </>
                  ) : (
                    renderEmptyWorkspacePlaceholder()
                  )}

                </div>
              )}

              {/* -------------------- 3. JSON DATABASE VIEW TAB -------------------- */}
              {sandboxTab === "json" && (
                <div className="flex-1 bg-slate-950 p-5 overflow-auto font-mono text-xs text-slate-300 select-all animate-in fade-in duration-300">
                  {generated ? (
                    <pre className="whitespace-pre-wrap leading-6">
                      {JSON.stringify(generated.schema, null, 4)}
                    </pre>
                  ) : (
                    renderEmptyWorkspacePlaceholder()
                  )}
                </div>
              )}

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}
