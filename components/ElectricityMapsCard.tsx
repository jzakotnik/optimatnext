import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import getColor from "@/utils/getColor";

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

interface ElectricityMapsCardProps {
  data: ElectricityMapsData | null;
}

/**
 * Displays the carbon intensity of electricity from Electricity Maps API.
 * Carbon intensity is measured in gCO2eq/kWh.
 *
 * Typical ranges:
 * - < 100: Very clean (nuclear, hydro, renewables)
 * - 100-300: Moderate
 * - > 300: High carbon (coal, gas)
 */
export default function ElectricityMapsCard({
  data,
}: ElectricityMapsCardProps) {
  // Handle null/undefined data
  if (!data?.items?.carbonIntensity) {
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

  const carbonIntensity = Math.round(data.items.carbonIntensity);

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
        title={`${carbonIntensity} g`}
        avatar={
          <Avatar
            sx={{ bgcolor: getColor(carbonIntensity, 100, 300) }}
            aria-label="CO2 carbon intensity"
          >
            <EnergySavingsLeafIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          CO₂/kWh
        </Typography>
        {data.items.isEstimated && (
          <Typography variant="caption" color="text.secondary">
            (geschätzt)
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
