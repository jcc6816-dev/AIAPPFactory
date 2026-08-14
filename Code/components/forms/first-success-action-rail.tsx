"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FirstSuccessState =
  | "context"
  | "generated"
  | "published"
  | "testing"
  | "result";

export default function FirstSuccessActionRail({
  state,
  locale,
  title,
  description,
  primaryLabel,
  onPrimary,
  primaryHref,
  primaryDisabled,
  secondaryActions = [],
}: {
  state: FirstSuccessState;
  locale: string;
  title: string;
  description?: string;
  primaryLabel: string;
  onPrimary?: () => void;
  primaryHref?: string;
  primaryDisabled?: boolean;
  secondaryActions?: Array<{
    label: string;
    onClick?: () => void;
    href?: string;
  }>;
}) {
  const isZh = locale.toLowerCase().startsWith("zh");
  const steps = isZh
    ? ["生成表单", "发布链接", "提交第一条结果", "查看结果"]
    : ["Generate", "Publish", "Submit first result", "View results"];
  const activeStep = Math.max(
    0,
    ["context", "generated", "published", "testing", "result"].indexOf(state)
  );

  return (
    <aside data-first-success-state={state} className="w-full shrink-0 border-t border-slate-200 bg-slate-50 p-4 xl:w-64 xl:border-l xl:border-t-0">
      <div className="sticky top-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {isZh ? "下一步" : "Next step"}
        </p>
        <h2 className="mt-2 text-xl font-black text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
            {description}
          </p>
        ) : null}
        <ol className="mt-4 grid gap-2" aria-label={isZh ? "首次成功步骤" : "First success steps"}>
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                  index <= activeStep
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {index + 1}
              </span>
              <span className={index === activeStep ? "text-slate-900" : undefined}>{step}</span>
            </li>
          ))}
        </ol>
        <div className="my-4 h-px bg-slate-100" />
        {primaryHref ? (
          <Button asChild className="min-h-11 w-full whitespace-normal rounded-xl bg-blue-600 px-4 text-sm font-black leading-5 text-white hover:bg-blue-700">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled}
            className="min-h-11 w-full whitespace-normal rounded-xl bg-blue-600 px-4 text-sm font-black leading-5 text-white hover:bg-blue-700"
          >
            {primaryLabel}
          </Button>
        )}
        {secondaryActions.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {secondaryActions.map((action) => (
              action.href ? (
                <Button
                  key={action.label}
                  asChild
                  variant="outline"
                  className="min-h-9 w-full justify-start whitespace-normal rounded-xl bg-white text-xs font-bold text-slate-700"
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ) : (
                <Button
                  key={action.label}
                  type="button"
                  variant="outline"
                  onClick={action.onClick}
                  className="min-h-9 w-full justify-start whitespace-normal rounded-xl bg-white text-xs font-bold text-slate-700"
                >
                  {action.label}
                </Button>
              )
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
