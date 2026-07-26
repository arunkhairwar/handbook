import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '@/store/mockStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ActiveSitesList() {
  const sites = useStore((state) => state.sites);
  const router = useRouter();
  
  const activeSites = sites.filter((s) => s.status === 'ONGOING');

  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-slate-800">
          Active Sites ({activeSites.length})
        </Text>
        <TouchableOpacity onPress={() => router.push('/(home)/sites' as any)}>
          <Text className="text-blue-600 font-semibold text-sm">View All</Text>
        </TouchableOpacity>
      </View>

      {activeSites.slice(0, 3).map((site) => (
        <TouchableOpacity 
          key={site.id} 
          className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow-sm border border-slate-100"
          onPress={() => router.push(`/(home)/sites/${site.id}` as any)}
        >
          <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center mr-4">
            <Ionicons name="business-outline" size={20} color="#4f46e5" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-800">{site.name}</Text>
            <Text className="text-sm text-slate-500 mt-1">{site.clientName}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>
      ))}

      {activeSites.length === 0 && (
        <View className="bg-slate-50 p-6 rounded-xl items-center justify-center border border-dashed border-slate-300">
          <Text className="text-slate-500 font-medium">No active sites right now.</Text>
        </View>
      )}
    </View>
  );
}
