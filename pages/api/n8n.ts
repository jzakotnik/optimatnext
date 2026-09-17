import type { NextApiRequest, NextApiResponse } from "next";
import { setSuccess } from "@/lib/cache/store";

/**
 * n8n pushes markdown content here instead of being polled — there is no
 * upstream to schedule a refresh against. GET is served through
 * /api/dashboard along with everything else.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body: unknown = req.body;
  let markdown: string | null = null;

  if (typeof body === "string") {
    markdown = body;
  } else if (Buffer.isBuffer(body)) {
    markdown = body.toString("utf-8");
  } else if (
    body &&
    typeof body === "object" &&
    "markdown" in body &&
    typeof (body as { markdown: unknown }).markdown === "string"
  ) {
    markdown = (body as { markdown: string }).markdown;
  }

  if (markdown === null) {
    return res.status(400).json({
      error:
        "Expected a markdown string, or JSON body with a 'markdown' field",
    });
  }

  await setSuccess("n8n", markdown);
  return res.status(200).json({ ok: true });
}
