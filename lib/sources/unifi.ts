import { promises as fs } from "fs";
import https from "https";
import path from "path";
import { getEntry } from "@/lib/cache/store";

const MAX_EVENTS = 3;
const DEFAULT_POOR_SIGNAL_DBM = -70;

export interface UnknownClient {
  mac: string;
  name: string;
  ip: string | null;
  /** epoch ms when this dashboard first noticed the client */
  firstSeen: number;
}

export interface PoorSignalEvent {
  mac: string;
  name: string;
  signal: number;
  ap: string | null;
  /** epoch ms */
  at: number;
}

export interface UnifiData {
  clientsOnline: number;
  wirelessOnline: number;
  /** Unknown clients, newest first (max 3). Cleared once a client is made known. */
  unknownClients: UnknownClient[];
  /** Poor signal events, newest first (max 3). */
  poorSignals: PoorSignalEvent[];
  /** MACs currently below the threshold (used to avoid logging every poll). */
  poorActive: string[];
  /** MACs already reported as unknown, so we only log each client once. */
  unknownSeen: string[];
  poorThresholdDbm: number;
}

interface UnifiConfig {
  knownClients?: Array<string | { mac: string; name?: string }>;
  poorSignalDbm?: number;
  /** Treat clients that have a name/alias in the UniFi UI as known (default true). */
  namedClientsAreKnown?: boolean;
  ignoreMacs?: string[];
}

interface UnifiClient {
  mac: string;
  name?: string;
  hostname?: string;
  ip?: string;
  is_wired?: boolean;
  signal?: number;
  ap_mac?: string;
}

interface UnifiDevice {
  mac: string;
  name?: string;
}

const normMac = (m: string) => m.trim().toLowerCase().replace(/-/g, ":");

async function loadConfig(): Promise<UnifiConfig> {
  const file =
    process.env.UNIFI_CONFIG_FILE ??
    path.join(process.cwd(), "unifi.config.json");
  try {
    return JSON.parse(await fs.readFile(file, "utf-8")) as UnifiConfig;
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return {};
    throw new Error(`Could not read ${file}: ${(error as Error).message}`);
  }
}

interface HttpsResponse {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
}

/** The controller uses a self-signed cert on the LAN, so we use node:https
 * (fetch can't opt out of verification without extra deps). */
function request(
  url: URL,
  method: "GET" | "POST",
  headers: Record<string, string>,
  body?: string,
): Promise<HttpsResponse> {
  const verify = process.env.UNIFI_VERIFY_TLS === "true";
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method, headers, rejectUnauthorized: verify, timeout: 10000 },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () =>
          resolve({ status: res.statusCode ?? 0, headers: res.headers, body: data }),
        );
      },
    );
    req.on("timeout", () => req.destroy(new Error("UniFi request timed out")));
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function authHeaders(base: string): Promise<Record<string, string>> {
  const apiKey = process.env.UNIFI_API_KEY;
  if (apiKey) return { "X-API-KEY": apiKey, Accept: "application/json" };

  const username = process.env.UNIFI_USERNAME;
  const password = process.env.UNIFI_PASSWORD;
  if (!username || !password) {
    throw new Error("UNIFI_API_KEY or UNIFI_USERNAME/UNIFI_PASSWORD not configured");
  }
  const payload = JSON.stringify({ username, password });
  const res = await request(
    new URL("/api/auth/login", base),
    "POST",
    { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload).toString() },
    payload,
  );
  if (res.status !== 200) throw new Error(`UniFi login failed: HTTP ${res.status}`);
  const setCookie = res.headers["set-cookie"];
  const cookie = (Array.isArray(setCookie) ? setCookie : [setCookie ?? ""])
    .map((c) => c.split(";")[0])
    .join("; ");
  const headers: Record<string, string> = { Cookie: cookie, Accept: "application/json" };
  const csrf = res.headers["x-csrf-token"] ?? res.headers["x-updated-csrf-token"];
  if (typeof csrf === "string") headers["X-CSRF-Token"] = csrf;
  return headers;
}

async function getData<T>(
  base: string,
  site: string,
  endpoint: string,
  headers: Record<string, string>,
): Promise<T[]> {
  const res = await request(
    new URL(`/proxy/network/api/s/${site}/${endpoint}`, base),
    "GET",
    headers,
  );
  if (res.status !== 200) {
    throw new Error(`UniFi ${endpoint} failed: HTTP ${res.status}`);
  }
  return (JSON.parse(res.body) as { data: T[] }).data;
}

export async function fetchUnifi(): Promise<UnifiData> {
  const base = process.env.UNIFI_URL;
  if (!base) throw new Error("UNIFI_URL not configured");
  const site = process.env.UNIFI_SITE ?? "default";

  const config = await loadConfig();
  const threshold = config.poorSignalDbm ?? DEFAULT_POOR_SIGNAL_DBM;
  const namedAreKnown = config.namedClientsAreKnown ?? true;
  const known = new Set(
    (config.knownClients ?? []).map((k) => normMac(typeof k === "string" ? k : k.mac)),
  );
  for (const m of config.ignoreMacs ?? []) known.add(normMac(m));

  const headers = await authHeaders(base);
  const [clients, devices] = await Promise.all([
    getData<UnifiClient>(base, site, "stat/sta", headers),
    getData<UnifiDevice>(base, site, "stat/device-basic", headers).catch(() => []),
  ]);
  const apNames = new Map(devices.map((d) => [normMac(d.mac), d.name ?? d.mac]));

  const prev = (await getEntry<UnifiData>("unifi")).data;
  const now = Date.now();

  const unknownSeen = new Set(prev?.unknownSeen ?? []);
  let unknownClients = (prev?.unknownClients ?? []).filter(
    (u) => !known.has(u.mac),
  );
  const poorActive = new Set<string>();
  const poorSignals = [...(prev?.poorSignals ?? [])];
  const prevPoor = new Set(prev?.poorActive ?? []);

  for (const c of clients) {
    const mac = normMac(c.mac);
    const alias = c.name?.trim();
    const label = alias || c.hostname || mac;

    const isKnown = known.has(mac) || (namedAreKnown && !!alias);
    if (!isKnown && !unknownSeen.has(mac)) {
      unknownSeen.add(mac);
      unknownClients.unshift({ mac, name: c.hostname ?? "(ohne Name)", ip: c.ip ?? null, firstSeen: now });
    }

    if (!c.is_wired && typeof c.signal === "number" && c.signal < threshold) {
      poorActive.add(mac);
      // Log once per dip; again only after the client recovered.
      if (!prevPoor.has(mac)) {
        poorSignals.unshift({
          mac,
          name: label,
          signal: c.signal,
          ap: c.ap_mac ? (apNames.get(normMac(c.ap_mac)) ?? null) : null,
          at: now,
        });
      }
    }
  }

  unknownClients = unknownClients.slice(0, MAX_EVENTS);

  return {
    clientsOnline: clients.length,
    wirelessOnline: clients.filter((c) => !c.is_wired).length,
    unknownClients,
    poorSignals: poorSignals.slice(0, MAX_EVENTS),
    poorActive: [...poorActive],
    unknownSeen: [...unknownSeen],
    poorThresholdDbm: threshold,
  };
}
