import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {" "}
        <meta charSet="utf-8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta http-equiv="refresh" content="60" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
