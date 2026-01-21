import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import getColor from "@/utils/getColor";

interface CO2Data {
  items?: {
    data?: {
      fossilFuelPercentage: number | string;
    };
  };
}

interface CO2SignalCardProps {
  co2: CO2Data | null;
}

export default function CO2SignalCard({ co2 }: CO2SignalCardProps) {
  // Handle null/undefined data
  if (!co2?.items?.data) {
    return (
      <Card
        elevation={1}
        sx={{
          border: "1px solid",
          borderRadius: 2,
          borderColor: "#FFFFFF",
          height: "100%",
        }}
      >
        <CardContent>
          <Typography>Keine CO2-Daten</Typography>
        </CardContent>
      </Card>
    );
  }

  const percentage = Math.round(Number(co2.items.data.fossilFuelPercentage));

  return (
    <Card
      elevation={1}
      sx={{
        border: "1px solid",
        borderRadius: 2,
        borderColor: "#FFFFFF",
        height: "100%",
      }}
    >
      <CardHeader
        sx={{ fontWeight: "bold", p: 2.5 }}
        titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        title={`${percentage} %`}
        avatar={
          <Avatar
            sx={{ bgcolor: getColor(percentage, 30, 60) }}
            aria-label="CO2 fossil fuel percentage"
          >
            <EnergySavingsLeafIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          CO2 Mix
        </Typography>
      </CardContent>
    </Card>
  );
}
