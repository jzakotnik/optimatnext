import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import getColor from "@/utils/getColor";

interface EnergyData {
  ppv: number;
  pgrid: number;
  soc: number;
}

interface EnergyCardProps {
  energy: {
    energy: {
      data: EnergyData;
    };
  } | null;
}

export default function EnergyCard({ energy }: EnergyCardProps) {
  // Handle null/undefined energy data
  if (!energy?.energy?.data) {
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
          <Typography>Keine Energiedaten</Typography>
        </CardContent>
      </Card>
    );
  }

  const { ppv, pgrid, soc } = energy.energy.data;
  const isExporting = ppv - pgrid >= 0;

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
        title={
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="stretch"
          >
            <Grid sx={{ mx: 1 }}>
              {isExporting ? <ArrowCircleUpIcon /> : <ArrowCircleDownIcon />}
            </Grid>
            <Grid>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                PV
              </Typography>
            </Grid>
          </Grid>
        }
        avatar={
          <Avatar
            sx={{
              bgcolor: getColor(pgrid, 80, 300, false),
            }}
            aria-label="icon"
          >
            <SolarPowerIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {`PV: ${ppv} W`}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {`Grid: ${pgrid} W`}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {`Akku: ${soc} %`}
        </Typography>
      </CardContent>
    </Card>
  );
}
