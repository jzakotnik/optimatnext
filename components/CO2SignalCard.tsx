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
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function CO2SignalCard({ co2 }: CO2SignalCardProps) {
  const theme = useTheme();
  console.log("Rendering co2", co2);
  return (
    <Card
      elevation={1}
      sx={{
        border: "1px solid",
        borderRadius: 2,
        borderColor: "#FFFFF",
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
        title={co2.items.data.fossilFuelPercentage + " %"}
        avatar={
          <Avatar sx={{ bgcolor: "#FFFFAA" }} aria-label="icon">
            <EnergySavingsLeafIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="caption">CO2 im Strommix</Typography>
      </CardContent>
    </Card>
  );
}
