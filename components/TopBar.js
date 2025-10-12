import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorModeContext } from "../colorMode";

export default function TopBar({ onNotificationsPress, onBackPress, showBack = false }) {
  const { colors, tokens } = useTheme();
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: colors.card }]}>
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        {/* Left side: Back button or spacer */}
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={[styles.iconBtn, { backgroundColor: colors.background }]}
            >
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <View
              style={[styles.placeholderBox, { backgroundColor: tokens.primary[400] }]}
            />
          )}
        </View>

        {/* Right icons */}
        <View style={styles.right}>
          <TouchableOpacity
            onPress={toggleColorMode}
            style={[styles.iconBtn, { backgroundColor: colors.background }]}
          >
            <Ionicons
              name={mode === "dark" ? "moon" : "sunny-outline"}
              size={22}
              color={colors.text}
            />
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
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  right: {
    flexDirection: "row",
    gap: 8,
  },
  placeholderBox: {
    height: 36,
    borderRadius: 6,
    flex: 1,
    opacity: 0.4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
