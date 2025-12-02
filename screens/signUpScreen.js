import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../auth";

export default function SignUpScreen({ navigation }) {
  const { colors } = useTheme();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!email || !password) throw new Error("Please enter email and password.");
      setBusy(true);
      await signUp(email.trim(), password, displayName.trim());\
    } catch (err) {
      Alert.alert("Sign up failed", err?.message || "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Create account</Text>

        <TextInput
          placeholder="Display name (optional)"
          placeholderTextColor="#9ca3af"
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={displayName}
          onChangeText={setDisplayName}
        />
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
          onPress={handleSignUp}
          activeOpacity={0.9}
        >
          <Ionicons name="person-add-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.primaryText}>{busy ? "Creating..." : "Create account"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkBtn} activeOpacity={0.8}>
          <Text style={[styles.linkText, { color: colors.text }]}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  input: {
    width: "100%", borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, fontSize: 14,
  },
  primaryBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 10, paddingVertical: 12,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  linkBtn: { marginTop: 12, alignItems: "center" },
  linkText: { fontWeight: "700" },
});
