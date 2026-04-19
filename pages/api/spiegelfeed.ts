import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";
import { readKey, writeKey, safeParsePayload } from "../../utils/dbutils";

const url = process.env.NEWS_RSS_FEED as string;
const NEWS_CACHE_SECONDS = process.env.NEWS_CACHE_SECONDS as string;

const parser: Parser<any> = new Parser({});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("news");
  const cacheSeconds = cachedData.age;
  try {
    if (isNaN(cacheSeconds) || cacheSeconds > parseInt(NEWS_CACHE_SECONDS)) {
      console.log("Refreshing Cache for News");
      const feed = await parser.parseURL(url);
      const titles: string[] = feed.items.map((item: any) => item.title);
      await writeKey("news", titles as any);
      res.status(200).json({ key: "news", items: titles });
    } else {
      res.status(200).json({
        key: "news",
        items: safeParsePayload<string[]>(cachedData.data.payload, []),
      });
    }
  } catch (e: any) {
    console.warn("Cache refresh for news went wrong:", e.message);
    res.status(200).json({
      key: "news",
      items: safeParsePayload<string[]>(cachedData.data.payload, []),
    });
  }
}
