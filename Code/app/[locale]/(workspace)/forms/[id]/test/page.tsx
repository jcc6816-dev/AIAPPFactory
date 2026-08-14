import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import { getFormByUuidForUser, isFormPublished } from "@/services/form";
import { getUserUuid } from "@/services/user";
import { serializeFormForClient } from "@/services/webhook-security";
import TestRunnerExperience from "@/components/forms/test-runner-experience";
import { isFirstSuccessLoopEnabled } from "@/services/first-success";

export default async function TestFormPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations("forms");
  const isFirstSuccessLoop = isFirstSuccessLoopEnabled();
  const userUuid = await getUserUuid();
  if (!userUuid) {
    const callbackUrl = `/${locale}/forms/${id}/test`;
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const form = await getFormByUuidForUser(userUuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }
  if (!isFormPublished(form)) {
    redirect(`/${locale}/forms/${form.uuid}`);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
      {!isFirstSuccessLoop && (
        <SceneSubnav
          locale={locale}
          formId={form.uuid}
          formTitle={form.title}
          active="publish"
        />
      )}
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <TestRunnerExperience form={serializeFormForClient(form)} />
        </div>
      </main>
    </div>
  );
}
