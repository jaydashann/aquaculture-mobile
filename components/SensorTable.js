import React from "react";
import { View, Text, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/MainScreenStyles";

export default function SensorTable({ sensorData = [] }) {
  return (
    <View style={styles.sensorContainer}>
      <View style={styles.sensorHeader}>
        <MaterialCommunityIcons name="eye" size={20} color="#a5b4fc" style={{ marginRight: 6 }} />
        <Text style={styles.sensorHeaderText}>Sensors (Live Stream)</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colTime]}>Time</Text>
        <Text style={[styles.thNum, styles.colPh]}>pH</Text>
        <Text style={[styles.thNum, styles.colTemp]}>Temp (°C)</Text>
        <Text style={[styles.thNum, styles.colTurb]}>Turbidity</Text>
        <Text style={[styles.thNum, styles.colTds]}>TDS</Text>
      </View>

      <FlatList
        data={sensorData}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => (
          <View style={[styles.tableRow, index % 2 === 0 && styles.zebraRow]}>
            <Text style={[styles.td, styles.colTime]}>{item.time}</Text>
            <Text style={[styles.tdNum, styles.colPh]}>{item.ph}</Text>
            <Text style={[styles.tdNum, styles.colTemp]}>{item.temp}</Text>
            <Text style={[styles.tdNum, styles.colTurb]}>{item.turbidity}</Text>
            <Text style={[styles.tdNum, styles.colTds]}>{item.tds}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="database-off" size={48} color="#64748b" />
            <Text style={styles.emptyText}>Waiting for sensor data...</Text>
            <Text style={styles.emptySubtext}>
              Make sure your ESP8266 or Pi server is connected
            </Text>
          </View>
        )}
      />
    </View>
  );
}
