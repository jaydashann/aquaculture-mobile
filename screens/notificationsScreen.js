import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";
import TopBar from "../components/TopBar";

const MOCK = [
  { id: "1", title: "Model trained", body: "Your YOLO run finished with mAP50=0.78." },
  { id: "2", title: "Storage reminder", body: "Dataset usage reached 85% of quota." },
  { id: "3", title: "New message", body: "Teammate: “Can you push the latest labels?”" },
];

export default function NotificationsScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar onNotificationsPress={() => {}} />
      <FlatList
        data={MOCK}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: colors.text }]}>{item.body}</Text>
          </View>
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
    padding: 12,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  body: { fontSize: 14, opacity: 0.9 },
});
