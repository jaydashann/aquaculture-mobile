import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import TopBar from "../components/TopBar";

export default function MainScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <TopBar
        onNotificationsPress={() => navigation.navigate("Notifications")}
        badgeCount={3} // optional badge
      />
      <View style={styles.overlay}>
        <Text style={[styles.text, { color: colors.text }]}>Welcome!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});
