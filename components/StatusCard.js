import React from "react";
import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/MainScreenStyles";

export default function StatusCard({
  title,
  subtitle,
  message,
  time,
  icon,
  color,
  active,
  onPress,
  disabled = false,
}) {
  const bgColor = color || "#1e293b";
  const statusColor = active ? "#22c55e" : "#ef4444";
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.statusContainer,
        { backgroundColor: "#1e293b" },
        disabled && { opacity: 0.6 }
      ]}
      onPress={disabled ? null : onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={[styles.statusIconWrapper, { backgroundColor: color || "#3b82f6" }]}>
        <MaterialCommunityIcons name={icon} size={24} color="#fff" />
      </View>

      <View style={styles.statusTextWrapper}>
        <Text style={styles.statusTitle}>{title}</Text>
        {subtitle && <Text style={styles.statusSince}>{subtitle}</Text>}
        {message && <Text style={styles.notificationMessage}>{message}</Text>}
        {time && <Text style={styles.statusSince}>Since {time}</Text>}
      </View>

      {disabled && (
        <ActivityIndicator size="small" color="#3b82f6" style={{ marginRight: 8 }} />
      )}

      {!disabled && typeof active !== "undefined" && (
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusBadgeText}>{active ? "Active" : "Inactive"}</Text>
        </View>
      )}

      {!disabled && onPress && typeof active === "undefined" && (
        <View style={[styles.statusBadge, { backgroundColor: color || "#3b82f6" }]}>
          <Text style={styles.statusBadgeText}>View</Text>
        </View>
      )}
    </Container>
  );
}