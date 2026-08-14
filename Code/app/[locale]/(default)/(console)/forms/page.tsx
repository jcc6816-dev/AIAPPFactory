import Link from "next/link";
import moment from "moment";
import { redirect } from "next/navigation";

import Icon from "@/components/icon";
import CopyShareLinkButton from "@/components/forms/copy-share-link-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormStatus } from "@/models/form";
import { getFormDashboardMetrics } from "@/services/form-dashboard";
import { getUserUuid } from "@/services/user";
import { listFormsByUser } from "@/services/form";
import { getHomepageSceneTemplates } from "@/services/form-templates";

/**
 * The signed-in home intentionally focuses on the next useful form action.
 * It is not a generic "AI scene" console: new users create a form, while
 * returning users continue editing, test a published form, or view results.
 */
export default async function FormsWorkspace({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const userUuid = await getUserUuid();
  const callbackUrl = `/${locale}/forms`;

  if (!userUuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const forms = await listFormsByUser(userUuid);
  const formMetrics = await Promise.all(
    forms.map(async (form) => ({
      formUuid: form.uuid,
      metrics: await getFormDashboardMetrics([form]),
    }))
  );
  const formMetricsByUuid = new Map(
    formMetrics.map((item) => [item.formUuid, item.metrics])
  );
  const recommendedTemplates = getHomepageSceneTemplates().slice(0, 3);
  const draftCount = forms.filter((form) => form.status !== FormStatus.Published).length;
  const publishedCount = forms.length - draftCount;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-blue">
            {isZh ? "我的表单" : "My forms"}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {forms.length === 0
              ? isZh
                ? "创建你的第一个表单"
                : "Create your first form"
              : isZh
                ? "管理你的表单"
                : "Manage your forms"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500">
            {forms.length === 0
              ? isZh
                ? "用一句话或模板生成表单，确认内容后即可发布链接并收集结果。"
                : "Generate a form from one sentence or a template, then publish a link and collect results."
              : isZh
                ? "从这里继续编辑、发布、测试或查看每个表单的结果。"
                : "Continue editing, publishing, testing, or reviewing results for each form."}
          </p>
        </div>
        <Button asChild className="h-11 shrink-0 rounded-2xl bg-brand-blue px-5 font-black shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/90">
          <Link href={`/${locale}/forms/new`}>
            <Icon name="RiAddLine" className="mr-2 h-5 w-5" />
            {isZh ? "新建表单" : "New form"}
          </Link>
        </Button>
      </header>

      {forms.length === 0 ? (
        <section className="mt-9 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="border-none bg-brand-light-blue text-[10px] font-black uppercase tracking-widest text-brand-blue">
                {isZh ? "从这里开始" : "Start here"}
              </Badge>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                {isZh ? "选择一个接近需求的模板" : "Choose a template close to your need"}
              </h2>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
                {isZh
                  ? "模板会带入合适的字段；生成后仍可调整标题、字段和外观。"
                  : "A template brings useful fields, and you can still adjust the title, fields, and appearance after generation."}
              </p>
            </div>
            <Button asChild variant="outline" className="h-10 rounded-xl border-slate-200 bg-white font-bold">
              <Link href={`/${locale}/forms/new`}>
                {isZh ? "用一句话生成" : "Generate with one sentence"}
              </Link>
            </Button>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {recommendedTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/${locale}/forms/new?template=${template.id}&autogenerate=1`}
                className="group rounded-2xl border border-slate-200 p-5 transition-colors hover:border-brand-blue hover:bg-brand-light-blue/30"
              >
                <p className="text-sm font-black text-slate-900 group-hover:text-brand-blue">
                  {isZh ? template.name : template.nameEn || template.name}
                </p>
                <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                  {isZh ? template.description : template.descriptionEn || template.description}
                </p>
                <span className="mt-5 flex items-center gap-1 text-xs font-black text-brand-blue">
                  {isZh ? "使用模板" : "Use template"}
                  <Icon name="RiArrowRightLine" className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <div className="mt-9 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1.5">
              {isZh ? `共 ${forms.length} 个表单` : `${forms.length} forms`}
            </span>
            {draftCount > 0 && (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                {isZh ? `${draftCount} 个草稿待发布` : `${draftCount} drafts to publish`}
              </span>
            )}
            {publishedCount > 0 && (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                {isZh ? `${publishedCount} 个已发布` : `${publishedCount} published`}
              </span>
            )}
          </div>

          <section className="mt-5 grid gap-4 md:grid-cols-2">
            {forms.map((form) => {
              const metrics = formMetricsByUuid.get(form.uuid);
              const isPublished = form.status === FormStatus.Published;
              const hasSubmissions = Boolean(metrics?.totalSubmissions);
              const primaryHref = !isPublished
                ? `/${locale}/forms/${form.uuid}`
                : hasSubmissions
                  ? `/${locale}/forms/${form.uuid}/submissions`
                  : `/${locale}/forms/${form.uuid}/test`;
              const primaryLabel = !isPublished
                ? isZh
                  ? "继续编辑"
                  : "Continue editing"
                : hasSubmissions
                  ? isZh
                    ? "查看结果"
                    : "View results"
                  : isZh
                    ? "开始免费测试"
                    : "Start free test";
              const updatedLabel = form.updated_at
                ? moment(form.updated_at).fromNow()
                : isZh
                  ? "刚刚创建"
                  : "Just created";

              return (
                <article key={form.uuid} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black text-slate-950">{form.title}</h2>
                      <p className="mt-2 text-sm font-medium text-slate-500">
                        {form.schema_json.fields.length} {isZh ? "个字段" : "fields"} · {updatedLabel}
                      </p>
                    </div>
                    <Badge className={isPublished
                      ? "border-none bg-emerald-50 text-emerald-700"
                      : "border-none bg-amber-50 text-amber-700"}>
                      {isPublished ? (isZh ? "已发布" : "Published") : (isZh ? "草稿" : "Draft")}
                    </Badge>
                  </div>

                  <p className="mt-5 text-sm font-medium leading-6 text-slate-500">
                    {!isPublished
                      ? isZh
                        ? "确认内容和外观后即可发布。"
                        : "Confirm the content and appearance, then publish."
                      : hasSubmissions
                        ? isZh
                          ? `已收到 ${metrics?.totalSubmissions ?? 0} 条提交。`
                          : `${metrics?.totalSubmissions ?? 0} submissions received.`
                        : isZh
                          ? "先完成一次免费测试，确认结果能够保存。"
                          : "Complete one free test to confirm results are saved."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="h-10 rounded-xl bg-brand-blue px-4 font-black hover:bg-brand-blue/90">
                      <Link href={primaryHref}>{primaryLabel}</Link>
                    </Button>
                    {isPublished && !hasSubmissions && form.share_code ? (
                      <CopyShareLinkButton
                        shareUrl={`/${locale}/f/${form.share_code}`}
                        label={isZh ? "复制公开链接" : "Copy public link"}
                      />
                    ) : null}
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
      </div>
    </div>
  );
}
