import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TopBar from "../components/TopBar";

export default function NotificationsScreen({ navigation }) {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://192.168.254.185:5000/notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Delete a specific notification
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://192.168.254.185:5000/notifications/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchNotifications(); // Refresh when user goes back
    });
    return unsubscribe;
  }, [navigation]);

  const handlePress = (item) => {
    navigation.navigate("NotificationDetail", { notification: item });
  };

  // Render each notification card
  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handlePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.body, { color: colors.text }]} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={[styles.timestamp, { color: colors.text }]}>
            {item.timestamp}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => deleteNotification(item.id)}
          style={styles.deleteButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="delete" size={22} color="#EF4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    opacity: 0.9,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.6,
    fontStyle: "italic",
  },
  deleteButton: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
