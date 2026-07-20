import { GrowthEventRecord } from "@/types/growth-event";

const MONITORED_EVENT_NAMES = [
  "forms_new_view",
  "template_context_loaded",
  "workspace_preview_ready",
  "forms_new_primary_action_viewed",
  "forms_new_primary_action_clicked",
  "guest_login_prompt_shown",
  "guest_login_intent_started",
  "guest_login_intent_returned",
  "form_created",
] as const;

type MonitoredEventName = (typeof MONITORED_EVENT_NAMES)[number];

export type FormsNewActivationDecision = "pass" | "iterate" | "wait";

export interface FormsNewActivationSession {
  visitor_id: string;
  session_id: string;
  first_seen_at: string;
  last_seen_at: string;
  template_id: string | null;
  source: string;
  content_source: string | null;
  path: string | null;
  event_counts: Record<MonitoredEventName, number>;
  sequence: Array<{
    event_name: string;
    created_at: string;
  }>;
  decision_signal: "activated" | "cta_no_click" | "login_return_missing" | "watch";
}

export interface FormsNewActivationMonitor {
  generated_at: string;
  window: {
    from: string;
    to: string;
    hours: number;
  };
  totals: {
    raw_events: number;
    scoped_events: number;
    qualified_sessions: number;
    event_counts: Record<MonitoredEventName, number>;
    cta_view_sessions: number;
    cta_click_sessions: number;
    login_start_sessions: number;
    login_return_sessions: number;
    form_created_sessions: number;
  };
  decision: FormsNewActivationDecision;
  triggers: string[];
  notes: string[];
  qualified_sessions: FormsNewActivationSession[];
}

export interface BuildFormsNewActivationMonitorOptions {
  now?: Date;
  hours?: number;
}

