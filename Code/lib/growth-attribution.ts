export const GROWTH_SESSION_TIMEOUT_MS = 30 * 60 * 1000;
export const GROWTH_ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type GrowthChannel =
  | "organic_search"
  | "campaign"
  | "referral"
  | "direct"
  | "internal"
  | "unknown";

export type GrowthSearchEngine = "google" | "bing" | "baidu" | "other";

export interface GrowthAttributionContext {
  channel: GrowthChannel;
  search_engine?: GrowthSearchEngine;
  landing_path?: string;
  content_source?: string;
  intent?: string;
  template_id?: string;
  first_touch_at?: string;
  last_non_direct_at?: string;
  visitor_id?: string;
  session_id?: string;
}

export interface GrowthSessionState {
  id: string;
  last_activity_at: number;
}

const SENSITIVE_QUERY_KEYS = new Set([
  "prompt",
  "callbackurl",
  "callback_url",
  "email",
  "token",
  "code",
  "state",
  "answer",
  "answers",
  "clarification",
  "clarification_answers",
]);

const CHANNELS = new Set<GrowthChannel>([
  "organic_search",
  "campaign",
  "referral",
  "direct",
  "internal",
  "unknown",
]);

const SEARCH_ENGINES = new Set<GrowthSearchEngine>([
  "google",
  "bing",
  "baidu",
  "other",
]);

function boundedString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().slice(0, maxLength);
  return normalized || undefined;
}

function safeIsoDate(value: unknown): string | undefined {
  const text = boundedString(value, 40);
  if (!text) return undefined;
  const timestamp = Date.parse(text);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
}

export function sanitizeGrowthPath(value: unknown): string | undefined {
  const text = boundedString(value, 500);
  if (!text) return undefined;

  try {
    const url = new URL(text, "https://genforms.local");
    for (const key of Array.from(url.searchParams.keys())) {
      if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
    const path = `${url.pathname}${url.search}`;
    return path.slice(0, 500) || "/";
  } catch {
    return text.split("?")[0].slice(0, 500) || undefined;
  }
}

export function sanitizeGrowthReferrer(value: unknown): string | undefined {
  const text = boundedString(value, 500);
  if (!text) return undefined;
  try {
    const url = new URL(text);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return undefined;
  }
}

export function sanitizeGrowthAttribution(
  value: unknown
): GrowthAttributionContext | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  const channel = boundedString(raw.channel, 32) as GrowthChannel | undefined;
  if (!channel || !CHANNELS.has(channel)) return undefined;

  const searchEngine = boundedString(raw.search_engine, 24) as
    | GrowthSearchEngine
    | undefined;
  const result: GrowthAttributionContext = { channel };
  if (searchEngine && SEARCH_ENGINES.has(searchEngine)) {
    result.search_engine = searchEngine;
  }

  const landingPath = sanitizeGrowthPath(raw.landing_path);
  const contentSource = boundedString(raw.content_source, 120);
  const intent = boundedString(raw.intent, 120);
  const templateId = boundedString(raw.template_id, 120);
  const firstTouchAt = safeIsoDate(raw.first_touch_at);
  const lastNonDirectAt = safeIsoDate(raw.last_non_direct_at);
  const visitorId = boundedString(raw.visitor_id, 128);
  const sessionId = boundedString(raw.session_id, 128);

  if (landingPath) result.landing_path = landingPath;
  if (contentSource) result.content_source = contentSource;
  if (intent) result.intent = intent;
  if (templateId) result.template_id = templateId;
  if (firstTouchAt) result.first_touch_at = firstTouchAt;
  if (lastNonDirectAt) result.last_non_direct_at = lastNonDirectAt;
  if (visitorId) result.visitor_id = visitorId;
  if (sessionId) result.session_id = sessionId;

  return result;
}

function searchEngineForHost(hostname: string): GrowthSearchEngine | undefined {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  if (/(^|\.)google\./.test(host)) return "google";
  if (/(^|\.)bing\.com$/.test(host)) return "bing";
  if (/(^|\.)baidu\.com$/.test(host)) return "baidu";
  return undefined;
}

export function normalizeGrowthTraffic(input: {
  currentHostname?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
}): Pick<GrowthAttributionContext, "channel" | "search_engine"> {
  const utmSource = boundedString(input.utmSource, 120);
  const utmMedium = boundedString(input.utmMedium, 80)?.toLowerCase();
  if (utmSource || utmMedium) {
    return { channel: "campaign" };
  }

  const referrer = boundedString(input.referrer, 500);
  if (!referrer) return { channel: "direct" };

  try {
    const referrerHost = new URL(referrer).hostname.toLowerCase();
    const currentHost = (input.currentHostname || "").toLowerCase();
    if (currentHost && referrerHost === currentHost) {
      return { channel: "internal" };
    }
    const searchEngine = searchEngineForHost(referrerHost);
    if (searchEngine) {
      return { channel: "organic_search", search_engine: searchEngine };
    }
    return { channel: "referral" };
  } catch {
    return { channel: "unknown" };
  }
}

export function isGrowthAttributionExpired(
  context: GrowthAttributionContext | undefined,
  now = Date.now()
): boolean {
  const timestamp = Date.parse(
    context?.last_non_direct_at || context?.first_touch_at || ""
  );
  return !Number.isFinite(timestamp) || now - timestamp > GROWTH_ATTRIBUTION_TTL_MS;
}

export function mergeGrowthAttribution(
  existing: GrowthAttributionContext | undefined,
  incoming: GrowthAttributionContext,
  now = Date.now()
): GrowthAttributionContext {
  const previous = isGrowthAttributionExpired(existing, now) ? undefined : existing;
  const timestamp = new Date(now).toISOString();
  const incomingNonDirect = !["direct", "internal", "unknown"].includes(
    incoming.channel
  );

  if (!previous) {
    return sanitizeGrowthAttribution({
      ...incoming,
      first_touch_at: incoming.first_touch_at || timestamp,
      last_non_direct_at: incomingNonDirect
        ? incoming.last_non_direct_at || timestamp
        : undefined,
    }) || { channel: "unknown", first_touch_at: timestamp };
  }

  const next = incomingNonDirect
    ? {
        ...previous,
        ...incoming,
        landing_path: previous.landing_path || incoming.landing_path,
        first_touch_at: previous.first_touch_at || timestamp,
        last_non_direct_at: incoming.last_non_direct_at || timestamp,
      }
    : {
        ...previous,
        content_source: incoming.content_source || previous.content_source,
        intent: incoming.intent || previous.intent,
        template_id: incoming.template_id || previous.template_id,
        visitor_id: incoming.visitor_id || previous.visitor_id,
        session_id: incoming.session_id || previous.session_id,
      };

  return sanitizeGrowthAttribution(next) || previous;
}

export function resolveGrowthSession(
  existing: GrowthSessionState | undefined,
  createId: () => string,
  now = Date.now()
): GrowthSessionState {
  if (
    existing?.id &&
    Number.isFinite(existing.last_activity_at) &&
    now - existing.last_activity_at <= GROWTH_SESSION_TIMEOUT_MS
  ) {
    return { id: existing.id, last_activity_at: now };
  }
  return { id: createId(), last_activity_at: now };
}
