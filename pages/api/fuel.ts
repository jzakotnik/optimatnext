import type { NextApiRequest, NextApiResponse } from "next";
import { GetServerSideProps } from "next";
import { readKey, writeKey } from "../../utils/dbutils";

const url = process.env.TANKEN_URL as string;
const apikey = process.env.TANKEN_APIKEY as string;
const location = process.env.TANKEN_LOCATION as string;
const TANKEN_CACHE_SECONDS = process.env.TANKEN_CACHE_SECONDS as string;

const requestURL = `${url}?ids=${location}&apikey=${apikey}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //check if cache hit is sufficient
  const cachedData = await readKey("fuel");
  //console.log("Cached Data last Update", cachedData.age);
  const cacheSeconds = cachedData.age;

  if (isNaN(cacheSeconds) || cacheSeconds > parseInt(TANKEN_CACHE_SECONDS)) {
    console.log("Refreshing Cache for Fuel");
    const fuelprice = await fetch(requestURL);
    if (!fuelprice.ok) {
      res.status(200).json({
        key: "fuel",
        items: {},
      });
    }
    console.log("Fuel data", fuelprice);
    const alldata = await fuelprice.json();
    const data = alldata.prices[location]["e10"];

    await writeKey("fuel", data);

    res.status(200).json({
      key: "fuel",
      items: data,
    });
  } else {
    //console.log("Used cache for fuel");
    res.status(200).json({
      key: "fuel",
      items: JSON.parse(cachedData.data.payload),
    });
  }
}
