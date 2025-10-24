import React from "react";
import { View, Text, Platform } from "react-native";
import styles from "../styles/MainScreenStyles";

export default function DebugInfo({ data = [] }) {
  const last = data[data.length - 1];

  return (
    <View style={styles.debugContainer}>
      <Text style={styles.debugTitle}>Debug Info:</Text>
      <Text style={styles.debugText}>Data entries: {data.length}</Text>

      {last ? (
        <View>
          <Text style={styles.debugText}>Last pH: {last.ph}</Text>
          <Text style={styles.debugText}>Last Temp: {last.temp}°C</Text>
          <Text style={styles.debugText}>Last TDS: {last.tds}</Text>
          <Text style={styles.debugText}>Last Turbidity: {last.turbidity}</Text>
        </View>
      ) : (
        <Text style={[styles.debugText, { color: "#ef4444" }]}>
          ⚠️ No data received yet. Check console logs.
        </Text>
      )}
    </View>
  );
}
