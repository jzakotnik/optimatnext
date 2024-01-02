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
  console.log("Rendering traffic", traffic);
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
        title={traffic.items + " Min"}
        avatar={
          <Avatar sx={{ bgcolor: "#AAFFFF" }} aria-label="icon">
            <DirectionsCarFilledIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="caption">Verkehr KfW</Typography>
      </CardContent>
    </Card>
  );
}
