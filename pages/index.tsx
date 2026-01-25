import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid"; // MUI v7 uses Grid2 as the default Grid
import TrafficCard from "@/components/TrafficCard";
import ElectricityMapsCard from "@/components/ElectricityMapsCard";
import NewsCard from "@/components/NewsCard";
import PhoneCard from "@/components/PhoneCard";
import CalendarCard from "@/components/CalendarCard";
import FuelCard from "@/components/FuelCard";
import WeatherCard from "@/components/WeatherCard";
import TibberCard from "@/components/TibberCard";
import EnergyCard from "@/components/EnergyCard";
import { useEffect, useState, useCallback } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Define types for API responses
interface EnergyData {
  energy: {
    data: {
      ppv: number;
      pgrid: number;
      soc: number;
    };
  };
}

interface ElectricityMapsData {
  items?: {
    zone: string;
    carbonIntensity: number;
    datetime: string;
    updatedAt: string;
    isEstimated: boolean;
    countryCode: string;
  };
}

interface DashboardState {
  traffic: Record<string, unknown> | null;
  electricitymaps: ElectricityMapsData | null;
  news: Record<string, unknown> | null;
  phone: Record<string, unknown> | null;
  calendar: Record<string, unknown> | null;
  fuel: Record<string, unknown> | null;
  weather: Record<string, unknown> | null;
  tibber: Record<string, unknown> | null;
  energy: EnergyData | null;
  lastUpdate: string;
}

interface IndexPageProps {
  traffic: Record<string, unknown> | null;
  electricitymaps: ElectricityMapsData | null;
  news: Record<string, unknown> | null;
  phone: Record<string, unknown> | null;
  calendar: Record<string, unknown> | null;
  fuel: Record<string, unknown> | null;
  weather: Record<string, unknown> | null;
  tibber: Record<string, unknown> | null;
  energy: EnergyData | null;
  lastUpdate: string;
}

export default function Home({
  traffic,
  electricitymaps,
  news,
  phone,
  calendar,
  fuel,
  weather,
  tibber,
  energy,
  lastUpdate,
}: IndexPageProps) {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    traffic,
    electricitymaps,
    news,
    phone,
    calendar,
    fuel,
    weather,
    tibber,
    energy,
    lastUpdate,
  });

  const refreshAPI = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const [
        trafficRes,
        electricitymapsRes,
        newsRes,
        phoneRes,
        calendarRes,
        fuelRes,
        weatherRes,
        tibberRes,
        energyRes,
      ] = await Promise.all([
        fetch(`${apiUrl}/api/traffic`),
        fetch(`${apiUrl}/api/electricitymaps`),
        fetch(`${apiUrl}/api/spiegelfeed`),
        fetch(`${apiUrl}/api/fritz`),
        fetch(`${apiUrl}/api/calendar`),
        fetch(`${apiUrl}/api/fuel`),
        fetch(`${apiUrl}/api/weather`),
        fetch(`${apiUrl}/api/tibber`),
        fetch(`${apiUrl}/api/alphaess`),
      ]);

      const [
        trafficData,
        electricitymapsData,
        newsData,
        phoneData,
        calendarData,
        fuelData,
        weatherData,
        tibberData,
        energyData,
      ] = await Promise.all([
        trafficRes.json(),
        electricitymapsRes.json(),
        newsRes.json(),
        phoneRes.json(),
        calendarRes.json(),
        fuelRes.json(),
        weatherRes.json(),
        tibberRes.json(),
        energyRes.json(),
      ]);

      setDashboardState({
        traffic: trafficData,
        electricitymaps: electricitymapsData,
        news: newsData,
        phone: phoneData,
        calendar: calendarData,
        fuel: fuelData,
        weather: weatherData,
        tibber: tibberData,
        energy: energyData,
        lastUpdate: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setDashboardState((prev) => ({
        ...prev,
        lastUpdate: `${new Date().toLocaleTimeString()} - API Fehler`,
      }));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshAPI, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [refreshAPI]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* Main container - vertical stack */}
      <Grid container direction="column" spacing={0.5} sx={{ p: 1 }}>
        {/* Top row - info cards */}
        <Grid
          container
          spacing={1}
          justifyContent="space-around"
          alignItems="stretch"
        >
          <Grid>
            <TrafficCard traffic={dashboardState.traffic} />
          </Grid>
          <Grid>
            <ElectricityMapsCard data={dashboardState.electricitymaps} />
          </Grid>
          <Grid>
            <EnergyCard energy={dashboardState.energy} />
          </Grid>
          <Grid>
            <WeatherCard weather={dashboardState.weather} />
          </Grid>
          <Grid>
            <TibberCard tibber={dashboardState.tibber} />
          </Grid>
          <Grid>
            <FuelCard fuel={dashboardState.fuel} />
          </Grid>
        </Grid>

        {/* Middle row - news */}
        <Grid
          container
          spacing={1}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid size={12}>
            <NewsCard
              news={dashboardState.news}
              lastUpdate={dashboardState.lastUpdate}
            />
          </Grid>
        </Grid>

        {/* Bottom row - phone and calendar */}
        <Grid
          container
          spacing={1}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid>
            <PhoneCard phone={dashboardState.phone} />
          </Grid>
          <Grid>
            <CalendarCard calendar={dashboardState.calendar} />
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export const getServerSideProps = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const [
      trafficRes,
      electricitymapsRes,
      newsRes,
      phoneRes,
      calendarRes,
      fuelRes,
      weatherRes,
      tibberRes,
      energyRes,
    ] = await Promise.all([
      fetch(`${apiUrl}/api/traffic`),
      fetch(`${apiUrl}/api/electricitymaps`),
      fetch(`${apiUrl}/api/spiegelfeed`),
      fetch(`${apiUrl}/api/fritz`),
      fetch(`${apiUrl}/api/calendar`),
      fetch(`${apiUrl}/api/fuel`),
      fetch(`${apiUrl}/api/weather`),
      fetch(`${apiUrl}/api/tibber`),
      fetch(`${apiUrl}/api/alphaess`),
    ]);

    const [
      traffic,
      electricitymaps,
      news,
      phone,
      calendar,
      fuel,
      weather,
      tibber,
      energy,
    ] = await Promise.all([
      trafficRes.json(),
      electricitymapsRes.json(),
      newsRes.json(),
      phoneRes.json(),
      calendarRes.json(),
      fuelRes.json(),
      weatherRes.json(),
      tibberRes.json(),
      energyRes.json(),
    ]);

    return {
      props: {
        traffic,
        electricitymaps,
        news,
        phone,
        calendar,
        fuel,
        weather,
        tibber,
        energy,
        lastUpdate: new Date().toLocaleTimeString(),
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    // Return empty/default props on error
    return {
      props: {
        traffic: null,
        electricitymaps: null,
        news: null,
        phone: null,
        calendar: null,
        fuel: null,
        weather: null,
        tibber: null,
        energy: null,
        lastUpdate: `${new Date().toLocaleTimeString()} - Initial load error`,
      },
    };
  }
};
