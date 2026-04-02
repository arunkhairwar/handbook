import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  bgColor?: string;
};

export default function StatCard({ title, value, icon, color = "#3b82f6", bgColor = "bg-blue-50" }: StatCardProps) {
  return (
    <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mx-1">
      <View className={`w-10 h-10 rounded-full items-center justify-center mb-3 ${bgColor}`}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-2xl font-bold text-slate-800 mb-1">{value}</Text>
      <Text className="text-xs text-slate-500 font-medium">{title}</Text>
    </View>
  );
}
