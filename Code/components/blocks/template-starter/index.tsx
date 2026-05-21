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
import { getHomepageSceneTemplates } from "@/services/form-templates";

export default function TemplateStarter({ locale }: { locale: string }) {
  const templates = getHomepageSceneTemplates();

  return (
    <section id="templates" className="border-y border-slate-200/70 bg-slate-50 py-16">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-600">
              Template-first
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              不必从空白页开始，先选一个可运行场景
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              从获客、报名、满意度、票据收集等高频模板出发，再让左侧 Agent
              帮你改字段、改文案、配置发布与自动推送。
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-xl">
            <Link href={`/${locale}/forms/new`}>从空白表单开始</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group flex min-h-[260px] flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10"
            >
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
                    Agent 可帮你
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-700">
                    {template.agentQuickActions.slice(0, 2).join(" / ")}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full rounded-xl bg-slate-950 text-white hover:bg-blue-700">
                  <Link href={`/${locale}/forms/new?template=${template.id}`}>
                    使用这个模板
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
