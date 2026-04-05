import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "outline";
type BadgeTextTransform = "capitalize" | "lowercase" | "uppercase";

interface BadgeProps {
  /** Preferred prop name */
  title?: string;
  /** @deprecated Use `title` instead. Kept for backward compatibility. */
  label?: string;
  variant?: BadgeVariant;
  textTransform?: BadgeTextTransform;
  style?: ViewStyle;
}

const variantStyles: Record<
  BadgeVariant,
  { backgroundColor: string; textColor: string; borderColor?: string }
> = {
  default: {
    backgroundColor: Colors.border,
    textColor: Colors.text,
  },
  primary: {
    backgroundColor: "#EFF6FF", // Blue 50
    textColor: "#1E40AF", // Blue 800
  },
  success: {
    backgroundColor: "#DCFCE7", // Green 100
    textColor: "#166534", // Green 800
  },
  warning: {
    backgroundColor: "#FEF3C7", // Amber 100
    textColor: "#92400E", // Amber 800
  },
  error: {
    backgroundColor: "#FEE2E2", // Red 100
    textColor: "#991B1B", // Red 800
  },
  info: {
    backgroundColor: "#E0F2FE", // Sky 100
    textColor: "#075985", // Sky 800
  },
  outline: {
    backgroundColor: "transparent",
    textColor: Colors.primary,
    borderColor: Colors.primary,
  },
};

export function Badge({
  title,
  label,
  variant = "default",
  textTransform = "capitalize",
  style,
}: BadgeProps) {
  const displayText = title ?? label ?? "";
  const { backgroundColor, textColor, borderColor } = variantStyles[variant];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor },
        borderColor ? { borderWidth: 1, borderColor } : undefined,
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor, textTransform }]}>
        {displayText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    // alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
