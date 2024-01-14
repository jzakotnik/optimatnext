import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  ListItemSecondaryAction,
  Typography,
  useTheme,
} from "@mui/material";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { convertDateString } from "@/utils/dateutils";

type PhoneCardProps = {
  phone: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function PhoneCard({ phone }: PhoneCardProps) {
  function formatPhone(item: any) {
    const date = convertDateString(item.date) as string;
    //console.log("Date", date);
    const row =
      date +
      ", " +
      (item.name.length > 0 ? item.name + ", " : " ") +
      item.number;

    return row;
  }

  const theme = useTheme();
  console.log("Rendering phone", new Date().toLocaleString(), phone);
  let formattedCalls = ["Fehler"];
  try {
    formattedCalls = phone.items.map((i: any) => formatPhone(i));
  } catch (e: any) {
    console.log("ERROR formatting phone calls");
  }
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
        title={
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Telefon
          </Typography>
        }
        avatar={
          <Avatar sx={{ bgcolor: "#AFFAAC" }} aria-label="icon">
            <ContactPhoneIcon />
          </Avatar>
        }
      />
      <CardContent>
        {formattedCalls.slice(0, 5).map((n: any, i: number) => (
          <Typography variant="h5" sx={{ fontWeight: "bold" }} key={i}>
            {n}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}
