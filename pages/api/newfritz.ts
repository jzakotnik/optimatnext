import type { NextApiRequest, NextApiResponse } from "next";
import { writeKey, readKey } from "../../utils/dbutils";

const FRITZ_USER = process.env.FRITZ_USER as string;
const FRITZ_URL = process.env.FRITZ_URL as string;
const FRITZ_PASSWORD = process.env.FRITZ_PASSWORD as string;
const FRITZ_CACHE_SECONDS = process.env.FRITZ_CACHE_SECONDS as string;

const options = {
  username: FRITZ_USER,
  password: FRITZ_PASSWORD,
  server: FRITZ_URL,
  protocol: "http",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const options = {
    username: FRITZ_USER,
    password: FRITZ_PASSWORD,
    server: FRITZ_URL,
    protocol: "http",
    host: "fritz.box",
    port: 49000,
    ssl: false,
  };
  var Fritzbox = require("fritzbox");

  var fritzbox = new Fritzbox(options);

  fritzbox
    .initTR064Device()
    .then(function () {
      console.log("Successfully initialized device");
      var wanip =
        fritzbox.services["urn:dslforum-org:service:WANIPConnection:1"];
      return wanip.actions.GetInfo();
    })
    .then(function (result: any) {
      console.log(result);
    })
    .catch(function (error: any) {
      console.log(error);
    });
}
