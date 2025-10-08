import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ColorModeProvider, ColorModeContext } from "./colorMode";
import { SafeAreaProvider } from "react-native-safe-area-context";

import WelcomeScreen from "./screens/welcomeScreen";
import MainScreen from "./screens/mainScreen";
import NotificationsScreen from "./screens/notificationsScreen";

const Stack = createNativeStackNavigator();

function RootNav() {
  const { theme } = useContext(ColorModeContext);

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade", animationDuration: 400 }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ColorModeProvider>
        <RootNav />
      </ColorModeProvider>
    </SafeAreaProvider>
  );
}
