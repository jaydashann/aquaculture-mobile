import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";

import TopBar from "../components/TopBar";
import ChartSection from "../components/ChartSection";
import StatusCard from "../components/StatusCard";
import SensorTable from "../components/SensorTable";
import useSensorData from "../hooks/useSensorData";
import styles from "../styles/MainScreenStyles";

export default function MainScreen({ navigation }) {
  const { colors } = useTheme();

  const [mode, setMode] = useState("firebase");
  const [scaleMode, setScaleMode] = useState("raw");

  const [notifications, setNotifications] = useState([]);

  const [aeratorStatus, setAeratorStatus] = useState({
    mode: "OFF",
    isActive: false,
  });

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

  // --- fetch aerator status ---
  const fetchAeratorStatus = async () => {
    try {
      const response = await fetch("http://192.168.100.7:5000/aerator-status");
      const data = await response.json();
      setAeratorStatus(data);
    } catch (error) {
      console.warn("Aerator status not found.");
    }
  };

  // --- cycle OFF → ON → AUTO ---
  const cycleAeratorMode = async () => {
    let nextMode = "OFF";

    if (aeratorStatus.mode === "OFF") nextMode = "ON";
    else if (aeratorStatus.mode === "ON") nextMode = "AUTO";
    else if (aeratorStatus.mode === "AUTO") nextMode = "OFF";

    try {
      const response = await fetch(
        "http://192.168.100.7:5000/aerator-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mode: nextMode }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        fetchAeratorStatus();
      }
    } catch (error) {
      console.error("Error changing aerator mode:", error);
    }
  };

  // --- auto refresh ---
  useEffect(() => {
    fetchNotifications();
    fetchAeratorStatus();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchAeratorStatus();
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
      type: "aeratorStatus",
      content: (
        <StatusCard
          title="Aerator"
          subtitle={`Mode: ${aeratorStatus.mode}`}
          icon={
            aeratorStatus.mode === "AUTO"
              ? "autorenew"
              : aeratorStatus.mode === "ON"
              ? "power"
              : "power-off"
          }
          active={aeratorStatus.isActive}
          onPress={cycleAeratorMode}
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

    {
      type: "sensorTable",
      content: <SensorTable sensorData={sensorData} />,
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
