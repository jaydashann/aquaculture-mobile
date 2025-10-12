import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import TopBar from "../components/TopBar";

const MOCK = [
  {
    id: "1",
    title: "High Turbidity Detected",
    body: "Turbidity spiked above the 10 NTU threshold for 3 minutes.",
    timestamp: "10/12/2025, 7:40 AM",
    level: "Critical",
  },
  {
    id: "2",
    title: "Temperature Normalized",
    body: "Temperature returned to normal range after 15 minutes.",
    timestamp: "10/12/2025, 7:25 AM",
    level: "Info",
  },
  {
    id: "3",
    title: "Aerator Running",
    body: "Aerator has been continuously active for 2 hours.",
    timestamp: "10/12/2025, 7:10 AM",
    level: "Notice",
  },
];

export default function NotificationsScreen({ navigation }) {
  const { colors } = useTheme();

  const handlePress = (item) => {
    navigation.navigate("NotificationDetail", { notification: item });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar
        onNotificationsPress={() => {}}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={MOCK}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handlePress(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: colors.text }]} numberOfLines={2}>
              {item.body}
            </Text>
            <Text style={[styles.timestamp, { color: colors.text }]}>
              {item.timestamp}
            </Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 14,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  body: { fontSize: 14, opacity: 0.9 },
  timestamp: {
    fontSize: 12,
    marginTop: 8,
    opacity: 0.7,
    fontStyle: "italic",
  },
});
