import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey } from "../../utils/dbutils";

const url = process.env.GOOGLETRAFFIC_URL as string;
const apikey = process.env.GOOGLE_API_KEY as string;
const locationSource = process.env.GOOGLETRAFFIC_SOURCE as string;
const locationDestination = process.env.GOOGLETRAFFIC_DESTINATION as string;
const TRAFFIC_CACHE_SECONDS = process.env.TRAFFIC_CACHE_SECONDS as string;

const requestURL = `${url}?origins=${locationSource}&destinations=${locationDestination}&departure_time=now&mode=driving&language=de-DE&key=${apikey}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("traffic");
  console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(TRAFFIC_CACHE_SECONDS)) {
    const traffic = await fetch(requestURL);
    const data = await traffic.json();
    const convertedDuration = data.rows[0].elements[0].duration_in_traffic
      .value as number; //duration in seconds
    const durationMinutes = Math.round(convertedDuration / 60);
    await writeKey("traffic", durationMinutes as any);
    res.status(200).json({ key: "traffic", items: durationMinutes });
  } else {
    console.log("Used cache");
    res.status(200).json({
      key: "traffic",
      items: JSON.parse(cachedData.data.payload),
    });
  }
}