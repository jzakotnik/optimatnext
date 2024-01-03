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
  fontWeight: "bold",
};

export default function FuelCard({ fuel }: FuelCardProps) {
  const theme = useTheme();
  console.log("Rendering fuel", fuel);
  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
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
        titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        title={"items" in fuel ? fuel.items + " EUR" : "-"}
        avatar={
          <Avatar sx={{ bgcolor: "#0AFAFF" }} aria-label="icon">
            <LocalGasStationIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Benzinpreis Königstein
        </Typography>
      </CardContent>
    </Card>
  );
}
