import type { NextApiRequest, NextApiResponse } from "next";
import { getAll } from "@/lib/cache/store";
import type { CacheStore } from "@/lib/cache/types";

/**
 * Serves the entire dashboard snapshot from the in-memory/disk-backed cache.
 * This never triggers a live upstream fetch — the background scheduler
 * (lib/cache/scheduler.ts) is the only thing that talks to the upstream
 * APIs, so this route always responds instantly regardless of upstream
 * health.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CacheStore>,
) {
  const snapshot = await getAll();
  res.status(200).json(snapshot);
}
