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
      className="flex-1"
    >
      {posts.length === 0 ? (
        <p className="text-lg text-(--color-fg-muted)">Keine Beiträge</p>
      ) : (
        <ul className="space-y-1.5">
          {posts.slice(0, 5).map((p) => (
            <li key={p.id} className="text-lg font-semibold leading-snug">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-(--color-accent)"
              >
                {stripHtml(p.content).slice(0, 90)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
