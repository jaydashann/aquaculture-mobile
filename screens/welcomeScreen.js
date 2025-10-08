import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import TopBar from "../components/TopBar";

export default function WelcomeScreen({ navigation }) {
  const { colors, dark } = useTheme();

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <TopBar
        onNotificationsPress={() => navigation.navigate("Notifications")}
        badgeCount={3} // optional badge
      />
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
  background: { flex: 1, width: "100%", height: "100%", alignItems: "center" },
  circleButton: {
    width: 65, height: 65, borderRadius: 40, alignItems: "center", justifyContent: "center",
    position: "absolute", bottom: 70, alignSelf: "center",
    elevation: 5, shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 },
  },
});
