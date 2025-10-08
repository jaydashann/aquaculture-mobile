import React, { createContext, useMemo, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeNavTheme } from "./theme.native";

export const ColorModeContext = createContext({
  mode: "dark",
  toggleColorMode: () => {},
  theme: makeNavTheme("dark"),
});

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@color-mode");
      if (saved) setMode(saved);
      else setMode(Appearance.getColorScheme() || "light");
    })();
  }, []);

  const toggleColorMode = async () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    await AsyncStorage.setItem("@color-mode", next);
  };

  const theme = useMemo(() => makeNavTheme(mode), [mode]);

  const value = useMemo(() => ({ mode, toggleColorMode, theme }), [mode, theme]);
  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}
