import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export interface HeaderProps {
  /**
   * The header text title/label. (Required)
   */
  label: string;

  /**
   * Whether to show the back button.
   * If not provided, it defaults to true if navigation has history (canGoBack).
   */
  showBackButton?: boolean;

  /**
   * Custom back action. If not provided, it falls back to standard navigation.goBack().
   */
  onBack?: () => void;

  /**
   * Optional custom element to render on the right side of the header.
   */
  rightElement?: React.ReactNode;

  /**
   * Alignment of the label text.
   * Defaults to 'center'.
   */
  alignLabel?: "left" | "center" | "right";
}

export const ScreenHeader: React.FC<HeaderProps> = ({
  label,
  showBackButton,
  onBack,
  rightElement,
  alignLabel = "left",
}) => {
//   const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const canGoBack = router.canGoBack();
  const shouldShowBack = showBackButton !== undefined ? showBackButton : canGoBack;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack) {
    router.back();
    }
  };

  const alignmentClass =
    alignLabel === "left"
      ? "items-start"
      : alignLabel === "right"
      ? "items-end"
      : "items-center";

  const textAlignClass =
    alignLabel === "left"
      ? "text-left"
      : alignLabel === "right"
      ? "text-right"
      : "text-center";

  return (
    <View 
      style={{ paddingTop: insets.top + 14 }}
      className="flex-row items-center justify-between px-4 pb-3.5 bg-white border-b border-[#E5E7EB]"
    >
      {/* Left Column (Back button or placeholder) */}
      <View className="min-w-[48px] items-start justify-center">
        {shouldShowBack && (
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center justify-center p-2 rounded-lg bg-[#1A2D4A18] active:opacity-70"
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={20} color="#1A2D4A" />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Column (Title) */}
      <View className={`flex-1 justify-center mx-2 ${alignmentClass}`}>
        <Text 
          className={`text-base font-bold text-[#0A1628] ${textAlignClass}`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>

      {/* Right Column (Right element or placeholder) */}
      <View className="min-w-[48px] items-end justify-center">
        {rightElement ? (
          rightElement
        ) : (
          <View className="w-8 h-8" />
        )}
      </View>
    </View>
  );
};

export default ScreenHeader;
