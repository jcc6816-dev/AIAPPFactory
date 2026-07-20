export function getClarityNumber(value: unknown): number {
  if (value === undefined || value === null || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Clarity's sessionsCount is the denominator for click/error metrics.
 * subTotal is the metric count. Older response shapes may expose a
 * metric-specific count instead, so those remain as compatibility fallbacks.
 */
export function getClarityMetricCount(
  record: Record<string, any>,
  metricSpecificKeys: string[] = []
): number {
  const candidates = [
    record.subTotal,
    ...metricSpecificKeys.map((key) => record[key]),
    record.count,
  ];
  const value = candidates.find(
    (candidate) => candidate !== undefined && candidate !== null && candidate !== ""
  );
  if (value !== undefined) return getClarityNumber(value);

  // Compatibility only for legacy/mocked payloads without subTotal.
  return getClarityNumber(record.sessions ?? record.sessionsCount);
}
