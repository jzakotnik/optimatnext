import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey, assertJsonResponse, safeParsePayload } from "../../utils/dbutils";

const url = process.env.TANKEN_URL as string;
const apikey = process.env.TANKEN_APIKEY as string;
const location = process.env.TANKEN_LOCATION as string;
const TANKEN_CACHE_SECONDS = process.env.TANKEN_CACHE_SECONDS as string;

const requestURL = `${url}?ids=${location}&apikey=${apikey}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("fuel");
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(TANKEN_CACHE_SECONDS)) {
    console.log("Refreshing Cache for Fuel");
    try {
      const response = await fetch(requestURL);
      await assertJsonResponse(response, "Tanken");
      const alldata = await response.json();
      const data = alldata.prices[location]["e10"];
      await writeKey("fuel", data);
      res.status(200).json({ key: "fuel", items: data });
    } catch (e: any) {
      console.warn("Cache refresh for fuel went wrong:", e.message);
      res.status(200).json({
        key: "fuel",
        items: safeParsePayload(cachedData.data.payload, null),
      });
    }
  } else {
    res.status(200).json({
      key: "fuel",
      items: safeParsePayload(cachedData.data.payload, null),
    });
  }
}
