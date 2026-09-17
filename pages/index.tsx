import { useCallback, useEffect, useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import type { CacheStore, CacheEntry } from "@/lib/cache/types";
import StatusBar from "@/components/dashboard/StatusBar";
import NewsPanel from "@/components/dashboard/NewsPanel";
import MastodonPanel from "@/components/dashboard/MastodonPanel";
import CalendarPanel from "@/components/dashboard/CalendarPanel";
import {
  TrafficTile,
  WeatherTile,
  ElectricityTile,
  EnergyTile,
  TibberTile,
  FuelTile,
} from "@/components/dashboard/StatTiles";
import { formatClock } from "@/lib/date";
import type { TrafficData } from "@/lib/sources/traffic";
import type { WeatherData } from "@/lib/sources/weather";
import type { ElectricityMapsData } from "@/lib/sources/electricitymaps";
import type { EnergyData } from "@/lib/sources/energy";
import type { TibberData } from "@/lib/sources/tibber";
import type { FuelData } from "@/lib/sources/fuel";
import type { NewsData } from "@/lib/sources/news";
import type { MastodonPost } from "@/lib/sources/mastodon";
import type { CalendarEvent } from "@/lib/sources/calendar";

const POLL_INTERVAL_MS = 30000;
const FETCH_TIMEOUT_MS = 8000;
// Only flip to "offline" after two consecutive failed polls, so a single
// dropped packet doesn't flash a scary banner on an otherwise fine network.
const OFFLINE_AFTER_FAILURES = 2;

interface DashboardProps {
  initialData: CacheStore;
}

export default function Home({ initialData }: DashboardProps) {
  const [data, setData] = useState<CacheStore>(initialData);
  const [connected, setConnected] = useState(true);
  const [offlineSince, setOfflineSince] = useState<Date | null>(null);
  const [lastPolled, setLastPolled] = useState<Date>(new Date());
  const failuresRef = useRef(0);

  const poll = useCallback(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch("/api/dashboard", { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as CacheStore;
      setData(json);
      setLastPolled(new Date());
      failuresRef.current = 0;
      setConnected(true);
      setOfflineSince(null);
    } catch (error) {
      failuresRef.current += 1;
      console.warn("Dashboard poll failed:", error);
      if (failuresRef.current >= OFFLINE_AFTER_FAILURES) {
        setConnected(false);
        setOfflineSince((prev) => prev ?? new Date());
      }
    } finally {
      clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  return (
    <div className="flex h-screen w-screen flex-col gap-2 overflow-hidden p-3">
      <div className="grid shrink-0 grid-cols-6 gap-2">
        <TrafficTile entry={data.traffic as CacheEntry<TrafficData>} />
        <ElectricityTile
          entry={data.electricitymaps as CacheEntry<ElectricityMapsData>}
        />
        <EnergyTile entry={data.energy as CacheEntry<EnergyData>} />
        <WeatherTile entry={data.weather as CacheEntry<WeatherData>} />
        <TibberTile entry={data.tibber as CacheEntry<TibberData>} />
        <FuelTile entry={data.fuel as CacheEntry<FuelData>} />
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-2 gap-2">
        <NewsPanel entry={data.news as CacheEntry<NewsData>} />
        <div className="flex min-h-0 gap-2">
          <MastodonPanel entry={data.mastodon as CacheEntry<MastodonPost[]>} />
          <CalendarPanel
            entry={data.calendar as CacheEntry<CalendarEvent[]>}
          />
        </div>
      </div>

      <StatusBar
        connected={connected}
        offlineSinceLabel={offlineSince ? formatClock(offlineSince) : null}
        lastUpdatedLabel={formatClock(lastPolled)}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async () => {
  // Dynamically imported so this Node-only, fs-backed module never ends up
  // in the client bundle.
  const { getAll } = await import("@/lib/cache/store");
  const initialData = await getAll();
  return { props: { initialData } };
};
