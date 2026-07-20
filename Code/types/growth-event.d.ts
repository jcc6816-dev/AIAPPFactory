export type GrowthEventName =
  | "page_view"
  | "page_leave"
  | "signup_started"
  | "user_signed_up"
  | "user_signed_in"
  | "landing_viewed"
  | "template_viewed"
  | "template_used"
  | "skill_viewed"
  | "skill_tried"
  | "ai_generate_submitted"
  | "form_created"
  | "form_published"
  | "public_form_submitted"
  | "checkout_started"
  | "purchase_completed"
  | "pricing_viewed"
  | "pricing_plan_selected"
  | "paywall_impression"
  | "paywall_clicked"
  | "demo_started"
  | "demo_completed"
  | "forms_new_view"
  | "forms_new_primary_action_viewed"
  | "forms_new_primary_action_clicked"
  | "workspace_preview_ready"
  | "template_context_loaded"
  | "guest_login_prompt_shown"
  | "guest_login_intent_started"
  | "guest_login_intent_returned"
  | "activation_started"
  | "publish_started"
  | "publish_succeeded"
  | "test_submission_started"
  | "test_submission_completed"
  | "first_result_viewed"
  | "activation_completed"
  | "whatsapp_share_clicked"
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
