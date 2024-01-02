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

  const currentPrice = Math.floor(
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

  const todayLow = Math.min(...todayPrices);
  const todayHigh = Math.max(...todayPrices);
  const tomorrowLow = Math.min(...tomorrowPrices);
  const tomorrowHigh = Math.max(...tomorrowPrices);
  console.log(
    "Rendering tibber",
    tibber,
    currentPrice,
    todayPrices,
    todayLow,
    todayHigh
  );
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
        title={currentPrice + " ct"}
        avatar={
          <Avatar sx={{ bgcolor: "#FFA444" }} aria-label="icon">
            <ElectricBoltIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography>
          {todayLow} - {todayHigh} ct heute
        </Typography>
        <Typography>
          {tomorrowLow} - {tomorrowHigh} ct morgen
        </Typography>
      </CardContent>
    </Card>
  );
}
