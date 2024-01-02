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
        sx={headerSX}
        titleTypographyProps={{ variant: "subtitle1" }}
        title={parseInt(weather.items) + " °C"}
        avatar={
          <Avatar sx={{ bgcolor: "#FFAAAA" }} aria-label="icon">
            <ThermostatIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="caption">Temperatur</Typography>
      </CardContent>
    </Card>
  );
}
