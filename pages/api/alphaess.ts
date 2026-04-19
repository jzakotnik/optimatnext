import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey, safeParsePayload } from "../../utils/dbutils";
import dayjs from "dayjs";
import crypto from "crypto";

const appid = process.env.ALPHAESS_APPID as string;
const appsecret = process.env.ALPHAESS_APPSECRET as string;
const systemsn = process.env.ALPHAESS_SYSTEMSN as string;
const location = process.env.ALPHAESS_URL as string;
const ALPHAESS_CACHE_SECONDS = process.env.ALPHAESS_CACHE_SECONDS as string;

const signRequest = (timestamp: string) => {
  const unsigned = appid + appsecret + timestamp;
  const signed = crypto.createHash("sha512").update(unsigned).digest("hex");
  return signed;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("alphaess");
  const timestamp = dayjs(new Date()).unix().toString();
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(ALPHAESS_CACHE_SECONDS)) {
    console.log("Refreshing Cache for alphaess");
    try {
      const response = await fetch(
        location + "?" + new URLSearchParams({ sysSn: systemsn }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            appId: appid,
            timeStamp: timestamp,
            sign: signRequest(timestamp),
          },
        }
      );

      // AlphaESS sometimes returns HTML on auth failures – read as text first
      // so we can log a useful preview before throwing.
      const responseText = await response.text();
      let data: unknown;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `AlphaESS returned non-JSON (HTTP ${response.status}): ${responseText.slice(0, 300)}`
        );
      }

      await writeKey("alphaess", data as any);
      res.status(200).json({ key: "alphaess", energy: data });
    } catch (e: any) {
      console.warn("Cache refresh for alphaess went wrong:", e.message);
      res.status(200).json({
        key: "alphaess",
        energy: safeParsePayload(cachedData.data.payload, null),
      });
    }
  } else {
    res.status(200).json({
      key: "alphaess",
      energy: safeParsePayload(cachedData.data.payload, null),
    });
  }
}
