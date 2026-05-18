import Link from "next/link";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";

type SceneTab = "design" | "data" | "analytics" | "publish";

interface SceneSubnavProps {
  locale: string;
  formId: string;
  formTitle: string;
  active: SceneTab;
  rightActions?: React.ReactNode;
}

const tabs: Array<{ key: SceneTab; label: string; href: (locale: string, id: string) => string }> = [
  {
    key: "design",
    label: "设计",
    href: (locale, id) => `/${locale}/forms/${id}`,
  },
  {
    key: "data",
    label: "数据",
    href: (locale, id) => `/${locale}/forms/${id}/submissions`,
  },
  {
    key: "analytics",
    label: "分析",
    href: (locale, id) => `/${locale}/forms/${id}/analytics`,
  },
  {
    key: "publish",
    label: "发布",
    href: (locale, id) => `/${locale}/forms/${id}/publish`,
  },
];

export default function SceneSubnav({
  locale,
  formId,
  formTitle,
  active,
  rightActions,
}: SceneSubnavProps) {
  return (
    <div className="flex min-h-[52px] items-center justify-between border-b border-slate-200 bg-white px-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href={`/${locale}/forms`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-brand-blue hover:bg-brand-light-blue hover:text-brand-blue"
          title="返回工作台"
        >
          <Icon name="RiArrowLeftLine" className="h-4 w-4" />
        </Link>
        <div className="inline-flex min-w-0 items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800">
          <Icon name="RiFileList3Line" className="h-4 w-4 shrink-0 text-brand-blue" />
          <span className="truncate">场景：{formTitle}</span>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href(locale, formId)}
              className={cn(
                "inline-flex h-8 items-center rounded-lg px-4 text-xs font-bold transition-all",
                active === tab.key
                  ? "bg-white text-brand-blue shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
         {rightActions}
      </div>
    </div>
  );
}
