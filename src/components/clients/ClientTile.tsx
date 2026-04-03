import React from "react";
import { Text, View } from "react-native";
import { Client } from "../../types/client.types";
import { Card } from "../ui/Card";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface ClientTileProps {
  client: Client;
}

export const ClientTile: React.FC<ClientTileProps> = ({ client }) => {
  const tileColors = Colors.tiles.client;

  return (
    <Card
      className="mb-3 dark:bg-slate-800 dark:border-slate-700"
      style={{ borderLeftWidth: 4, borderLeftColor: tileColors.icon }}
    >
      <View className="flex-row items-center">
        <View
          className="w-11 h-11 rounded-full items-center justify-center mr-3.5 dark:bg-blue-900/30"
          style={{ backgroundColor: tileColors.background }}
        >
          <Ionicons name="person-outline" size={22} color={tileColors.icon} />
        </View>
        <View className="flex-1 justify-center">
          <Text
            className="text-base font-bold dark:text-blue-300"
            style={{ color: tileColors.text }}
          > 
            {client.name}
          </Text>
          <Text
            className="text-sm mt-0.5 font-medium dark:text-blue-400/70"
            style={{ color: tileColors.icon }}
          >
            {client.mobile}
          </Text>
        </View>
      </View>
    </Card>
  );
};
