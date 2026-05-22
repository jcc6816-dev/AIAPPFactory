import { respData, respErr, respJson } from "@/lib/resp";

import {
  createForm,
  getFormCreationAllowance,
  listFormsByUser,
  normalizeFormTheme,
} from "@/services/form";
import { getFormDashboardMetrics } from "@/services/form-dashboard";
import { getUserUuid } from "@/services/user";
import { normalizeGeneratedSchema } from "@/services/form-generator";

export async function GET() {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const forms = await listFormsByUser(user_uuid);
    const allowance = await getFormCreationAllowance(user_uuid);
    const metrics = await getFormDashboardMetrics(forms);
    return respData({
      forms,
      allowance,
      metrics,
    });
  } catch (error) {
    console.log("list forms failed:", error);
    return respErr("list forms failed");
  }
}

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const { title, description, theme, schema, generation, ocr_template, webhook } =
      await req.json();
    if (!title || typeof title !== "string" || !title.trim()) {
      return respErr("title is required");
    }

    if (!schema) {
      return respErr("schema is required");
    }

    const form = await createForm(user_uuid, {
      title,
      description,
      theme: normalizeFormTheme(theme),
      schema: normalizeGeneratedSchema(schema),
      ocr_template,
      webhook,
      generation,
    });

    return respData(form);
  } catch (error) {
    console.log("create form failed:", error);
    return respErr("create form failed");
  }
}
