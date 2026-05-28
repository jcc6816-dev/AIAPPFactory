import { listSupportTickets } from "@/models/support-ticket";
import { respData, respErr } from "@/lib/resp";
import { getUserEmail } from "@/services/user";

async function requireAdmin() {
  const email = await getUserEmail();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim());

  if (!email || !adminEmails?.includes(email)) {
    throw new Error("no admin access");
  }
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const tickets = await listSupportTickets(searchParams.get("status") || undefined);

    return respData({ tickets });
  } catch (error) {
    return respErr(error instanceof Error ? error.message : "list admin support tickets failed");
  }
}
