import { timingSafeEqual } from "crypto";

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isBlogAutomationRequest(req: Request) {
  const expected = process.env.BLOG_AUTOMATION_API_KEY || "";
  if (!expected) return false;

  const authorization = req.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;

  return safeCompare(match[1].trim(), expected);
}
