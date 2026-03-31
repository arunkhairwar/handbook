import { Images } from "@/constants/images";
import { useAuth } from "@/src/hooks";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const BAR_WIDTH = width * 0.7;

interface Props {
  onFinish: () => void;
}

export default function SplashScreenLoader({ onFinish }: Props) {
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const { initializeAuth } = useAuth();

  const authReady = useRef(false);
  const animDone = useRef(false);

  const tryFinish = () => {
    if (authReady.current && animDone.current) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }
  };

  useEffect(() => {
    // Initialize auth on app start
    initializeAuth().finally(() => {
      authReady.current = true;
      tryFinish();
    });

    // Animate logo in
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: width * 0.7,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Update percentage counter
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        animDone.current = true;
        tryFinish();
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      className="flex-1 bg-white items-center justify-center gap-12"
      style={{ opacity: fadeAnim }}
    >
      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          alignItems: "center",
        }}
      >
        <Image
          source={Images.logo}
          className="w-44 h-44"
          resizeMode="contain"
        />
      </Animated.View>

      {/* Loading section */}
      <View className="items-center gap-3">
        {/* Progress bar track */}
        <View
          className="h-1.5 bg-gray-200 rounded-full overflow-hidden"
          style={{ width: BAR_WIDTH }}
        >
          <Animated.View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: progressAnim }}
          />
        </View>

        {/* Percentage text */}
        <Text className="text-sm font-semibold text-gray-500 tracking-widest">
          {progress}%
        </Text>
      </View>
    </Animated.View>
  );
}
