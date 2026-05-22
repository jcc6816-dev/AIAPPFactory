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
  const isDark = template.theme === "dark";
  const textClass = style.text;
  const mutedLine = isDark ? "bg-white/20" : "bg-slate-200";

  function renderArtwork() {
    switch (template.id) {
      case "lead-capture":
        return (
          <div className="grid h-full grid-cols-[1fr_0.9fr] gap-3">
            <div className="space-y-2">
              <div className={`h-7 rounded-full ${style.accent}`} />
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className={`rounded-xl border px-3 py-2 ${style.field}`}
                >
                  <div className={`h-1.5 rounded-full ${mutedLine}`} />
                  <div className={`mt-1.5 h-1.5 w-2/3 rounded-full ${mutedLine}`} />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-end gap-1.5">
              <div className={`h-5 w-full rounded-t-xl ${style.accent}`} />
              <div className={`h-10 w-4/5 rounded-t-xl ${style.accent} opacity-80`} />
              <div className={`h-16 w-3/5 rounded-t-xl ${style.accent} opacity-60`} />
            </div>
          </div>
        );
      case "event-registration":
        return (
          <div className={`relative h-full overflow-hidden rounded-2xl border ${style.field}`}>
            <div className={`absolute inset-x-0 top-0 h-12 ${style.accent}`} />
            <div className="absolute left-4 right-4 top-7 rounded-2xl border border-white/40 bg-white p-3 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-2 w-20 rounded-full bg-slate-900" />
                  <div className="h-1.5 w-12 rounded-full bg-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="h-2 w-2 rounded-sm bg-blue-100" />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-7 rounded-lg bg-slate-100" />
                <div className="h-7 rounded-lg bg-slate-100" />
                <div className="h-7 rounded-lg bg-blue-600" />
              </div>
            </div>
          </div>
        );
      case "satisfaction-survey":
        return (
          <div className="flex h-full flex-col justify-between">
            <div className={`rounded-2xl border p-3 ${style.field}`}>
              <div className={`mb-2 h-2 w-24 rounded-full ${mutedLine}`} />
              <div className="flex items-end gap-2">
                {[38, 64, 48, 82, 58].map((height, index) => (
                  <div
                    key={height}
                    className={`w-full rounded-t-lg ${index === 3 ? style.accent : mutedLine}`}
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["😄", "🙂", "😐", "🙁"].map((item) => (
                <div key={item} className={`rounded-xl border py-2 text-center text-lg ${style.field}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      case "product-recommendation":
        return (
          <div className="grid h-full grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className={`rounded-2xl border p-3 ${item === 1 ? `${style.accent} text-white` : style.field}`}
              >
                <div className={`mb-5 h-7 w-7 rounded-xl ${item === 1 ? "bg-white/25" : style.accent}`} />
                <div className={`h-1.5 rounded-full ${item === 1 ? "bg-white/50" : mutedLine}`} />
                <div className={`mt-1.5 h-1.5 w-2/3 rounded-full ${item === 1 ? "bg-white/30" : mutedLine}`} />
              </div>
            ))}
          </div>
        );
      case "booking-consultation":
        return (
          <div className={`h-full rounded-2xl border p-3 ${style.field}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className={`h-2 w-20 rounded-full ${style.accent}`} />
              <div className={`h-6 w-6 rounded-full ${mutedLine}`} />
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 21 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-5 rounded-md ${
                    [8, 9, 15].includes(index) ? style.accent : mutedLine
                  }`}
                />
              ))}
            </div>
            <div className={`mt-3 h-7 rounded-full ${style.button}`} />
          </div>
        );
      case "invoice-receipt-collection":
        return (
          <div className="grid h-full grid-cols-[0.75fr_1fr] gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
              <div className="mb-3 h-2 w-16 rounded-full bg-slate-300" />
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="mb-2 h-1.5 rounded-full bg-slate-200" />
              ))}
              <div className="mt-4 h-7 rounded-lg bg-blue-100" />
            </div>
            <div className={`rounded-2xl border p-3 ${style.field}`}>
              <div className={`mb-3 h-7 w-7 rounded-xl ${style.accent}`} />
              <div className={`mb-2 h-2 w-20 rounded-full ${mutedLine}`} />
              <div className={`mb-2 h-2 w-14 rounded-full ${mutedLine}`} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className={`h-8 rounded-xl ${style.accent}`} />
                <div className={`h-8 rounded-xl ${mutedLine}`} />
              </div>
            </div>
          </div>
        );
      case "beta-feedback":
        return (
          <div className="space-y-2">
            {[0, 1, 2].map((item) => (
              <div key={item} className={`rounded-2xl border p-3 ${style.field}`}>
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-lg ${item === 0 ? "bg-red-400" : item === 1 ? "bg-amber-300" : "bg-emerald-300"}`} />
                  <div className="flex-1">
                    <div className={`h-1.5 rounded-full ${mutedLine}`} />
                    <div className={`mt-1.5 h-1.5 w-2/3 rounded-full ${mutedLine}`} />
                  </div>
                  <div className={`h-5 w-10 rounded-full ${style.accent}`} />
                </div>
              </div>
            ))}
          </div>
        );
      case "waitlist":
        return (
          <div className="relative h-full">
            <div className={`absolute left-2 top-3 h-28 w-28 rounded-full ${style.accent} opacity-30 blur-xl`} />
            <div className={`absolute right-2 top-1 h-24 w-24 rounded-full ${isDark ? "bg-fuchsia-400" : "bg-blue-300"} opacity-30 blur-xl`} />
            <div className={`relative rounded-3xl border p-4 ${style.panel}`}>
              <div className={`mb-4 h-2 w-24 rounded-full ${style.accent}`} />
              <div className="space-y-2">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className={`h-7 w-7 rounded-full ${item === 0 ? style.accent : mutedLine}`} />
                    <div className={`h-2 flex-1 rounded-full ${mutedLine}`} />
                    <div className={`h-5 w-9 rounded-full ${item < 2 ? style.accent : mutedLine}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            {template.formSchema.fields.slice(0, 3).map((field, index) => (
              <div key={field.key} className={`rounded-xl border px-3 py-2 ${style.field}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`line-clamp-1 text-[10px] font-bold ${textClass}`}>
                    {field.label}
                  </span>
                  {field.required && <span className={`h-1.5 w-1.5 rounded-full ${style.accent}`} />}
                </div>
                <div
                  className={`mt-1 h-1.5 rounded-full ${
                    index === 0 ? "w-4/5" : index === 1 ? "w-2/3" : "w-1/2"
                  } ${mutedLine}`}
                />
              </div>
            ))}
          </div>
        );
    }
  }

  return (
    <div className={`relative h-44 overflow-hidden ${style.frame}`}>
      <div className="absolute inset-x-0 top-0 h-20 bg-white/30 blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.18),transparent_30%)]" />
      <div className="relative z-10 h-full p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className={`mb-1 h-1.5 w-10 rounded-full ${style.accent}`} />
            <p className={`line-clamp-1 text-[11px] font-black ${textClass}`}>
              {template.name}
            </p>
          </div>
          <div className={`h-6 w-6 rounded-full ${style.accent}`} />
        </div>
        <div className="h-[118px]">{renderArtwork()}</div>
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
