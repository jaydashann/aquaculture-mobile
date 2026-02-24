import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";

import TopBar from "../components/TopBar";
import ChartSection from "../components/ChartSection";
import StatusCard from "../components/StatusCard";
import SensorTable from "../components/SensorTable";
import useSensorData from "../hooks/useSensorData";
import styles from "../styles/MainScreenStyles";

export default function LiveScreen({ navigation }) {
  const { colors } = useTheme();
  const [mode, setMode] = useState("firebase");
  const [scaleMode, setScaleMode] = useState("raw");
  const { sensorData, forecastData } = useSensorData(mode);
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
      type: "sensorTable",
      content: <SensorTable sensorData={sensorData} />,
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
        renderItem={({ item }) => <View>{item.content}</View>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
