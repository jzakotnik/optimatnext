import Parser from "rss-parser";
import { withTimeout } from "@/lib/withTimeout";

const parser: Parser = new Parser();

export interface NewsData {
  titles: string[];
}

export async function fetchNews(): Promise<NewsData> {
  const url = process.env.NEWS_RSS_FEED;
  if (!url) {
    throw new Error("NEWS_RSS_FEED not configured");
  }

  const feed = await withTimeout(parser.parseURL(url), 10000, "Spiegel RSS");
  const titles = (feed.items ?? [])
    .map((item) => item.title ?? "")
    .filter(Boolean);
  return { titles };
}
