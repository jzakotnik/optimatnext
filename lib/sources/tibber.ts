import { fetchJson } from "@/lib/http";

export interface TibberData {
  currentCt: number;
  todayLow: number;
  todayHigh: number;
  tomorrowLow: number;
  tomorrowHigh: number;
}

const QUERY = `{
  viewer {
    homes {
      currentSubscription {
        priceInfo {
          current { total }
          today { total }
          tomorrow { total }
        }
      }
    }
  }
}`;

interface TibberResponse {
  data?: {
    viewer?: {
      homes?: {
        currentSubscription?: {
          priceInfo?: {
            current?: { total: number };
            today?: { total: number }[];
            tomorrow?: { total: number }[];
          };
        };
      }[];
    };
  };
}

export async function fetchTibber(): Promise<TibberData> {
  const apikey = process.env.TIBBER_KEY;
  const url = process.env.TIBBER_URL;
  if (!apikey || !url) {
    throw new Error("Tibber env vars not configured");
  }

  const response = await fetchJson<TibberResponse>(
    url,
    {
      method: "POST",
      body: JSON.stringify({ query: QUERY }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
      },
    },
    "Tibber",
  );

  const priceInfo =
    response.data?.viewer?.homes?.[0]?.currentSubscription?.priceInfo;
  if (!priceInfo?.current) {
    throw new Error("Tibber response missing priceInfo");
  }

  const toCt = (total: number) => Math.round(total * 100);
  const today = (priceInfo.today ?? []).map((p) => toCt(p.total));
  const tomorrow = (priceInfo.tomorrow ?? []).map((p) => toCt(p.total));

  return {
    currentCt: toCt(priceInfo.current.total),
    todayLow: today.length ? Math.min(...today) : 0,
    todayHigh: today.length ? Math.max(...today) : 0,
    tomorrowLow: tomorrow.length ? Math.min(...tomorrow) : 0,
    tomorrowHigh: tomorrow.length ? Math.max(...tomorrow) : 0,
  };
}
