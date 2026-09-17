import { withTimeout } from "@/lib/withTimeout";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fritz = require("fritzbox.js");

export interface PhoneCall {
  date: string;
  name: string;
  number: string;
}

interface FritzCall {
  type: string;
  date: string;
  name?: string;
  number: string;
}

export async function fetchPhone(): Promise<PhoneCall[]> {
  const username = process.env.FRITZ_USER;
  const password = process.env.FRITZ_PASSWORD;
  const server = process.env.FRITZ_URL;
  if (!username || !password || !server) {
    throw new Error("Fritz env vars not configured");
  }

  const calls: FritzCall[] | { error: { message: string } } = await withTimeout(
    fritz.getCalls({ username, password, server, protocol: "http" }),
    10000,
    "FritzBox",
  );
  if (!Array.isArray(calls)) {
    throw new Error("Fritz error: " + calls.error.message);
  }

  return calls
    .filter((c) => c.type === "missed")
    .slice(0, 10)
    .map((c) => ({ date: c.date, name: c.name ?? "", number: c.number }));
}
