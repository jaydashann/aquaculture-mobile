import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorModeContext } from "../colorMode";

export default function TopBar({ onNotificationsPress }) {
  const { colors, tokens } = useTheme();
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: colors.card }]}>
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        {/* Left spacer to mimic your web "search box area" */}
        <View style={[styles.left, { backgroundColor: tokens.primary[400], borderRadius: 6 }]} />

        {/* Right icons */}
        <View style={styles.right}>
          <TouchableOpacity
            onPress={toggleColorMode}
            style={[styles.iconBtn, { backgroundColor: colors.background }]}
          >
            <Ionicons name={mode === "dark" ? "moon" : "sunny-outline"} size={22} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNotificationsPress}
            style={[styles.iconBtn, { backgroundColor: colors.background }]}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { width: "100%" },
  row: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { height: 36, flex: 1 },
  right: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.2,
    shadowRadius: 2, shadowOffset: { width: 0, height: 1 },
  },
});
