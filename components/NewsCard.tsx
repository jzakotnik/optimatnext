import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  ListItemSecondaryAction,
  Typography,
  useTheme,
} from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";

type NewsCardProps = {
  news: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function NewsCard({ news }: NewsCardProps) {
  const theme = useTheme();
  console.log("Rendering news", news);
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
        title={<Typography variant="caption">Spiegel Online News</Typography>}
        avatar={
          <Avatar sx={{ bgcolor: "#FFAAFF" }} aria-label="icon">
            <FeedIcon />
          </Avatar>
        }
      />
      <CardContent>
        {news.items.slice(0, 5).map((n: any, i: number) => (
          <Typography key={i}>{n}</Typography>
        ))}
      </CardContent>
    </Card>
  );
}