import { redirect } from "next/navigation";
import { getFormCreationAllowance } from "@/services/form";
import { getUserUuid } from "@/services/user";
import FormCreationManager from "@/components/forms/form-creation-manager";

export default async function ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const { locale } = await params;
  const { template } = await searchParams;
  const user_uuid = await getUserUuid();
  const templateQuery = template ? `?template=${encodeURIComponent(template)}` : "";
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms/new${templateQuery}`;
  
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const allowance = await getFormCreationAllowance(user_uuid);

  return <FormCreationManager canCreate={allowance.canCreate} initialTemplateId={template} />;
}
