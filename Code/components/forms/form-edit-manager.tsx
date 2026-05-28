"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { Loader2 } from "lucide-react";
import FormGenerator from "@/components/forms/form-generator";
import { GeneratedFormDraft, FormTheme, FormRecord } from "@/types/form";

export default function FormEditManager({
  form,
  locale,
}: {
  form: FormRecord;
  locale: string;
}) {
  const t = useTranslations("forms");

  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState<FormTheme>(form.theme);
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description);
  const [formStatus, setFormStatus] = useState(form.status);
  
  const [generated, setGenerated] = useState<GeneratedFormDraft | null>({
    title: form.title,
    description: form.description || "",
    theme: form.theme,
    schema: form.schema_json,
    source: "ai",
    provider: form.llm_provider,
    model: form.llm_model,
  });
  
  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify({
      title: form.title,
      description: form.description || "",
      theme: form.theme,
      schema: form.schema_json,
      status: form.status,
    })
  );

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        title,
        description: description || "",
        theme,
        schema: generated?.schema || form.schema_json,
        status: formStatus,
      }),
    [description, form.schema_json, formStatus, generated?.schema, theme, title]
  );
  const hasUnsavedChanges = currentSnapshot !== savedSnapshot;

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleGenerate = (inputPrompt?: string) => {
    const finalPrompt = inputPrompt || prompt;
    if (!finalPrompt.trim()) {
      toast.error(t("prompt_required"));
      return;
    }
    
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
            existingSchema: generated?.schema || form.schema_json,
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
        toast.success(t("regenerate_success"));
      } catch (error: any) {
        toast.error(error.message || "generate form failed");
      }
    });
  };

  const saveForm = (status: "draft" | "published") => {
    if (!generated) {
      toast.error(t("generate_first"));
      return;
    }

    startSaving(async () => {
      try {
        const response = await fetch(`/api/forms/${form.uuid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            theme,
            schema: generated.schema,
            status,
          }),
        });
        const result = await response.json();

        if (result.code !== 0 || !result.data?.uuid) {
          throw new Error(result.message || "update form failed");
        }

        setFormStatus(status);
        setSavedSnapshot(
          JSON.stringify({
            title,
            description: description || "",
            theme,
            schema: generated.schema,
            status,
          })
        );
        toast.success(
          status === "published"
            ? isZh
              ? "表单已发布"
              : "Form published"
            : t("save_success")
        );
      } catch (error: any) {
        toast.error(error.message || "update form failed");
      }
    });
  };

  const handleSave = () => saveForm("draft");
  const handlePublish = () => saveForm("published");

  const isZh = locale.toLowerCase().startsWith("zh");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SceneSubnav
        locale={locale}
        formId={form.uuid}
        formTitle={form.title}
        active="design"
        rightActions={
          <div className="flex items-center gap-2">
             {hasUnsavedChanges && (
               <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 md:inline-flex">
                 {isZh ? "未保存修改" : "Unsaved Changes"}
               </span>
             )}
             <Button 
               variant="outline"
               size="sm"
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
               {isZh ? "同步并发布" : "Publish"}
             </Button>
          </div>
        }
      />
      <div className="flex-1 p-0 overflow-y-auto min-h-0 bg-slate-900">
        <FormGenerator
          canCreate={true}
          generated={generated}
          onGeneratedChange={(updater) => setGenerated(updater(generated as any))}
          isSaving={isSaving}
          handleSave={handleSave}
          theme={theme}
          onThemeChange={setTheme}
          title={title}
          onTitleChange={setTitle}
          description={description || ""}
          onDescriptionChange={setDescription}
          saveButtonText={isZh ? "更新并发布" : "Update & Publish"}
          saveButtonIcon="RiSave3Line"
        />
      </div>
    </div>
  );
}
