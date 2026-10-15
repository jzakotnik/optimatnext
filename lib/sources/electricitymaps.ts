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
  renewablePercentage?: number | null;
  powerConsumptionBreakdown?: Record<string, number | null> | null;
  isEstimated?: boolean;
}

const RENEWABLE_SOURCES = ["biomass", "geothermal", "wind", "solar", "hydro"];

/** Share of renewables in the consumption mix, derived from the breakdown. */
function renewableShare(
  breakdown: Record<string, number | null> | null | undefined,
): number | null {
  if (!breakdown) return null;
  let total = 0;
  let renewable = 0;
  for (const [source, mw] of Object.entries(breakdown)) {
    if (typeof mw !== "number" || mw <= 0) continue;
    total += mw;
    if (RENEWABLE_SOURCES.includes(source)) renewable += mw;
  }
  return total > 0 ? (renewable / total) * 100 : null;
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
  const percentage =
    typeof data.renewablePercentage === "number"
      ? data.renewablePercentage
      : renewableShare(data.powerConsumptionBreakdown);
  if (percentage == null) {
    throw new Error(
      "ElectricityMaps response has neither renewablePercentage nor powerConsumptionBreakdown (is ELECTRICITYMAPS_URL the /v3/power-breakdown/latest endpoint?)",
    );
  }
  return {
    zone: data.zone,
    renewablePercentage: Math.round(percentage),
    isEstimated: Boolean(data.isEstimated),
  };
}
