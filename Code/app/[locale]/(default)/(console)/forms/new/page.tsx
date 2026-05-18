import { redirect } from "next/navigation";
import { getFormCreationAllowance } from "@/services/form";
import { getUserUuid } from "@/services/user";
import FormCreationManager from "@/components/forms/form-creation-manager";

export default async function ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user_uuid = await getUserUuid();
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms/new`;
  
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const allowance = await getFormCreationAllowance(user_uuid);

  return <FormCreationManager canCreate={allowance.canCreate} />;
}
