import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import { getFormByUuidForUser } from "@/services/form";
import { getTranslations } from "next-intl/server";
import { getUserUuid } from "@/services/user";
import { redirect } from "next/navigation";
import FormEditManager from "@/components/forms/form-edit-manager";

export default async function ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = await getTranslations("forms");
  const { id, locale } = await params;
  const user_uuid = await getUserUuid();
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  const form = await getFormByUuidForUser(user_uuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SceneSubnav
        locale={locale}
        formId={form.uuid}
        formTitle={form.title}
        active="design"
      />
      <div className="flex-1 flex flex-col min-h-0">
        <FormEditManager form={form} />
      </div>
    </div>
  );
}
