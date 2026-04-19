import type { NextApiRequest, NextApiResponse } from "next";
import { writeKey, readKey, safeParsePayload } from "../../utils/dbutils";
const fritz = require("fritzbox.js");

const FRITZ_USER = process.env.FRITZ_USER as string;
const FRITZ_URL = process.env.FRITZ_URL as string;
const FRITZ_PASSWORD = process.env.FRITZ_PASSWORD as string;
const FRITZ_CACHE_SECONDS = process.env.FRITZ_CACHE_SECONDS as string;

const options = {
  username: FRITZ_USER,
  password: FRITZ_PASSWORD,
  server: FRITZ_URL,
  protocol: "http",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("fritz");
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(FRITZ_CACHE_SECONDS)) {
    console.log("Refreshing Cache for Fritz");
    try {
      const calls = await fritz.getCalls(options);
      if (calls.error) {
        throw new Error("Fritz error: " + calls.error.message);
      }
      const missedCalls = calls.filter((c: any) => c.type === "missed");
      await writeKey("fritz", missedCalls);
      res.status(200).json({ key: "fritz", items: missedCalls.slice(0, 10) });
    } catch (e: any) {
      console.warn("Cache refresh for phone data went wrong:", e.message);
      res.status(200).json({
        key: "fritz",
        items: safeParsePayload<any[]>(cachedData.data.payload, []),
      });
    }
  } else {
    const parsed = safeParsePayload<any[]>(cachedData.data.payload, []);
    res.status(200).json({ key: "fritz", items: parsed.slice(0, 10) });
  }
}
