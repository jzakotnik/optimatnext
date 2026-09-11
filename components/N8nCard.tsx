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
  fullscreen?: boolean;
};

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

const BOX_MAX_CHARS = 800;

function truncateMarkdown(markdown: string, maxChars: number): string {
  if (markdown.length <= maxChars) return markdown;
  return markdown.slice(0, maxChars).trimEnd() + "…";
}

function getMarkdownComponents(fullscreen: boolean) {
  if (fullscreen) {
    return {
      h1: ({ children }: any) => (
        <Typography
          sx={{ fontWeight: "bold", fontSize: "5rem", lineHeight: 1.15, mb: 3 }}
        >
          {children}
        </Typography>
      ),
      h2: ({ children }: any) => (
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "3.5rem",
            lineHeight: 1.2,
            mb: 3,
          }}
        >
          {children}
        </Typography>
      ),
      h3: ({ children }: any) => (
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "3.5rem",
            lineHeight: 1.2,
            mb: 3,
          }}
        >
          {children}
        </Typography>
      ),
      p: ({ children }: any) => (
        <Typography
          sx={{ fontWeight: "bold", fontSize: "3rem", lineHeight: 1.3, mb: 3 }}
        >
          {children}
        </Typography>
      ),
      li: ({ children }: any) => (
        <Typography
          component="li"
          sx={{ fontWeight: "bold", fontSize: "3rem", lineHeight: 1.3, mb: 2 }}
        >
          {children}
        </Typography>
      ),
      strong: ({ children }: any) => (
        <Typography component="span" sx={{ fontWeight: "bold" }}>
          {children}
        </Typography>
      ),
    };
  }

  return {
    h1: ({ children }: any) => (
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        {children}
      </Typography>
    ),
    h2: ({ children }: any) => (
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {children}
      </Typography>
    ),
    h3: ({ children }: any) => (
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {children}
      </Typography>
    ),
    p: ({ children }: any) => (
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {children}
      </Typography>
    ),
    li: ({ children }: any) => (
      <Typography
        component="li"
        variant="h5"
        sx={{ fontWeight: "bold", mb: 0.5 }}
      >
        {children}
      </Typography>
    ),
    strong: ({ children }: any) => (
      <Typography component="span" sx={{ fontWeight: "bold" }}>
        {children}
      </Typography>
    ),
  };
}

export default function N8nCard({ n8n, fullscreen = false }: N8nCardProps) {
  const theme = useTheme();
  console.log("Rendering n8n", new Date().toLocaleString(), n8n);

  let markdown = "";
  try {
    markdown = "items" in n8n && typeof n8n.items === "string" ? n8n.items : "";
  } catch (e: any) {
    console.log("ERROR reading n8n markdown", n8n);
  }

  const displayMarkdown = fullscreen
    ? markdown
    : truncateMarkdown(markdown, BOX_MAX_CHARS);

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
        sx={fullscreen ? { p: 1.5 } : undefined}
        title={
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: fullscreen ? "1.75rem" : "1.25rem",
            }}
          >
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
          maxHeight: fullscreen ? "calc(100vh - 110px)" : 220,
          overflow: "hidden",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          "& ul, & ol": { m: 0, mb: 2, pl: 4 },
          color: "inherit",
        }}
      >
        {displayMarkdown.length > 0 ? (
          <ReactMarkdown components={getMarkdownComponents(fullscreen)}>
            {displayMarkdown}
          </ReactMarkdown>
        ) : (
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            -
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
