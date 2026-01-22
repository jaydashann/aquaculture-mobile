import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyA2lxrC7xwkWvPZORQ4h0iiKEfymTOPX2Q",
  authDomain: "aquaculture-1f760.firebaseapp.com",
  projectId: "aquaculture-1f760",
  storageBucket: "aquaculture-1f760.firebasestorage.app",
  messagingSenderId: "787501821097",
  appId: "1:787501821097:web:c0b11b9ed622a120b24db8",
  measurementId: "G-6103835ZRY",
  databaseURL: "https://aquaculture-1f760-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

const db = getDatabase(app);

export { app, auth, db };
