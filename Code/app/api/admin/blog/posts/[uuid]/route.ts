import { isBlogAutomationRequest } from "@/services/blog-automation-auth";
import { respData, respErr } from "@/lib/resp";
import { updateBlogDraftForAutomation } from "@/services/blog-automation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    if (!isBlogAutomationRequest(req)) {
      return respErr("unauthorized");
    }

    const { uuid } = await params;
    const body = await req.json();
    const post = await updateBlogDraftForAutomation(uuid, body);
    return respData({ post });
  } catch (error) {
    return respErr(error instanceof Error ? error.message : "update post failed");
  }
}
