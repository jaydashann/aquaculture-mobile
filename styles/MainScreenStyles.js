import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
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
    modeSwitch: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 20,
      marginBottom: 10,
    },
    modeLabel: {
      color: "#cbd5e1",
      fontWeight: "600",
      fontSize: 14
    },
    chartContainer: {
      backgroundColor: "#0f172a",
      borderRadius: 12,
      marginHorizontal: 20,
      marginVertical: 10,
      padding: 15,
    },
    chartHeaderRow: {
      flexDirection: "row",
      alignItems: "center"
    },
    chartTitle: {
      color: "#a5b4fc",
      fontSize: 18,
      fontWeight: "700",
      flex: 1
    },
    toggleGroup: {
      flexDirection: "row",
      backgroundColor: "#0b1224",
      borderRadius: 8,
      overflow: "hidden",
    },
    toggleBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6
    },
    toggleBtnActive: {
      backgroundColor: "#1f2b4a"
    },
    toggleText: {
      color: "#94a3b8",
      fontSize: 12,
      fontWeight: "600"
    },
    toggleTextActive: {
      color: "#e2e8f0"
    },
    chartLegend: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginTop: 8,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 4
    },
    legendText: {
      color: "#cbd5e1",
      fontSize: 12
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
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
    statusTextWrapper: {
      flex: 1
    },
    statusTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff"
    },
    statusSince: {
      fontSize: 12,
      color: "#cbd5e1",
      marginTop: 4
    },
    statusBadge: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 20
    },
    statusBadgeText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 12
    },
    notificationTitle: {
      color: "#facc15",
      fontWeight: "600",
      fontSize: 14
    },
    notificationMessage: {
      color: "#e2e8f0",
      fontSize: 12
    },
    sensorContainer: {
      marginHorizontal: 20,
      marginBottom: 0,
      paddingTop: 15
    },
    sensorHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10
    },
    sensorHeaderText: {
      color: "#a5b4fc",
      fontSize: 18,
      fontWeight: "700"
    },
    tableHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#334155",
      paddingBottom: 8,
    },
    colTime: { width: 70, paddingHorizontal: 4 },
    colPh: { width: 60, textAlign: "center" },
    colTemp: { width: 85, textAlign: "center" },
    colTurb: { width: 80, textAlign: "center" },
    colTds: { width: 70, textAlign: "center" },
    colAerator: { width: 50, textAlign: "center", paddingHorizontal: 4 },
    th: {
      color: "#cbd5e1",
      fontWeight: "700",
      fontSize: 12
    },
    thNum: {
      color: "#cbd5e1",
      fontWeight: "700",
      fontSize: 12,
      textAlign: "right"
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 10,
      paddingHorizontal: 0,
      borderBottomWidth: 0.5,
      borderBottomColor: "#1e293b",
    },
    zebraRow: { backgroundColor: "#0b1224" },
    td: {
      color: "#f8fafc",
      fontSize: 12
    },
    tdNum: {
      color: "#f8fafc",
      fontSize: 12,
      textAlign: "right",
      fontVariant: ["tabular-nums"],
      fontFamily: Platform.OS === "android" ? "monospace" : undefined,
    },
    emptyContainer: {
      padding: 40,
      alignItems: "center",
      justifyContent: "center"
    },
    emptyText: {
      color: "#94a3b8",
      fontSize: 16,
      fontWeight: "600",
      marginTop: 16
    },
    emptySubtext: {
      color: "#64748b",
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
    },
});
