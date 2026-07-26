import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import "../global.css";
import SplashScreenLoader from "@/src/components/SplashScreenLoader";
import Toast from "react-native-toast-message";
import { getToastConfig } from "@/src/toast/toastConfig";

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!appReady) {
    return <SplashScreenLoader onFinish={() => setAppReady(true)} />;
  }
  const isDark = false;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(home)" />
      </Stack>
      <StatusBar style="dark" />
      <Toast config={getToastConfig(isDark)} visibilityTime={3000} />
    </>
  );
}
