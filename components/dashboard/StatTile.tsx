import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/tone";
import { toneTextClass } from "@/lib/tone";

type StatTileProps = {
  icon: LucideIcon;
  /** Primary value, e.g. "18°C" — shown large. */
  value: string;
  /** What the value is, e.g. "Temperatur" — shown small below. */
  label: string;
  /** Optional second line, e.g. price range. */
  detail?: string;
  tone?: Tone;
  stale?: boolean;
  noData?: boolean;
};

export default function StatTile({
  icon: Icon,
  value,
  label,
  detail,
  tone = "warn",
  stale = false,
  noData = false,
}: StatTileProps) {
  return (
    <Card className="min-w-0 flex-1 gap-1 py-3">
      <div className="flex items-center gap-2 px-3">
        <Icon
          className={cn(
            "size-6 shrink-0",
            noData ? "text-(--color-fg-muted)" : toneTextClass[tone],
          )}
          strokeWidth={2.25}
        />
        <span
          className={cn(
            "truncate text-2xl font-bold tabular-nums",
            noData && "text-(--color-fg-muted)",
          )}
        >
          {noData ? "–" : value}
        </span>
        {stale && (
          <span
            title="Veraltete Daten"
            className="ml-auto size-2 shrink-0 rounded-full bg-(--color-warn)"
          />
        )}
      </div>
      <div className="px-3 text-sm font-medium text-(--color-fg-muted)">
        {label}
        {detail ? <span className="block">{detail}</span> : null}
      </div>
    </Card>
  );
}
