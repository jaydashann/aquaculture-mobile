import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TopBar({ onBackPress, showBack = false }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: colors.card }]}>
      <View style={[styles.row, { borderBottomColor: colors.border }]}>

        {/* Left Section: Back Button or Spacer */}
        <View style={styles.section}>
          {showBack && (
            <TouchableOpacity
              onPress={onBackPress}
              style={[styles.iconBtn, { backgroundColor: colors.background }]}
            >
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section: App Logo Image */}
        <View style={styles.centerSection}>
          <Image
            source={require("../assets/kelong1.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Right Section: Balanced Spacer to maintain center alignment */}
        <View style={styles.section} />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    width: "100%",
  },
  row: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8, // Reduced vertical padding slightly for images
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  section: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 120, // Adjust width based on your logo's aspect ratio
    height: 40,  // Standard header height for logos
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});