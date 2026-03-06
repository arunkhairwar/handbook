import { Images } from "@/constants/images";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  onFinish: () => void;
}

export default function SplashScreenLoader({ onFinish }: Props) {
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      toValue: width * 0.7, // 70% of screen width (the bar width)
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
        // Fade out entire screen, then notify parent
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }
    }, 20); // 20ms * 100 = 2000ms total

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          alignItems: "center",
        }}
      >
        <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      {/* Loading section */}
      <View style={styles.loadingSection}>
        {/* Progress bar track */}
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: progressAnim,
              },
            ]}
          />
        </View>

        {/* Percentage text */}
        <Text style={styles.percentText}>{progress}%</Text>
      </View>
    </Animated.View>
  );
}

const BAR_WIDTH = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
  },
  logo: {
    width: 180,
    height: 180,
  },
  loadingSection: {
    alignItems: "center",
    gap: 12,
  },
  barTrack: {
    width: BAR_WIDTH,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 999,
  },
  percentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 1,
  },
});
