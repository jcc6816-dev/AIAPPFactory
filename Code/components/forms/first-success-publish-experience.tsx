import Link from "next/link";
import { CheckCircle2, ExternalLink, QrCode, Rocket, Send } from "lucide-react";

import CopyShareLinkButton from "@/components/forms/copy-share-link-button";
import PublishDraftAction from "@/components/forms/publish-draft-action";
import ShareQrCard from "@/components/forms/share-qr-card";
import { Button } from "@/components/ui/button";
import type { FormRecord } from "@/types/form";

export default function FirstSuccessPublishExperience({
  form,
  locale,
  shareUrl,
  published,
}: {
  form: FormRecord;
  locale: string;
  shareUrl: string;
  published: boolean;
}) {
  const isZh = locale.toLowerCase().startsWith("zh");
  const fields = form.schema_json.fields.slice(0, 6);
  const publicHref = `/${locale}/f/${form.share_code}`;
  const testHref = `/${locale}/forms/${form.uuid}/test`;

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-[1320px] gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section>
          <p className="mb-4 text-lg font-black tracking-tight text-slate-900">
            {isZh ? "填写体验预览" : "Response experience preview"}
          </p>
          <div className="bg-slate-50 p-5 sm:p-8">
            <div className="mx-auto max-w-xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.10)]">
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-9 text-white">
                <p className="text-xs font-bold text-blue-200">{isZh ? "填写者将看到" : "What respondents see"}</p>
                <h2 className="mt-2 text-2xl font-black">{form.title}</h2>
                {form.description ? <p className="mt-2 text-sm text-slate-300">{form.description}</p> : null}
              </div>
              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>{isZh ? "第 1 题" : "Question 1"}</span><span>1 / {Math.max(fields.length, 1)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-1/4 rounded-full bg-blue-600" /></div>
                {fields[0] ? <><label className="block text-base font-black text-slate-900">{fields[0].label}{fields[0].required ? <span className="ml-1 text-rose-500">*</span> : null}</label><div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">{fields[0].placeholder || (isZh ? "请输入您的回答" : "Enter your answer")}</div></> : null}
                <div className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-black text-white">{isZh ? "继续" : "Continue"}</div>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit xl:sticky xl:top-6">
          {published ? (
            <>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">{isZh ? "下一步：完成一次测试" : "Next: complete a test"}</h1>
              <Button asChild className="mt-6 h-14 w-full rounded-xl bg-blue-600 text-base font-black hover:bg-blue-700"><a href={testHref} aria-label={isZh ? "开始免费测试表单" : "Start free form test"}><Send className="size-5" />{isZh ? "开始免费测试" : "Start free test"}</a></Button>
              <p className="mt-3 text-sm leading-6 text-slate-500">{isZh ? "测试答卷会保存为 TEST，不扣额度，也不会触发外部通知。" : "Test responses are saved as TEST, free, and never send external notifications."}</p>
              <section className="mt-7 border-t border-slate-200 pt-7">
                <h2 className="text-xl font-black tracking-tight text-slate-900">{isZh ? "分享表单" : "Share form"}</h2>
                <code className="mt-4 block break-all rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">{shareUrl}</code>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="h-12 min-w-0 rounded-xl border-blue-500 bg-white text-sm font-black text-slate-700 hover:bg-blue-50 hover:text-slate-950"><Link href={publicHref} target="_blank" aria-label={isZh ? "在新窗口打开公开表单" : "Open public form in a new window"}><ExternalLink className="size-5 shrink-0" /><span className="truncate">{isZh ? "打开表单" : "Open form"}</span></Link></Button>
                  <CopyShareLinkButton shareUrl={shareUrl} label={isZh ? "复制链接" : "Copy link"} ariaLabel={isZh ? "复制公开表单链接" : "Copy public form link"} className="h-12 border-blue-500 text-sm font-black" />
                </div>
                <div className="mt-5"><ShareQrCard shareUrl={shareUrl} compact /></div>
              </section>
            </>
          ) : (
            <>
              <p className="text-sm font-black text-slate-950">{isZh ? "确认后发布" : "Confirm and publish"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{isZh ? "发布后会生成公开链接和二维码；你仍可返回修改。" : "Publishing creates a public link and QR code. You can still return to edit."}</p>
              <PublishDraftAction formUuid={form.uuid} locale={locale} />
              <Button asChild variant="outline" className="mt-3 h-11 w-full rounded-xl"><Link href={`/${locale}/forms/${form.uuid}`}><Rocket className="size-4" />{isZh ? "返回修改" : "Back to edit"}</Link></Button>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
