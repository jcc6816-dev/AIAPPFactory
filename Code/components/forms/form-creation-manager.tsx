"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import FormGenerator from "@/components/forms/form-generator";
import { GeneratedFormDraft, FormTheme } from "@/types/form";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FormCreationManager({
  canCreate,
}: {
  canCreate: boolean;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("forms");

  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState<FormTheme>("minimal");
  const [generated, setGenerated] = useState<GeneratedFormDraft | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();
  
  const [generationPrompt, setGenerationPrompt] = useState("");

  const handleGenerate = (inputPrompt?: string) => {
    const finalPrompt = inputPrompt || prompt;
    if (!finalPrompt.trim()) {
      toast.error(t("prompt_required"));
      return;
    }
    
    setGenerationPrompt(finalPrompt);
    setPrompt("");

    startGenerating(async () => {
      try {
        const response = await fetch("/api/forms/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: finalPrompt,
            theme,
          }),
        });
        const result = await response.json();

        if (result.code !== 0 || !result.data) {
          throw new Error(result.message || "generate form failed");
        }

        const data = result.data as GeneratedFormDraft;
        setGenerated(data);
        setTitle(data.title);
        setDescription(data.description);
        setTheme(data.theme);
        toast.success(generated ? t("regenerate_success") : t("generate_success"));
      } catch (error: any) {
        toast.error(error.message || "generate form failed");
      }
    });
  };

  const handleSave = () => {
    if (!canCreate) {
      toast.error(t("save_limit_error"));
      return;
    }

    if (!generated) {
      toast.error(t("generate_first"));
      return;
    }

    startSaving(async () => {
      try {
        const response = await fetch("/api/forms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            theme,
            schema: generated.schema,
            generation: {
              source: generated.source,
              provider: generated.provider,
              model: generated.model,
              prompt: generationPrompt.trim() || prompt.trim(),
            },
          }),
        });
        const result = await response.json();

        if (result.code !== 0 || !result.data?.uuid) {
          throw new Error(result.message || "save form failed");
        }

        toast.success(t("save_success"));
        router.push(`/${locale}/forms/${result.data.uuid}`);
      } catch (error: any) {
        const message =
          error.message === "free plan users have reached the current form limit"
            ? t("save_limit_error")
            : error.message || "save form failed";
        toast.error(message);
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 场景副导航 (Sub-header) */}
      <div className="flex h-[52px] items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${locale}/forms`} 
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-brand-blue hover:bg-slate-50 hover:text-brand-blue"
          >
            <Icon name="RiArrowLeftLine" className="h-3.5 w-3.5" />
          </Link>
          <div className="flex items-center gap-2 rounded-lg border border-brand-blue/10 bg-[#f0f7ff] px-3 py-1 text-xs font-black text-slate-900 shadow-sm">
            <Icon name="RiFilePaperLine" className="h-3.5 w-3.5 text-brand-blue" />
            <span>场景：{title || "新表单场景"}</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
           <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
             <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-black text-brand-blue shadow-sm">设计</button>
             <button className="rounded-lg px-4 py-1.5 text-xs font-bold text-slate-400 opacity-50 cursor-not-allowed">数据</button>
             <button className="rounded-lg px-4 py-1.5 text-xs font-bold text-slate-400 opacity-50 cursor-not-allowed">分析</button>
             <button className="rounded-lg px-4 py-1.5 text-xs font-bold text-slate-400 opacity-50 cursor-not-allowed">发布</button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-black text-slate-600">
              <Icon name="RiPlayFill" className="h-3 w-3" />
              运行
           </button>
        </div>
      </div>

      {/* Main Double-Column Generative Sandbox Workspace */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 min-h-0">
        {!canCreate && (
          <div className="mb-4 border border-brand-yellow/30 bg-brand-yellow/5 rounded-2xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-yellow text-slate-950 shadow-sm shadow-brand-yellow/20">
                <Icon name="RiVipDiamondLine" className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-black text-slate-900">免费额度已用完</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">升级专业版解锁无限可能</p>
              </div>
            </div>
            <Button asChild className="h-7 rounded-lg bg-brand-yellow px-4 text-slate-950 text-[10px] font-black hover:bg-brand-yellow/90 shadow-sm">
              <Link href="/#pricing">立即升级</Link>
            </Button>
          </div>
        )}
        
        <FormGenerator
          canCreate={canCreate}
          generated={generated}
          onGeneratedChange={(updater) => setGenerated(updater(generated))}
          isSaving={isSaving}
          handleSave={handleSave}
          theme={theme}
          onThemeChange={setTheme}
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
        />
      </div>
    </div>
  );
}
