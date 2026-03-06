import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getBaseToastStyle, styles } from "./toastStyles";

export default function ErrorToast({ text1, text2 }: any, isDark: boolean) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text2 && text2.length > 100;

  const displayText =
    shouldTruncate && !expanded ? text2.substring(0, 100) + "..." : text2;

  return (
    <View
      style={{
        ...getBaseToastStyle(isDark),
        flexDirection: "row",
        alignItems: "flex-start",
        borderLeftColor: "#ef4444",
        paddingHorizontal: 12,
        minHeight: 60,
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: "#ef444420" }]}>
        <Ionicons name="close-circle" size={20} color="#ef4444" />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#0f172a" }]}>
          {text1}
        </Text>

        <Text
          style={[styles.message, { color: isDark ? "#94a3b8" : "#64748b" }]}
        >
          {displayText}
        </Text>

        {shouldTruncate && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.toggle}
          >
            <Text style={styles.toggleText}>
              {expanded ? "Show less" : "View full message"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
