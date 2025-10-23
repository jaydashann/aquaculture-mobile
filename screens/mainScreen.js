import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";
import TopBar from "../components/TopBar";
import { db } from "../firebase"; // ✅ Firebase Realtime DB instance
import { ref, onValue, get } from "firebase/database"; // ✅ Listener

export default function MainScreen({ navigation }) {
  const { colors } = useTheme();
  const [sensorData, setSensorData] = useState([]);
  const [scaleMode, setScaleMode] = useState("raw"); // 'raw' | 'norm'

  // Aerator status (static for now, can be made dynamic later)
  const aeratorStatus = {
    isActive: true,
    lastUpdated: "10/11/2025, 7:49:41 PM",
  };

  // Latest notification (sample)
  const latestNotification = {
    title: "Low Dissolved Oxygen Detected",
    message: "Aerator was automatically activated to stabilize water quality.",
    time: "10/12/2025, 7:30:05 AM",
  };

  // Test Firebase read - call this manually
  const testFirebaseRead = async () => {
    try {
      console.log("🧪 Testing Firebase read...");
      const sensorRef = ref(db, "sensor_data");
      const snapshot = await get(sensorRef);

      if (snapshot.exists()) {
        console.log("✅ Data exists:", snapshot.val());
      } else {
        console.log("❌ No data available");
      }
    } catch (error) {
      console.error("❌ Error reading from Firebase:", error);
    }
  };

  // Call test once on mount
  useEffect(() => {
    testFirebaseRead();
  }, []);

  // ✅ Real-time Firebase listener with better debugging
  useEffect(() => {
    console.log("🔥 Setting up Firebase listener...");

    const sensorRef = ref(db, "sensor_data");

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        console.log("📥 Firebase snapshot received");

        const data = snapshot.val();

        if (!data) {
          console.log("⚠️ No data received from Firebase.");
          setSensorData([]);
          return;
        }

        console.log("✅ Raw data from Firebase:", JSON.stringify(data, null, 2));

        // Handle both single-object and multi-object formats
        let entries = [];

        if (Array.isArray(data)) {
          console.log("📊 Data is an array");
          entries = data.map((val, i) => ({
            id: i.toString(),
            ph: parseFloat(val.ph || 0).toFixed(2),
            temp: parseFloat(val.temperature || 0).toFixed(2),
            turbidity: parseFloat(val.turbidity || 0).toFixed(2),
            tds: parseFloat(val.tds || 0).toFixed(0),
            time: new Date().toLocaleTimeString(),
            rawTimestamp: val.timestamp || Date.now(),
          }));
        } else if (typeof data === "object") {
          console.log("📊 Data is an object");
          entries = Object.entries(data).map(([key, val]) => {
            console.log(`Processing entry ${key}:`, val);

            return {
              id: key,
              ph: parseFloat(val.ph || 0).toFixed(2),
              temp: parseFloat(val.temperature || 0).toFixed(2),
              turbidity: parseFloat(val.turbidity || 0).toFixed(2),
              tds: parseFloat(val.tds || 0).toFixed(0),
              time: new Date().toLocaleTimeString(),
              rawTimestamp: val.timestamp || Date.now(),
            };
          });
        }

        console.log(`✅ Processed ${entries.length} entries`);

        // Sort by rawTimestamp (numeric sort)
        entries.sort((a, b) => a.rawTimestamp - b.rawTimestamp);

        // Keep the most recent 20 readings
        const recent = entries.slice(-20);

        console.log("📊 Setting sensor data:", recent.length, "items");
        setSensorData(recent);
      },
      (error) => {
        console.error("❌ Firebase listener error:", error);
      }
    );

    return () => {
      console.log("🔌 Unsubscribing from Firebase");
      unsubscribe();
    };
  }, []);

  // ---- Prepare chart data (last 15 points) ----
  const last = sensorData.slice(-15);
  const phVals = last.map((d) => +d.ph || 0);
  const tempVals = last.map((d) => +d.temp || 0);
  const tdsVals = last.map((d) => +d.tds || 0);
  const turbVals = last.map((d) => +d.turbidity || 0);

  const phData = phVals.map((v) => ({ value: v }));
  const tempData = tempVals.map((v) => ({ value: v }));
  const tdsData = tdsVals.map((v) => ({ value: v }));
  const turbidityData = turbVals.map((v) => ({ value: v }));

  // Global max for unified y-axis
  const globalMaxRaw = Math.max(
    ...(phVals.length ? phVals : [0]),
    ...(tempVals.length ? tempVals : [0]),
    ...(tdsVals.length ? tdsVals : [0]),
    ...(turbVals.length ? turbVals : [0])
  );
  const maxValueRaw = Math.ceil(globalMaxRaw * 1.05);

  // Normalized 0–100 (optional)
  const normalize = (arr) => {
    if (!arr.length) return [];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;
    return arr.map((v) => ({ value: ((v - min) / range) * 100 }));
  };

  const phDataNorm = normalize(phVals);
  const tempDataNorm = normalize(tempVals);
  const tdsDataNorm = normalize(tdsVals);
  const turbidityDataNorm = normalize(turbVals);

  const usingNorm = scaleMode === "norm";
  const displayData1 = usingNorm ? phDataNorm : phData;
  const displayData2 = usingNorm ? tempDataNorm : tempData;
  const displayData3 = usingNorm ? tdsDataNorm : tdsData;
  const displayData4 = usingNorm ? turbidityDataNorm : turbidityData;
  const maxValue = usingNorm ? 100 : maxValueRaw;

  // Header (Chart + Aerator + Notification)
  const renderHeader = () => (
    <View>
      {/* Live Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.chartTitle}>Trends and Patterns</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              onPress={() => setScaleMode("raw")}
              style={[
                styles.toggleBtn,
                scaleMode === "raw" && styles.toggleBtnActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  scaleMode === "raw" && styles.toggleTextActive,
                ]}
              >
                Raw
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScaleMode("norm")}
              style={[
                styles.toggleBtn,
                scaleMode === "norm" && styles.toggleBtnActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  scaleMode === "norm" && styles.toggleTextActive,
                ]}
              >
                Normalized
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <LineChart
          data={displayData1}
          data2={displayData2}
          data3={displayData3}
          data4={displayData4}
          maxValue={maxValue}
          thickness={2}
          thickness2={2}
          thickness3={2}
          thickness4={2}
          color1="#22c55e" // pH
          color2="#3b82f6" // Temperature
          color3="#facc15" // TDS
          color4="#ff4800" // Turbidity
          curved
          animateOnDataChange
          animationDuration={600}
          hideRules
          hideYAxisText
          height={200}
          backgroundColor="#0f172a"
          xAxisColor="#1e293b"
          yAxisColor="#1e293b"
          startOpacity={0.9}
          endOpacity={0.1}
        />
        <View style={styles.chartLegend}>
          <View style={[styles.legendDot, { backgroundColor: "#22c55e" }]} />
          <Text style={styles.legendText}>pH</Text>
          <View style={[styles.legendDot, { backgroundColor: "#3b82f6" }]} />
          <Text style={styles.legendText}>Temp</Text>
          <View style={[styles.legendDot, { backgroundColor: "#facc15" }]} />
          <Text style={styles.legendText}>TDS</Text>
          <View style={[styles.legendDot, { backgroundColor: "#ff4800" }]} />
          <Text style={styles.legendText}>Turbidity</Text>
        </View>
        {usingNorm ? (
          <Text style={styles.noteText}>
            Showing normalized values (0–100) to compare trends. Raw values are
            still listed in the table below.
          </Text>
        ) : null}
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
          <Text style={[styles.th, styles.colTime]}>Time</Text>
          <Text style={[styles.thNum, styles.colPh]}>pH</Text>
          <Text style={[styles.thNum, styles.colTemp]}>Temp (°C)</Text>
          <Text style={[styles.thNum, styles.colTurb]}>Turbidity</Text>
          <Text style={[styles.thNum, styles.colTds]}>TDS</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <TopBar
        onNotificationsPress={() => navigation.navigate("Notifications")}
        badgeCount={3}
      />

      {/* 🧪 TEMPORARY DEBUG VIEW */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Info:</Text>
        <Text style={styles.debugText}>
          Data entries: {sensorData.length}
        </Text>
        {sensorData.length > 0 && (
          <>
            <Text style={styles.debugText}>
              Last pH: {sensorData[sensorData.length - 1].ph}
            </Text>
            <Text style={styles.debugText}>
              Last Temp: {sensorData[sensorData.length - 1].temp}°C
            </Text>
            <Text style={styles.debugText}>
              Last TDS: {sensorData[sensorData.length - 1].tds}
            </Text>
            <Text style={styles.debugText}>
              Last Turbidity: {sensorData[sensorData.length - 1].turbidity}
            </Text>
          </>
        )}
        {sensorData.length === 0 && (
          <Text style={[styles.debugText, { color: '#ef4444' }]}>
            ⚠️ No data received yet. Check console logs.
          </Text>
        )}
      </View>

      <FlatList
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ paddingBottom: 0 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        data={sensorData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={[styles.tableRow, index % 2 === 0 && styles.zebraRow]}
          >
            <Text numberOfLines={1} style={[styles.td, styles.colTime]}>
              {item.time}
            </Text>
            <Text style={[styles.tdNum, styles.colPh]}>{item.ph}</Text>
            <Text style={[styles.tdNum, styles.colTemp]}>{item.temp}</Text>
            <Text style={[styles.tdNum, styles.colTurb]}>
              {item.turbidity}
            </Text>
            <Text style={[styles.tdNum, styles.colTds]}>{item.tds}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="database-off"
              size={48}
              color="#64748b"
            />
            <Text style={styles.emptyText}>
              Waiting for sensor data...
            </Text>
            <Text style={styles.emptySubtext}>
              Make sure your ESP8266 is connected and sending data
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  debugContainer: {
    padding: 15,
    backgroundColor: '#1e293b',
    margin: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  debugTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  debugText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 4,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    padding: 15,
    overflow: "hidden",
  },
  chartHeaderRow: { flexDirection: "row", alignItems: "center" },
  chartTitle: {
    color: "#a5b4fc",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    flex: 1,
  },
  toggleGroup: {
    flexDirection: "row",
    backgroundColor: "#0b1224",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  toggleBtnActive: { backgroundColor: "#1f2b4a" },
  toggleText: { color: "#94a3b8", fontSize: 12, fontWeight: "600" },
  toggleTextActive: { color: "#e2e8f0" },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  legendText: { color: "#cbd5e1", fontSize: 12, marginHorizontal: 4 },
  noteText: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
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
  notificationTitle: {
    color: "#facc15",
    fontWeight: "600",
    fontSize: 14,
  },
  notificationMessage: { color: "#e2e8f0", fontSize: 12 },
  sensorContainer: {
    marginHorizontal: 20,
    marginBottom: 0,
    paddingTop: 15,
    paddingBottom: 6,
  },
  sensorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sensorHeaderText: { color: "#a5b4fc", fontSize: 18, fontWeight: "700" },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 6,
    marginBottom: 2,
  },
  colTime: { flex: 1.5 },
  colPh: { flex: 0.8 },
  colTemp: { flex: 1.0 },
  colTurb: { flex: 1.0 },
  colTds: { flex: 1.1 },
  th: { color: "#cbd5e1", fontWeight: "700", fontSize: 12 },
  thNum: {
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1e293b",
  },
  zebraRow: { backgroundColor: "#0b1224" },
  td: { color: "#f8fafc", fontSize: 12 },
  tdNum: {
    color: "#f8fafc",
    fontSize: 12,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
    fontFamily: Platform.OS === "android" ? "monospace" : undefined,
  },
});