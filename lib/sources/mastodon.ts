import { fetchJson } from "@/lib/http";

export interface MastodonPost {
  id: string;
  content: string;
  created_at: string;
  url: string;
  account: string;
}

interface MastodonStatus {
  id: string;
  content: string;
  created_at: string;
  url: string;
  account?: { display_name?: string; username?: string };
  reblog?: MastodonStatus;
}

export async function fetchMastodon(): Promise<MastodonPost[]> {
  const instance = process.env.MASTODON_INSTANCE ?? "mastodon.social";
  const token = process.env.MASTODON_ACCESS_TOKEN;
  if (!token) {
    throw new Error("MASTODON_ACCESS_TOKEN not configured");
  }

  const statuses = await fetchJson<MastodonStatus[]>(
    `https://${instance}/api/v1/timelines/home?limit=5`,
    { headers: { Authorization: `Bearer ${token}` } },
    "Mastodon",
  );

  return statuses.map((s) => {
    const original = s.reblog ?? s; // unwrap boosts
    return {
      id: s.id,
      content: original.content,
      created_at: original.created_at,
      url: original.url,
      account:
        original.account?.display_name ?? original.account?.username ?? "",
    };
  });
}
