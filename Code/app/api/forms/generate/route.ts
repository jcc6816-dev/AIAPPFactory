import { respData, respErr, respJson } from "@/lib/resp";

import { generateFormSchemaFromPrompt } from "@/services/form-generator";
import { getUserUuid } from "@/services/user";
import { normalizeFormTheme } from "@/services/form";

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const { prompt, theme, provider, model, existingSchema, clarifications } =
      await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return respErr("prompt is required");
    }

    const generated = await generateFormSchemaFromPrompt(
      prompt,
      normalizeFormTheme(theme),
      {
        provider,
        model,
        existingSchema,
        clarifications,
      }
    );

    return respData(generated);
  } catch (error) {
    console.log("generate form failed:", error);
    return respErr("generate form failed");
  }
}
