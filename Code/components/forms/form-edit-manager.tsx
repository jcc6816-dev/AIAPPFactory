"use client";

import { useState, useTransition } from "react";
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

  const handleSave = () => {
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
          }),
        });
        const result = await response.json();

        if (result.code !== 0 || !result.data?.uuid) {
          throw new Error(result.message || "update form failed");
        }

        toast.success(t("save_success"));
      } catch (error: any) {
        toast.error(error.message || "update form failed");
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SceneSubnav
        locale={locale}
        formId={form.uuid}
        formTitle={form.title}
        active="design"
        rightActions={
          <div className="flex items-center gap-2">
             <Button 
               variant="outline"
               size="sm"
               onClick={handleSave} 
               disabled={isSaving || !generated}
               className="h-8 rounded-xl border-slate-200 bg-white px-4 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
             >
               {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Icon name="RiSaveLine" className="mr-1.5 h-3.5 w-3.5 text-slate-500" />}
               保存草稿
             </Button>

             <Button 
               onClick={handleSave} 
               disabled={isSaving || !generated}
               className="h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-black text-white shadow-md hover:opacity-90 disabled:opacity-50"
             >
               {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Icon name="RiRocket2Line" className="mr-1.5 h-3.5 w-3.5" />}
               同步并发布
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
          saveButtonText="更新并发布"
          saveButtonIcon="RiSave3Line"
        />
      </div>
    </div>
  );
}
