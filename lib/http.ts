/**
 * Fetches JSON with a hard timeout and validates the response is actually JSON
 * before parsing — upstream APIs sometimes return an HTML error page with a
 * 200 status, which would otherwise crash JSON.parse deep inside a source
 * fetcher.
 */
export async function fetchJson<T = unknown>(
  url: string,
  init: RequestInit = {},
  label = "request",
  timeoutMs = 10000,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `${label} failed: HTTP ${response.status} ${response.statusText}` +
          (body ? ` — ${body.slice(0, 300)}` : ""),
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `${label} returned non-JSON content-type "${contentType}". Body: ${body.slice(0, 300)}`,
      );
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
