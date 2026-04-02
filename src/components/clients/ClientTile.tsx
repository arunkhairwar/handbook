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
      className="mb-3 flex-row items-center"
      style={{
        backgroundColor: tileColors.background,
        borderColor: tileColors.border,
        borderLeftWidth: 4,
        borderLeftColor: tileColors.icon,
      }}
    >
      <View
        className="mr-4 rounded-full p-3 items-center justify-center"
        style={{ backgroundColor: "white" }}
      >
        <Ionicons name="person-outline" size={24} color={tileColors.icon} />
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-lg font-bold" style={{ color: tileColors.text }}>
          {client.name}
        </Text>
        <Text
          className="text-sm mt-1 font-medium"
          style={{ color: tileColors.icon }}
        >
          {client.mobile}
        </Text>
      </View>
    </Card>
  );
};
