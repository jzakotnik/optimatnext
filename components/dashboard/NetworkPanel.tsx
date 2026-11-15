import { Wifi } from "lucide-react";
import Panel from "./Panel";
import { formatDateTime } from "@/lib/date";
import type { CacheEntry } from "@/lib/cache/types";
import type { UnifiData } from "@/lib/sources/unifi";

export default function NetworkPanel({
  entry,
}: {
  entry?: CacheEntry<UnifiData>;
}) {
  const d = entry?.data;
  if (!d) {
    return (
      <Panel
        icon={Wifi}
        title="Netzwerk"
        stale={entry?.stale}
        className="min-w-0 flex-1 overflow-hidden"
      >
        <p className="text-2xl text-(--color-fg-muted)">Keine Daten</p>
      </Panel>
    );
  }

  const unknownNow = d.unknownClients.length;
  const poorNow = d.poorActive.length;
  const ok = unknownNow === 0 && poorNow === 0;

  return (
    <Panel
      icon={Wifi}
      title={`Netzwerk · ${d.clientsOnline} Geräte`}
      stale={entry?.stale}
      className="min-w-0 flex-1 overflow-hidden"
    >
      <ul className="space-y-1 text-2xl font-semibold leading-snug">
        <li
          className={
            ok ? "text-(--color-good)" : poorNow ? "text-(--color-warn)" : ""
          }
        >
          {ok
            ? "Alles in Ordnung"
            : poorNow
              ? `${poorNow} Gerät(e) mit schwachem WLAN`
              : "Neue unbekannte Geräte"}
        </li>
        {d.unknownClients.map((u) => (
          <li key={u.mac} className="truncate text-(--color-bad)">
            Unbekannt: {u.name} ({u.mac.slice(-8)}) · {formatDateTime(new Date(u.firstSeen).toISOString())}
          </li>
        ))}
        {d.poorSignals.map((p) => (
          <li
            key={`${p.mac}-${p.at}`}
            className="truncate text-(--color-fg-muted)"
          >
            {formatDateTime(new Date(p.at).toISOString())} {p.name} {p.signal} dBm
          </li>
        ))}
      </ul>
    </Panel>
  );
}
