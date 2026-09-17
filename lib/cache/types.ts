export interface CacheEntry<T = unknown> {
  data: T | null;
  /** epoch ms of the last *successful* fetch, or null if it never succeeded */
  updatedAt: number | null;
  /** true once a refresh has failed and we're serving old (or no) data */
  stale: boolean;
  error: string | null;
}

export type CacheStore = Record<string, CacheEntry>;

export function emptyEntry<T>(): CacheEntry<T> {
  return { data: null, updatedAt: null, stale: true, error: null };
}
