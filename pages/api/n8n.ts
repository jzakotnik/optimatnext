import type { NextApiRequest, NextApiResponse } from "next";
import { writeKey, readKey, safeParsePayload } from "../../utils/dbutils";

const N8N_MAX_CHARS = process.env.N8N_MAX_CHARS as string;

function truncateMarkdown(markdown: string, maxChars: number): string {
  if (markdown.length <= maxChars) return markdown;
  return markdown.slice(0, maxChars).trimEnd() + "…";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const body: any = req.body;
      let markdown: string | null = null;

      if (typeof body === "string") {
        markdown = body;
      } else if (Buffer.isBuffer(body)) {
        markdown = body.toString("utf-8");
      } else if (body && typeof body.markdown === "string") {
        markdown = body.markdown;
      }

      if (markdown === null) {
        return res.status(400).json({
          key: "n8n",
          error:
            "Expected a markdown string, or JSON body with a 'markdown' field",
        });
      }

      await writeKey("n8n", markdown as any);
      return res.status(200).json({ key: "n8n", items: markdown });
    } catch (e: any) {
      console.warn("Writing n8n markdown went wrong:", e.message);
      return res
        .status(500)
        .json({ key: "n8n", error: "Could not store markdown" });
    }
  }

  if (req.method !== "GET") {
    return res.status(405).json({ key: "n8n", error: "Method not allowed" });
  }

  let cachedData: Awaited<ReturnType<typeof readKey>> | undefined;
  try {
    cachedData = await readKey("n8n");
  } catch (e: any) {
    console.warn("n8n cache read failed:", e.message);
    return res.status(200).json({ key: "n8n", items: "" });
  }

  const markdown = safeParsePayload<string>(cachedData.data.payload, "");
  const maxChars = parseInt(N8N_MAX_CHARS) || 800;
  res
    .status(200)
    .json({ key: "n8n", items: truncateMarkdown(markdown, maxChars) });
}
