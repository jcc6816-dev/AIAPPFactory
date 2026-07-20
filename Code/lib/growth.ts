"use client";

import {
  GrowthAttributionContext,
  GrowthSessionState,
  mergeGrowthAttribution,
  normalizeGrowthTraffic,
  resolveGrowthSession,
  sanitizeGrowthAttribution,
  sanitizeGrowthPath,
  sanitizeGrowthReferrer,
} from "@/lib/growth-attribution";

const VISITOR_ID_KEY = "aiff_visitor_id";
const SESSION_STATE_KEY = "aiff_session_state";
const LEGACY_SESSION_ID_KEY = "aiff_session_id";
const ATTRIBUTION_KEY = "aiff_growth_attribution";
const GUEST_LOGIN_INTENT_KEY = "aiff_guest_login_intent";

const GA_EVENT_NAMES: Record<string, string> = {
  page_leave: "page_leave",
  signup_started: "signup_start",
  user_signed_up: "sign_up",
  user_signed_in: "login",
  landing_viewed: "landing_view",
  template_viewed: "template_view",
  template_used: "template_use_click",
  skill_viewed: "skill_view",
  skill_tried: "skill_try",
  ai_generate_submitted: "form_generate",
  form_created: "form_saved",
  form_published: "form_publish",
  public_form_submitted: "form_submit",
  checkout_started: "checkout_start",
  purchase_completed: "purchase",
  // 新增游客体验事件映射
  demo_started: "demo_start",
  demo_completed: "demo_complete",
  // 新增付费墙事件映射
  paywall_impression: "paywall_view",
  paywall_clicked: "paywall_click",
  // 新创表单与隐私安全 Clarity 体验埋点事件映射
  forms_new_view: "forms_new_view",
  forms_new_primary_action_viewed: "forms_new_primary_action_view",
  forms_new_primary_action_clicked: "forms_new_primary_action_click",
  workspace_preview_ready: "workspace_preview_ready",
  template_context_loaded: "template_context_loaded",
  guest_login_prompt_shown: "guest_login_prompt_shown",
  guest_login_intent_started: "guest_login_intent_start",
  guest_login_intent_returned: "guest_login_intent_return",
  activation_started: "activation_start",
  publish_started: "publish_start",
  publish_succeeded: "publish_success",
  test_submission_started: "test_submission_start",
  test_submission_completed: "test_submission_complete",
  first_result_viewed: "first_result_view",
  activation_completed: "activation_complete",
  whatsapp_share_clicked: "whatsapp_share_click",
  // 保持对旧 GA4 事件名的兼容性映射
  ai_generate_submit: "form_generate",
  publish_form: "form_publish",
};

function trackGoogleAnalyticsEvent(
  eventName: string,
  metadata: Record<string, any>
) {
  const gaEventName = GA_EVENT_NAMES[eventName];
  const gtag = (window as Window & { gtag?: (...args: any[]) => void }).gtag;

  if (!gaEventName || typeof gtag !== "function") return;
  gtag("event", gaEventName, metadata);
}

function getStoredId(key: string, prefix: string) {
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const next = createStoredId(prefix);
    window.localStorage.setItem(key, next);
    return next;
  } catch {
    return createStoredId(prefix);
  }
}

function readJson<T>(key: string): T | undefined {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : undefined;
  } catch {
    return undefined;
  }
}

function createStoredId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function getGrowthIdentity() {
  const visitorId = getStoredId(VISITOR_ID_KEY, "visitor");
  const previous = readJson<GrowthSessionState>(SESSION_STATE_KEY);
  const session = resolveGrowthSession(previous, () => createStoredId("session"));
  try {
    window.localStorage.setItem(SESSION_STATE_KEY, JSON.stringify(session));
    window.localStorage.removeItem(LEGACY_SESSION_ID_KEY);
  } catch {
    // Analytics storage must never block the product flow.
  }
  return { visitorId, sessionId: session.id };
}

