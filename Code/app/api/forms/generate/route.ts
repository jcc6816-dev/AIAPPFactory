import { respBadRequest, respData, respServerError, respUnauthorized } from "@/lib/resp";

import { generateFormSchemaFromPrompt } from "@/services/form-generator";
import { getUserUuid } from "@/services/user";
import { normalizeFormTheme } from "@/services/form";

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respUnauthorized();
    }

    const { prompt, theme, provider, model, existingSchema, clarifications, locale } =
      await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return respBadRequest("prompt is required");
    }

    const generated = await generateFormSchemaFromPrompt(
      prompt,
      normalizeFormTheme(theme),
      {
        provider,
        model,
        existingSchema,
        clarifications,
        locale,
      }
    );

    return respData(generated);
  } catch (error) {
    console.log("generate form failed:", error);
    return respServerError("generate form failed");
  }
}
