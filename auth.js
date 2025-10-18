import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = signed out

  // ---- Stubbed methods you can replace with Firebase later ----
  const signIn = async (email, password) => {
    // TODO: replace with Firebase signInWithEmailAndPassword
    if (!email || !password) throw new Error("Email and password are required.");
    setUser({
      uid: "local-" + Date.now(),
      email,
      displayName: email.split("@")[0],
      isGuest: false,
    });
  };

  const continueAsGuest = () => {
    setUser({
      uid: "guest",
      displayName: "Guest",
      email: null,
      isGuest: true,
    });
  };

  const signOut = async () => {
    // TODO: replace with Firebase signOut
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, signIn, continueAsGuest, signOut }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
