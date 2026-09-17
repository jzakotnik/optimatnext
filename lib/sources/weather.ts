import { fetchJson } from "@/lib/http";

export interface WeatherData {
  temperatureC: number;
}

interface OpenWeatherResponse {
  main: { temp: number };
}

export async function fetchWeather(): Promise<WeatherData> {
  const url = process.env.OPENWEATHER_URL;
  const apikey = process.env.OPENWEATHER_APIKEY;
  const location = process.env.OPENWEATHER_LOCATIONID;
  if (!url || !apikey || !location) {
    throw new Error("Weather env vars not configured");
  }

  const requestUrl = `${url}?id=${location}&APPID=${apikey}&units=metric`;
  const data = await fetchJson<OpenWeatherResponse>(
    requestUrl,
    {},
    "OpenWeather",
  );
  if (typeof data.main?.temp !== "number") {
    throw new Error("OpenWeather response missing main.temp");
  }
  return { temperatureC: Math.round(data.main.temp) };
}
