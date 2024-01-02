import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  ListItemSecondaryAction,
  Typography,
  useTheme,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { convertDateString } from "@/utils/dateutils";

type CalendarCardProps = {
  calendar: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function CalendarCard({ calendar }: CalendarCardProps) {
  function formatCalendar(item: any) {
    const date = convertDateString(item.startTime.dateTime) as string;
    console.log("Date", date);
    const row = date + ", " + item.summary;
    return row;
  }

  const theme = useTheme();

  console.log("Rendering calendar", calendar);
  const formattedCalendar = calendar.items.map((i: any) => formatCalendar(i));
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
        title={<Typography variant="caption">Kalender</Typography>}
        avatar={
          <Avatar sx={{ bgcolor: "#FAEAFF" }} aria-label="icon">
            <CalendarMonthIcon />
          </Avatar>
        }
      />
      <CardContent>
        {formattedCalendar.slice(0, 5).map((n: any, i: number) => (
          <Typography key={i}>{n}</Typography>
        ))}
      </CardContent>
    </Card>
  );
}
