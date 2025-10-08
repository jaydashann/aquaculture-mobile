import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { tokens } from "./tokens";

export const makeNavTheme = (mode = "dark") => {
  const t = tokens(mode);
  const base = mode === "dark" ? DarkTheme : DefaultTheme;

  return {
    // start from React Navigation's base theme (this includes required shapes)
    ...base,

    // required by @react-navigation/elements header/title, etc.
    fonts: {
      regular: { fontFamily: "System", fontWeight: "400" },
      medium:  { fontFamily: "System", fontWeight: "500" },
      bold:    { fontFamily: "System", fontWeight: "700" },
      heavy:   { fontFamily: "System", fontWeight: "800" }, // safe extra
    },

    // your colors, layered over the base
    colors: {
      ...base.colors,
      background: mode === "dark" ? t.primary[500] : "#fcfcfc",
      card:       t.primary[400],
      text:       mode === "dark" ? "#ffffff" : t.grey[100],
      border:     mode === "dark" ? t.primary[600] : t.grey[800],
      primary:    t.blueAccent[500],
      notification: t.redAccent[500],
    },

    // custom extras (ok to keep — JS will allow them)
    tokens: t,
    typography: {
      baseSize: 12,
      h1: 40, h2: 32, h3: 24, h4: 20, h5: 16, h6: 14,
      fontFamily: "System",
    },
  };
};
