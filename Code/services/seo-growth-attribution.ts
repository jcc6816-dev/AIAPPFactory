import { getFormSubmissions } from "@/models/form-submission";
import { getForms } from "@/models/form";
import { sanitizeGrowthAttribution } from "@/lib/growth-attribution";
import type { FormRecord, FormSubmissionRecord } from "@/types/form";

const PAGE_SIZE = 500;
const MAX_ROWS = 10_000;
const PUBLISH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const VALUE_REALIZATION_WINDOW_MS = 28 * 24 * 60 * 60 * 1000;

export interface SeoGrowthAttributionFilters {
  from: string;
  to: string;
  contentSource?: string;
  intent?: string;
}

export interface SeoGrowthAttributionSummary {
  generatedAt: string;
  range: { from: string; to: string };
  filters: { contentSource?: string; intent?: string };
  summary: {
    eligibleForms: number;
    organicAttributedCreated: number;
    organicAttributedCreators: number;
    organicAttributedPublished: number;
    organicPublishedWithin7d: number;
    organicPublishedCreatorsWithin7d: number;
    organicAttributedValueRealized: number;
    organicValueRealizedCreators: number;
    unattributedForms: number;
    unattributedRate: number;
    internalExcluded: number;
    upgradeIntent: null;
    qualifiedLead: null;
  };
  breakdown: Array<{
    contentSource: string;
    intent: string;
    created: number;
    published: number;
    valueRealized: number;
  }>;
  dataQualityWarnings: string[];
}

