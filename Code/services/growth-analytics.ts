import { GrowthEventRecord } from "@/types/growth-event";
import { listGrowthEvents } from "@/models/growth-event";

export interface GrowthAnalyticsSummary {
  totals: {
    visitors: number;
    pageViews: number;
    templateViews: number;
    templateUses: number;
    formsCreated: number;
    formsPublished: number;
    publicSubmissions: number;
    checkoutStarted: number;
    supportTickets: number;
    averageDurationSeconds: number;
  };
  funnel: Array<{
    key: string;
    label: string;
    count: number;
    rateFromPrevious: number;
  }>;
  topPages: Array<{ key: string; count: number }>;
  topTemplates: Array<{ key: string; views: number; uses: number; conversionRate: number }>;
  topSources: Array<{ key: string; count: number }>;
  recentEvents: GrowthEventRecord[];
}

const funnelSteps = [
  { key: "page_view", label: "Visitors" },
  { key: "template_viewed", label: "Template Views" },
  { key: "template_used", label: "Use Template" },
  { key: "form_created", label: "Forms Created" },
  { key: "form_published", label: "Forms Published" },
  { key: "public_form_submitted", label: "Public Submissions" },
];

function countBy<T>(items: T[], getKey: (item: T) => string | undefined) {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

function eventCount(events: GrowthEventRecord[], eventName: string) {
  return events.filter((event) => event.event_name === eventName).length;
}

function percentage(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export function buildGrowthAnalyticsSummary(
  events: GrowthEventRecord[]
): GrowthAnalyticsSummary {
  const visitors = new Set(
    events.map((event) => event.visitor_id).filter(Boolean)
  ).size;
  const pageViews = eventCount(events, "page_view");
  const durations = events
    .filter((event) => event.event_name === "page_leave")
    .map((event) => event.duration_ms || 0)
    .filter((duration) => duration > 0 && duration < 60 * 60 * 1000);
  const averageDurationSeconds = durations.length
    ? Math.round(
        durations.reduce((total, duration) => total + duration, 0) /
          durations.length /
          1000
      )
    : 0;

  const funnel = funnelSteps.map((step, index) => {
    const count = index === 0 ? visitors : eventCount(events, step.key);
    const previousCount =
      index === 0
        ? count
        : index === 1
          ? visitors
          : eventCount(events, funnelSteps[index - 1].key);

    return {
      key: step.key,
      label: step.label,
      count,
      rateFromPrevious: index === 0 ? 100 : percentage(count, previousCount),
    };
  });

  const templateViews = countBy(
    events.filter((event) => event.event_name === "template_viewed"),
    (event) => event.template_id
  );
  const templateUses = countBy(
    events.filter((event) => event.event_name === "template_used"),
    (event) => event.template_id
  );
  const templateUseMap = new Map(templateUses.map((item) => [item.key, item.count]));
  const topTemplates = templateViews.slice(0, 10).map((item) => {
    const uses = templateUseMap.get(item.key) || 0;
    return {
      key: item.key,
      views: item.count,
      uses,
      conversionRate: percentage(uses, item.count),
    };
  });

  return {
    totals: {
      visitors,
      pageViews,
      templateViews: eventCount(events, "template_viewed"),
      templateUses: eventCount(events, "template_used"),
      formsCreated: eventCount(events, "form_created"),
      formsPublished: eventCount(events, "form_published"),
      publicSubmissions: eventCount(events, "public_form_submitted"),
      checkoutStarted: eventCount(events, "checkout_started"),
      supportTickets: eventCount(events, "support_ticket_created"),
      averageDurationSeconds,
    },
    funnel,
    topPages: countBy(
      events.filter((event) => event.event_name === "page_view"),
      (event) => event.path
    ).slice(0, 10),
    topTemplates,
    topSources: countBy(events, (event) => event.source || "direct").slice(0, 10),
    recentEvents: events.slice(0, 20),
  };
}

export async function getGrowthAnalyticsSummary() {
  const events = await listGrowthEvents(3000);
  return buildGrowthAnalyticsSummary(events);
}
