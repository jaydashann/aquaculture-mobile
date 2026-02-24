import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

import TopBar from "../components/TopBar";
import StatusCard from "../components/StatusCard";
import { useAuth } from "../auth"; // 1. Import useAuth
import styles from "../styles/MainScreenStyles";

export default function UserScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth(); // 2. Destructure user and signOut
  const [notifications, setNotifications] = useState([]);

  // --- fetch Notifications ---
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://192.168.100.7:5000/notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // 3. Add User info and Logout to the renderItems
    const renderItems = [
      {
        type: "profileHeader",
        content: (
          <View style={localStyles.profileCard}>
            <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
               <Ionicons name="person" size={40} color="white" />
            </View>
            <Text style={[localStyles.userName, { color: colors.text }]}>
              {user?.displayName || "User"}
            </Text>
            <Text style={[localStyles.userEmail, { color: colors.text, opacity: 0.6 }]}>
              {user?.email || "Guest"}
            </Text>
          </View>
        ),
      },
      {
        type: "notification",
        content: (
          <StatusCard
            title="Notifications"
            subtitle={`You have ${notifications.length} notifications`}
            icon="bell-ring"
            onPress={() => navigation.navigate("Notifications")}
            color="#3b82f6"
          />
        ),
      },
      {
        type: "logout",
        content: (
          /* Custom Logout Button replacing the StatusCard */
          <TouchableOpacity
            onPress={async () => await signOut()}
            style={localStyles.logoutButton}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={localStyles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ),
      },
    ];

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <TopBar
        onNotificationsPress={() => navigation.navigate("Notifications")}
      />

      <FlatList
        data={renderItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <View style={{ paddingHorizontal: 16, marginTop: 10 }}>{item.content}</View>}
        contentContainerStyle={{ paddingBottom: 100 }} // Space for floating tab bar
      />
    </View>
  );
}

// 4. Local styles for the profile look
const localStyles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  logoutButton: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: '#ef4444', // Red color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 5,
    marginHorizontal: 4, // Aligns with the width of your StatusCards
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});