"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, Layers3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { FirstSuccessState } from "@/components/forms/first-success-action-rail";

export interface FirstSuccessContextSummary {
  title: string;
  intent?: string;
  source?: string;
  recommendedFields: string[];
}

export default function FirstSuccessContextBanner({
  locale,
  context,
  state = "context",
  generatedFieldCount,
  showChange = true,
}: {
  locale: string;
  context: FirstSuccessContextSummary;
  state?: FirstSuccessState;
  generatedFieldCount?: number;
  showChange?: boolean;
}) {
  const isZh = locale.toLowerCase().startsWith("zh");
  const fieldCount = generatedFieldCount || context.recommendedFields.length;
  const stateOrder: FirstSuccessState[] = [
    "context",
    "generated",
    "published",
    "testing",
    "result",
  ];
  const stateIndex = Math.max(0, stateOrder.indexOf(state));
  const progress = ((stateIndex + 1) / stateOrder.length) * 100;
  const stateCopy: Record<
    FirstSuccessState,
    { current: string; next: string }
  > = isZh
    ? {
        context: { current: "场景已就绪", next: "生成表单" },
        generated: { current: "草稿已生成", next: "发布表单" },
        published: { current: "表单已发布", next: "发送免费测试" },
        testing: { current: "正在测试", next: "提交测试结果" },
        result: { current: "首次设置已完成", next: "分享公开表单" },
      }
    : {
        context: { current: "Context ready", next: "Generate form" },
        generated: { current: "Draft generated", next: "Publish form" },
        published: { current: "Form published", next: "Send a free test" },
        testing: { current: "Test in progress", next: "Submit test response" },
        result: { current: "First setup complete", next: "Share public form" },
      };
  const currentState = stateCopy[state];

  return (
    <section className="border-b border-slate-200 bg-slate-50/95 px-3 py-2.5 sm:px-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600">
            <Layers3 className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-bold text-slate-800">{context.title}</span>
              {context.intent ? (
                <span className="text-slate-500">
                  {isZh ? "意图" : "Intent"}: {context.intent}
                </span>
              ) : null}
              {context.source ? (
                <span className="text-slate-500">
                  {isZh ? "来源" : "Source"}: {context.source}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              {isZh
                ? `已继承 ${fieldCount} 个推荐字段`
                : `${fieldCount} recommended fields inherited`}
            </p>
          </div>
          <div className="hidden max-w-[30%] flex-wrap justify-end gap-1.5 xl:flex">
            {context.recommendedFields.slice(0, 3).map((field) => (
              <Badge
                key={field}
                variant="outline"
                className="max-w-40 truncate border-blue-200 bg-white text-[10px] font-bold text-slate-600"
              >
                {field}
              </Badge>
            ))}
          </div>
          <div className="ml-auto w-64 shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex min-w-0 items-center gap-1.5 font-black text-slate-800">
                {state === "result" ? (
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                ) : null}
                <span className="truncate">{currentState.current}</span>
              </span>
              <span className="shrink-0 font-bold text-slate-400">
                {stateIndex + 1}/{stateOrder.length}
              </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 truncate text-[10px] font-semibold text-slate-500">
              {state === "result"
                ? currentState.next
                : `${isZh ? "下一步" : "Next"}: ${currentState.next}`}
            </p>
          </div>
          {showChange ? (
            <Link
              href={`/${locale}/forms/new`}
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-black text-blue-700 hover:bg-blue-100"
            >
              {isZh ? "更换" : "Change"}
            </Link>
          ) : null}
        </div>

        <details className="group md:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600">
              <Layers3 className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-950">
                {context.title}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                {state === "result" ? (
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                ) : null}
                <span className="truncate">{currentState.current}</span>
                <span className="shrink-0 text-slate-400">
                  {stateIndex + 1}/{stateOrder.length}
                </span>
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-black text-blue-700">
              {isZh ? "详情" : "Details"}
              <ChevronDown className="size-3.5 transition group-open:rotate-180" />
            </span>
          </summary>
          <div className="h-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="border-t border-blue-100 pb-1 pt-3">
            <p className="mb-2 text-xs font-bold text-slate-600">
              {state === "result"
                ? currentState.next
                : `${isZh ? "下一步" : "Next"}: ${currentState.next}`}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {context.recommendedFields.slice(0, 5).map((field) => (
                <Badge
                  key={field}
                  variant="outline"
                  className="border-blue-200 bg-white text-[10px] font-bold text-slate-600"
                >
                  {field}
                </Badge>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
              <span className="min-w-0 truncate">
                {[context.intent, context.source].filter(Boolean).join(" / ")}
              </span>
              {showChange ? (
                <Link
                  href={`/${locale}/forms/new`}
                  className="shrink-0 font-black text-blue-700"
                >
                  {isZh ? "更换场景" : "Change context"}
                </Link>
              ) : null}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
