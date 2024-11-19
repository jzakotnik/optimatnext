import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey } from "../../utils/dbutils";

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

//console.log(JSON.stringify(query));

//my query
//{"query":"{\n  viewer {\n    homes {\n      currentSubscription {\n        priceInfo {\n          current {\n            total\n            energy\n            tax\n            startsAt\n          }\n          today {\n            total\n            energy\n            tax\n            startsAt\n          }\n          tomorrow {\n            total\n            energy\n            tax\n            startsAt\n          }\n        }\n      }\n    }\n  }\n }"}

//baseline:
//{"query":"{\n  viewer {\n    homes {\n      currentSubscription {\n        priceInfo {\n          current {\n            total\n            energy\n            tax\n            startsAt\n          }\n          today {\n            total\n            energy\n            tax\n            startsAt\n          }\n          tomorrow {\n            total\n            energy\n            tax\n            startsAt\n          }\n        }\n      }\n    }\n  }\n}"}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("tibber");
  //console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;
  try {
    if (isNaN(cacheSeconds) || cacheSeconds > parseInt(TIBBER_CACHE_SECONDS)) {
      console.log("Refreshing Cache for Tibber");
      const data = await fetch(location, {
        method: "POST",
        body: JSON.stringify(query),

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apikey,
        },
      }).then((res) => res.json());
      await writeKey("tibber", data as any);
      res.status(200).json({ key: "tibber", price: data });
    } else {
      //console.log("Used cache for tibber");
      res.status(200).json({
        key: "tibber",
        items: JSON.parse(cachedData.data.payload),
      });
    }
  } catch (e: any) {
    console.warn("Cache refresh for tibber went wrong", e);
    res.status(200).json({
      key: "tibber",
      items: JSON.parse(cachedData.data.payload),
    });
  }
}
