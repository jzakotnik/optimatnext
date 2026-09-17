import { CalendarDays } from "lucide-react";
import Panel from "./Panel";
import { formatDateTime, formatDay } from "@/lib/date";
import type { CacheEntry } from "@/lib/cache/types";
import type { CalendarEvent } from "@/lib/sources/calendar";

export default function CalendarPanel({
  entry,
}: {
  entry?: CacheEntry<CalendarEvent[]>;
}) {
  const events = entry?.data ?? [];
  return (
    <Panel
      icon={CalendarDays}
      title="Kalender"
      stale={entry?.stale}
      className="w-72 shrink-0"
    >
      {events.length === 0 ? (
        <p className="text-lg text-(--color-fg-muted)">Keine Termine</p>
      ) : (
        <ul className="space-y-1.5">
          {events.slice(0, 5).map((e, i) => (
            <li key={i} className="text-lg font-semibold leading-snug">
              {e.dateTime
                ? formatDateTime(e.dateTime)
                : e.date
                  ? formatDay(e.date)
                  : "–"}
              {", "}
              {e.summary}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
