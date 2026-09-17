import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Link,
  useTheme,
} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

type MastodonPost = {
  id: string;
  content: string;
  created_at: string;
  url: string;
};

type MastodonCardProps = {
  mastodon: MastodonPost[] | null;
  lastUpdate: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function MastodonCard({
  mastodon,
  lastUpdate = "Letztes Update..",
}: MastodonCardProps) {
  const theme = useTheme();
  console.log("Rendering mastodon", new Date().toLocaleString(), mastodon);

  const posts = mastodon ?? [];

  return (
    <Card
      elevation={1}
      sx={{
        border: "1px solid",
        height: "100%",
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
        title={
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {"Mastodon um " + lastUpdate}
          </Typography>
        }
        avatar={
          <Avatar sx={{ bgcolor: "#6364FF" }} aria-label="icon">
            <AlternateEmailIcon />
          </Avatar>
        }
      />
      <CardContent>
        {posts.length === 0 ? (
          <Typography variant="body1">Keine Beiträge verfügbar</Typography>
        ) : (
          posts.slice(0, 5).map((p) => (
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 1 }}
              key={p.id}
            >
              <Link
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
              >
                {stripHtml(p.content).substring(0, 80)}
              </Link>
            </Typography>
          ))
        )}
      </CardContent>
    </Card>
  );
}
