import { getAll, setSuccess, setFailure } from "./store";
import { sources } from "@/lib/sources";

/** Cap exponential backoff at 8x the normal interval so a long outage doesn't
 * silently stretch the retry interval into hours. */
const MAX_BACKOFF_MULTIPLIER = 8;
/** Spread initial fetches over a few seconds instead of firing them all at once. */
const MAX_INITIAL_JITTER_MS = 4000;

function runSource(key: string, ttlMs: number, fetcher: () => Promise<unknown>) {
  let failures = 0;

  const schedule = (delayMs: number) => {
    setTimeout(tick, delayMs);
  };

  const tick = async () => {
    try {
      const data = await fetcher();
      await setSuccess(key, data);
      if (failures > 0) {
        console.log(`[cache] ${key} recovered after ${failures} failure(s)`);
      }
      failures = 0;
      schedule(ttlMs);
    } catch (error) {
      failures += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[cache] ${key} refresh failed (attempt ${failures}):`, message);
      await setFailure(key, message);
      const backoffMultiplier = Math.min(2 ** failures, MAX_BACKOFF_MULTIPLIER);
      schedule(ttlMs * backoffMultiplier);
    }
  };

  schedule(Math.random() * MAX_INITIAL_JITTER_MS);
}

let started = false;

/**
 * Starts one independent refresh loop per data source. Each source keeps its
 * own TTL and its own failure/backoff state, so one slow or down upstream API
 * never blocks or throttles the others, and API routes never trigger a live
 * fetch themselves — they only ever read whatever this loop last wrote.
 */
export async function startScheduler(): Promise<void> {
  if (started) return;
  started = true;

  await getAll(); // ensures the persisted cache is loaded before we start overwriting it
  for (const source of sources) {
    runSource(source.key, source.ttlMs, source.fetcher);
  }
  console.log(`[cache] scheduler started for ${sources.length} sources`);
}
