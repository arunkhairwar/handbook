import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  /** Extra NativeWind classes for the outer SafeAreaView */
  className?: string;
  /** Wrap children in a ScrollView so content is scrollable when the keyboard is open */
  scrollable?: boolean;
  /** Custom style passed to SafeAreaView */
  style?: ViewStyle;
  /** Customize which edges are safe area */
  edges?: Array<"top" | "right" | "bottom" | "left">;
}

/**
 * Global wrapper that combines SafeAreaView + KeyboardAvoidingView.
 *
 * Use this on every screen to avoid the keyboard covering inputs
 * and content bleeding into the status-bar / notch / nav-bar area.
 *
 * @example
 * <SafeAreaWrapper className="bg-slate-50">
 *   <View>…</View>
 * </SafeAreaWrapper>
 *
 * @example scrollable
 * <SafeAreaWrapper scrollable className="bg-white">
 *   <View>…long form…</View>
 * </SafeAreaWrapper>
 */
export function SafeAreaWrapper({
  children,
  className = "flex-1 bg-slate-50",
  scrollable = false,
  style,
  edges,
}: SafeAreaWrapperProps) {
  return (
    <SafeAreaView className={className} style={style} edges={edges}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
