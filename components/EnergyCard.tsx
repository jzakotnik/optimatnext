import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

type EnergyCardProps = {
  energy: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function EnergyCard({ energy }: EnergyCardProps) {
  const theme = useTheme();
  console.log("Rendering energy", new Date().toLocaleString(), energy);
  return (
    <Card
      elevation={1}
      sx={{
        border: "1px solid",
        borderRadius: 2,
        borderColor: "#FFFFF",
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
            <Grid item sx={{ mx: 1 }}>
              {" "}
              {energy.energy.data.ppv - energy.energy.data.pgrid < 0 ? (
                <ArrowCircleDownIcon />
              ) : (
                <ArrowCircleUpIcon />
              )}
            </Grid>
            <Grid item>
              {" "}
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {"PV"}
              </Typography>
            </Grid>
          </Grid>
        }
        avatar={
          <Avatar sx={{ bgcolor: "#FAEAFF" }} aria-label="icon">
            <SolarPowerIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {"PV: " + energy.energy.data.ppv.toString() + " W"}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {"Grid: " + energy.energy.data.pgrid.toString() + " W"}{" "}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {"Akku: " + energy.energy.data.soc.toString() + " %"}
        </Typography>
      </CardContent>
    </Card>
  );
}
