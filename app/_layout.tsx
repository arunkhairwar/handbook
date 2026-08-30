import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import "../global.css";
import SplashScreenLoader from "@/src/components/SplashScreenLoader";
import { queryClient } from "@/src/lib/queryClient";
import Toast from "react-native-toast-message";
import { getToastConfig } from "@/src/toast/toastConfig";
import { LogBox, StatusBar } from "react-native";

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!appReady) {
    return <SplashScreenLoader onFinish={() => setAppReady(true)} />;
  }
  const isDark = false;

  if(__DEV__){
    LogBox.ignoreAllLogs(true);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(home)" />
      </Stack>
      <StatusBar barStyle={"light-content"} />
      <Toast config={getToastConfig(isDark)} visibilityTime={3000} />
    </QueryClientProvider>
  );
}
