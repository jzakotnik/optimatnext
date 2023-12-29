import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Home: NextPage = () => {
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
          <Grid item>a</Grid>
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
};

export default Home;
