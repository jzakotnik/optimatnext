// pages/api/mastodon.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readKey,
  writeKey,
  safeParsePayload,
  assertJsonResponse,
} from "../../utils/dbutils";

const MASTODON_INSTANCE = process.env.MASTODON_INSTANCE ?? "mastodon.social";
const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN as string;
const CACHE_TTL_SECONDS = Number(process.env.MASTODON_CACHE_TTL_SECONDS ?? 300);

interface MastodonPost {
  id: string;
  content: string;
  created_at: string;
  url: string;
  account: string; // who posted it — useful now that it's not just your own posts
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (!MASTODON_ACCESS_TOKEN) {
      throw new Error("MASTODON_ACCESS_TOKEN env var is not set");
    }

    const cached = await readKey("mastodon");
    const cachedPosts = safeParsePayload<MastodonPost[] | null>(
      cached.data.payload,
      null,
    );

    if (cachedPosts && cached.age < CACHE_TTL_SECONDS) {
      return res.status(200).json(cachedPosts);
    }

    const response = await fetch(
      `https://${MASTODON_INSTANCE}/api/v1/timelines/home?limit=5`,
      {
        headers: {
          Authorization: `Bearer ${MASTODON_ACCESS_TOKEN}`,
        },
      },
    );

    await assertJsonResponse(response, "Mastodon");

    const statuses = await response.json();

    const simplified: MastodonPost[] = statuses.map((s: any) => {
      const original = s.reblog ?? s; // unwrap boosts
      return {
        id: s.id,
        content: original.content,
        created_at: s.created_at,
        url: original.url,
        account:
          original.account?.display_name ?? original.account?.username ?? "",
      };
    });

    await writeKey("mastodon", simplified as any);

    return res.status(200).json(simplified);
  } catch (err) {
    console.error("Mastodon fetch failed:", err);
    const cached = await readKey("mastodon");
    const fallback = safeParsePayload<MastodonPost[] | null>(
      cached.data.payload,
      null,
    );
    return res.status(200).json(fallback);
  }
}
