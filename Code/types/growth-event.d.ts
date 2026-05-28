export type GrowthEventName =
  | "page_view"
  | "page_leave"
  | "template_viewed"
  | "template_used"
  | "form_created"
  | "form_published"
  | "public_form_submitted"
  | "checkout_started"
  | "support_ticket_created";

export interface GrowthEventRecord {
  id?: number;
  uuid: string;
  event_name: GrowthEventName | string;
  visitor_id: string;
  user_uuid?: string;
  user_email?: string;
  session_id?: string;
  path?: string;
  referrer?: string;
  source?: string;
  template_id?: string;
  form_uuid?: string;
  share_code?: string;
  metadata_json?: Record<string, any>;
  duration_ms?: number;
  user_agent?: string;
  created_at?: string;
}
