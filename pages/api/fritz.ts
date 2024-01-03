import type { NextApiRequest, NextApiResponse } from "next";
import { writeKey, readKey } from "../../utils/dbutils";

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
  //check if cache hit is sufficient
  const cachedData = await readKey("fritz");
  //console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(FRITZ_CACHE_SECONDS)) {
    console.log("Refreshing Cache for Fritz");
    const fritz = require("fritzbox.js");
    try {
      const calls = await fritz.getCalls(options);
      if (calls.error) return console.log("Error: " + calls.error.message);
      //console.log("Got " + calls.length + "calls.");
      //console.log("Calls", calls);
      const missedCalls = calls.filter((c: any) => c.type === "missed");
      await writeKey("fritz", missedCalls);

      res.status(200).json({ key: "fritz", items: missedCalls.slice(0, 10) });
    } catch (e: any) {
      res.status(200).json({ key: "fritz", items: {} });
    }
  } //this is a cache hit
  else {
    //console.log("Used cache for phone data");
    res.status(200).json({
      key: "fritz",
      items: JSON.parse(cachedData.data.payload).slice(0, 10),
    });
  }
}
