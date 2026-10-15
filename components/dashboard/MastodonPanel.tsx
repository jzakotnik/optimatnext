import { AtSign } from "lucide-react";
import Panel from "./Panel";
import type { CacheEntry } from "@/lib/cache/types";
import type { MastodonPost } from "@/lib/sources/mastodon";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function MastodonPanel({
  entry,
}: {
  entry?: CacheEntry<MastodonPost[]>;
}) {
  const posts = entry?.data ?? [];
  return (
    <Panel
      icon={AtSign}
      title="Mastodon"
      stale={entry?.stale}
      className="min-w-0 flex-1"
    >
      {posts.length === 0 ? (
        <p className="text-2xl text-(--color-fg-muted)">Keine Beiträge</p>
      ) : (
        <ul className="space-y-1.5">
          {posts.slice(0, 3).map((p) => (
            <li
              key={p.id}
              className="line-clamp-2 text-2xl font-semibold leading-snug"
            >
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-(--color-accent)"
              >
                {stripHtml(p.content)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
