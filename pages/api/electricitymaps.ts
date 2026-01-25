import type { NextApiRequest, NextApiResponse } from "next";
import { readKey, writeKey } from "../../utils/dbutils";

const ELECTRICITYMAPS_APIKEY = process.env.ELECTRICITYMAPS_APIKEY as string;
const ELECTRICITYMAPS_URL = process.env.ELECTRICITYMAPS_URL as string;
const ELECTRICITYMAPS_CACHE_SECONDS = process.env
  .ELECTRICITYMAPS_CACHE_SECONDS as string;

// New Electricity Maps API response structure
interface ElectricityMapsResponse {
  zone: string;
  carbonIntensity: number;
  datetime: string;
  updatedAt: string;
  emissionFactorType: string;
  isEstimated: boolean;
  estimationMethod: string | null;
}

// Normalized response for backward compatibility with existing frontend
interface NormalizedResponse {
  zone: string;
  carbonIntensity: number;
  datetime: string;
  updatedAt: string;
  isEstimated: boolean;
  // Legacy fields mapped for compatibility
  countryCode: string;
}

interface ApiResponse {
  key: string;
  items: NormalizedResponse | Record<string, never>;
}

interface CachedData {
  age: number;
  data: {
    payload: string;
  };
}

/*
New Electricity Maps API:
curl 'https://api.electricitymap.org/v3/carbon-intensity/latest?zone=DE' \
  -H 'auth-token: myapitoken'

Response:
{
  "zone": "DE",
  "carbonIntensity": 302,
  "datetime": "2018-04-25T18:07:00.350Z",
  "updatedAt": "2018-04-25T18:07:01.000Z",
  "emissionFactorType": "lifecycle",
  "isEstimated": true,
  "estimationMethod": "TIME_SLICER_AVERAGE"
}
*/

function normalizeResponse(
  response: ElectricityMapsResponse,
): NormalizedResponse {
  return {
    zone: response.zone,
    carbonIntensity: response.carbonIntensity,
    datetime: response.datetime,
    updatedAt: response.updatedAt,
    isEstimated: response.isEstimated,
    // Map zone to countryCode for backward compatibility
    countryCode: response.zone,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const cachedData = (await readKey("electricitymaps")) as CachedData | null;
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

      if (!response.ok) {
        console.error(
          "Electricity Maps request failed:",
          response.status,
          response.statusText,
        );

        // Try to return cached data if available
        if (cachedData?.data?.payload) {
          res.status(200).json({
            key: "electricitymaps",
            items: JSON.parse(cachedData.data.payload) as NormalizedResponse,
          });
          return;
        }

        res.status(200).json({
          key: "electricitymaps",
          items: {},
        });
        return;
      }

      const data = (await response.json()) as ElectricityMapsResponse;
      const normalizedData = normalizeResponse(data);

      // Note: writeKey's type signature is misleading - it accepts any data and stringifies it
      // Using 'as any' for consistency with other API handlers in this codebase
      await writeKey("electricitymaps", normalizedData as any);

      res.status(200).json({
        key: "electricitymaps",
        items: normalizedData,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn("Cache refresh for electricitymaps failed:", errorMessage);

      // Return cached data on error if available
      if (cachedData?.data?.payload) {
        res.status(200).json({
          key: "electricitymaps",
          items: JSON.parse(cachedData.data.payload) as NormalizedResponse,
        });
        return;
      }

      res.status(200).json({
        key: "electricitymaps",
        items: {},
      });
    }
  } else {
    res.status(200).json({
      key: "electricitymaps",
      items: JSON.parse(cachedData!.data.payload) as NormalizedResponse,
    });
  }
}
