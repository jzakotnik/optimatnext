import { fetchJson } from "@/lib/http";

export interface TrafficData {
  minutes: number;
}

interface DistanceMatrixResponse {
  rows: { elements: { duration_in_traffic?: { value: number } }[] }[];
}

export async function fetchTraffic(): Promise<TrafficData> {
  const url = process.env.GOOGLETRAFFIC_URL;
  const apikey = process.env.GOOGLE_API_KEY;
  const origin = process.env.GOOGLETRAFFIC_SOURCE;
  const destination = process.env.GOOGLETRAFFIC_DESTINATION;
  if (!url || !apikey || !origin || !destination) {
    throw new Error("Traffic env vars not configured");
  }

  const requestUrl = `${url}?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&departure_time=now&mode=driving&language=de-DE&key=${apikey}`;
  const data = await fetchJson<DistanceMatrixResponse>(
    requestUrl,
    {},
    "GoogleTraffic",
  );
  const seconds = data.rows?.[0]?.elements?.[0]?.duration_in_traffic?.value;
  if (typeof seconds !== "number") {
    throw new Error("GoogleTraffic response missing duration_in_traffic");
  }
  return { minutes: Math.round(seconds / 60) };
}
