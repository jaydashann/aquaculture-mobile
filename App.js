import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Live Data') {
            iconName = 'pulse-outline';
          } else if (route.name === 'Alerts') {
            iconName = 'notifications-outline';
          } else if (route.name === 'Forecast') {
            iconName = 'trending-up-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Live Data" component={LiveScreen} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} />
      <Tab.Screen name="Forecast" component={ForecastScreen} />
    </Tab.Navigator>
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