import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";

type WeatherCardProps = {
  weather: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function WeatherCard({ weather }: WeatherCardProps) {
  const theme = useTheme();
  console.log("Rendering weather", weather);
  let temperature = 0;
  try {
    temperature = parseInt(weather.items);
  } catch (e: any) {
    console.log("Something went wrong with the weather", e.toString());
  }
  return (
    <Card
      elevation={1}
      sx={{
        border: "1px solid",
        borderRadius: 2,
        borderColor: "#FFFFFF",
        "& pre": {
          m: 0,
          p: "16px !important",
          fontFamily: theme.typography.fontFamily,
          fontSize: "0.75rem",
        },
      }}
    >
      <CardHeader
        title={
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {temperature + " °C"}
          </Typography>
        }
        avatar={
          <Avatar sx={{ bgcolor: "#FFAAAA" }} aria-label="icon">
            <ThermostatIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Temperatur
        </Typography>
      </CardContent>
    </Card>
  );
}
