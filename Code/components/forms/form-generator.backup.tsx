"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormFieldSchema, FormTheme, GeneratedFormDraft } from "@/types/form";
import FormPreviewPanel from "./form-preview-panel";
import { ArrowDown, ArrowLeft, ArrowRightLeft, ArrowUp, CheckCircle2, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  moveDraftField,
  normalizeDraftOptions,
  removeDraftField,
  updateDraftField,
} from "@/services/form-draft-editor";

const themes: FormTheme[] = ["minimal", "business", "dark"];

export default function FormGenerator({
  canCreate = true,
}: {
  canCreate?: boolean;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("forms");
  const examplePrompts = [
    t("generator_example_1"),
    t("generator_example_2"),
    t("generator_example_3"),
  ];
  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState<FormTheme>("minimal");
  const [generated, setGenerated] = useState<GeneratedFormDraft | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();

  function syncDraft(nextDraft: GeneratedFormDraft) {
    setGenerated(nextDraft);
    setTitle(nextDraft.title);
    setDescription(nextDraft.description);
    setTheme(nextDraft.theme);
    setActivePreviewIndex(0);
  }

  function selectExamplePrompt(value: string) {
    setPrompt(value);
  }

  function handleGenerate() {
    if (!prompt.trim()) {
      toast.error(t("prompt_required"));
      return;
    }

    startGenerating(async () => {
      try {
        const response = await fetch("/api/forms/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            theme,
          }),
        });
        const result = await response.json();

        if (result.code !== 0 || !result.data) {
          throw new Error(result.message || "generate form failed");
        }

        syncDraft(result.data as GeneratedFormDraft);
        toast.success(generated ? t("regenerate_success") : t("generate_success"));
      } catch (error: any) {
        toast.error(error.message || "generate form failed");
      }
    });
  }

  function handleSave() {
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
              prompt: prompt.trim(),
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
  }

  function resetDraft() {
    setGenerated(null);
    setTitle("");
    setPrompt("");
    setDescription("");
    setActivePreviewIndex(0);
  }

  function updateGeneratedSchema(
    updater: (current: GeneratedFormDraft) => GeneratedFormDraft
  ) {
    setGenerated((current) => {
      if (!current) {
        return current;
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

  return (
    <div className="space-y-6">
      {/* 三栏布局：左(生成器) | 中(预览) | 右(字段配置) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左栏：生成器 */}
        <div className="space-y-5 lg:col-span-1">
          <Card className="overflow-hidden rounded-[1.9rem] border bg-white shadow-sm">
            <CardHeader className="border-b bg-[linear-gradient(135deg,rgba(238,242,255,0.65),rgba(255,255,255,0.96))] pb-5">
              <div className="inline-flex w-fit rounded-full border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {generated ? t("draft_badge") : t("generator_badge")}
              </div>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
                <Sparkles className="size-5 text-indigo-500" />
                {t("generator_title")}
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6">
                {t("generator_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="form-prompt">{t("prompt_label")}</Label>
                <Textarea
                  id="form-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder={t("prompt_placeholder")}
                  className="min-h-32 rounded-2xl border-slate-200 bg-slate-50/80"
                />
                <p className="text-sm leading-6 text-muted-foreground">
                  {generated ? t("regenerate_hint") : t("generator_prompt_hint")}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                  <CheckCircle2 className="size-3.5" />
                  {t("generator_examples_label")}
                </div>
                <div className="grid gap-2">
                  {examplePrompts.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => selectExamplePrompt(item)}
                      className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs leading-5 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <span className="mr-1">✨</span>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("theme_label")}</Label>
                <Select
                  value={theme}
                  onValueChange={(value) => setTheme(value as FormTheme)}
                >
                  <SelectTrigger className="rounded-xl bg-white">
                    <SelectValue placeholder={t("theme_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {generated && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="draft-title">{t("title_label")}</Label>
                    <Input
                      id="draft-title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="draft-description">{t("description_label")}</Label>
                    <Textarea
                      id="draft-description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="min-h-24 rounded-2xl bg-white"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                {generated && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetDraft}
                    className="rounded-xl"
                  >
                    <ArrowLeft className="size-4" />
                    {t("workspace_back")}
                  </Button>
                )}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="rounded-xl shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t("generating")}
                    </>
                  ) : (
                    generated ? t("regenerate") : t("generate")
                  )}
                </Button>
                {generated && (
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !canCreate}
                    className="rounded-xl shadow-sm"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t("saving")}
                      </>
                    ) : (
                      t("save")
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {generated && (
            <Card className="overflow-hidden rounded-[1.75rem] border bg-white shadow-sm">
              <CardHeader className="border-b bg-slate-50/70 pb-4">
                <CardTitle className="text-lg">{t("workspace_tab_structure")}</CardTitle>
                <CardDescription>{t("workspace_right_description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {generated.schema.fields.map((field, index) => (
                  <button
                    key={field.key}
                    type="button"
                    onClick={() => setActivePreviewIndex(index)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      activePreviewIndex === index
                        ? "border-primary/30 bg-primary/5"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{field.label}</p>
                      <span className="rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{field.key}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* 中栏：预览 */}
        <div className="space-y-5 lg:col-span-1">
          <div className="overflow-hidden rounded-[1.9rem] border bg-white shadow-sm">
            <div className="border-b bg-[linear-gradient(135deg,rgba(248,250,252,0.95),rgba(255,255,255,1))] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {t("preview_live_label")}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {t("preview_live_title")}
                  </h3>
                </div>
                <div className="rounded-full border bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {generated ? t("draft_badge") : t("creator_panel_title")}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {generated ? t("workspace_sidebar_description") : t("workspace_right_description")}
              </p>
            </div>

            <div className="p-4">
              {generated ? (
                <FormPreviewPanel
                  title={title || t("draft_preview")}
                  description={description || t("draft_preview_description")}
                  theme={theme}
                  fields={generated.schema.fields}
                  activeFieldIndex={activePreviewIndex}
                  onFieldChange={setActivePreviewIndex}
                />
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.9rem] border-2 border-dashed border-slate-200 bg-[linear-gradient(135deg,rgba(238,242,255,0.55),rgba(248,250,252,0.75))] px-6 text-center">
                  <div className="mb-4 flex size-20 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(30,64,175,0.08),rgba(59,130,246,0.10))] text-3xl">
                    ✨
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t("generator_title")}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    {t("workspace_right_description")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右栏：字段配置 */}
        <Card className="overflow-hidden rounded-[1.75rem] border bg-white shadow-sm lg:col-span-1">
          <CardHeader className="border-b bg-slate-50/70 pb-4">
            <CardTitle className="text-lg">{t("workspace_tab_details")}</CardTitle>
            <CardDescription>{t("workspace_right_description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {activeField ? (
              <>
                <div className="flex items-start justify-between gap-3 rounded-2xl border bg-slate-50/70 px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{activeField.label}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{activeField.key}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border px-2.5 py-1 text-xs capitalize">
                        {activeField.type}
                      </span>
                      {activeField.required && (
                        <span className="rounded-full border px-2.5 py-1 text-xs">
                          {t("required")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="size-8 rounded-xl"
                      disabled={activePreviewIndex === 0}
                      onClick={() => handleMoveField(activePreviewIndex, "up")}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="size-8 rounded-xl"
                      disabled={generated ? activePreviewIndex === generated.schema.fields.length - 1 : true}
                      onClick={() => handleMoveField(activePreviewIndex, "down")}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="size-8 rounded-xl"
                      onClick={() => handleRemoveField(activePreviewIndex)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("field_label_title")}</Label>
                    <Input
                      value={activeField.label}
                      onChange={(event) =>
                        editField(activePreviewIndex, (current) => ({
                          ...current,
                          label: event.target.value,
                        }))
                      }
                      className="rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("placeholder_label")}</Label>
                    <Input
                      value={activeField.placeholder || ""}
                      onChange={(event) =>
                        editField(activePreviewIndex, (current) => ({
                          ...current,
                          placeholder: event.target.value,
                        }))
                      }
                      className="rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("field_required_label")}</Label>
                    <button
                      type="button"
                      onClick={() =>
                        editField(activePreviewIndex, (current) => ({
                          ...current,
                          required: !current.required,
                        }))
                      }
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                        activeField.required
                          ? "border-primary/30 bg-primary/5 text-slate-900"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      <span>{activeField.required ? t("required") : t("optional")}</span>
                      <ArrowRightLeft className="size-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("help_label")}</Label>
                    <Textarea
                      value={activeField.help_text || ""}
                      onChange={(event) =>
                        editField(activePreviewIndex, (current) => ({
                          ...current,
                          help_text: event.target.value,
                        }))
                      }
                      className="min-h-20 rounded-2xl bg-white"
                    />
                  </div>

                  {(activeField.type === "select" ||
                    activeField.type === "radio" ||
                    activeField.type === "checkbox") && (
                    <div className="space-y-2">
                      <Label>{t("field_options_label")}</Label>
                      <Textarea
                        value={(activeField.options || []).map((option) => option.label).join("\n")}
                        onChange={(event) =>
                          editField(activePreviewIndex, (current) => ({
                            ...current,
                            options: normalizeDraftOptions(event.target.value),
                          }))
                        }
                        className="min-h-24 rounded-2xl bg-white"
                      />
                      <p className="text-xs leading-6 text-muted-foreground">
                        {t("field_options_hint")}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed bg-slate-50/70 px-6 text-center text-sm text-muted-foreground">
                {t("workspace_right_description")}
              </div>
            )}

            {generated && (
              <Accordion type="single" collapsible>
                <AccordionItem value="schema">
                  <AccordionTrigger>{t("workspace_schema_toggle")}</AccordionTrigger>
                  <AccordionContent>
                    <pre className="overflow-auto rounded-2xl bg-muted p-4 text-xs leading-6">
                      {JSON.stringify(generated.schema, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
