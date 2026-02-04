import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import styles from "../styles/MainScreenStyles";

export default function ChartSection({ sensorData, scaleMode, setScaleMode }) {
  const last = sensorData.slice(-15);

  // extract date and time labels
  const timeLabels = last.map((d) => {
    const ts = d.rawTimestamp || Date.now();
    const date = new Date(ts);

    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateStr}\n${timeStr}`; // multi-line x-axis label
  });

  // extract values
  const phVals = last.map((d) => +d.ph || 0);
  const tempVals = last.map((d) => +d.temp || 0);
  const tdsVals = last.map((d) => +d.tds || 0);
  const turbVals = last.map((d) => +d.turbidity || 0);

  // chart data w/ labels
  const phData = last.map((d, i) => ({
    value: parseFloat(d.ph),
    label: timeLabels[i],
  }));

  const tempData = last.map((d, i) => ({
    value: parseFloat(d.temp),
    label: timeLabels[i],
  }));

  const tdsData = last.map((d, i) => ({
    value: parseFloat(d.tds),
    label: timeLabels[i],
  }));

  const turbData = last.map((d, i) => ({
    value: parseFloat(d.turbidity),
    label: timeLabels[i],
  }));

  // normalization function
  const normalize = (arr, labels) => {
    if (!arr.length) return [];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;
    return arr.map((v, i) => ({
      value: ((v - min) / range) * 100,
      label: labels[i],
    }));
  };

  const usingNorm = scaleMode === "norm";

  const maxRaw = Math.ceil(
    Math.max(...phVals, ...tempVals, ...tdsVals, ...turbVals, 0) * 1.05
  );

  const maxValue = usingNorm ? 100 : maxRaw;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeaderRow}>
        <Text style={styles.chartTitle}>Forecasted Data</Text>

        <View style={styles.toggleGroup}>
          {["raw", "norm"].map((m) => (
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
                {m === "raw" ? "Raw" : "Normalized"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* line chart with data time labels */}
      <LineChart
        data={usingNorm ? normalize(phVals, timeLabels) : phData}
        data2={usingNorm ? normalize(tempVals, timeLabels) : tempData}
        data3={usingNorm ? normalize(tdsVals, timeLabels) : tdsData}
        data4={usingNorm ? normalize(turbVals, timeLabels) : turbData}
        curved
        hideRules
        hideYAxisText
        height={250}
        maxValue={maxValue}
        backgroundColor="#0f172a"
        spacing={50}
        xAxisLabelStyle={{
          color: "#ffffff",
          fontSize: 10,
          textAlign: "center",
        }}
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
    </View>
  );
}
