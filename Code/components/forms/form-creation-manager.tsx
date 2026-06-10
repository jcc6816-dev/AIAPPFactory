"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import FormGenerator from "@/components/forms/form-generator";
import { FormArtifactPreferences, GeneratedFormDraft, FormTheme } from "@/types/form";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { trackGrowthEvent } from "@/lib/growth";
import { useAppContext } from "@/contexts/app";

export default function FormCreationManager({
  canCreate,
  allowance,
  initialTemplateId,
  initialPrompt,
  initialArtifactPreferences,
  initialSkill,
  initialSkillConfig,
  isGuest = false,
}: {
  canCreate: boolean;
  allowance?: {
    isPaidUser: boolean;
    maxForms: number | null;
    currentFormCount: number;
    canCreate: boolean;
  };
  initialTemplateId?: string;
  initialPrompt?: string;
  initialArtifactPreferences?: FormArtifactPreferences;
  initialSkill?: string;
  initialSkillConfig?: string;
  isGuest?: boolean;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("forms");
  const { setShowSignModal } = useAppContext();

  const [theme, setTheme] = useState<FormTheme>("minimal");
  const [generated, setGenerated] = useState<GeneratedFormDraft | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, startSaving] = useTransition();
  const [generationPrompt, setGenerationPrompt] = useState("");
  const hasUnsavedDraft = Boolean(generated) && !isSaving;

  useEffect(() => {
    if (!hasUnsavedDraft) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedDraft]);

  const saveForm = (status: "draft" | "published") => {
    if (isGuest) {
      setShowSignModal(true);
      toast.info(
        isZh
          ? "请登录以保存或发布您的表单场景。"
          : "Please log in to save or publish your form scenario."
      );
      return;
    }

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
        let skill_settings: any = undefined;
        if (initialSkill) {
          let parsedConfig = {};
          try {
            parsedConfig = initialSkillConfig ? JSON.parse(initialSkillConfig) : {};
          } catch (e) {
            console.error("failed to parse initialSkillConfig", e);
          }
          skill_settings = {
            [initialSkill]: {
              enabled: true,
              config: parsedConfig
            }
          };
        }

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
            status,
            ocr_template: generated.ocr_template,
            webhook: generated.webhook_provider
              ? {
                  enabled: false,
                  provider: generated.webhook_provider,
                }
              : undefined,
            generation: {
              source: generated.source,
              provider: generated.provider,
              model: generated.model,
              prompt: generationPrompt.trim(),
              clarification_answers: generated.artifact?.clarificationAnswers,
            },
            skill_settings,
          }),
        });
        const result = await response.json();

        if (result.code !== 0 || !result.data?.uuid) {
          throw new Error(result.message || "save form failed");
        }

        trackGrowthEvent("form_created", {
          form_uuid: result.data.uuid,
          status,
          source: generated.source,
        });
        if (status === "published") {
          trackGrowthEvent("form_published", { form_uuid: result.data.uuid });
        }

        toast.success(
          status === "published"
            ? isZh
              ? "表单已发布"
              : "Form published"
            : t("save_success")
        );
        router.push(
          status === "published"
            ? `/${locale}/forms/${result.data.uuid}/publish`
            : `/${locale}/forms/${result.data.uuid}`
        );
      } catch (error: any) {
        const message =
          error.message === "free plan users have reached the current form limit"
            ? t("save_limit_error")
            : error.message || "save form failed";
        toast.error(message);
      }
    });
  };

  const handleSave = () => saveForm("draft");
  const handlePublish = () => saveForm("published");

  const isZh = locale.toLowerCase().startsWith("zh");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 场景副导航 (Sub-header) */}
      <div className="flex h-[52px] items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link 
              href={isGuest ? `/${locale}` : `/${locale}/forms`} 
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-brand-blue hover:bg-slate-50 hover:text-brand-blue"
              title={isGuest ? (isZh ? "返回首页" : "Back to Home") : (isZh ? "返回工作台" : "Back to Console")}
            >
              <Icon name="RiArrowLeftLine" className="h-3.5 w-3.5" />
            </Link>
            <Link 
              href={`/${locale}`} 
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-brand-blue hover:bg-slate-50 hover:text-brand-blue"
              title={isZh ? "返回首页" : "Back to Home"}
            >
              <Icon name="RiHome5Line" className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-brand-blue/10 bg-[#f0f7ff] px-3 py-1 text-xs font-black text-slate-900 shadow-sm">
            <Icon name="RiFilePaperLine" className="h-3.5 w-3.5 text-brand-blue" />
            <span>{isZh ? "场景" : "Scenario"}: {title || (isZh ? "新表单场景" : "New Form Scenario")}</span>
          </div>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
           <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
             <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-black text-brand-blue shadow-sm">{isZh ? "设计" : "Design"}</button>
             <button className="rounded-lg px-4 py-1.5 text-xs font-bold text-slate-400 opacity-50 cursor-not-allowed">{isZh ? "数据" : "Data"}</button>
             <button className="rounded-lg px-4 py-1.5 text-xs font-bold text-slate-400 opacity-50 cursor-not-allowed">{isZh ? "分析" : "Analytics"}</button>
             <button className="rounded-lg px-4 py-1.5 text-xs font-bold text-slate-400 opacity-50 cursor-not-allowed">{isZh ? "发布" : "Publish"}</button>
           </div>
        </div>

        <div className="flex items-center gap-2">
           {hasUnsavedDraft && (
             <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 md:inline-flex">
               {isZh ? "未保存草稿" : "Unsaved Draft"}
             </span>
           )}
           <Button
             variant="outline"
             onClick={handleSave}
             disabled={isSaving || !generated}
             className="h-8 rounded-xl border-slate-200 bg-white px-4 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
           >
             {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Icon name="RiSaveLine" className="mr-1.5 h-3.5 w-3.5 text-slate-500" />}
             {isZh ? "保存草稿" : "Save Draft"}
           </Button>
           <Button 
             onClick={handlePublish}
             disabled={isSaving || !generated}
             className="h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-black text-white shadow-md hover:opacity-90 disabled:opacity-50"
           >
             {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Icon name="RiRocket2Line" className="mr-1.5 h-3.5 w-3.5" />}
             {isZh ? "发布表单" : "Publish Form"}
           </Button>
        </div>
      </div>

      {/* Main Double-Column Generative Sandbox Workspace */}
      <div className="flex-1 overflow-y-auto bg-slate-900 p-0 min-h-0">
        {!canCreate && (
          <div className="m-4 flex items-center justify-between rounded-2xl border border-brand-yellow/40 bg-white px-5 py-4 shadow-lg shadow-slate-950/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow text-slate-950 shadow-sm shadow-brand-yellow/20">
                <Icon name="RiVipDiamondLine" className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">
                  {isZh ? "免费额度已用完" : "Free allowance reached"}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {allowance?.maxForms
                    ? isZh
                      ? `当前已使用 ${allowance.currentFormCount}/${allowance.maxForms} 个表单。升级后可以继续创建并发布更多表单。`
                      : `You have used ${allowance.currentFormCount}/${allowance.maxForms} forms. Upgrade to keep creating and publishing more forms.`
                    : isZh
                      ? "升级专业版后可以继续创建更多表单。"
                      : "Upgrade to keep creating more forms."}
                </p>
              </div>
            </div>
            <Button asChild className="h-9 rounded-xl bg-brand-yellow px-5 text-slate-950 text-xs font-black hover:bg-brand-yellow/90 shadow-sm">
              <Link href="/#pricing">{isZh ? "立即升级" : "Upgrade Now"}</Link>
            </Button>
          </div>
        )}
        
        <FormGenerator
          canCreate={canCreate}
          initialTemplateId={initialTemplateId}
          initialPrompt={initialPrompt}
          initialArtifactPreferences={initialArtifactPreferences}
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
          onGeneratedPromptChange={setGenerationPrompt}
          saveButtonText={isZh ? "保存场景" : "Save Scenario"}
          showSaveAction={false}
          isGuest={isGuest}
        />
      </div>
    </div>
  );
}
