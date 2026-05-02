"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { HomePage } from "../page/Home";
import { appTheme } from "../style/theme";

export default function Home() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}
