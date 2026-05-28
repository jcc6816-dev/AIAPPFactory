import { replySupportTicket } from "@/models/support-ticket";
import { respData, respErr } from "@/lib/resp";
import { getUserEmail } from "@/services/user";

async function requireAdmin() {
  const email = await getUserEmail();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim());

  if (!email || !adminEmails?.includes(email)) {
    throw new Error("no admin access");
  }

  return email;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin_email = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const reply = String(body.reply || "").trim();

    if (!reply) {
      return respErr("reply is required");
    }

    if (reply.length > 4000) {
      return respErr("reply is too long");
    }

    const ticket = await replySupportTicket({
      uuid: id,
      admin_email,
      reply,
      status: body.status,
    });

    return respData({ ticket });
  } catch (error) {
    return respErr(error instanceof Error ? error.message : "reply support ticket failed");
  }
}
