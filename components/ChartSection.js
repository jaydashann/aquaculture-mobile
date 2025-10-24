import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import styles from "../styles/MainScreenStyles";

export default function ChartSection({ sensorData, scaleMode, setScaleMode }) {
  const last = sensorData.slice(-15);

  // Extract data arrays
  const phVals = last.map((d) => +d.ph || 0);
  const tempVals = last.map((d) => +d.temp || 0);
  const tdsVals = last.map((d) => +d.tds || 0);
  const turbVals = last.map((d) => +d.turbidity || 0);

  const normalize = (arr) => {
    if (!arr.length) return [];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;
    return arr.map((v) => ({ value: ((v - min) / range) * 100 }));
  };

  const phData = phVals.map((v) => ({ value: v }));
  const tempData = tempVals.map((v) => ({ value: v }));
  const tdsData = tdsVals.map((v) => ({ value: v }));
  const turbData = turbVals.map((v) => ({ value: v }));

  const usingNorm = scaleMode === "norm";
  const maxRaw = Math.ceil(Math.max(...phVals, ...tempVals, ...tdsVals, ...turbVals, 0) * 1.05);
  const maxValue = usingNorm ? 100 : maxRaw;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeaderRow}>
        <Text style={styles.chartTitle}>Trends and Patterns</Text>
        <View style={styles.toggleGroup}>
          {["raw", "norm"].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setScaleMode(m)}
              style={[styles.toggleBtn, scaleMode === m && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, scaleMode === m && styles.toggleTextActive]}>
                {m === "raw" ? "Raw" : "Normalized"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <LineChart
        data={usingNorm ? normalize(phVals) : phData}
        data2={usingNorm ? normalize(tempVals) : tempData}
        data3={usingNorm ? normalize(tdsVals) : tdsData}
        data4={usingNorm ? normalize(turbVals) : turbData}
        color1="#22c55e"
        color2="#3b82f6"
        color3="#facc15"
        color4="#ff4800"
        curved
        hideRules
        hideYAxisText
        height={200}
        backgroundColor="#0f172a"
        maxValue={maxValue}
      />

      <View style={styles.chartLegend}>
        {[
          { color: "#22c55e", label: "pH" },
          { color: "#3b82f6", label: "Temp" },
          { color: "#facc15", label: "TDS" },
          { color: "#ff4800", label: "Turbidity" },
        ].map((l) => (
          <View key={l.label} style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={[styles.legendDot, { backgroundColor: l.color }]} />
            <Text style={styles.legendText}>{l.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
