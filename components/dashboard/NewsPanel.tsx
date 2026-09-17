import { Newspaper } from "lucide-react";
import Panel from "./Panel";
import type { CacheEntry } from "@/lib/cache/types";
import type { NewsData } from "@/lib/sources/news";

export default function NewsPanel({ entry }: { entry?: CacheEntry<NewsData> }) {
  const titles = entry?.data?.titles ?? [];
  return (
    <Panel icon={Newspaper} title="Spiegel Online" stale={entry?.stale}>
      {titles.length === 0 ? (
        <p className="text-lg text-(--color-fg-muted)">Keine Nachrichten</p>
      ) : (
        <ul className="space-y-1.5">
          {titles.slice(0, 6).map((title, i) => (
            <li key={i} className="text-lg font-semibold leading-snug">
              {title}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
