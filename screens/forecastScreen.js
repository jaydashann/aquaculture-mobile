import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";

import TopBar from "../components/TopBar";
import ChartSection from "../components/ChartSection";
import StatusCard from "../components/StatusCard";
import SensorTable from "../components/SensorTable";
import useSensorData from "../hooks/useSensorData";
import styles from "../styles/MainScreenStyles";

export default function ForecastScreen({ navigation }) {
  const { colors } = useTheme();

  const [mode, setMode] = useState("firebase");
  const [scaleMode, setScaleMode] = useState("raw");

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

  // --- auto refresh ---
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { sensorData, forecastData } = useSensorData(mode);

  // --- flatList items ---
  const renderItems = [
    {
      type: "modeSwitch",
      content: (
        <View style={styles.modeSwitch}>
          <Text style={styles.modeLabel}>
            {mode === "firebase"
              ? "☁️ Firebase Cloud Mode"
              : mode === "local"
              ? "📡 Local Flask Mode"
              : "🎨 Demo Mode"}
          </Text>

          <Switch
            value={mode !== "firebase"}
            onValueChange={() => {
              if (mode === "firebase") setMode("local");
              else if (mode === "local") setMode("demo");
              else setMode("firebase");
            }}
          />
        </View>
      ),
    },

    {
      type: "chartSection",
      content: (
        <ChartSection
          sensorData={sensorData}
          forecastData={forecastData}
          scaleMode={scaleMode}
          setScaleMode={setScaleMode}
        />
      ),
    },

    {
      type: "notification",
      content: (
        <StatusCard
          title="Notifications"
          subtitle={`You have ${notifications.length} new notifications`}
          icon="bell-ring"
          onPress={() => navigation.navigate("Notifications")}
          color="#3b82f6"
        />
      ),
    },
  ];

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <TopBar
        onNotificationsPress={() => navigation.navigate("Notifications")}
        badgeCount={notifications.length}
      />

      <FlatList
        data={renderItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <View>{item.content}</View>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
