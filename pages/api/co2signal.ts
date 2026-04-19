import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey, assertJsonResponse, safeParsePayload } from "../../utils/dbutils";

const CO2SIGNAL_APIKEY = process.env.CO2SIGNAL_APIKEY as string;
const CO2SIGNAL_URL = process.env.CO2SIGNAL_URL as string;
const CO2SIGNAL_CACHE_SECONDS = process.env.CO2SIGNAL_CACHE_SECONDS as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("co2signal");
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(CO2SIGNAL_CACHE_SECONDS)) {
    console.log("Refreshing Cache for Co2");
    try {
      const response = await fetch(CO2SIGNAL_URL, {
        headers: {
          "auth-token": CO2SIGNAL_APIKEY,
          "Content-Type": "application/json",
        },
      });
      await assertJsonResponse(response, "CO2Signal");
      const data = await response.json();
      await writeKey("co2signal", data as any);
      res.status(200).json({ key: "co2signal", items: data });
    } catch (e: any) {
      console.warn("Cache refresh for co2signal went wrong:", e.message);
      res.status(200).json({
        key: "co2signal",
        items: safeParsePayload(cachedData.data.payload, null),
      });
    }
  } else {
    res.status(200).json({
      key: "co2signal",
      items: safeParsePayload(cachedData.data.payload, null),
    });
  }
}
