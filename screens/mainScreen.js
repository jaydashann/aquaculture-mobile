import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";
import TopBar from "../components/TopBar";

export default function MainScreen({ navigation }) {
  const { colors } = useTheme();
  const [sensorData, setSensorData] = useState([]);

  const aeratorStatus = {
    isActive: true,
    lastUpdated: "10/11/2025, 7:49:41 PM",
  };

  const latestNotification = {
    title: "Low Dissolved Oxygen Detected",
    message: "Aerator was automatically activated to stabilize water quality.",
    time: "10/12/2025, 7:30:05 AM",
  };

  // Random sensor generator
  const generateRandomData = () => ({
    id: Math.random().toString(36).substring(7),
    ph: (7.5 + Math.random() * 1.0).toFixed(1),
    temp: (25 + Math.random() * 3).toFixed(1),
    turbidity: (0.5 + Math.random() * 2).toFixed(1),
    tds: (1000 + Math.random() * 400).toFixed(0),
    time: new Date().toLocaleTimeString(),
  });

  // Initialize + continuous stream
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, generateRandomData);
    setSensorData(initialData);

    const interval = setInterval(() => {
      setSensorData((prev) => [...prev, generateRandomData()]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Prepare chart data
  const phData = sensorData.slice(-15).map((d) => ({ value: parseFloat(d.ph) }));
  const tempData = sensorData
    .slice(-15)
    .map((d) => ({ value: parseFloat(d.temp) }));
  const tdsData = sensorData
    .slice(-15)
    .map((d) => ({ value: parseFloat(d.tds) }));

  // Header content (Chart + Aerator + Notification)
  const renderHeader = () => (
    <View>
      {/* Live Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Trends and Patterns</Text>
        <LineChart
          data={phData}
          data2={tempData}
          data3={tdsData}
          thickness={2}
          color1="#22c55e" // pH
          color2="#3b82f6" // Temperature
          color3="#facc15" // TDS
          curved
          animateOnDataChange
          animationDuration={600}
          hideRules
          hideYAxisText
          height={180}
          backgroundColor="#0f172a"
          xAxisColor="#1e293b"
          yAxisColor="#1e293b"
          startOpacity={0.9}
          endOpacity={0.1}
          areaChart
        />
        <View style={styles.chartLegend}>
          <View style={[styles.legendItem, { backgroundColor: "#22c55e" }]} />
          <Text style={styles.legendText}>pH</Text>
          <View style={[styles.legendItem, { backgroundColor: "#3b82f6" }]} />
          <Text style={styles.legendText}>Temp</Text>
          <View style={[styles.legendItem, { backgroundColor: "#facc15" }]} />
          <Text style={styles.legendText}>TDS</Text>
        </View>
      </View>

      {/* Aerator Status */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIconWrapper,
            { backgroundColor: aeratorStatus.isActive ? "#34d399" : "#9ca3af" },
          ]}
        >
          <MaterialCommunityIcons name="autorenew" size={24} color="#fff" />
        </View>
        <View style={styles.statusTextWrapper}>
          <Text style={styles.statusTitle}>Aerator</Text>
          <Text style={styles.statusSince}>
            Since {aeratorStatus.lastUpdated}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: aeratorStatus.isActive ? "#22c55e" : "#ef4444" },
          ]}
        >
          <Text style={styles.statusBadgeText}>
            {aeratorStatus.isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Notifications */}
      <TouchableOpacity
        style={styles.statusContainer}
        onPress={() => navigation.navigate("Notifications")}
        activeOpacity={0.8}
      >
        <View
          style={[styles.statusIconWrapper, { backgroundColor: "#3b82f6" }]}
        >
          <MaterialCommunityIcons name="bell-ring" size={24} color="#fff" />
        </View>

        <View style={styles.statusTextWrapper}>
          <Text style={styles.statusTitle}>Notification & Alerts</Text>
          <Text style={styles.notificationTitle}>
            {latestNotification.title}
          </Text>
          <Text style={styles.notificationMessage}>
            {latestNotification.message}
          </Text>
          <Text style={styles.statusSince}>Since {latestNotification.time}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: "#3b82f6" }]}>
          <Text style={styles.statusBadgeText}>View</Text>
        </View>
      </TouchableOpacity>

      {/* Table Header */}
      <View style={styles.sensorContainer}>
        <View style={styles.sensorHeader}>
          <MaterialCommunityIcons
            name="eye"
            size={20}
            color="#a5b4fc"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.sensorHeaderText}>Sensors (Live Stream)</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Time</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>pH</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Temp (°C)</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Turbidity</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>TDS</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <TopBar
        onNotificationsPress={() => navigation.navigate("Notifications")}
        badgeCount={3}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Single FlatList with header + data */}
      <FlatList
        ListHeaderComponent={renderHeader}
        data={sensorData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{item.time}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{item.ph}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{item.temp}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{item.turbidity}</Text>
            <Text style={[styles.tableCell, { flex: 1.8 }]}>{item.tds}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  // Chart
  chartContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    padding: 15,
  },
  chartTitle: {
    color: "#a5b4fc",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  legendText: {
    color: "#cbd5e1",
    fontSize: 12,
    marginHorizontal: 4,
  },

  // Status cards
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e293b",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  statusIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusTextWrapper: { flex: 1 },
  statusTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  statusSince: { fontSize: 12, color: "#cbd5e1", marginTop: 4 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  statusBadgeText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  notificationTitle: { color: "#facc15", fontWeight: "600", fontSize: 14 },
  notificationMessage: { color: "#e2e8f0", fontSize: 12 },

  // Table
  sensorContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 0,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  sensorHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sensorHeaderText: { color: "#a5b4fc", fontSize: 18, fontWeight: "700" },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableHeaderCell: { color: "#cbd5e1", fontWeight: "600", fontSize: 12 },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1e293b",
    paddingHorizontal: 20,
  },
  tableCell: { color: "#f8fafc", fontSize: 12 },
});