function emptyEventCounts(): Record<MonitoredEventName, number> {
  return Object.fromEntries(
    MONITORED_EVENT_NAMES.map((eventName) => [eventName, 0])
  ) as Record<MonitoredEventName, number>;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getEventTime(event: GrowthEventRecord): number {
  const parsed = Date.parse(event.created_at || "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function isMonitoredEvent(eventName: string): eventName is MonitoredEventName {
  return MONITORED_EVENT_NAMES.includes(eventName as MonitoredEventName);
}

function isInternalOrDevEvent(event: GrowthEventRecord): boolean {
  const metadata = event.metadata_json || {};
  const attribution =
    metadata.attribution && typeof metadata.attribution === "object"
      ? (metadata.attribution as Record<string, unknown>)
      : {};
  const source = normalizeString(event.source).toLowerCase();
  const path = normalizeString(event.path).toLowerCase();
  const metadataSource = normalizeString(metadata.source).toLowerCase();
  const contentSource = normalizeString(metadata.content_source).toLowerCase();
  const attributionSource = normalizeString(attribution.source).toLowerCase();
  const attributionContentSource = normalizeString(
    attribution.content_source
  ).toLowerCase();
  const attributionChannel = normalizeString(attribution.channel).toLowerCase();

  const internalMarkers = [
    "internal",
    "deploy_check",
    "codex_verify",
    "codex-verification",
    "playwright",
    "hermes_test",
  ];
  const markerFields = [
    source,
    path,
    metadataSource,
    contentSource,
    attributionSource,
    attributionContentSource,
    attributionChannel,
  ];

  return Boolean(
    metadata.is_dev ||
      metadata.is_internal ||
      markerFields.some((field) =>
        internalMarkers.some((marker) => field.includes(marker))
      )
  );
}

function isFormsNewEvent(event: GrowthEventRecord): boolean {
  const path = normalizeString(event.path);
  return path.includes("/forms/new") || isMonitoredEvent(event.event_name);
}

function resolveContentSource(event: GrowthEventRecord): string | null {
  const metadata = event.metadata_json || {};
  const attribution =
    metadata.attribution && typeof metadata.attribution === "object"
      ? (metadata.attribution as Record<string, unknown>)
      : {};
  const directSource =
    normalizeString(metadata.source) ||
    normalizeString(metadata.content_source) ||
    normalizeString(attribution.content_source) ||
    normalizeString(attribution.source);

  if (directSource) {
    return directSource;
  }

  const path = normalizeString(event.path);
  if (!path) {
    return null;
  }

  try {
    const url = new URL(path, "https://genforms.ai");
    return (
      normalizeString(url.searchParams.get("source")) ||
      normalizeString(url.searchParams.get("utm_source")) ||
      null
    );
  } catch {
    return null;
  }
}

function sessionKey(event: GrowthEventRecord): string {
  const visitorId = normalizeString(event.visitor_id) || "anonymous";
  const sessionId = normalizeString(event.session_id) || "no_session";
  return `${visitorId}::${sessionId}`;
}

function hasEvent(session: FormsNewActivationSession, eventName: MonitoredEventName) {
  return session.event_counts[eventName] > 0;
}

function classifySession(
  session: FormsNewActivationSession
): FormsNewActivationSession["decision_signal"] {
  if (
    hasEvent(session, "workspace_preview_ready") &&
    hasEvent(session, "forms_new_primary_action_clicked") &&
    (hasEvent(session, "guest_login_intent_started") || hasEvent(session, "form_created"))
  ) {
    return "activated";
  }

  if (
    hasEvent(session, "guest_login_intent_started") &&
    !hasEvent(session, "guest_login_intent_returned") &&
    !hasEvent(session, "form_created")
  ) {
    return "login_return_missing";
  }

  if (
    hasEvent(session, "forms_new_primary_action_viewed") &&
    !hasEvent(session, "forms_new_primary_action_clicked")
  ) {
    return "cta_no_click";
  }

  return "watch";
}

function countSessions(
  sessions: FormsNewActivationSession[],
  eventName: MonitoredEventName
) {
  return sessions.filter((session) => hasEvent(session, eventName)).length;
}

export function buildFormsNewActivationMonitor(
  events: GrowthEventRecord[],
  options: BuildFormsNewActivationMonitorOptions = {}
): FormsNewActivationMonitor {
  const now = options.now || new Date();
  const hours = Math.min(Math.max(options.hours || 24, 1), 168);
  const toMs = now.getTime();
  const fromMs = toMs - hours * 60 * 60 * 1000;
  const scopedEvents = events
    .filter((event) => {
      const eventTime = getEventTime(event);
      return eventTime >= fromMs && eventTime <= toMs;
    })
    .filter(isFormsNewEvent)
    .filter((event) => !isInternalOrDevEvent(event))
    .sort((a, b) => getEventTime(a) - getEventTime(b));

  const totals = {
    raw_events: events.length,
    scoped_events: scopedEvents.length,
    qualified_sessions: 0,
    event_counts: emptyEventCounts(),
    cta_view_sessions: 0,
    cta_click_sessions: 0,
    login_start_sessions: 0,
    login_return_sessions: 0,
    form_created_sessions: 0,
  };

  const sessionMap = new Map<string, FormsNewActivationSession>();

  for (const event of scopedEvents) {
    const eventName = event.event_name;
    if (isMonitoredEvent(eventName)) {
      totals.event_counts[eventName] += 1;
    }

    const key = sessionKey(event);
    const createdAt = event.created_at || now.toISOString();
    const existing = sessionMap.get(key);
    const visitorId = normalizeString(event.visitor_id) || "anonymous";
    const sessionId = normalizeString(event.session_id) || "no_session";
    const templateId = normalizeString(event.template_id) || null;
    const source = normalizeString(event.source) || "direct";
    const contentSource = resolveContentSource(event);
    const path = normalizeString(event.path) || null;

    if (!existing) {
      sessionMap.set(key, {
        visitor_id: visitorId,
        session_id: sessionId,
        first_seen_at: createdAt,
        last_seen_at: createdAt,
        template_id: templateId,
        source,
        content_source: contentSource,
        path,
        event_counts: emptyEventCounts(),
        sequence: [],
        decision_signal: "watch",
      });
    }

    const session = sessionMap.get(key)!;
    session.last_seen_at = createdAt;
    session.template_id = session.template_id || templateId;
    session.source = session.source === "direct" ? source : session.source;
    session.content_source = session.content_source || contentSource;
    session.path = session.path || path;
    if (isMonitoredEvent(eventName)) {
      session.event_counts[eventName] += 1;
    }
    session.sequence.push({
      event_name: eventName,
      created_at: createdAt,
    });
  }

  const qualifiedSessions = Array.from(sessionMap.values())
    .filter((session) =>
      MONITORED_EVENT_NAMES.some((eventName) => session.event_counts[eventName] > 0)
    )
    .map((session) => ({
      ...session,
      decision_signal: classifySession(session),
      sequence: session.sequence.slice(-12),
    }))
    .sort((a, b) => Date.parse(b.last_seen_at) - Date.parse(a.last_seen_at));

  totals.qualified_sessions = qualifiedSessions.length;
  totals.cta_view_sessions = countSessions(
    qualifiedSessions,
    "forms_new_primary_action_viewed"
  );
  totals.cta_click_sessions = countSessions(
    qualifiedSessions,
    "forms_new_primary_action_clicked"
  );
  totals.login_start_sessions = countSessions(
    qualifiedSessions,
    "guest_login_intent_started"
  );
  totals.login_return_sessions = countSessions(
    qualifiedSessions,
    "guest_login_intent_returned"
  );
  totals.form_created_sessions = countSessions(qualifiedSessions, "form_created");

  const activatedSessions = qualifiedSessions.filter(
    (session) => session.decision_signal === "activated"
  ).length;
  const ctaNoClickSessions = qualifiedSessions.filter(
    (session) => session.decision_signal === "cta_no_click"
  ).length;
  const loginReturnMissingSessions = qualifiedSessions.filter(
    (session) => session.decision_signal === "login_return_missing"
  ).length;

  const triggers: string[] = [];
  let decision: FormsNewActivationDecision = "wait";

  if (activatedSessions > 0 || totals.form_created_sessions > 0) {
    decision = "pass";
    triggers.push("At least one /forms/new session reached click/login/form-created activation.");
  } else if (ctaNoClickSessions >= 3) {
    decision = "iterate";
    triggers.push("Three or more sessions saw the primary CTA but did not click it.");
  } else if (loginReturnMissingSessions >= 2) {
    decision = "iterate";
    triggers.push("Two or more sessions started login intent but did not return.");
  } else {
    triggers.push("Insufficient qualified activation evidence in the current window.");
  }

  return {
    generated_at: now.toISOString(),
    window: {
      from: new Date(fromMs).toISOString(),
      to: now.toISOString(),
      hours,
    },
    totals,
    decision,
    triggers,
    notes: [
      "This endpoint is built for Hermes monitoring and returns aggregated activation evidence only.",
      "Internal, deploy-check, and development events are excluded before decision scoring.",
    ],
    qualified_sessions: qualifiedSessions.slice(0, 50),
  };
}
