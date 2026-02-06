import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import styles from "../styles/MainScreenStyles";

export default function ChartSection({ sensorData, scaleMode, setScaleMode }) {
  const last = sensorData.slice(-15);

  // format date/time
  const formatTimestamp = (ts) => {
    const date = new Date(ts || Date.now());

    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateStr} ${timeStr}`;
  };

  // extract chart values
  const phData = last.map((d) => ({ value: +d.ph || 0 }));
  const tempData = last.map((d) => ({ value: +d.temp || 0 }));
  const tdsData = last.map((d) => ({ value: +d.tds || 0 }));
  const turbData = last.map((d) => ({ value: +d.turbidity || 0 }));

  const maxRaw = Math.ceil(
    Math.max(
      ...last.map((d) => +d.ph || 0),
      ...last.map((d) => +d.temp || 0),
      ...last.map((d) => +d.tds || 0),
      ...last.map((d) => +d.turbidity || 0),
      0
    ) * 1.05
  );

  const usingTable = scaleMode === "table";

  return (
    <View style={styles.chartContainer}>
      {/* header and toggle */}
      <View style={styles.chartHeaderRow}>
        <Text style={styles.chartTitle}>Forecasted Data</Text>

        <View style={styles.toggleGroup}>
          {["raw", "table"].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setScaleMode(m)}
              style={[
                styles.toggleBtn,
                scaleMode === m && styles.toggleBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  scaleMode === m && styles.toggleTextActive,
                ]}
              >
                {m === "raw" ? "Chart" : "Table"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* chart view */}
      {!usingTable && (
        <>
          <LineChart
            data={phData}
            data2={tempData}
            data3={tdsData}
            data4={turbData}
            curved
            hideRules
            hideYAxisText
            height={250}
            maxValue={maxRaw}
            backgroundColor="#0f172a"
            spacing={50}
            showXAxisIndices
            color1="#22c55e"
            color2="#3b82f6"
            color3="#facc15"
            color4="#ff4800"
          />

          {/* legends */}
          <View style={styles.chartLegend}>
            {[
              { color: "#22c55e", label: "pH" },
              { color: "#3b82f6", label: "Temp" },
              { color: "#facc15", label: "TDS" },
              { color: "#ff4800", label: "Turbidity" },
            ].map((l) => (
              <View
                key={l.label}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View
                  style={[styles.legendDot, { backgroundColor: l.color }]}
                />
                <Text style={styles.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* table view */}
      {usingTable && (
        <ScrollView horizontal>
          <View style={{ marginTop: 10 }}>
            {/* table header */}
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderColor: "#334155",
              }}
            >
              {["Date/Time", "pH", "Temp", "TDS", "Turb", "Aerator"].map(
                (h) => (
                  <Text
                    key={h}
                    style={{
                      width: 90,
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {h}
                  </Text>
                )
              )}
            </View>

            {/* table rows */}
            {last
              .slice()
              .reverse()
              .map((d, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 8,
                    borderBottomWidth: 0.5,
                    borderColor: "#334155",
                  }}
                >
                  <Text style={tableCell()}>
                    {formatTimestamp(d.rawTimestamp)}
                  </Text>
                  <Text style={tableCell()}>{d.ph}</Text>
                  <Text style={tableCell()}>{d.temp}</Text>
                  <Text style={tableCell()}>{d.tds}</Text>
                  <Text style={tableCell()}>{d.turbidity}</Text>
                  <Text style={tableCell()}>
                    {d.aeratorStatus || "—"}
                  </Text>
                </View>
              ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

/* helper cell style */
const tableCell = () => ({
  width: 90,
  color: "#e2e8f0",
  fontSize: 11,
  textAlign: "center",
});
