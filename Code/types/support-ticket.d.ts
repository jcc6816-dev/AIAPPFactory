export type SupportTicketStatus = "open" | "replied" | "closed";

export type SupportTicketCategory =
  | "general"
  | "generation"
  | "template"
  | "publish"
  | "webhook"
  | "billing"
  | "bug"
  | "feature";

export interface SupportTicket {
  id?: number;
  uuid: string;
  user_uuid: string;
  user_email: string;
  category: SupportTicketCategory;
  title: string;
  message: string;
  status: SupportTicketStatus;
  admin_reply?: string;
  admin_email?: string;
  replied_at?: string;
  closed_at?: string;
  created_at?: string;
  updated_at?: string;
}
