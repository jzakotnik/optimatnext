import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  ListItemSecondaryAction,
  Typography,
  useTheme,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { convertDateDaytoString, convertDateString } from "@/utils/dateutils";

type CalendarCardProps = {
  calendar: any;
};

const headerSX = {
  p: 2.5,
};

export default function CalendarCard({ calendar }: CalendarCardProps) {
  function formatCalendar(item: any) {
    try {
      //full days have a "date" field, days with time have "dateTime"
      let date = "No time";
      if ("dateTime" in item.startTime)
        date = convertDateString(item.startTime.dateTime) as string;

      if ("date" in item.startTime)
        date = convertDateDaytoString(item.startTime.date) as string;

      //console.log("Date", date);
      const row = date + ", " + item.summary;
      return row;
    } catch (e: any) {
      return "Kein Eintrag";
    }
  }

  const theme = useTheme();

  console.log("Rendering calendar", new Date().toLocaleString(), calendar);

  let formattedCalendar = ["Fehler"];
  try {
    formattedCalendar = calendar.items.map((i: any) => formatCalendar(i));
  } catch (e: any) {
    console.log("ERROR formatting calendar items");
  }
  try {
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
              Kalender
            </Typography>
          }
          avatar={
            <Avatar sx={{ bgcolor: "#FAEAFF" }} aria-label="icon">
              <CalendarMonthIcon />
            </Avatar>
          }
        />
        <CardContent>
          {formattedCalendar.slice(0, 5).map((n: any, i: number) => (
            <Typography variant="h5" sx={{ fontWeight: "bold" }} key={i}>
              {n}
            </Typography>
          ))}
        </CardContent>
      </Card>
    );
  } catch (e: any) {
    return <Typography>Datenfehler Kalender {e.toString()}</Typography>;
  }
}
