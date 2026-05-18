import { respData, respErr, respJson } from "@/lib/resp";

import { getFormByUuidForUser } from "@/services/form";
import { getUserUuid } from "@/services/user";
import { listFormSubmissions } from "@/services/form-runtime";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const { id } = await params;
    if (!id) {
      return respErr("form id is required");
    }

    const form = await getFormByUuidForUser(user_uuid, id);
    if (!form) {
      return respErr("form not found");
    }

    const submissions = await listFormSubmissions(form);
    return respData(submissions);
  } catch (error) {
    console.log("list form submissions failed:", error);
    return respErr("list form submissions failed");
  }
}
