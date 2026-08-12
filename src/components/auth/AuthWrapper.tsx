import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

interface AuthWrapperProps {
  /** Screen title (e.g. "Sign In", "Create Account") */
  title: string;
  /** Optional subtitle shown below the title */
  description?: string;
  /** Whether the content should be scrollable (useful for longer forms) */
  scrollable?: boolean;
  children: React.ReactNode;
}

/**
 * Shared wrapper for all auth screens.
 *
 * Renders the app logo, a title, an optional description,
 * and wraps children in a SafeAreaView with keyboard avoidance.
 */
export function AuthWrapper({
  title,
  description,
  scrollable = false,
  children,
}: AuthWrapperProps) {
  return (
    <SafeAreaWrapper scrollable={scrollable}>
      <View className="flex-1 justify-center p-6">
        {/* App Logo */}
        <View className="flex-row justify-center mb-4">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 200, height: 100, borderRadius: 10 }}
          />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-slate-800 text-center mb-2">
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text className="text-base text-slate-500 text-center mb-12">
            {description}
          </Text>
        )}

        {children}
      </View>
    </SafeAreaWrapper>
  );
}
