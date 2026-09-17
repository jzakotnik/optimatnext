import { WifiOff } from "lucide-react";

type StatusBarProps = {
  connected: boolean;
  offlineSinceLabel?: string | null;
  lastUpdatedLabel: string;
};

export default function StatusBar({
  connected,
  offlineSinceLabel,
  lastUpdatedLabel,
}: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-1 text-sm text-(--color-fg-muted)">
      <span>Stand: {lastUpdatedLabel}</span>
      {!connected && (
        <span className="flex items-center gap-1.5 font-semibold text-(--color-bad)">
          <WifiOff className="size-4" />
          Keine Verbindung
          {offlineSinceLabel ? ` seit ${offlineSinceLabel}` : ""}
        </span>
      )}
    </div>
  );
}
