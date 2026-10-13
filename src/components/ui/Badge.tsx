import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { cn } from "@/src/lib/utils";

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
  className?: string;
}

const variantClasses: Record<
  BadgeVariant,
  { container: string; text: string }
> = {
  default: {
    container: "bg-border",
    text: "text-text",
  },
  primary: {
    container: "bg-blue-50",
    text: "text-blue-800",
  },
  success: {
    container: "bg-emerald-100",
    text: "text-emerald-800",
  },
  warning: {
    container: "bg-amber-100",
    text: "text-amber-800",
  },
  error: {
    container: "bg-red-100",
    text: "text-red-800",
  },
  info: {
    container: "bg-sky-100",
    text: "text-sky-800",
  },
  outline: {
    container: "bg-transparent border border-primary",
    text: "text-primary",
  },
};

const textTransformClasses: Record<BadgeTextTransform, string> = {
  capitalize: "capitalize",
  lowercase: "lowercase",
  uppercase: "uppercase",
};

export function Badge({
  title,
  label,
  variant = "default",
  textTransform = "capitalize",
  style,
  className,
}: BadgeProps) {
  const displayText = title ?? label ?? "";
  const { container, text } = variantClasses[variant];

  return (
    <View
      className={cn(
        "px-3 py-1 rounded-full items-center justify-center",
        container,
        className
      )}
      style={style}
    >
      <Text
        className={cn(
          "text-xs font-semibold",
          text,
          textTransformClasses[textTransform]
        )}
      >
        {displayText}
      </Text>
    </View>
  );
}
