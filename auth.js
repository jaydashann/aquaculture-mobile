import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  signInAnonymously,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);           // null = signed out
  const [booting, setBooting] = useState(true);     // optional: splash/loader gating

  // Keep app in sync with Firebase session
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
          isGuest: fbUser.isAnonymous || false,
        });
      } else {
        setUser(null);
      }
      setBooting(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const signUp = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return cred.user;
  };

  const continueAsGuest = async () => {
    // Enable Anonymous in Firebase Console to use this
    const cred = await signInAnonymously(auth);
    return cred.user;
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  const value = useMemo(
    () => ({ user, booting, signIn, signUp, continueAsGuest, signOut }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