function buildCurrentAttribution(
  metadata: Record<string, any>,
  identity: { visitorId: string; sessionId: string }
): GrowthAttributionContext {
  const params = new URLSearchParams(window.location.search);
  const traffic = normalizeGrowthTraffic({
    currentHostname: window.location.hostname,
    referrer: sanitizeGrowthReferrer(document.referrer) || "",
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
  });
  const contentSource =
    typeof metadata.content_source === "string"
      ? metadata.content_source
      : typeof metadata.traffic_source === "string"
        ? metadata.traffic_source
        : params.get("source") || undefined;

  return {
    ...traffic,
    landing_path: sanitizeGrowthPath(window.location.pathname + window.location.search),
    content_source: contentSource,
    intent:
      typeof metadata.intent === "string"
        ? metadata.intent
        : params.get("intent") || undefined,
    template_id:
      typeof metadata.template_id === "string"
        ? metadata.template_id
        : params.get("template") || params.get("template_id") || undefined,
    visitor_id: identity.visitorId,
    session_id: identity.sessionId,
  };
}

export function getCurrentGrowthAttribution(
  metadata: Record<string, any> = {}
): GrowthAttributionContext | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const identity = getGrowthIdentity();
    const existing = sanitizeGrowthAttribution(
      readJson<GrowthAttributionContext>(ATTRIBUTION_KEY)
    );
    const next = mergeGrowthAttribution(
      existing,
      buildCurrentAttribution(metadata, identity)
    );
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
    return next;
  } catch {
    return undefined;
  }
}

export function rememberGuestLoginIntent(metadata: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  try {
    const identity = getGrowthIdentity();
    const attribution = getCurrentGrowthAttribution(metadata);
    const safeMetadata = { ...metadata };
    delete safeMetadata.prompt;
    delete safeMetadata.answer;
    delete safeMetadata.answers;
    delete safeMetadata.title;
    delete safeMetadata.description;
    window.localStorage.setItem(
      GUEST_LOGIN_INTENT_KEY,
      JSON.stringify({
        ...safeMetadata,
        attribution,
        visitor_id: identity.visitorId,
        session_id: identity.sessionId,
        path: sanitizeGrowthPath(window.location.pathname + window.location.search),
        stored_at: Date.now(),
      })
    );
  } catch {
    // Intent storage must never block the sign-in flow.
  }
}

export function consumeGuestLoginIntent(): Record<string, any> | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.localStorage.getItem(GUEST_LOGIN_INTENT_KEY);
    if (!raw) return undefined;
    window.localStorage.removeItem(GUEST_LOGIN_INTENT_KEY);
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : undefined;
  } catch {
    try {
      window.localStorage.removeItem(GUEST_LOGIN_INTENT_KEY);
    } catch {}
    return undefined;
  }
}

function getPageMetadata() {
  if (typeof window === "undefined") {
    return {
      page_location: "",
      page_path: "",
      page_title: "",
    };
  }
  return {
    page_location: sanitizeGrowthPath(window.location.href) || "",
    page_path: sanitizeGrowthPath(window.location.pathname + window.location.search) || "",
    page_title: document.title,
  };
}

export function trackGrowthEvent(eventName: string, metadata: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  const enrichedMetadata: Record<string, any> = {
    ...getPageMetadata(),
    ...metadata,
  };

  trackGoogleAnalyticsEvent(eventName, enrichedMetadata);

  const isDev = window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1" ||
                window.location.hostname.includes("vercel.app") ||
                window.location.hostname === "43.98.193.104";

  const identity = getGrowthIdentity();
  const attribution = getCurrentGrowthAttribution(enrichedMetadata);
  const { template_id, form_uuid, share_code, ...metadataJson } = enrichedMetadata;
  
  metadataJson.is_dev = isDev;

  const payload = {
    event_name: eventName,
    visitor_id: identity.visitorId,
    session_id: identity.sessionId,
    path: enrichedMetadata.page_path,
    referrer: document.referrer,
    source: attribution?.channel || "unknown",
    template_id,
    form_uuid,
    share_code,
    metadata: { ...metadataJson, attribution },
  };

  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/growth/events", new Blob([body], { type: "application/json" }));
      return;
    }

    fetch("/api/growth/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    console.warn("trackGrowthEvent failed:", e);
  }
}
