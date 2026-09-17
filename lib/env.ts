/**
 * Reads a `<NAME>_CACHE_SECONDS`-style env var and returns a TTL in milliseconds.
 * Falls back to a safe default instead of NaN when the var is missing or malformed,
 * so a forgotten env var degrades to "refresh periodically" rather than "refresh on
 * every request" (the old behavior when parseInt(undefined) produced NaN).
 */
export function ttlMsFromEnv(name: string, fallbackSeconds: number): number {
  const raw = process.env[name];
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0
    ? parsed * 1000
    : fallbackSeconds * 1000;
}
