import { Colors } from "@/constants/Colors";
import { Badge } from "@/src/components/ui/Badge";
import { Card } from "@/src/components/ui/Card";
import { Site } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SiteTileProps {
  data: Site;
  status?: string;
  onPress?: () => void;
}

export function SiteTile({ data, status = "ONGOING", onPress }: SiteTileProps) {
  const badgeVariant = status === "ONGOING" ? "success" : "default";
  const tileColors = Colors.tiles.site;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3 dark:bg-slate-800 dark:border-slate-700">
        <View className="flex-row items-center">
          {/* Icon */}
          <View
            className="w-11 h-11 rounded-full items-center justify-center mr-3.5 dark:bg-teal-900/30"
            style={{ backgroundColor: tileColors.background }}
          >
            <Ionicons
              name="business-outline"
              size={22}
              color={tileColors.icon}
            />
          </View>

          {/* Info */}
          <View className="flex-1 justify-center mr-3">
            <Text
              className="text-base font-bold dark:text-teal-300"
              style={{ color: tileColors.text }}
              numberOfLines={1}
            >
              {data.name}
            </Text>
            <Text
              className="text-sm mt-0.5 font-medium dark:text-teal-400/70"
              style={{ color: tileColors.icon }}
              numberOfLines={1}
            >
              {data.client?.name}
            </Text>
          </View>

          {/* Trailing */}
          <View className="flex-row items-center gap-2">
            <Badge label={status} variant={badgeVariant} />
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textSecondary}
              className="ml-1 dark:text-slate-400"
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
