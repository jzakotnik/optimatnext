import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";

type TrafficCardProps = {
  traffic: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function TrafficCard({ traffic }: TrafficCardProps) {
  const theme = useTheme();
  console.log("Rendering traffic", new Date().toLocaleString(), traffic);
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
            {traffic.items + " Min"}
          </Typography>
        }
        avatar={
          <Avatar sx={{ bgcolor: "#AAFFFF" }} aria-label="icon">
            <DirectionsCarFilledIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Verkehr KfW
        </Typography>
      </CardContent>
    </Card>
  );
}
