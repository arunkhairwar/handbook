import React from 'react';
import { View, Text } from 'react-native';
import { useStore } from '@/store/mockStore';
import { Ionicons } from '@expo/vector-icons';

export default function TodayWorkforce() {
  const { attendance, sites } = useStore();
  
  // Get today's attendance only
  // Format YYYY-MM-DD
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayDateString = `${year}-${month}-${day}`;

  const todaysAttendance = attendance.filter(a => a.date === todayDateString);

  // Group by site
  const siteAttendanceCounts: Record<string, number> = {};
  todaysAttendance.forEach(record => {
    siteAttendanceCounts[record.siteId] = (siteAttendanceCounts[record.siteId] || 0) + 1;
  });

  const totalWorkersToday = todaysAttendance.length;

  return (
    <View className="mb-6 bg-blue-600 rounded-2xl p-5 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-blue-100 font-medium text-sm mb-1">Today's Workforce</Text>
          <Text className="text-white text-3xl font-bold">{totalWorkersToday} <Text className="text-xl font-medium">Workers</Text></Text>
        </View>
        <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
          <Ionicons name="people" size={24} color="#ffffff" />
        </View>
      </View>

      {totalWorkersToday > 0 ? (
        <View className="bg-blue-700/50 rounded-xl p-3">
          {Object.entries(siteAttendanceCounts).map(([siteId, count]) => {
            const site = sites.find(s => s.id === siteId);
            return (
               <View key={siteId} className="flex-row justify-between items-center py-2 border-b border-blue-500/30 last:border-0">
                 <Text className="text-blue-50 font-medium flex-1 mr-2" numberOfLines={1}>{site?.name || 'Unknown Site'}</Text>
                 <View className="bg-blue-500 px-3 py-1 rounded-full">
                    <Text className="text-white font-bold text-xs">{count} present</Text>
                 </View>
               </View>
            );
          })}
        </View>
      ) : (
        <View className="bg-blue-700/50 rounded-xl p-4 items-center">
          <Text className="text-blue-200">No attendance marked for today yet.</Text>
        </View>
      )}
    </View>
  );
}
