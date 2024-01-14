import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

type TibberCardProps = {
  tibber: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function TibberCard({ tibber }: TibberCardProps) {
  const theme = useTheme();
  let currentPrice = 0;
  let todayLow = 0;
  let todayHigh = 0;
  let tomorrowHigh = 0;
  let tomorrowLow = 0;

  try {
    currentPrice = Math.floor(
      parseFloat(
        tibber.items.data.viewer.homes[0].currentSubscription.priceInfo.current
          .total
      ) * 100
    );
    const todayPrices =
      tibber.items.data.viewer.homes[0].currentSubscription.priceInfo.today.map(
        (x: any) => Math.floor(parseFloat(x.total) * 100)
      );

    const tomorrowPrices =
      tibber.items.data.viewer.homes[0].currentSubscription.priceInfo.tomorrow.map(
        (x: any) => Math.floor(parseFloat(x.total) * 100)
      );

    todayLow = Math.min(...todayPrices);
    todayHigh = Math.max(...todayPrices);
    tomorrowLow = tomorrowPrices.length > 0 ? Math.min(...tomorrowPrices) : 0;
    tomorrowHigh = tomorrowPrices.length > 0 ? Math.max(...tomorrowPrices) : 0;
    console.log(
      "Rendering tibber",
      new Date().toLocaleString(),
      tibber,
      currentPrice,
      todayPrices,
      todayLow,
      todayHigh
    );
  } catch (e: any) {
    console.log("Something went wrong in catching tibber price", e.toString());
  }

  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
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
            {currentPrice + " ct"}
          </Typography>
        }
        avatar={
          <Avatar sx={{ bgcolor: "#FFA444" }} aria-label="icon">
            <ElectricBoltIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {todayLow} - {todayHigh} ct heute
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {tomorrowLow} - {tomorrowHigh} ct morgen
        </Typography>
      </CardContent>
    </Card>
  );
}
