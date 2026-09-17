import { fetchJson } from "@/lib/http";

export interface FuelData {
  price: number;
}

export async function fetchFuel(): Promise<FuelData> {
  const url = process.env.TANKEN_URL;
  const apikey = process.env.TANKEN_APIKEY;
  const location = process.env.TANKEN_LOCATION;
  if (!url || !apikey || !location) {
    throw new Error("Fuel env vars not configured");
  }

  const data = await fetchJson<{
    prices?: Record<string, { e10?: number }>;
  }>(`${url}?ids=${location}&apikey=${apikey}`, {}, "Tanken");
  const price = data.prices?.[location]?.e10;
  if (typeof price !== "number") {
    throw new Error("Tanken response missing e10 price");
  }
  return { price };
}
