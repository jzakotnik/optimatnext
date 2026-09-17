import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PanelProps = {
  icon: LucideIcon;
  title: string;
  stale?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Panel({
  icon: Icon,
  title,
  stale,
  className,
  children,
}: PanelProps) {
  return (
    <Card className={cn("min-h-0", className)}>
      <CardHeader>
        <Icon className="size-6 text-(--color-accent)" strokeWidth={2.25} />
        <CardTitle className="flex-1 truncate">{title}</CardTitle>
        {stale && (
          <span
            title="Veraltete Daten"
            className="size-2 shrink-0 rounded-full bg-(--color-warn)"
          />
        )}
      </CardHeader>
      <CardContent className="min-h-0 overflow-auto">{children}</CardContent>
    </Card>
  );
}
