import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey, assertJsonResponse, safeParsePayload } from "../../utils/dbutils";

const apikey = process.env.TIBBER_KEY as string;
const location = process.env.TIBBER_URL as string;
const TIBBER_CACHE_SECONDS = process.env.TIBBER_CACHE_SECONDS as string;

const query = {
  query: `{
    viewer {
      homes {
        currentSubscription {
          priceInfo {
            current {
              total
              energy
              tax
              startsAt
            }
            today {
              total
              energy
              tax
              startsAt
            }
            tomorrow {
              total
              energy
              tax
              startsAt
            }
          }
        }
      }
    }
  }`,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("tibber");
  const cacheSeconds = cachedData.age;
  try {
    if (isNaN(cacheSeconds) || cacheSeconds > parseInt(TIBBER_CACHE_SECONDS)) {
      console.log("Refreshing Cache for Tibber");
      const response = await fetch(location, {
        method: "POST",
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikey,
        },
      });
      await assertJsonResponse(response, "Tibber");
      const data = await response.json();
      await writeKey("tibber", data as any);
      res.status(200).json({ key: "tibber", price: data });
    } else {
      res.status(200).json({
        key: "tibber",
        items: safeParsePayload(cachedData.data.payload, null),
      });
    }
  } catch (e: any) {
    console.warn("Cache refresh for tibber went wrong:", e.message);
    res.status(200).json({
      key: "tibber",
      items: safeParsePayload(cachedData.data.payload, null),
    });
  }
}
