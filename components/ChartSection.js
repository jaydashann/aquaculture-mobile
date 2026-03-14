import React from "react";
import { View, Text, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import styles from "../styles/MainScreenStyles";

export default function ChartSection({ sensorData = [] }) {
  // Get last 20 readings
  const last = sensorData.slice(-20);

  const formatXAxisTime = (ts) => {
    const date = new Date(ts || Date.now());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Map data for the 4 lines
  const phData = last.map((d) => ({
    value: +d.ph || 0,
    label: formatXAxisTime(d.rawTimestamp || d.time),
    labelTextStyle: { color: '#94a3b8', fontSize: 10 }
  }));
  const tempData = last.map((d) => ({ value: +d.temp || 0 }));
  const tdsData = last.map((d) => ({ value: +d.tds || 0 }));
  const turbData = last.map((d) => ({ value: +d.turbidity || 0 }));

  // Dynamic Y-axis max value
  const maxRaw = Math.ceil(
    Math.max(
      ...last.map((d) => +d.ph || 0),
      ...last.map((d) => +d.temp || 0),
      ...last.map((d) => +d.tds || 0),
      ...last.map((d) => +d.turbidity || 0),
      0
    ) * 1.1
  );

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeaderRow}>
        <Text style={styles.chartTitle}>Forecasted Trends</Text>
      </View>

      <View style={{ marginTop: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={phData}
            data2={tempData}
            data3={tdsData}
            data4={turbData}
            curved
            hideRules
            yAxisColor="#334155"
            xAxisColor="#334155"
            yAxisTextStyle={{ color: '#94a3b8', fontSize: 10 }}
            height={220}
            width={last.length * 60}
            maxValue={maxRaw}
            noOfSections={5}
            backgroundColor="#0f172a"
            spacing={60}
            initialSpacing={30}
            endSpacing={30}
            color1="#22c55e"
            color2="#3b82f6"
            color3="#facc15"
            color4="#ff4800"
            pointerConfig={{
              pointerStripColor: '#334155',
              pointerStripWidth: 2,
              pointerColor: '#3b82f6',
              radius: 6,
              pointerLabelComponent: items => (
                <View style={{
                  height: 100,
                  width: 120,
                  backgroundColor: '#1e293b',
                  borderRadius: 8,
                  justifyContent: 'center',
                  paddingLeft: 10,
                  paddingVertical: 10,
                  marginLeft: -60,
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: '#334155',
                  zIndex: 1000,
                }}>
                  <Text style={{color: 'white', fontSize: 10, marginBottom: 4, opacity: 0.7}}>
                    {items[0].label}
                  </Text>
                  <MetricRow color="#22c55e" label="pH" value={items[0].value} />
                  <MetricRow color="#3b82f6" label="Temp" value={items[1].value} />
                  <MetricRow color="#facc15" label="TDS" value={items[2].value} />
                  <MetricRow color="#ff4800" label="Turb" value={items[3].value} />
                </View>
              ),
            }}
          />
        </ScrollView>

        <View style={styles.chartLegend}>
          {[
            { color: "#22c55e", label: "pH" },
            { color: "#3b82f6", label: "Temp" },
            { color: "#facc15", label: "TDS" },
            { color: "#ff4800", label: "Turbidity" },
          ].map((l) => (
            <View key={l.label} style={{ flexDirection: "row", alignItems: "center", marginRight: 12 }}>
              <View style={[styles.legendDot, { backgroundColor: l.color }]} />
              <Text style={styles.legendText}>{l.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Helper for the tooltip rows
const MetricRow = ({ color, label, value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: color, marginRight: 6 }} />
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{label}: {value}</Text>
  </View>
);