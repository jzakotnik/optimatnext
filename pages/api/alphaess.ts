import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey } from "../../utils/dbutils";
import dayjs from "dayjs";
import crypto from "crypto";

const appid = process.env.ALPHAESS_APPID as string;
const appsecret = process.env.ALPHAESS_APPSECRET as string;
const systemsn = process.env.ALPHAESS_SYSTEMSN as string;
const location = process.env.ALPHAESS_URL as string;
const ALPHAESS_CACHE_SECONDS = process.env.ALPHAESS_CACHE_SECONDS as string;

const signRequest = (timestamp: string) => {
  const unsigned = appid + appsecret + timestamp;
  //console.log("Unsigned", unsigned);
  const signed = crypto.createHash("sha512").update(unsigned).digest("hex");
  return signed;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("alphaess");
  const timestamp = dayjs(new Date()).unix().toString();
  //console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;
  var responseDebug = undefined;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(ALPHAESS_CACHE_SECONDS)) {
    console.log("Refreshing Cache for alphaess");
    try {
      const data = await fetch(
        location +
          "?" +
          new URLSearchParams({
            sysSn: systemsn,
          }),
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            appId: appid,
            timeStamp: timestamp,
            sign: signRequest(timestamp),
          },
        }
      ).then(async (res) => {
        responseDebug = res;
        const responseText = await res.text(); // Read response as text
        try {
          return JSON.parse(responseText); // Try parsing the text as JSON
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          console.log("Response text was:", responseText);
          throw new Error("Response was not valid JSON");
        }
      });
      await writeKey("alphaess", data as any);
      res.status(200).json({ key: "alphaess", energy: data });
    } catch (e: any) {
      console.warn("Cache refresh for alphaess went wrong", e);
      console.log("Response debug", responseDebug);

      res.status(200).json({ key: "alpha", items: {} });
    }
  } else {
    //console.log("Used cache for alphaess");
    res.status(200).json({
      key: "alphaess",
      energy: JSON.parse(cachedData.data.payload),
    });
  }
}
