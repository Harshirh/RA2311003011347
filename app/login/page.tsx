"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { LoginPage } from "../../page/Login";
import { appTheme } from "../../style/theme";

export default function Login() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <LoginPage />
    </ThemeProvider>
  );
}
