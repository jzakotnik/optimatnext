import { Car, Leaf, SunMedium, Thermometer, Zap, Fuel } from "lucide-react";
import StatTile from "./StatTile";
import { toneForRange } from "@/lib/tone";
import type { CacheEntry } from "@/lib/cache/types";
import type { TrafficData } from "@/lib/sources/traffic";
import type { WeatherData } from "@/lib/sources/weather";
import type { ElectricityMapsData } from "@/lib/sources/electricitymaps";
import type { EnergyData } from "@/lib/sources/energy";
import type { TibberData } from "@/lib/sources/tibber";
import type { FuelData } from "@/lib/sources/fuel";

export function TrafficTile({ entry }: { entry?: CacheEntry<TrafficData> }) {
  const minutes = entry?.data?.minutes;
  return (
    <StatTile
      icon={Car}
      value={`${minutes} Min`}
      label="Verkehr KfW"
      noData={minutes == null}
      stale={entry?.stale}
    />
  );
}

export function WeatherTile({ entry }: { entry?: CacheEntry<WeatherData> }) {
  const temp = entry?.data?.temperatureC;
  return (
    <StatTile
      icon={Thermometer}
      value={`${temp} °C`}
      label="Temperatur"
      noData={temp == null}
      tone={temp != null ? toneForRange(temp, 10, 20) : undefined}
      stale={entry?.stale}
    />
  );
}

export function ElectricityTile({
  entry,
}: {
  entry?: CacheEntry<ElectricityMapsData>;
}) {
  const intensity = entry?.data?.carbonIntensity;
  return (
    <StatTile
      icon={Leaf}
      value={`${intensity} g`}
      label={`CO₂/kWh${entry?.data?.isEstimated ? " (geschätzt)" : ""}`}
      noData={intensity == null}
      tone={intensity != null ? toneForRange(intensity, 100, 300) : undefined}
      stale={entry?.stale}
    />
  );
}

export function EnergyTile({ entry }: { entry?: CacheEntry<EnergyData> }) {
  const data = entry?.data;
  return (
    <StatTile
      icon={SunMedium}
      value={data ? `${data.ppv} W` : "–"}
      label="PV Leistung"
      detail={data ? `Netz ${data.pgrid} W · Akku ${data.soc}%` : undefined}
      noData={!data}
      tone={data ? toneForRange(data.pgrid, 80, 300, false) : undefined}
      stale={entry?.stale}
    />
  );
}

export function TibberTile({ entry }: { entry?: CacheEntry<TibberData> }) {
  const data = entry?.data;
  return (
    <StatTile
      icon={Zap}
      value={data ? `${data.currentCt} ct` : "–"}
      label="Strompreis"
      detail={
        data
          ? `${data.todayLow}-${data.todayHigh} ct heute`
          : undefined
      }
      noData={!data}
      tone={
        data
          ? toneForRange(
              data.currentCt,
              (data.todayHigh + data.todayLow) / 3,
              (data.todayHigh + data.todayLow) / 1.5,
            )
          : undefined
      }
      stale={entry?.stale}
    />
  );
}

export function FuelTile({ entry }: { entry?: CacheEntry<FuelData> }) {
  const price = entry?.data?.price;
  return (
    <StatTile
      icon={Fuel}
      value={price != null ? `${price.toFixed(2)} €` : "–"}
      label="E10 Königstein"
      noData={price == null}
      stale={entry?.stale}
    />
  );
}
