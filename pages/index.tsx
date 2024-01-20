import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid } from "@mui/material";
import TrafficCard from "@/components/TrafficCard";
import CO2SignalCard from "@/components/CO2SignalCard";
import NewsCard from "@/components/NewsCard";
import PhoneCard from "@/components/PhoneCard";
import CalendarCard from "@/components/CalendarCard";
import FuelCard from "@/components/FuelCard";
import WeatherCard from "@/components/WeatherCard";
import TibberCard from "@/components/TibberCard";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

type IndexPageProps = {
  traffic: any;
  co2: any;
  news: any;
  phone: any;
  calendar: any;
  fuel: any;
  weather: any;
  tibber: any;
};

export default function Home({
  traffic,
  co2,
  news,
  phone,
  calendar,
  fuel,
  weather,
  tibber,
}: IndexPageProps) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const data = null;
  //no caching for SWR, hence random string
  /* const { data, error, isLoading } = useSWR(
    "allAPIs" + Math.floor(Date.now() / 1000).toString(),
    fetcher,
    {
      refreshInterval: parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL!),
      refreshWhenHidden: true,
    }
  );*/
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };
  /*console.log(
    "SWR Data",
    api,
    data,
    error,
    isLoading,
    parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL!)
  );*/
  /*const updatedTraffic = data?.data.traffic;
  const updatedCo2 = data?.data.co2;
  const updatedNews = data?.data.news;
  const updatedPhone = data?.data.phone;
  const updatedCalendar = data?.data.calendar;
  const updatedFuel = data?.data.fuel;
  const updatedWeather = data?.data.weather;
  const updatedTibber = data?.data.tibber;
*/
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="stretch"
      >
        <Grid
          container
          item
          direction="row"
          justifyContent="space-around"
          alignItems="stretch"
        >
          <Grid item sx={{ m: 1 }}>
            <TrafficCard traffic={traffic} />
          </Grid>
          <Grid item sx={{ m: 1 }}>
            <CO2SignalCard co2={co2} />
          </Grid>
          <Grid item sx={{ m: 1 }}>
            <WeatherCard weather={weather} />
          </Grid>
          <Grid item sx={{ m: 1 }}>
            <TibberCard tibber={tibber} />
          </Grid>
          <Grid item sx={{ m: 1 }}>
            <FuelCard fuel={fuel} />
          </Grid>
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item sx={{ m: 1 }}>
            <NewsCard news={news} />
          </Grid>
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item sx={{ m: 1 }}>
            <PhoneCard phone={phone} />
          </Grid>
          <Grid item sx={{ m: 1 }}>
            <CalendarCard calendar={calendar} />
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export const getServerSideProps = async () => {
  const trafficresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/traffic"
  );
  const traffic = await trafficresponse.json();

  const co2response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/co2signal"
  );
  const co2 = await co2response.json();

  const newsresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/spiegelfeed"
  );
  const news = await newsresponse.json();

  const phoneresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/fritz"
  );
  const phone = await phoneresponse.json();
  //console.log("Got phone", phone);

  const calendarresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/calendar"
  );
  const calendar = await calendarresponse.json();

  const fuelresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/fuel"
  );
  const fuel = await fuelresponse.json();

  const weatherresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/weather"
  );
  const weather = await weatherresponse.json();

  const tibberresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/tibber"
  );
  const tibber = await tibberresponse.json();

  // Pass data to the page via props
  return {
    props: { traffic, co2, news, phone, calendar, fuel, weather, tibber },
  };
};
