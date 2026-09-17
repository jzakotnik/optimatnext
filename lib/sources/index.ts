import { ttlMsFromEnv } from "@/lib/env";
import { fetchTraffic } from "./traffic";
import { fetchElectricityMaps } from "./electricitymaps";
import { fetchEnergy } from "./energy";
import { fetchWeather } from "./weather";
import { fetchTibber } from "./tibber";
import { fetchFuel } from "./fuel";
import { fetchNews } from "./news";
import { fetchMastodon } from "./mastodon";
import { fetchCalendar } from "./calendar";

export interface SourceDefinition {
  key: string;
  ttlMs: number;
  fetcher: () => Promise<unknown>;
}

// n8n is intentionally excluded: it's pushed via POST /api/n8n rather than polled.
export const sources: SourceDefinition[] = [
  {
    key: "traffic",
    ttlMs: ttlMsFromEnv("TRAFFIC_CACHE_SECONDS", 300),
    fetcher: fetchTraffic,
  },
  {
    key: "electricitymaps",
    ttlMs: ttlMsFromEnv("ELECTRICITYMAPS_CACHE_SECONDS", 900),
    fetcher: fetchElectricityMaps,
  },
  {
    key: "energy",
    ttlMs: ttlMsFromEnv("ALPHAESS_CACHE_SECONDS", 300),
    fetcher: fetchEnergy,
  },
  {
    key: "weather",
    ttlMs: ttlMsFromEnv("WEATHER_CACHE_SECONDS", 600),
    fetcher: fetchWeather,
  },
  {
    key: "tibber",
    ttlMs: ttlMsFromEnv("TIBBER_CACHE_SECONDS", 900),
    fetcher: fetchTibber,
  },
  {
    key: "fuel",
    ttlMs: ttlMsFromEnv("TANKEN_CACHE_SECONDS", 900),
    fetcher: fetchFuel,
  },
  {
    key: "news",
    ttlMs: ttlMsFromEnv("NEWS_CACHE_SECONDS", 600),
    fetcher: fetchNews,
  },
  {
    key: "mastodon",
    ttlMs: ttlMsFromEnv("MASTODON_CACHE_TTL_SECONDS", 300),
    fetcher: fetchMastodon,
  },
  {
    key: "calendar",
    ttlMs: ttlMsFromEnv("GOOGLECALENDAR_CACHE_SECONDS", 900),
    fetcher: fetchCalendar,
  },
];
