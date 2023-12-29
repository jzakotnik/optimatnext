import type { NextApiRequest, NextApiResponse } from "next";

import { google } from "googleapis";
import { readKey, writeKey } from "../../utils/dbutils";

const SCOPES = [process.env.GOOGLECALENDAR_URL as string];
const base64credentials = process.env.GOOGLE_CREDENTIALSBASE64 as string;
const calendarID = process.env.GOOGLECALENDAR_ID as string;
const CALENDAR_CACHE_SECONDS = process.env.CALENDAR_CACHE_SECONDS as string;

async function listEvents() {
  const googleCredential = JSON.parse(
    Buffer.from(base64credentials, "base64").toString()
  );

  const auth = new google.auth.GoogleAuth({
    credentials: googleCredential,
    scopes: SCOPES,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: auth,
  });

  const entries = await calendar.events.list({
    calendarId: calendarID,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  const filteredEntries = entries.data.items!.map((a) => {
    return { summary: a.summary, startTime: a.start };
  });
  return filteredEntries;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = await readKey("calendar");
  console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(CALENDAR_CACHE_SECONDS)) {
    const events = await listEvents();

    await writeKey("calendar", events as any);
    res.status(200).json({ key: "calendar", items: events });
  } else {
    console.log("Used cache");
    res.status(200).json({
      key: "Kalender",
      items: JSON.parse(cachedData.data.payload),
    });
  }
}
