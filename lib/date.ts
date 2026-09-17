import dayjs from "dayjs";

export function formatDateTime(iso: string): string {
  return dayjs(iso).format("DD.MM. HH:mm");
}

export function formatDay(isoDate: string): string {
  return dayjs(isoDate).format("DD.MM.");
}

export function formatClock(date: Date = new Date()): string {
  return dayjs(date).format("HH:mm:ss");
}
