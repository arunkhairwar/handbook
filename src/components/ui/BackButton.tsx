import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

type BackButtonProps = {
  iconName?: ComponentProps<typeof Ionicons>["name"];
  title?: string;
  onPress?: () => void;
  className?: string;
};
const BackButton = ({
  iconName,
  title,
  onPress,
  className,
}: BackButtonProps) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => (onPress ? onPress() : router.back())}
      className={`ml-6 mr-2 ${className}`}
    >
      <Ionicons
        name={iconName || "arrow-back-outline"}
        size={24}
        color={Colors.primary}
      />
      {title && (
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
      )}
    </Pressable>
  );
};

export default BackButton;
