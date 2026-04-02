import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface FullScreenLoaderProps {
  size?: number | "small" | "large";
  color?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  size = "large",
  color = Colors.primary,
  className = "",
  style,
  message,
}) => {
  return (
    <View style={[styles.container, style]} className={className}>
      <ActivityIndicator size={size} color={color} />
      {message ? (
        <Text style={styles.message} className="mt-4 text-center text-gray-500">
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginTop: 16,
    color: "#666",
    textAlign: "center",
  },
});
