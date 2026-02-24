import React, { createContext, useState, useContext } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState("firebase");

  const cycleMode = () => {
    if (mode === "firebase") setMode("local");
    else if (mode === "local") setMode("demo");
    else setMode("firebase");
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, cycleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);