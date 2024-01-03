import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";

type CO2SignalCardProps = {
  co2: any;
};

const headerSX = {
  fontWeight: "bold",
  p: 2.5,
};

export default function CO2SignalCard({ co2 }: CO2SignalCardProps) {
  const theme = useTheme();
  console.log("Rendering co2", co2);
  let percentage = 0;
  if ("data" in co2.items)
    percentage = parseInt(co2.items.data.fossilFuelPercentage);
  return (
    <Card
      elevation={1}
      sx={{
        border: "1px solid",
        borderRadius: 2,
        borderColor: "#FFFFF",
        height: "100%",
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
        titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        title={percentage + " %"}
        avatar={
          <Avatar sx={{ bgcolor: "#FFFFAA" }} aria-label="icon">
            <EnergySavingsLeafIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          CO2 im Strommix
        </Typography>
      </CardContent>
    </Card>
  );
}
