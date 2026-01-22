import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";
import TopBar from "../components/TopBar";
import ChartSection from "../components/ChartSection";
import StatusCard from "../components/StatusCard";
import SensorTable from "../components/SensorTable";
import DebugInfo from "../components/DebugInfo";
import useSensorData from "../hooks/useSensorData";
import styles from "../styles/MainScreenStyles";

export default function MainScreen({ navigation }) {
  const { colors } = useTheme();
  const [mode, setMode] = useState("firebase"); // firebase | local
  const [scaleMode, setScaleMode] = useState("raw");
  const [notifications, setNotifications] = useState([]);
  const [aeratorStatus, setAeratorStatus] = useState({
    isActive: false, // off is initial state
    lastUpdated: "10/11/2025, 7:49:41 PM",
  });

  // fetch notification from flask backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://192.168.100.7:5000/notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  // fetch aerator status
  const fetchAeratorStatus = async () => {
    try {
      const response = await fetch("http://192.168.100.7:5000/aerator-status");
      const data = await response.json();
      setAeratorStatus(data);
    } catch (error) {
      console.warn("Aerator status not found, using default state.");
    }
  };

  const toggleAerator = async () => {
    try {
      const newStatus = aeratorStatus.isActive ? "OFF" : "ON";  // toggle to on and off
      const response = await fetch("http://192.168.100.7:5000/aerator-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // send "status" instead of "isActive"
      });
      const data = await response.json();
      if (data.status === "success") {
        setAeratorStatus({
          isActive: newStatus === "ON",  // update the active state based on the new status
          lastUpdated: data.lastUpdated,
        });
      }
    } catch (error) {
      console.error("Error toggling aerator", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAeratorStatus();

    // auto-refresh aerator status every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchAeratorStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { sensorData, forecastData } = useSensorData(mode);

  // data for FlatList rendering
  const renderItems = [
// debug info section
//    {
//      type: "debug",
//      content: <DebugInfo data={sensorData} />,
//    },
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

          {/* cycle through the 3 modes */}
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
          subtitle={`Since ${aeratorStatus.lastUpdated}`}
          icon="autorenew"
          active={aeratorStatus.isActive}
          onPress={toggleAerator}
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
      {/* --- top bar --- */}
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