function timestamp(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isInternalForm(form: FormRecord): boolean {
  const attribution = sanitizeGrowthAttribution(form.generation_meta_json?.attribution);
  const source = attribution?.content_source?.toLowerCase() || "";
  return (
    attribution?.channel === "internal" ||
    source.startsWith("admin") ||
    source.startsWith("internal") ||
    source.startsWith("test")
  );
}

function hasValueRealizedWithinWindow(
  form: FormRecord,
  submissions: FormSubmissionRecord[]
): boolean {
  const createdAt = timestamp(form.created_at);
  return submissions.some((submission) => {
    if (submission.form_uuid !== form.uuid || submission.is_test) return false;
    if (!createdAt) return true;
    const submittedAt = timestamp(submission.created_at);
    return (
      submittedAt !== undefined &&
      submittedAt >= createdAt &&
      submittedAt <= createdAt + VALUE_REALIZATION_WINDOW_MS
    );
  });
}

function publishedWithinActivationWindow(form: FormRecord): boolean {
  const createdAt = timestamp(form.created_at);
  if (!createdAt) return false;
  const publishedAt = form.generation_meta_json?.artifact?.history
    ?.filter((event) => event.type === "published")
    .map((event) => timestamp(event.createdAt))
    .find((value): value is number => value !== undefined);
  return (
    publishedAt !== undefined &&
    publishedAt >= createdAt &&
    publishedAt <= createdAt + PUBLISH_WINDOW_MS
  );
}

function hasEverPublished(form: FormRecord): boolean {
  return (
    form.status === "published" ||
    Boolean(
      form.generation_meta_json?.artifact?.history?.some(
        (event) => event.type === "published"
      )
    )
  );
}

export function buildSeoGrowthAttributionSummary(
  forms: FormRecord[],
  submissions: FormSubmissionRecord[],
  filters: SeoGrowthAttributionFilters
): SeoGrowthAttributionSummary {
  const from = Date.parse(filters.from);
  const to = Date.parse(filters.to);
  const cohort = forms.filter((form) => {
    const createdAt = timestamp(form.created_at);
    return createdAt !== undefined && createdAt >= from && createdAt <= to;
  });
  const internalExcluded = cohort.filter(isInternalForm).length;
  const external = cohort.filter((form) => !isInternalForm(form));
  const filtered = external.filter((form) => {
    const attribution = sanitizeGrowthAttribution(form.generation_meta_json?.attribution);
    if (filters.contentSource && attribution?.content_source !== filters.contentSource) {
      return false;
    }
    if (filters.intent && attribution?.intent !== filters.intent) return false;
    return true;
  });
  const unattributedForms = filtered.filter(
    (form) => !sanitizeGrowthAttribution(form.generation_meta_json?.attribution)
  ).length;
  const organic = filtered.filter(
    (form) =>
      sanitizeGrowthAttribution(form.generation_meta_json?.attribution)?.channel ===
      "organic_search"
  );

  const breakdownMap = new Map<
    string,
    SeoGrowthAttributionSummary["breakdown"][number]
  >();
  for (const form of organic) {
    const attribution = sanitizeGrowthAttribution(form.generation_meta_json?.attribution)!;
    const contentSource = attribution.content_source || "unspecified";
    const intent = attribution.intent || "unspecified";
    const key = `${contentSource}\u0000${intent}`;
    const row = breakdownMap.get(key) || {
      contentSource,
      intent,
      created: 0,
      published: 0,
      valueRealized: 0,
    };
    row.created += 1;
    if (form.status === "published") row.published += 1;
    if (hasEverPublished(form) && hasValueRealizedWithinWindow(form, submissions)) {
      row.valueRealized += 1;
    }
    breakdownMap.set(key, row);
  }

  const published = organic.filter((form) => form.status === "published").length;
  const publishedWithin7dForms = organic.filter(publishedWithinActivationWindow);
  const valueRealized = organic.filter((form) =>
    hasEverPublished(form) && hasValueRealizedWithinWindow(form, submissions)
  ).length;

  const uniqueCreators = (rows: FormRecord[]) =>
    new Set(rows.map((form) => form.user_uuid).filter(Boolean)).size;
  const valueRealizedForms = organic.filter(
    (form) => hasEverPublished(form) && hasValueRealizedWithinWindow(form, submissions)
  );

  return {
    generatedAt: new Date().toISOString(),
    range: { from: filters.from, to: filters.to },
    filters: {
      ...(filters.contentSource ? { contentSource: filters.contentSource } : {}),
      ...(filters.intent ? { intent: filters.intent } : {}),
    },
    summary: {
      eligibleForms: filtered.length,
      organicAttributedCreated: organic.length,
      organicAttributedCreators: uniqueCreators(organic),
      organicAttributedPublished: published,
      organicPublishedWithin7d: publishedWithin7dForms.length,
      organicPublishedCreatorsWithin7d: uniqueCreators(publishedWithin7dForms),
      organicAttributedValueRealized: valueRealized,
      organicValueRealizedCreators: uniqueCreators(valueRealizedForms),
      unattributedForms,
      unattributedRate: filtered.length
        ? Number((unattributedForms / filtered.length).toFixed(4))
        : 0,
      internalExcluded,
      upgradeIntent: null,
      qualifiedLead: null,
    },
    breakdown: Array.from(breakdownMap.values()).sort(
      (a, b) => b.created - a.created
    ),
    dataQualityWarnings: [
      "搜索点击仍以 GSC 为准，站内归因不会重建 GSC 点击。",
      "organicAttributedPublished 使用表单当前状态；七日发布 KPI 仅统计 artifact history 中有可靠 published 时间的表单。",
      "价值实现仅统计已发布表单创建后 28 天内的非测试 Submission，并按 Form UUID 去重。",
      "无法识别的内部人员公网访问仍可能落入 unattributed，需结合受控测试标记解读。",
      "升级意图与合格线索尚无可靠业务定义，因此保持 null。",
    ],
  };
}

async function loadAll<T>(loader: (page: number, limit: number) => Promise<T[]>): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; rows.length < MAX_ROWS; page += 1) {
    const batch = await loader(page, PAGE_SIZE);
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return rows.slice(0, MAX_ROWS);
}

export async function getSeoGrowthAttributionSummary(
  filters: SeoGrowthAttributionFilters
): Promise<SeoGrowthAttributionSummary> {
  const [forms, submissions] = await Promise.all([
    loadAll(getForms),
    loadAll(getFormSubmissions),
  ]);
  return buildSeoGrowthAttributionSummary(forms, submissions, filters);
}
