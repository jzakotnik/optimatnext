import { fetchJson } from "@/lib/http";

export interface ElectricityMapsData {
  zone: string;
  carbonIntensity: number;
  isEstimated: boolean;
}

interface ElectricityMapsResponse {
  zone: string;
  carbonIntensity: number;
  isEstimated: boolean;
}

export async function fetchElectricityMaps(): Promise<ElectricityMapsData> {
  const url = process.env.ELECTRICITYMAPS_URL;
  const apikey = process.env.ELECTRICITYMAPS_APIKEY;
  if (!url || !apikey) {
    throw new Error("ElectricityMaps env vars not configured");
  }

  const data = await fetchJson<ElectricityMapsResponse>(
    url,
    { headers: { "auth-token": apikey, "Content-Type": "application/json" } },
    "ElectricityMaps",
  );
  if (typeof data.carbonIntensity !== "number") {
    throw new Error("ElectricityMaps response missing carbonIntensity");
  }
  return {
    zone: data.zone,
    carbonIntensity: Math.round(data.carbonIntensity),
    isEstimated: Boolean(data.isEstimated),
  };
}
