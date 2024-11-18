import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey } from "../../utils/dbutils";

const CO2SIGNAL_APIKEY = process.env.CO2SIGNAL_APIKEY as string;
const CO2SIGNAL_URL = process.env.CO2SIGNAL_URL as string;
const CO2SIGNAL_CACHE_SECONDS = process.env.CO2SIGNAL_CACHE_SECONDS as string;
/*
curl 'https://api.co2signal.com/v1/latest?countryCode=DE'
  -H 'auth-token: myapitoken'
*/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("co2signal");
  //console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(CO2SIGNAL_CACHE_SECONDS)) {
    console.log("Refreshing Cache for Co2");
    try {
      const co2signal = await fetch(CO2SIGNAL_URL, {
        headers: {
          "auth-token": CO2SIGNAL_APIKEY,
          "Content-Type": "application/json",
        },
      });
      if (!co2signal.ok) {
        console.log("CO2 Request failed", co2signal);
        res.status(200).json({
          key: "co2signal",
          items: {},
        });
      }
      const response = await co2signal.json();
      await writeKey("co2signal", response as any);
      res.status(200).json({
        key: "CO2",
        items: response,
      });
    } catch (e: any) {
      console.warn("Cache refresh for co2signal went wrong", e);
      res.status(200).json({
        key: "co2signal",
        items: JSON.parse(cachedData.data.payload),
      });
    }
  } else {
    //console.log("Used cache for CO2 Signal");
    res.status(200).json({
      key: "co2signal",
      items: JSON.parse(cachedData.data.payload),
    });
  }
}
