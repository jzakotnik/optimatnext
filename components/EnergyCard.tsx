import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import SolarPowerIcon from "@mui/icons-material/SolarPower";

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
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {energy.energy.data.ppv.toString() +
              " - " +
              energy.energy.data.pgrid.toString() +
              " W"}
          </Typography>
        }
        avatar={
          <Avatar sx={{ bgcolor: "#FAEAFF" }} aria-label="icon">
            <SolarPowerIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          PV
        </Typography>
      </CardContent>
    </Card>
  );
}
