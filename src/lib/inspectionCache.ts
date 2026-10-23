// ─────────────────────────────────────────────────────────────────────────────
// src/lib/inspectionCache.ts
// In-memory cache for inspection reports list view
// ─────────────────────────────────────────────────────────────────────────────

interface CacheEntry {
  reports: any[];
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds fresh

export function getCachedReports(): any[] | null {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.reports;
  }
  return null;
}

export function setCachedReports(reports: any[]) {
  cache = { reports, timestamp: Date.now() };
}

export function invalidateReportsCache() {
  cache = null;
}
