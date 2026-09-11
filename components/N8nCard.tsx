import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import ReactMarkdown from "react-markdown";

type N8nCardProps = {
  n8n: any;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export default function N8nCard({ n8n }: N8nCardProps) {
  const theme = useTheme();
  console.log("Rendering n8n", new Date().toLocaleString(), n8n);

  let markdown = "";
  try {
    markdown = "items" in n8n && typeof n8n.items === "string" ? n8n.items : "";
  } catch (e: any) {
    console.log("ERROR reading n8n markdown", n8n);
  }

  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        width: "100%",
        border: "1px solid",
        borderRadius: 2,
        borderColor: "#FFFFF",
        overflow: "hidden",
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
            n8n
          </Typography>
        }
        avatar={
          <Avatar sx={{ bgcolor: "#FFB74D" }} aria-label="icon">
            <IntegrationInstructionsIcon />
          </Avatar>
        }
      />
      <CardContent
        sx={{
          maxHeight: 220,
          overflow: "hidden",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          "& p": { m: 0, mb: 1 },
          "& ul, & ol": { m: 0, mb: 1, pl: 3 },
          "& h1, & h2, & h3": { m: 0, mb: 1 },
          color: "inherit",
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {markdown.length > 0 ? (
          <ReactMarkdown>{markdown}</ReactMarkdown>
        ) : (
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            -
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
