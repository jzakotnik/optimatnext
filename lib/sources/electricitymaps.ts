import { fetchJson } from "@/lib/http";

export interface ElectricityMapsData {
  zone: string;
  /** Share of renewable electricity in the grid mix right now, 0-100. */
  renewablePercentage: number;
  isEstimated: boolean;
}

// Response of the /v3/power-breakdown/latest endpoint.
interface ElectricityMapsResponse {
  zone: string;
  renewablePercentage: number;
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
  if (typeof data.renewablePercentage !== "number") {
    throw new Error(
      "ElectricityMaps response missing renewablePercentage (is ELECTRICITYMAPS_URL the /v3/power-breakdown/latest endpoint?)",
    );
  }
  return {
    zone: data.zone,
    renewablePercentage: Math.round(data.renewablePercentage),
    isEstimated: Boolean(data.isEstimated),
  };
}
