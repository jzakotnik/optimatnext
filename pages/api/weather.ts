import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey } from "../../utils/dbutils";

const url = process.env.OPENWEATHER_URL as string;
const apikey = process.env.OPENWEATHER_APIKEY as string;
const location = process.env.OPENWEATHER_LOCATIONID as string;
const WEATHER_CACHE_SECONDS = process.env.WEATHER_CACHE_SECONDS as string;

const requestURL = `${url}?id=${location}&APPID=${apikey}&units=metric`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("weather");
  //console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;
  try {
    if (isNaN(cacheSeconds) || cacheSeconds > parseInt(WEATHER_CACHE_SECONDS)) {
      console.log("Refreshing Cache for Weather");
      const weather = await fetch(requestURL);
      const data = await weather.json();
      const singleData = data.main.temp;
      await writeKey("weather", singleData as any);

      res.status(200).json({ key: "weather", items: singleData });
    } else {
      //console.log("Used cache for weather");
      res.status(200).json({
        key: "weather",
        items: JSON.parse(cachedData.data.payload),
      });
    }
  } catch (e: any) {
    console.warn("Cache refresh for weather went wrong", e);
    res.status(200).json({
      key: "weather",
      items: JSON.parse(cachedData.data.payload),
    });
  }
}
