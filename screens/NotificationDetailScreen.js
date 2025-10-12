import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import TopBar from "../components/TopBar";

export default function NotificationDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { notification } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* TopBar with Back Button */}
      <TopBar
        showBack
        onBackPress={() => navigation.goBack()}
        onNotificationsPress={() => navigation.navigate("Notifications")}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {notification.title}
        </Text>

        <Text style={[styles.body, { color: colors.text }]}>
          {notification.body}
        </Text>

        <View style={styles.metaBox}>
          <Text style={[styles.meta, { color: colors.text }]}>
            Level: {notification.level}
          </Text>
          <Text style={[styles.meta, { color: colors.text }]}>
            Time: {notification.timestamp}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  metaBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 10,
  },
  meta: {
    fontSize: 14,
    opacity: 0.8,
  },
});
