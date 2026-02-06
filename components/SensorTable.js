import React from "react";
import { View, Text, FlatList, ScrollView } from "react-native"; // 1. Import ScrollView
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/MainScreenStyles";

export default function SensorTable({ sensorData = [] }) {
  return (
    <View style={styles.sensorContainer}>
      <View style={styles.sensorHeader}>
        <MaterialCommunityIcons name="eye" size={20} color="#a5b4fc" style={{ marginRight: 6 }} />
        <Text style={styles.sensorHeaderText}>Live Data Stream</Text>
      </View>

      <ScrollView horizontalShowsHorizontalScrollIndicator={true} horizontal={true}>
        <View>
          {/* header row */}
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colTime]}>Time</Text>
            <Text style={[styles.thNum, styles.colPh]}>pH</Text>
            <Text style={[styles.thNum, styles.colTemp]}>Temp (°C)</Text>
            <Text style={[styles.thNum, styles.colTurb]}>Turbidity</Text>
            <Text style={[styles.thNum, styles.colTds]}>TDS</Text>
            <Text style={[styles.thNum, styles.colAerator]}>Aerator</Text>
          </View>

          {/* data list */}
          <FlatList
            data={sensorData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={[styles.tableRow, index % 2 === 0 && styles.zebraRow]}>
                <Text style={[styles.td, styles.colTime]}>{item.time}</Text>
                <Text style={[styles.tdNum, styles.colPh]}>{item.ph}</Text>
                <Text style={[styles.tdNum, styles.colTemp]}>{item.temp}</Text>
                <Text style={[styles.tdNum, styles.colTurb]}>{item.turbidity}</Text>
                <Text style={[styles.tdNum, styles.colTds]}>{item.tds}</Text>

                  <View style={[styles.tdNum, styles.colAerator]}>
                    <Text style={{
                      color: item.aerator === "ON" ? "#4ade80" : "#f87171", // green for ON, red for OFF
                      fontWeight: "bold",
                      fontSize: 12
                    }}>
                      {item.aerator}
                    </Text>
                  </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}