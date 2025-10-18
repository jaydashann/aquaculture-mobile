import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../auth";

export default function WelcomeScreen() {
  const { colors, dark } = useTheme();
  const { signIn, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    try {
      setBusy(true);
      await signIn(email.trim(), password);
      // No need to navigate; App stack will switch automatically
    } catch (err) {
      Alert.alert("Sign in failed", err?.message || "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.background, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.overlay}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome!</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Sign in or continue as a guest
        </Text>

        {/* Auth Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            disabled={busy}
            style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: busy ? 0.7 : 1 }]}
            onPress={handleSignIn}
            activeOpacity={0.9}
          >
            <Ionicons name="lock-closed-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.primaryText}>{busy ? "Signing in..." : "Sign In"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ghostBtn, { borderColor: colors.border }]}
            onPress={handleGuest}
            activeOpacity={0.9}
          >
            <Ionicons name="person-outline" size={18} color={colors.text} style={{ marginRight: 6 }} />
            <Text style={[styles.ghostText, { color: colors.text }]}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style={dark ? "light" : "dark"} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%", alignItems: "center" },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24, width: "100%" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 14, opacity: 0.8, marginBottom: 18 },
  card: {
    width: "100%",
    maxWidth: 420,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 12,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  ghostText: { fontWeight: "700" },
  circleButton: {
    width: 65,
    height: 65,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
  },
});
