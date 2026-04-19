import type { NextApiRequest, NextApiResponse } from "next";
import {
  readKey,
  writeKey,
  assertJsonResponse,
  safeParsePayload,
} from "../../utils/dbutils";

const ELECTRICITYMAPS_APIKEY = process.env.ELECTRICITYMAPS_APIKEY as string;
const ELECTRICITYMAPS_URL = process.env.ELECTRICITYMAPS_URL as string;
const ELECTRICITYMAPS_CACHE_SECONDS = process.env
  .ELECTRICITYMAPS_CACHE_SECONDS as string;

interface ElectricityMapsResponse {
  zone: string;
  carbonIntensity: number;
  datetime: string;
  updatedAt: string;
  emissionFactorType: string;
  isEstimated: boolean;
  estimationMethod: string | null;
}

interface NormalizedResponse {
  zone: string;
  carbonIntensity: number;
  datetime: string;
  updatedAt: string;
  isEstimated: boolean;
  countryCode: string; // legacy alias for zone
}

function normalizeResponse(
  response: ElectricityMapsResponse,
): NormalizedResponse {
  return {
    zone: response.zone,
    carbonIntensity: response.carbonIntensity,
    datetime: response.datetime,
    updatedAt: response.updatedAt,
    isEstimated: response.isEstimated,
    countryCode: response.zone,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cachedData = await readKey("electricitymaps");
  const cacheSeconds = cachedData?.age ?? NaN;

  if (
    isNaN(cacheSeconds) ||
    cacheSeconds > parseInt(ELECTRICITYMAPS_CACHE_SECONDS)
  ) {
    console.log("Refreshing Cache for Electricity Maps");
    try {
      const response = await fetch(ELECTRICITYMAPS_URL, {
        headers: {
          "auth-token": ELECTRICITYMAPS_APIKEY,
          "Content-Type": "application/json",
        },
      });
      await assertJsonResponse(response, "ElectricityMaps");
      const data = (await response.json()) as ElectricityMapsResponse;
      const normalizedData = normalizeResponse(data);
      await writeKey("electricitymaps", normalizedData as any);
      res.status(200).json({ key: "electricitymaps", items: normalizedData });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn("Cache refresh for electricitymaps failed:", errorMessage);
      res.status(200).json({
        key: "electricitymaps",
        items: safeParsePayload<NormalizedResponse | null>(
          cachedData?.data?.payload,
          null,
        ),
      });
    }
  } else {
    res.status(200).json({
      key: "electricitymaps",
      items: safeParsePayload<NormalizedResponse | null>(
        cachedData.data.payload,
        null,
      ),
    });
  }
}
