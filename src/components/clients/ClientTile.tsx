import React from 'react';
import { Text, View } from 'react-native';
import { Client } from '../../types/client.types';
import { Card } from '../ui/Card';

interface ClientTileProps {
  client: Client;
}

export const ClientTile: React.FC<ClientTileProps> = ({ client }) => {
  return (
    <Card className="mb-3">
      <View className="flex-col justify-center">
        <Text className="text-base font-bold text-gray-800">{client.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">{client.mobile}</Text>
      </View>
    </Card>
  );
};
