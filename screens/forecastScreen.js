import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";

import TopBar from "../components/TopBar";
import ChartSection from "../components/ChartSection";
import StatusCard from "../components/StatusCard";
import SensorTable from "../components/SensorTable";
import useSensorData from "../hooks/useSensorData";
import styles from "../styles/MainScreenStyles";

import { useMode } from "../modeContext";

export default function ForecastScreen({ navigation }) {
  const { colors } = useTheme();

  const { mode, scaleMode, setScaleMode } = useMode();
  const { sensorData, forecastData } = useSensorData(mode);

  const [aeratorStatus, setAeratorStatus] = useState({
    mode: "OFF",
    isActive: false,
  });

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

  // --- cycle OFF > ON > AUTO ---
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

  // --- flatList items ---
  const renderItems = [
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
  ];

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <TopBar />

      <FlatList
        data={renderItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <View>{item.content}</View>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
