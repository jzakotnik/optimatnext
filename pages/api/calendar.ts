import type { NextApiRequest, NextApiResponse } from "next";

import { google } from "googleapis";
import { readKey, writeKey } from "../../utils/dbutils";
import { nowDate } from "@/utils/dateutils";

const SCOPES = [process.env.GOOGLECALENDAR_URL as string];
const base64credentials = process.env.GOOGLE_CREDENTIALSBASE64 as string;
const calendarID = process.env.GOOGLECALENDAR_ID as string;
const CALENDAR_CACHE_SECONDS = process.env
  .GOOGLECALENDAR_CACHE_SECONDS as string;

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

  const today = new Date();
  const entries = await calendar.events.list({
    calendarId: calendarID,
    timeMin: nowDate(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  entries.data.items!.map((a) => {
    console.log("Calendar DEBUG", a.summary, a.start);
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
  //console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;
  try {
    if (
      isNaN(cacheSeconds) ||
      cacheSeconds > parseInt(CALENDAR_CACHE_SECONDS)
    ) {
      console.log("Refreshing Cache for Calendar");
      const events = await listEvents();

      await writeKey("calendar", events as any);
      res.status(200).json({ key: "calendar", items: events });
    } else {
      //console.log("Used cache for Calendar");
      res.status(200).json({
        key: "calendar",
        items: JSON.parse(cachedData.data.payload),
      });
    }
  } catch (e: any) {
    console.log("ERROR getting calendar data");
    res.status(200).json({
      key: "calendar",
      items: JSON.parse(cachedData.data.payload),
    });
  }
}
