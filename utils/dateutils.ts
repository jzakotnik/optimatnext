import dayjs from "dayjs";
import "dayjs/locale/de";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const TIMEZONE = "Europe/Berlin";
dayjs.extend(utc);
//dayjs.extend(timezone);

export function convertDateString(date: string) {
  const d = dayjs(date).format("DD.MM. HH:mm");
  return d;
}
