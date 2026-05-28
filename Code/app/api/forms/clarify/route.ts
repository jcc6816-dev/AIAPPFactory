import { NextResponse } from "next/server";
import { generateClarificationQuestions } from "@/services/form-generator";
import { getUserUuid } from "@/services/user";

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, provider, model, locale } = await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const questions = await generateClarificationQuestions(prompt, { provider, model, locale });
    return NextResponse.json(questions);
  } catch (error: any) {
    console.error("Failed to generate clarification questions:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
