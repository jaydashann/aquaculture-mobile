import React, { useContext, useState } from "react";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ColorModeProvider, ColorModeContext } from "./colorMode";
import { AuthProvider, useAuth } from "./auth";
import WelcomeScreen from "./screens/welcomeScreen";
import SignUpScreen from "./screens/signUpScreen";
import LiveScreen from "./screens/liveScreen";
import NotificationsScreen from "./screens/notificationsScreen";
import NotificationDetailScreen from "./screens/NotificationDetailScreen";
import ForecastScreen from "./screens/forecastScreen";
import { ModeProvider } from "./modeContext";
import UserScreen from "./screens/userScreen.js"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const { signOut, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#2f95dc',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBarContainer,
          tabBarItemStyle: styles.tabItem,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Live Data') iconName = 'pulse-outline';
            else if (route.name === 'Alerts') iconName = 'notifications-outline';
            else if (route.name === 'Forecast') iconName = 'trending-up-outline';

            return <Ionicons name={iconName} size={20} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Live Data" component={LiveScreen} />
        <Tab.Screen
            name="Alerts"
            component={NotificationsScreen}
            options={{
            tabBarBadge: unreadCount > 0 ? unreadCount : null,
            tabBarBadgeStyle: {
                  backgroundColor: '#ef4444',
                  color: '#ef4444',
                  fontSize: 5,
                }
            }}
        />
        <Tab.Screen name="Forecast" component={ForecastScreen} />

        <Tab.Screen
          name="User"
          component={UserScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                style={styles.userTabContainer}
                activeOpacity={0.7}
              >
                <View style={styles.userIconCircle}>
                  <Ionicons name="person" size={20} color="white" />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

function RootNav() {
  const { theme } = useContext(ColorModeContext);
  const { user, booting } = useAuth();

  return (
    <NavigationContainer theme={theme}>
      {booting ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: "fade", animationDuration: 400 }}
        >
          {user ? (
            <>
              <Stack.Screen name="TabHome" component={MyTabs} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen
                name="NotificationDetail"
                component={NotificationDetailScreen}
                options={{ title: "Notification Detail" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ColorModeProvider>
        <AuthProvider>
          <ModeProvider>
            <RootNav />
          </ModeProvider>
        </AuthProvider>
      </ColorModeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "center",
    alignSelf: "center",
    bottom: 40,

    flexDirection: "row",
    backgroundColor: "#1e293b",
    width: "90%",
    height: 70,
    borderRadius: 40,

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    overflow: 'hidden',
    borderTopWidth: 0,
  },
  userTabContainer: {
    flex: 1,
    position: "center",
  },
  userIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 11
  },
});