export type Tone = "good" | "warn" | "bad";

/**
 * Buckets a value into good/warn/bad relative to a [low, high] band.
 * `inverted` flips which side counts as good (e.g. low grid draw is good,
 * but low battery charge is bad).
 */
export function toneForRange(
  value: number,
  low: number,
  high: number,
  inverted = false,
): Tone {
  if (value < low) return inverted ? "bad" : "good";
  if (value > high) return inverted ? "good" : "bad";
  return "warn";
}

export const toneTextClass: Record<Tone, string> = {
  good: "text-(--color-good)",
  warn: "text-(--color-warn)",
  bad: "text-(--color-bad)",
};

export const toneBgClass: Record<Tone, string> = {
  good: "bg-(--color-good)/15 text-(--color-good)",
  warn: "bg-(--color-warn)/15 text-(--color-warn)",
  bad: "bg-(--color-bad)/15 text-(--color-bad)",
};
