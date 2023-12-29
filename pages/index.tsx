import type { NextPage } from "next";
import Head from "next/head";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

type IndexPageProps = {
  traffic: any;
};

export default function Home({ traffic }: IndexPageProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
      >
        <Grid
          container
          item
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item>{JSON.stringify(traffic)}</Grid>
          <Grid item>b</Grid>
          <Grid item>c</Grid>
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item>d</Grid>
          <Grid item>e</Grid>
          <Grid item>f</Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/traffic");
  const traffic = await res.json();

  // Pass data to the page via props
  return { props: { traffic } };
};
