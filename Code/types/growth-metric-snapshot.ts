export interface GrowthMetricSnapshotRecord {
  id?: number;
  uuid: string;
  snapshot_date: string; // YYYY-MM-DD
  source: 'gsc' | 'ga4' | 'clarity' | 'pagespeed' | string;
  range: string; // '1d' | '7d' | '28d' | 'mobile' | 'desktop' or strategy etc.
  segment: string; // default value is 'default'
  metrics_json: Record<string, any>;
  details_json: Record<string, any>;
  status: 'success' | 'failed';
  error_message: string;
  fetched_at?: string; // ISO timestamp
  created_at?: string; // ISO timestamp
}
