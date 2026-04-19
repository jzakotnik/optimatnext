import { JSONFilePreset } from "lowdb/node";

import dayjs from "dayjs";
import "dayjs/locale/de";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const TIMEZONE = "Europe/Berlin";
dayjs.extend(utc);
//dayjs.extend(timezone);

interface cacheItem {
  data: {
    lastUpdate: string;
    payload: string;
  };
}

/**
 * Safely parse a JSON payload string.
 * Returns the parsed value, or `fallback` if parsing fails or the value is null/undefined.
 *
 * Use this instead of bare JSON.parse() everywhere a cache payload is read,
 * because the payload may be "null" (cold cache default), corrupted JSON,
 * or an HTML error page that was accidentally cached.
 */
export function safeParsePayload<T>(
  payload: string | undefined | null,
  fallback: T
): T {
  if (payload == null) return fallback;
  try {
    const parsed = JSON.parse(payload);
    // Treat an explicit null/undefined parse result the same as missing data
    if (parsed == null) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Validates that an API fetch() Response is safe to parse as JSON.
 * Throws a descriptive Error (which callers can catch) when:
 *  - The HTTP status is not OK (4xx / 5xx)
 *  - The Content-Type is not JSON (e.g. the provider returned an HTML error page)
 *
 * Usage:
 *   const response = await fetch(url);
 *   await assertJsonResponse(response, "MyAPI");   // throws if bad
 *   const data = await response.json();
 */
export async function assertJsonResponse(
  response: Response,
  label: string
): Promise<void> {
  if (!response.ok) {
    let body = "";
    try {
      body = await response.text();
    } catch {
      // ignore – we already know the response is bad
    }
    throw new Error(
      `${label} request failed: HTTP ${response.status} ${response.statusText}` +
        (body ? ` — ${body.slice(0, 300)}` : "")
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    let body = "";
    try {
      body = await response.text();
    } catch {
      // ignore
    }
    throw new Error(
      `${label} returned non-JSON content-type "${contentType}". ` +
        `Body preview: ${body.slice(0, 300)}`
    );
  }
}

export async function writeKey(key: string = "health", cacheEntry: cacheItem) {
  const nowTime = dayjs();
  const db = await JSONFilePreset<cacheItem>("cachedb/" + key + ".json", {
    // Use "null" as default so JSON.parse("null") === null (safe) instead of
    // the old "init" which caused JSON.parse to throw on first run.
    data: { lastUpdate: "", payload: "null" },
  });
  db.data = {
    data: {
      lastUpdate: nowTime.toString(),
      payload: JSON.stringify(cacheEntry),
    },
  };

  await db.write();
}

export async function readKey(key: string = "health") {
  const db = await JSONFilePreset<cacheItem>("cachedb/" + key + ".json", {
    data: { lastUpdate: "now", payload: "null" },
  });
  const cachedData = await db.data.data;
  const nowTime = dayjs();
  const cacheTime = dayjs(cachedData.lastUpdate);
  const age = nowTime.diff(cacheTime, "second");
  return { data: cachedData, age: age };
}
