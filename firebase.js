// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  // in some versions this is exported from 'firebase/auth' (not '/react-native')
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// 🔒 Fill with your config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA2lxrC7xwkWvPZORQ4h0iiKEfymTOPX2Q",
  authDomain: "aquaculture-1f760.firebaseapp.com",
  projectId: "aquaculture-1f760",
  storageBucket: "aquaculture-1f760.firebasestorage.app",
  messagingSenderId: "787501821097",
  appId: "1:787501821097:web:c0b11b9ed622a120b24db8",
  measurementId: "G-6103835ZRY"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  // web can just use the default
  auth = getAuth(app);
} else {
  // Try RN persistence if available; otherwise fall back to in-memory
  try {
    if (typeof getReactNativePersistence === "function" && initializeAuth) {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      auth = getAuth(app);
    }
  } catch (e) {
    // If initializeAuth was already called or not supported, just reuse/get default
    auth = getAuth(app);
  }
}

export { app, auth };
