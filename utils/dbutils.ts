import { JSONFilePreset } from "lowdb/node";

import dayjs from "dayjs";
import "dayjs/locale/de";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const TIMEZONE = "Europe/Berlin";
dayjs.extend(utc);
//dayjs.extend(timezone);

interface cacheItem {
  data: {
    lastUpdate: string;
    payload: string;
  };
}

export async function writeKey(key: string = "health", cacheEntry: cacheItem) {
  const nowTime = dayjs();
  const db = await JSONFilePreset<cacheItem>("cachedb/" + key + ".json", {
    data: { lastUpdate: "", payload: "" },
  });
  db.data = {
    data: {
      lastUpdate: nowTime.toString(),
      payload: JSON.stringify(cacheEntry),
    },
  };

  await db.write();
}
export async function readKey(key: string = "health") {
  const db = await JSONFilePreset<cacheItem>("cachedb/" + key + ".json", {
    data: { lastUpdate: "now", payload: "init" },
  });
  //console.log("Database", db);
  const cachedData = await db.data.data;
  //console.log("Reading cache: ", cachedData);
  const nowTime = dayjs();
  const cacheTime = dayjs(cachedData.lastUpdate);
  const age = nowTime.diff(cacheTime, "second");
  return { data: cachedData, age: age };
}
