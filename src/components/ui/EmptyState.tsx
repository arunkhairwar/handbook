import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  title: string;
  description?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  className?: string;
}

export function EmptyState({
  title,
  description,
  iconName = "folder-open-outline",
  iconSize = 48,
  className = "",
}: EmptyStateProps) {
  return (
    <View className={`flex-1 items-center justify-center p-6 ${className} `}>
      {iconName && (
        <Ionicons
          name={iconName}
          size={iconSize}
          color="#9ca3af"
          className="mb-4"
        />
      )}
      <Text className="text-lg font-semibold text-gray-500 text-center">
        {title}
      </Text>
      {description && (
        <Text className="mt-2 text-sm text-gray-500 text-center">
          {description}
        </Text>
      )}
    </View>
  );
}
