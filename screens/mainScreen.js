import React, { useState } from "react";
import { View, Text, Switch, ScrollView } from "react-native"; // ✅ added ScrollView
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
  const [mode, setMode] = useState("firebase");
  const [scaleMode, setScaleMode] = useState("raw");
  const sensorData = useSensorData(mode);

  const aeratorStatus = { isActive: true, lastUpdated: "10/11/2025, 7:49:41 PM" };
  const latestNotification = {
    title: "Low Dissolved Oxygen Detected",
    message: "Aerator was automatically activated to stabilize water quality.",
    time: "10/12/2025, 7:30:05 AM",
  };

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <TopBar onNotificationsPress={() => navigation.navigate("Notifications")} badgeCount={3} />

      {/* ✅ Make the content scrollable */}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <DebugInfo data={sensorData} />

        <View style={styles.modeSwitch}>
          <Text style={styles.modeLabel}>
            {mode === "firebase" ? "☁️ Firebase Cloud Mode" : "📡 Local Flask Mode"}
          </Text>
          <Switch
            value={mode === "local"}
            onValueChange={(v) => setMode(v ? "local" : "firebase")}
          />
        </View>

        <ChartSection
          sensorData={sensorData}
          scaleMode={scaleMode}
          setScaleMode={setScaleMode}
        />

        <StatusCard
          title="Aerator"
          subtitle={`Since ${aeratorStatus.lastUpdated}`}
          icon="autorenew"
          active={aeratorStatus.isActive}
        />

        <StatusCard
          title="Notification & Alerts"
          subtitle={latestNotification.title}
          message={latestNotification.message}
          time={latestNotification.time}
          icon="bell-ring"
          onPress={() => navigation.navigate("Notifications")}
          color="#3b82f6"
        />

        <SensorTable sensorData={sensorData} />
      </ScrollView>
    </View>
  );
}
