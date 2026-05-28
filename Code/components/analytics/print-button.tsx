"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";

interface PrintButtonProps {
  locale: string;
}

export default function PrintButton({ locale }: PrintButtonProps) {
  const isZh = locale.toLowerCase().startsWith("zh");

  return (
    <Button
      onClick={() => window.print()}
      variant="outline"
      className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 print:hidden"
    >
      <Icon name="RiPrinterLine" className="h-4 w-4 text-slate-500" />
      <span>{isZh ? "导出 PDF 报表" : "Export PDF Report"}</span>
    </Button>
  );
}
