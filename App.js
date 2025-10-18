import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";

import { ColorModeProvider, ColorModeContext } from "./colorMode";
import { AuthProvider, useAuth } from "./auth";

import WelcomeScreen from "./screens/welcomeScreen";
import SignUpScreen from "./screens/signUpScreen";
import MainScreen from "./screens/mainScreen";
import NotificationsScreen from "./screens/notificationsScreen";
import NotificationDetailScreen from "./screens/NotificationDetailScreen";

const Stack = createNativeStackNavigator();

function RootNav() {
  const { theme } = useContext(ColorModeContext);
  const { user, booting } = useAuth(); // booting is provided by the Firebase-backed auth.js

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
              <Stack.Screen name="Main" component={MainScreen} />
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
          <RootNav />
        </AuthProvider>
      </ColorModeProvider>
    </SafeAreaProvider>
  );
}
