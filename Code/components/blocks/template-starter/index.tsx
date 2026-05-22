import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getHomepageSceneTemplates,
  type SceneTemplate,
} from "@/services/form-templates";
import type { FormTheme } from "@/types/form";

const previewStyles: Record<
  FormTheme,
  {
    frame: string;
    panel: string;
    accent: string;
    field: string;
    button: string;
    text: string;
    muted: string;
  }
> = {
  minimal: {
    frame: "bg-gradient-to-br from-slate-100 to-white",
    panel: "border-slate-200 bg-white",
    accent: "bg-slate-900",
    field: "border-slate-200 bg-slate-50",
    button: "bg-slate-950",
    text: "text-slate-950",
    muted: "text-slate-500",
  },
  business: {
    frame: "bg-gradient-to-br from-blue-50 via-white to-indigo-100",
    panel: "border-blue-100 bg-white",
    accent: "bg-blue-600",
    field: "border-blue-100 bg-blue-50/70",
    button: "bg-blue-600",
    text: "text-slate-950",
    muted: "text-blue-500",
  },
  dark: {
    frame: "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950",
    panel: "border-white/10 bg-white/10",
    accent: "bg-cyan-300",
    field: "border-white/10 bg-white/10",
    button: "bg-cyan-300",
    text: "text-white",
    muted: "text-slate-300",
  },
  brutalism: {
    frame: "bg-[#f8f23a]",
    panel: "border-slate-950 bg-white shadow-[6px_6px_0_#0f172a]",
    accent: "bg-red-500",
    field: "border-slate-950 bg-white",
    button: "bg-slate-950",
    text: "text-slate-950",
    muted: "text-slate-600",
  },
  retro: {
    frame: "bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100",
    panel: "border-amber-200 bg-[#fff7e6]",
    accent: "bg-amber-700",
    field: "border-amber-200 bg-white/70",
    button: "bg-amber-800",
    text: "text-amber-950",
    muted: "text-amber-700",
  },
};

export function TemplateVisualPreview({
  template,
  fieldsLabel = "fields",
}: {
  template: SceneTemplate;
  fieldsLabel?: string;
}) {
  const style = previewStyles[template.theme];
  const previewFields = template.formSchema.fields.slice(0, 3);

  return (
    <div className={`relative h-44 overflow-hidden ${style.frame}`}>
      <div className="absolute inset-x-0 top-0 h-16 bg-white/30 blur-2xl" />
      <div
        className={`absolute left-1/2 top-5 w-[82%] -translate-x-1/2 rounded-[1.4rem] border p-3 shadow-xl backdrop-blur ${style.panel}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className={`mb-1 h-1.5 w-10 rounded-full ${style.accent}`} />
            <p className={`line-clamp-1 text-[11px] font-black ${style.text}`}>
              {template.name}
            </p>
          </div>
          <div className={`h-6 w-6 rounded-full ${style.accent}`} />
        </div>

        <div className="space-y-2">
          {previewFields.map((field, index) => (
            <div key={field.key} className={`rounded-xl border px-3 py-2 ${style.field}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`line-clamp-1 text-[10px] font-bold ${style.text}`}>
                  {field.label}
                </span>
                {field.required && <span className={`h-1.5 w-1.5 rounded-full ${style.accent}`} />}
              </div>
              <div
                className={`mt-1 h-1.5 rounded-full ${
                  index === 0 ? "w-4/5" : index === 1 ? "w-2/3" : "w-1/2"
                } ${template.theme === "dark" ? "bg-white/25" : "bg-slate-200"}`}
              />
            </div>
          ))}
        </div>

        <div className={`mt-3 h-7 rounded-full ${style.button}`}>
          <div className="mx-auto h-full w-16 rounded-full bg-white/20" />
        </div>
      </div>
      <div className={`absolute bottom-3 left-4 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold ${style.muted}`}>
        {template.formSchema.fields.length} {fieldsLabel}
      </div>
    </div>
  );
}

export default function TemplateStarter({ locale }: { locale: string }) {
  const templates = getHomepageSceneTemplates();
  const isZh = locale.toLowerCase().startsWith("zh");
  const copy = isZh
    ? {
        badge: "Template-first",
        title: "不必从空白页开始，先选一个可运行场景",
        description:
          "从获客、报名、满意度、票据收集等高频模板出发，再让左侧 Agent 帮你改字段、改文案、配置发布与自动推送。",
        blank: "从空白表单开始",
        agentCanHelp: "Agent 可帮你",
        useTemplate: "使用这个模板",
      }
    : {
        badge: "Template-first",
        title: "Do not start from a blank page. Pick a runnable scenario first.",
        description:
          "Start from proven templates for lead capture, registration, feedback, receipts and more. Then ask the page Agent to refine fields, copy, publishing and automation.",
        blank: "Start From Blank",
        agentCanHelp: "Agent can help",
        useTemplate: "Use This Template",
      };

  return (
    <section id="templates" className="border-y border-slate-200/70 bg-slate-50 py-16">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-600">
              {copy.badge}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {copy.description}
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-xl">
            <Link href={`/${locale}/forms/new`}>{copy.blank}</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group flex min-h-[420px] flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10"
            >
              <TemplateVisualPreview template={template} />
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    {template.category}
                  </Badge>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {template.theme}
                  </span>
                </div>
                <CardTitle className="text-xl leading-tight text-slate-950">
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                  {template.description}
                </p>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {copy.agentCanHelp}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-700">
                    {template.agentQuickActions.slice(0, 2).join(" / ")}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full rounded-xl bg-slate-950 text-white hover:bg-blue-700">
                  <Link href={`/${locale}/forms/new?template=${template.id}`}>
                    {copy.useTemplate}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
