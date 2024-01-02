import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

type FuelCardProps = {
  fuel: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function FuelCard({ fuel }: FuelCardProps) {
  const theme = useTheme();
  console.log("Rendering fuel", fuel);
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
        title={fuel.fuelprice + " EUR"}
        avatar={
          <Avatar sx={{ bgcolor: "#0AFAFF" }} aria-label="icon">
            <LocalGasStationIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="caption">Benzinpreis Königstein</Typography>
      </CardContent>
    </Card>
  );
}
