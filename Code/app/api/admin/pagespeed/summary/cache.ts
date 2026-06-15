interface PageSpeedCacheEntry {
  data: {
    url: string;
    strategy: "mobile" | "desktop";
    scores: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
    metrics: {
      fcp: string;
      lcp: string;
      tbt: string;
      cls: string;
      tti: string;
      speedIndex: string;
    };
    opportunities: Array<{
      id: string;
      title: string;
      displayValue: string;
    }>;
    diagnostics: {
      totalByteWeight: string;
      numRequests: number;
    };
  };
  timestamp: number;
}

export const pageSpeedCache = new Map<string, PageSpeedCacheEntry>();
