import { createBlogDraftForAutomation } from "@/services/blog-automation";
import { isBlogAutomationRequest } from "@/services/blog-automation-auth";
import { respData, respErr } from "@/lib/resp";

export async function POST(req: Request) {
  try {
    if (!isBlogAutomationRequest(req)) {
      return respErr("unauthorized");
    }

    const body = await req.json();
    const post = await createBlogDraftForAutomation(body);
    return respData({ post });
  } catch (error) {
    return respErr(error instanceof Error ? error.message : "create post failed");
  }
}
