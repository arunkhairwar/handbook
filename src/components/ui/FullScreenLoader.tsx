import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  ViewStyle,
  StyleProp,
} from "react-native";
import { cn } from "@/src/lib/utils";

interface FullScreenLoaderProps {
  size?: number | "small" | "large";
  color?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  size = "large",
  color = "#1E293B",
  className = "",
  style,
  message,
}) => {
  return (
    <View
      className={cn("flex-1 justify-center items-center", className)}
      style={style}
    >
      <ActivityIndicator size={size} color={color} />
      {message ? (
        <Text className="mt-4 text-center text-text-secondary text-sm">
          {message}
        </Text>
      ) : null}
    </View>
  );
};
