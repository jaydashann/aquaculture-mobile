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

export default function LiveScreen({ navigation }) {
  const { colors } = useTheme();
  const { mode, scaleMode, setScaleMode } = useMode();
  const { sensorData, forecastData } = useSensorData(mode);
  const renderItems = [
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
