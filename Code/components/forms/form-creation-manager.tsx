"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import FormGenerator from "@/components/forms/form-generator";
import { FormArtifactPreferences, FormCreationContext, GeneratedFormDraft, FormTheme } from "@/types/form";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  consumeGuestLoginIntent,
  getCurrentGrowthAttribution,
  rememberGuestLoginIntent,
  trackGrowthEvent,
} from "@/lib/growth";
import { useAppContext } from "@/contexts/app";
import FirstSuccessContextBanner, {
  FirstSuccessContextSummary,
} from "@/components/forms/first-success-context-banner";
import FirstSuccessActionRail from "@/components/forms/first-success-action-rail";
import FormPreviewPanel from "@/components/forms/form-preview-panel";

const TEMPLATE_ARRIVAL_FIELD_LIMIT = 5;

export default function FormCreationManager({
  canCreate,
  allowance,
  initialTemplateId,
  initialPrompt,
  initialArtifactPreferences,
  initialCreationContext,
  initialContextSummary,
  initialSkill,
  initialSkillConfig,
  isGuest = false,
}: {
  canCreate: boolean;
  allowance?: {
    isPaidUser: boolean;
    isInternalUser?: boolean;
    isUnlimited?: boolean;
    maxForms: number | null;
    currentFormCount: number;
    canCreate: boolean;
  };
  initialTemplateId?: string;
  initialPrompt?: string;
  initialArtifactPreferences?: FormArtifactPreferences;
  initialCreationContext?: FormCreationContext;
  initialContextSummary?: FirstSuccessContextSummary;
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
  const [showFullBuilder, setShowFullBuilder] = useState(!initialTemplateId);
  const hasTrackedPrimaryActionView = useRef(false);
  const hasUnsavedDraft = Boolean(generated) && !isSaving;
  const isTemplateArrival = Boolean(initialTemplateId) && !showFullBuilder;
  const contextIntent = (initialCreationContext?.intent || initialTemplateId || "custom_form")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
  const contextSummary: FirstSuccessContextSummary = initialContextSummary || {
    title: contextIntent,
    intent: initialCreationContext?.intent,
    source: initialCreationContext?.source || (initialTemplateId ? "template" : "direct"),
    recommendedFields: generated?.schema.fields
      .slice(0, 5)
      .map((field) => field.label) || [],
  };
  const buildActivationMetadata = (primaryAction: string) => ({
    template_id: initialTemplateId || "scratch",
    is_guest: isGuest,
    source: initialCreationContext?.source || "direct",
    intent: initialCreationContext?.intent || "unspecified",
    mode: initialCreationContext?.mode || "default",
    primary_action: primaryAction,
    device:
      typeof window !== "undefined" && window.innerWidth < 1024
        ? "mobile"
        : "desktop",
  });

  useEffect(() => {
    // 触发页面浏览事件 (不包含 PII)
    trackGrowthEvent("forms_new_view", {
      template_id: initialTemplateId || "scratch",
      is_guest: isGuest,
      source: initialCreationContext?.source || "direct",
      intent: initialCreationContext?.intent || "unspecified",
      mode: initialCreationContext?.mode || "default",
      device: typeof window !== "undefined" && window.innerWidth < 1024 ? "mobile" : "desktop",
    });
    trackGrowthEvent("activation_started", {
      template_id: initialTemplateId || "scratch",
      source: initialCreationContext?.source || "direct",
      intent: initialCreationContext?.intent || "unspecified",
    });

    // 如果是通过具体模板进来的，额外触发模板上下文加载完成事件
    if (initialTemplateId) {
      trackGrowthEvent("template_context_loaded", {
        template_id: initialTemplateId,
        is_guest: isGuest,
        source: initialCreationContext?.source || "direct",
        intent: initialCreationContext?.intent || "unspecified",
        mode: initialCreationContext?.mode || "default",
      });
    }

    if (!isGuest) {
      const previousGuestIntent = consumeGuestLoginIntent();
      if (previousGuestIntent) {
        trackGrowthEvent("guest_login_intent_returned", {
          ...buildActivationMetadata("login_return"),
          previous_trigger: previousGuestIntent.trigger,
          previous_path: previousGuestIntent.path,
          had_previous_intent: true,
        });
      }
    }

    // 清理 URL 中的敏感 query 参数，防止在录像或浏览时暴露 PII
    if (typeof window !== "undefined" && window.location.search) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sensitiveParams = [
          "prompt",
          "callbackUrl",
          "email",
          "token",
          "code",
          "state",
          "answer",
          "answers",
          "clarification",
          "clarification_answers"
        ];
        let changed = false;
        sensitiveParams.forEach(param => {
          if (urlParams.has(param)) {
            urlParams.delete(param);
            changed = true;
          }
        });
        if (changed) {
          const queryString = urlParams.toString();
          const cleanUrl = window.location.pathname + (queryString ? `?${queryString}` : "");
          window.history.replaceState({}, "", cleanUrl);
        }
      } catch (e) {
        console.error("Failed to clean sensitive URL query parameters", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!generated || hasTrackedPrimaryActionView.current) {
      return;
    }

    hasTrackedPrimaryActionView.current = true;
    const primaryAction = initialTemplateId ? "create_form" : "publish_form";
    trackGrowthEvent("forms_new_primary_action_viewed", {
      ...buildActivationMetadata(primaryAction),
      has_generated_preview: true,
      fields_count: generated.schema.fields.length,
      primary_action: primaryAction,
    });
  }, [generated]);

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

  const saveForm = (
    status: "draft" | "published",
    primaryActionOverride?: "create_form" | "publish_form" | "save_draft"
  ) => {
    const primaryAction =
      primaryActionOverride ||
      (status === "published" ? "publish_form" : "save_draft");
    const actionMetadata = {
      ...buildActivationMetadata(primaryAction),
      has_generated_preview: Boolean(generated),
      fields_count: generated?.schema.fields.length || 0,
      primary_action: primaryAction,
    };

    if (status === "published" || primaryAction === "create_form") {
      trackGrowthEvent("forms_new_primary_action_clicked", actionMetadata);
    }

    if (isGuest) {
      rememberGuestLoginIntent({
        ...actionMetadata,
        trigger: primaryAction,
      });
      trackGrowthEvent("guest_login_intent_started", {
        ...actionMetadata,
        trigger: primaryAction,
      });
      setShowSignModal(true);
      trackGrowthEvent("guest_login_prompt_shown", {
        trigger: primaryAction,
        template_id: initialTemplateId || "scratch",
        is_guest: true,
        source: initialCreationContext?.source || "direct",
        intent: initialCreationContext?.intent || "unspecified",
        mode: initialCreationContext?.mode || "default",
      });
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
        const attribution = getCurrentGrowthAttribution({
          content_source: initialCreationContext?.source,
          intent: initialCreationContext?.intent,
          template_id: initialTemplateId,
        });
        if (status === "published") {
          trackGrowthEvent("publish_started", {
            template_id: initialTemplateId || "scratch",
            source: initialCreationContext?.source || "direct",
            intent: initialCreationContext?.intent || "unspecified",
          });
        }
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
              attribution,
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
          trackGrowthEvent("publish_succeeded", {
            form_uuid: result.data.uuid,
            source: "first_success_loop",
          });
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
  const handleCreateFromTemplate = () => saveForm("draft", "create_form");

  const isZh = locale.toLowerCase().startsWith("zh");
  const templateArrivalTitle = formatTemplateArrivalTitle(
    contextSummary.title,
    isZh
  );
  const templateArrivalDescription = isZh
    ? "可以先使用此模板创建表单，之后再调整字段、主题和发布设置。"
    : "Create it first, then adjust fields, theme, and publishing settings.";
  const templateActionNote = isGuest
    ? isZh
      ? "需要登录后保存和发布；登录后会回到当前表单。"
      : "Sign in is required to save and publish. We'll bring you back to this form after sign-in."
    : isZh
      ? "你已登录。创建后可继续调整、发布和分享。"
      : "You are signed in. Create it, then adjust, publish, and share.";
  const primaryActionLabel =
    initialTemplateId
      ? isZh
        ? "使用此模板创建表单"
        : "Create this form"
      : isZh
        ? "发布表单"
        : "Publish form";
  const primaryActionDescription = initialTemplateId ? templateActionNote : undefined;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 场景副导航 (Sub-header) */}
      <div className="flex min-h-[52px] items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2 sm:px-6 shrink-0 z-10">
        <div className="flex min-w-0 items-center gap-4">
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
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-brand-blue/10 bg-[#f0f7ff] px-2.5 py-1 text-xs font-black text-slate-900 shadow-sm sm:px-3">
            <Icon name="RiFilePaperLine" className="h-3.5 w-3.5 text-brand-blue" />
            <span className="max-w-[42vw] truncate sm:max-w-[260px]">{title || contextSummary.title || (isZh ? "新表单" : "New form")}</span>
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
             disabled={isSaving || !generated || isTemplateArrival}
             className="hidden h-8 rounded-xl border-slate-200 bg-white px-4 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50 md:inline-flex xl:hidden"
           >
             {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Icon name="RiSaveLine" className="mr-1.5 h-3.5 w-3.5 text-slate-500" />}
             {isZh ? "保存草稿" : "Save Draft"}
           </Button>
           <Button 
             onClick={handlePublish}
             disabled={isSaving || !generated || isTemplateArrival}
             className="hidden h-9 max-w-[48vw] rounded-xl bg-blue-600 px-3 text-xs font-black text-white shadow-md hover:bg-blue-700 disabled:opacity-50 md:inline-flex sm:max-w-none sm:px-5 xl:hidden"
           >
             {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Icon name="RiRocket2Line" className="mr-1.5 h-3.5 w-3.5" />}
             {primaryActionLabel}
           </Button>
        </div>
      </div>

      {/* Main Double-Column Generative Sandbox Workspace */}
      <div data-clarity-mask="true" className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-100 p-0">
        <FirstSuccessContextBanner
          locale={locale}
          state={isTemplateArrival ? "context" : generated ? "generated" : "context"}
          context={{
            ...contextSummary,
            recommendedFields:
              generated?.schema.fields.slice(0, 5).map((field) => field.label) ||
              contextSummary.recommendedFields,
          }}
          generatedFieldCount={generated?.schema.fields.length}
        />
        {!isGuest && !canCreate && (
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
        
        <div className="flex min-h-0 flex-1">
          <div className={isTemplateArrival ? "hidden" : "min-w-0 flex-1"}>
            <FormGenerator
              canCreate={canCreate}
              initialTemplateId={initialTemplateId}
              initialPrompt={initialPrompt}
              initialArtifactPreferences={initialArtifactPreferences}
              initialCreationContext={initialCreationContext}
              generated={generated}
              onGeneratedChange={(updater) => setGenerated(updater(generated))}
              isSaving={isSaving}
              handleSave={handleSave}
              handlePublish={handlePublish}
              theme={theme}
              onThemeChange={setTheme}
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              onGeneratedPromptChange={setGenerationPrompt}
              saveButtonText={isZh ? "保存场景" : "Save Scenario"}
              generatedPrimaryActionLabel={primaryActionLabel}
              showSaveAction={false}
              isGuest={isGuest}
              focusMode
            />
          </div>
          {isTemplateArrival ? (
            <TemplateArrivalExperience
              locale={locale}
              title={templateArrivalTitle}
              description={templateArrivalDescription}
              context={contextSummary}
              fields={
                generated?.schema.fields
                  .slice(0, TEMPLATE_ARRIVAL_FIELD_LIMIT)
                  .map((field) => field.label) ||
                contextSummary.recommendedFields.slice(0, TEMPLATE_ARRIVAL_FIELD_LIMIT)
              }
              loginNote={templateActionNote}
              primaryLabel={primaryActionLabel}
              secondaryLabel={isZh ? "预览字段" : "Preview fields"}
              onPrimary={handleCreateFromTemplate}
              onSecondary={() => setShowFullBuilder(true)}
              primaryDisabled={isSaving || !generated}
              isSaving={isSaving}
              draft={generated}
            />
          ) : generated ? (
            <FirstSuccessActionRail
              state="generated"
              locale={locale}
              title={isZh ? "草稿已就绪" : "Draft ready"}
              description={primaryActionDescription}
              primaryLabel={primaryActionLabel}
              onPrimary={handlePublish}
              primaryDisabled={isSaving}
              secondaryActions={[
                {
                  label: isZh ? "保存草稿" : "Save draft",
                  onClick: handleSave,
                },
              ]}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TemplateArrivalExperience({
  locale,
  title,
  description,
  context,
  fields,
  loginNote,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled,
  isSaving,
  draft,
}: {
  locale: string;
  title: string;
  description: string;
  context: FirstSuccessContextSummary;
  fields: string[];
  loginNote: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryDisabled?: boolean;
  isSaving?: boolean;
  draft: GeneratedFormDraft | null;
}) {
  const isZh = locale.toLowerCase().startsWith("zh");
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const previewFields = fields.length
    ? fields
    : [isZh ? "姓名" : "Name", isZh ? "电子邮箱" : "Email"];
  const preferredDevice = draft?.schema.aspects?.preferredDevice || "phone";
  const isPhonePreview = preferredDevice === "phone";

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-slate-100 pb-24 md:pb-0 xl:flex-row">
      <div className="flex w-full min-w-0 shrink-0 flex-col overflow-x-hidden border-b border-slate-200 bg-white px-4 py-6 shadow-sm md:px-8 xl:w-[390px] xl:border-b-0 xl:border-r xl:py-8">
        <span className="inline-flex w-fit rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
          {isZh ? "模板上下文" : "Template context"}
        </span>
        <h1 className="mt-5 max-w-full break-words text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-4xl xl:text-3xl">
          {title}
        </h1>
        <p className="mt-4 max-w-full break-words text-sm font-medium leading-6 text-slate-600 md:text-base xl:text-sm">
          {description}
        </p>

        <div className="mt-6 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Icon name="RiFileList3Line" className="h-4 w-4 text-slate-500" />
            <span>{context.title}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {previewFields.map((field) => (
              <span
                key={field}
                className="max-w-full break-words rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600"
              >
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 hidden gap-3 md:grid">
          <Button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled}
            className="min-h-12 rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm hover:bg-blue-700"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {primaryLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSecondary}
            className="min-h-11 rounded-xl border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            {secondaryLabel}
          </Button>
        </div>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs font-semibold leading-5 text-slate-600">
          <div className="flex items-start gap-2">
            <Icon name="RiInformationLine" className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>{loginNote}</span>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-start justify-center overflow-x-hidden px-4 py-6 md:px-8 xl:items-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70 md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3 px-1 text-[11px] font-bold text-slate-400">
            <span>
              {isPhonePreview
                ? isZh
                  ? "移动端高保真预览"
                  : "Mobile high-fidelity preview"
                : isZh
                  ? "桌面端高保真预览"
                  : "Desktop high-fidelity preview"}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 uppercase tracking-wide">
              {draft?.theme || "minimal"} / {draft?.schema.aspects?.themeVariant || "default"}
            </span>
          </div>

          {draft ? (
            <div className="flex justify-center">
              {isPhonePreview ? (
                <div
                  data-phone-preview-frame
                  className="relative flex h-[clamp(430px,calc(100dvh-260px),620px)] max-h-full w-auto max-w-full aspect-[340/580] flex-col overflow-hidden rounded-[2.4rem] border-[8px] border-slate-900 bg-slate-950 shadow-2xl"
                >
                  <div className="absolute left-1/2 top-0 z-20 flex h-[22px] w-[110px] -translate-x-1/2 items-center justify-center rounded-b-2xl bg-slate-900">
                    <div className="mb-1 h-[3px] w-[40px] rounded-full bg-slate-800" />
                  </div>
                  <div className="aiff-phone-preview-scroll relative flex-1 overflow-y-auto rounded-[1.9rem]">
                    <FormPreviewPanel
                      title={draft.title}
                      description={draft.description}
                      theme={draft.theme}
                      fields={draft.schema.fields}
                      layout={draft.schema.layout || "single"}
                      aspects={draft.schema.aspects}
                      activeFieldIndex={activePreviewIndex}
                      onFieldChange={setActivePreviewIndex}
                      showTopProgress={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full min-w-0">
                  <FormPreviewPanel
                    title={draft.title}
                    description={draft.description}
                    theme={draft.theme}
                    fields={draft.schema.fields}
                    layout={draft.schema.layout || "single"}
                    aspects={draft.schema.aspects}
                    activeFieldIndex={activePreviewIndex}
                    onFieldChange={setActivePreviewIndex}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
              {isZh ? "正在加载模板预览..." : "Loading template preview..."}
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur md:hidden">
        <Button
          type="button"
          onClick={onPrimary}
          disabled={primaryDisabled}
          className="min-h-12 w-full rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm hover:bg-blue-700"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {primaryLabel}
        </Button>
        <p className="mt-2 text-center text-[11px] font-semibold leading-4 text-slate-500">
          {loginNote}
        </p>
      </div>
    </section>
  );
}

function formatTemplateArrivalTitle(templateTitle: string, isZh: boolean) {
  if (isZh) {
    return `你的${templateTitle}已经准备好`;
  }

  const normalizedTitle = templateTitle.trim();
  const lowerTitle = normalizedTitle.toLowerCase();
  const titleWithForm = lowerTitle.endsWith("form")
    ? lowerTitle
    : `${lowerTitle} form`;

  return `Your ${titleWithForm} is ready`;
}
