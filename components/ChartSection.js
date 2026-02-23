import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import styles from "../styles/MainScreenStyles";

const screenWidth = Dimensions.get("window").width;

export default function ChartSection({ sensorData = [], scaleMode, setScaleMode }) {
  const last = sensorData.slice(-20);

  const formatXAxisTime = (ts) => {
    const date = new Date(ts || Date.now());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts || Date.now());
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${dateStr} ${timeStr}`;
  };

  const phData = last.map((d) => ({
    value: +d.ph || 0,
    label: formatXAxisTime(d.rawTimestamp || d.time),
    labelTextStyle: { color: '#94a3b8', fontSize: 10 }
  }));
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
    ) * 1.1
  );

  const usingTable = scaleMode === "table";

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeaderRow}>
        <Text style={styles.chartTitle}>Forecasted Trends</Text>
        <View style={styles.toggleGroup}>
          {["raw", "table"].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setScaleMode(m)}
              style={[styles.toggleBtn, scaleMode === m && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, scaleMode === m && styles.toggleTextActive]}>
                {m === "raw" ? "Chart" : "Table"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!usingTable && (
        <View style={{ marginTop: 15 }}>
          {/* ScrollView prevents the chart from overlapping or bleeding out of the container */}
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
              // --- FIXED POINTER CONFIGURATION ---
              pointerConfig={{
                pointerStripColor: '#334155',
                pointerStripWidth: 2,
                pointerColor: '#3b82f6',
                radius: 6,
                pointerLabelComponent: items => {
                  return (
                    <View
                      style={{
                        height: 100,
                        width: 120,
                        backgroundColor: '#1e293b',
                        borderRadius: 8,
                        justifyContent: 'center',
                        paddingLeft: 10,
                        paddingVertical: 10,
                        // Offset the label so it doesn't cover the point
                        marginLeft: -60,
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: '#334155',
                        zIndex: 1000,
                      }}>
                      <Text style={{color: 'white', fontSize: 10, marginBottom: 4, opacity: 0.7}}>
                        {items[0].label}
                      </Text>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{height: 8, width: 8, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 6}} />
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>pH: {items[0].value}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{height: 8, width: 8, borderRadius: 4, backgroundColor: '#3b82f6', marginRight: 6}} />
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>Temp: {items[1].value}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{height: 8, width: 8, borderRadius: 4, backgroundColor: '#facc15', marginRight: 6}} />
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>TDS: {items[2].value}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{height: 8, width: 8, borderRadius: 4, backgroundColor: '#ff4800', marginRight: 6}} />
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>Turbidity: {items[3].value}</Text>
                      </View>
                    </View>
                  );
                },
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
      )}

      {usingTable && (
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={{ marginTop: 10 }}>
              {/* --- FIXED HEADER --- */}
              <View style={[styles.tableHeader, { flexDirection: 'row' }]}>
                {["Date/Time", "pH", "Temp", "TDS", "Turb", "Aerator"].map((h) => (
                  <Text
                    key={h}
                    style={[styles.th, tableCell(), { fontWeight: 'bold', color: '#fff' }]}
                  >
                    {h}
                  </Text>
                ))}
              </View>

              {/* --- TABLE ROWS --- */}
              {last.slice().reverse().map((d, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.zebraRow, { flexDirection: 'row' }]}>
                  <Text style={tableCell()}>{formatTimestamp(d.rawTimestamp || d.time)}</Text>
                  <Text style={tableCell()}>{d.ph}</Text>
                  <Text style={tableCell()}>{d.temp}</Text>
                  <Text style={tableCell()}>{d.tds}</Text>
                  <Text style={tableCell()}>{d.turbidity}</Text>
                  <Text style={tableCell()}>{d.aerator}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
      )}
    </View>
  );
}

const tableCell = () => ({
  width: 90,
  color: "#e2e8f0",
  fontSize: 11,
  textAlign: "center",
});