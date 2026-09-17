import crypto from "crypto";
import dayjs from "dayjs";

export interface EnergyData {
  ppv: number;
  pgrid: number;
  soc: number;
}

function signRequest(appId: string, appSecret: string, timestamp: string) {
  return crypto
    .createHash("sha512")
    .update(appId + appSecret + timestamp)
    .digest("hex");
}

export async function fetchEnergy(): Promise<EnergyData> {
  const appId = process.env.ALPHAESS_APPID;
  const appSecret = process.env.ALPHAESS_APPSECRET;
  const systemSn = process.env.ALPHAESS_SYSTEMSN;
  const url = process.env.ALPHAESS_URL;
  if (!appId || !appSecret || !systemSn || !url) {
    throw new Error("AlphaESS env vars not configured");
  }

  const timestamp = dayjs().unix().toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `${url}?${new URLSearchParams({ sysSn: systemSn })}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          appId,
          timeStamp: timestamp,
          sign: signRequest(appId, appSecret, timestamp),
        },
        signal: controller.signal,
      },
    );

    // AlphaESS sometimes returns HTML on auth failures — read as text first
    // so a bad response doesn't crash JSON.parse.
    const text = await response.text();
    let parsed: { data?: Partial<EnergyData> } | undefined;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(
        `AlphaESS returned non-JSON (HTTP ${response.status}): ${text.slice(0, 300)}`,
      );
    }
    if (!response.ok) {
      throw new Error(`AlphaESS request failed: HTTP ${response.status}`);
    }

    const d = parsed?.data;
    if (!d || typeof d.ppv !== "number" || typeof d.pgrid !== "number") {
      throw new Error("AlphaESS response missing expected data fields");
    }
    return { ppv: d.ppv, pgrid: d.pgrid, soc: d.soc ?? 0 };
  } finally {
    clearTimeout(timer);
  }
}
