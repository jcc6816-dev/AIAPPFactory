import { createSupportTicket, listSupportTicketsByUser } from "@/models/support-ticket";
import { createGrowthEventSafely } from "@/models/growth-event";
import { respData, respErr } from "@/lib/resp";
import { getUserEmail, getUserUuid } from "@/services/user";

const MAX_TITLE_LENGTH = 140;
const MAX_MESSAGE_LENGTH = 4000;

export async function GET() {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth, please sign-in");
    }

    const tickets = await listSupportTicketsByUser(user_uuid);
    return respData({ tickets });
  } catch (error) {
    return respErr(error instanceof Error ? error.message : "list support tickets failed");
  }
}

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth, please sign-in");
    }

    const user_email = await getUserEmail();
    const body = await req.json();
    const title = String(body.title || "").trim();
    const message = String(body.message || "").trim();

    if (!title || !message) {
      return respErr("title and message are required");
    }

    if (title.length > MAX_TITLE_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
      return respErr("support ticket content is too long");
    }

    const ticket = await createSupportTicket({
      user_uuid,
      user_email,
      category: body.category,
      title,
      message,
    });
    await createGrowthEventSafely({
      event_name: "support_ticket_created",
      visitor_id: "",
      user_uuid,
      user_email,
      path: "/api/support/tickets",
      source: "support",
      metadata_json: {
        ticket_uuid: ticket.uuid,
        category: ticket.category,
      },
    });

    return respData({ ticket });
  } catch (error) {
    return respErr(error instanceof Error ? error.message : "create support ticket failed");
  }
}
