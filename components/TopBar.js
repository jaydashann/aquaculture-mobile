import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorModeContext } from "../colorMode";
import { useAuth } from "../auth";

export default function TopBar({ onNotificationsPress, onBackPress, showBack = false }) {
  const { colors, tokens } = useTheme();
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.displayName || "Guest";

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
              style={[
                styles.placeholderBox,
                { backgroundColor: tokens?.primary?.[400] || colors.primary, opacity: 0.4 },
              ]}
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

          {/* Profile button */}
          <TouchableOpacity
            onPress={() => setMenuOpen(true)}
            style={[styles.iconBtn, { backgroundColor: colors.background }]}
          >
            <Ionicons name="person-circle-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Simple dropdown menu using Modal */}
      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <View />
        </Pressable>

        <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.menuHeader, { color: colors.text }]}>Signed in as</Text>
          <Text style={[styles.menuUser, { color: colors.text }]} numberOfLines={1}>
            {displayName}{user?.isGuest ? " (Guest)" : ""}
          </Text>

          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            onPress={async () => {
              setMenuOpen(false);
              await signOut();
            }}
            style={styles.menuItem}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.text, fontWeight: "600" }}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  right: { flexDirection: "row", gap: 8 },
  placeholderBox: { height: 36, borderRadius: 6, flex: 1, opacity: 0.4 },
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

  // Menu
  backdrop: {
    position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
  },
  menu: {
    position: "absolute",
    top: 56, // just below top bar
    right: 12,
    width: 220,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  menuHeader: { fontSize: 12, opacity: 0.7 },
  menuUser: { fontSize: 14, fontWeight: "700", marginTop: 2 },
  menuDivider: { height: 1, marginVertical: 10, opacity: 0.6 },
  menuItem: { flexDirection: "row", alignItems: "center" },
});
