import React from 'react';
import { View, Text } from 'react-native';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/src/atoms/auth.atoms';

export default function DashboardHeader() {
  const user = useAtomValue(userAtom);
  
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <View className="mb-5 flex-row justify-between items-end">
      <View>
        <Text className="text-2xl font-bold text-slate-800">
          Hello, {user?.firstName || "Contractor"}
        </Text>
        <Text className="text-sm font-medium text-slate-500 mt-1">
          {formattedDate}
        </Text>
      </View>
    </View>
  );
}
