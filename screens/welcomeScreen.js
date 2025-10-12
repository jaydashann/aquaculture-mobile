import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"; // ✅ added Text here
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function WelcomeScreen({ navigation }) {
  const { colors, dark } = useTheme();

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <View style={styles.overlay}>
        <Text style={[styles.text, { color: colors.text }]}>Welcome!</Text>
      </View>

      <TouchableOpacity
        style={[styles.circleButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("Main")}
      >
        <Ionicons name="arrow-forward" size={32} color="white" />
      </TouchableOpacity>

      <StatusBar style={dark ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
