import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, Typography } from "@mui/material";
import TrafficCard from "@/components/TrafficCard";
import CO2SignalCard from "@/components/CO2SignalCard";
import NewsCard from "@/components/NewsCard";
import PhoneCard from "@/components/PhoneCard";
import CalendarCard from "@/components/CalendarCard";
import FuelCard from "@/components/FuelCard";
import WeatherCard from "@/components/WeatherCard";
import TibberCard from "@/components/TibberCard";

import EnergyCard from "@/components/EnergyCard";
import { useEffect, useState } from "react";

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
  energy: any;
  lastUpdate: any;
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
  energy,
  lastUpdate,
}: IndexPageProps) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const data = null;
  const [dashboardState, setDashboardState] = useState({
    traffic: traffic,
    co2: co2,
    news: news,
    phone: phone,
    calendar: calendar,
    fuel: fuel,
    weather: weather,
    tibber: tibber,
    energy: energy,
    lastUpdate: lastUpdate,
  });

  useEffect(() => {
    const refreshAPI = async () => {
      try {
        const traffic = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/traffic"
        ).then((res) => res.json());

        const co2 = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/co2signal"
        ).then((res) => res.json());

        const news = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/spiegelfeed"
        ).then((res) => res.json());

        const phone = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/fritz"
        ).then((res) => res.json());

        const calendar = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/calendar"
        ).then((res) => res.json());

        const fuel = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/fuel"
        ).then((res) => res.json());

        const weather = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/weather"
        ).then((res) => res.json());

        const tibber = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/tibber"
        ).then((res) => res.json());

        const energy = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/alphaess"
        ).then((res) => res.json());

        // Pass data to the page via props

        const lastUpdate = new Date().toLocaleTimeString();

        setDashboardState({
          traffic: traffic,
          co2: co2,
          news: news,
          phone: phone,
          calendar: calendar,
          fuel: fuel,
          weather: weather,
          tibber: tibber,
          energy: energy,
          lastUpdate: lastUpdate,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setDashboardState({
          ...dashboardState,
          lastUpdate: lastUpdate + " - API Fehler",
        });
      }
    };

    console.log("Energy Index", energy);

    const interval = setInterval(refreshAPI, 5000); // 30000 milliseconds = 30 seconds
  }, []);

  // Cleanup the interval on component unmount

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="stretch"
      >
        {" "}
        <Grid
          container
          item
          direction="row"
          justifyContent="space-around"
          alignItems="stretch"
        >
          <Grid item sx={{ mx: 1, my: 0.2 }}>
            <TrafficCard traffic={dashboardState.traffic} />
          </Grid>
          <Grid item sx={{ mx: 1, my: 0.2 }}>
            <CO2SignalCard co2={dashboardState.co2} />
          </Grid>
          <Grid item sx={{ mx: 1, my: 0.2 }}>
            <EnergyCard energy={dashboardState.energy} />
          </Grid>
          <Grid item sx={{ mx: 1, my: 0.2 }}>
            <WeatherCard weather={dashboardState.weather} />
          </Grid>
          <Grid item sx={{ mx: 1, my: 0.2 }}>
            <TibberCard tibber={dashboardState.tibber} />
          </Grid>
          <Grid item sx={{ mx: 1 }}>
            <FuelCard fuel={dashboardState.fuel} />
          </Grid>
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item sx={{ m: 1, my: 0.2, width: "100%" }}>
            <NewsCard
              news={dashboardState.news}
              lastUpdate={dashboardState.lastUpdate}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item sx={{ mx: 1, my: 0.2 }}>
            <PhoneCard phone={dashboardState.phone} />
          </Grid>
          <Grid item sx={{ mx: 1, my: 0.2 }}>
            <CalendarCard calendar={dashboardState.calendar} />
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

  const energyresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/alphaess"
  );
  const energy = await energyresponse.json();
  console.log("Energy api", energy);
  const lastUpdate = new Date().toLocaleTimeString();

  // Pass data to the page via props
  return {
    props: {
      traffic,
      co2,
      news,
      phone,
      calendar,
      fuel,
      weather,
      tibber,
      energy,
      lastUpdate,
    },
  };
};
