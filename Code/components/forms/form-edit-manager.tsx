"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import FormGenerator from "@/components/forms/form-generator";
import { GeneratedFormDraft, FormTheme, FormRecord } from "@/types/form";

export default function FormEditManager({
  form,
}: {
  form: FormRecord;
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
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 min-h-0">
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
  );
}
