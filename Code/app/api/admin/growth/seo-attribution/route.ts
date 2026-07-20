import { getUserEmail } from "@/services/user";
import { getSeoGrowthAttributionSummary } from "@/services/seo-growth-attribution";

export const runtime = "nodejs";

function parseDateRange(searchParams: URLSearchParams) {
  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const fromText = searchParams.get("from");
  const toText = searchParams.get("to");
  const from = fromText ? new Date(fromText) : defaultFrom;
  const to = toText ? new Date(toText) : now;
  if (
    !Number.isFinite(from.getTime()) ||
    !Number.isFinite(to.getTime()) ||
    from > to ||
    to.getTime() - from.getTime() > 90 * 24 * 60 * 60 * 1000
  ) {
    return undefined;
  }
  return { from: from.toISOString(), to: to.toISOString() };
}

export async function GET(req: Request) {
  const email = await getUserEmail();
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!email || !adminEmails.includes(email)) {
    return Response.json({ code: 403, message: "无权访问该归因报表。" }, { status: 403 });
  }

  const searchParams = new URL(req.url).searchParams;
  const range = parseDateRange(searchParams);
  if (!range) {
    return Response.json(
      { code: 400, message: "日期范围无效，from/to 必须有效且不超过 90 天。" },
      { status: 400 }
    );
  }

  try {
    const data = await getSeoGrowthAttributionSummary({
      ...range,
      contentSource: searchParams.get("content_source")?.trim() || undefined,
      intent: searchParams.get("intent")?.trim() || undefined,
    });
    return Response.json({ code: 0, message: "ok", data });
  } catch (error) {
    console.error("生成 SEO 归因报表失败:", error);
    return Response.json(
      { code: 500, message: "SEO 归因报表查询失败，请检查数据库连接。" },
      { status: 500 }
    );
  }
}
