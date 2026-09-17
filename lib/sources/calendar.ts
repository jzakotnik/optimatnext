import { google } from "googleapis";
import { withTimeout } from "@/lib/withTimeout";

export interface CalendarEvent {
  summary: string;
  /** ISO datetime for timed events */
  dateTime: string | null;
  /** YYYY-MM-DD for all-day events */
  date: string | null;
}

export async function fetchCalendar(): Promise<CalendarEvent[]> {
  const base64Credentials = process.env.GOOGLE_CREDENTIALSBASE64;
  const calendarId = process.env.GOOGLECALENDAR_ID;
  const scope = process.env.GOOGLECALENDAR_URL;
  if (!base64Credentials || !calendarId || !scope) {
    throw new Error("Calendar env vars not configured");
  }

  const credentials = JSON.parse(
    Buffer.from(base64Credentials, "base64").toString(),
  );
  const auth = new google.auth.GoogleAuth({ credentials, scopes: [scope] });
  const calendar = google.calendar({ version: "v3", auth });

  const { data } = await withTimeout(
    calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    }),
    10000,
    "Google Calendar",
  );

  return (data.items ?? []).map((item) => ({
    summary: item.summary ?? "",
    dateTime: item.start?.dateTime ?? null,
    date: item.start?.date ?? null,
  }));
}
