import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";
import { readKey, writeKey } from "../../utils/dbutils";

const url = process.env.NEWS_RSS_FEED as string;
const NEWS_CACHE_SECONDS = process.env.NEWS_CACHE_SECONDS as string;

const parser: Parser<any> = new Parser({});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("news");
  //console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;
  try {
    if (isNaN(cacheSeconds) || cacheSeconds > parseInt(NEWS_CACHE_SECONDS)) {
      console.log("Refreshing Cache for News");
      const feed = await parser.parseURL(url);
      //console.log(feed.title);
      const titles: string[] = [];

      feed.items.forEach((item: any) => {
        //console.log(item.title);
        titles.push(item.title);
      });
      await writeKey("news", titles as any);

      res.status(200).json({ key: "news", items: titles });
    } else {
      //console.log("Used cache for news");
      res.status(200).json({
        key: "news",
        items: JSON.parse(cachedData.data.payload),
      });
    }
  } catch (e: any) {
    console.warn("Cache refresh for news went wrong", e);
    res.status(200).json({
      key: "news",
      items: JSON.parse(cachedData.data.payload),
    });
  }
}
