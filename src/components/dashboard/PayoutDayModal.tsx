import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const DAYS_OF_WEEK = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

interface PayoutDayModalProps {
  isVisible: boolean;
  onClose: () => void;
  payoutDay: number;
  onDaySelect: (dayValue: number) => void;
}

export default function PayoutDayModal({
  isVisible,
  onClose,
  payoutDay,
  onDaySelect
}: PayoutDayModalProps) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black/50 p-6">
        <View className="bg-white rounded-3xl overflow-hidden shadow-xl max-h-[80%]">
          <View className="flex-row justify-between items-center p-6 bg-slate-50 border-b border-slate-100">
            <View>
              <Text className="text-xl font-bold text-slate-800">Set Payout Day</Text>
              <Text className="text-sm text-slate-500 mt-1">Select common day for weekly basis</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            {DAYS_OF_WEEK.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => onDaySelect(item.value)}
                className={`flex-row justify-between items-center p-4 rounded-xl mb-3 border ${
                  payoutDay === item.value 
                    ? 'bg-amber-50 border-amber-500' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text className={`text-base ${
                  payoutDay === item.value 
                    ? 'font-bold text-amber-900' 
                    : 'text-slate-700'
                }`}>
                  {item.label}
                </Text>
                <View className={`w-6 h-6 rounded-full border items-center justify-center ${
                  payoutDay === item.value ? 'border-amber-500' : 'border-slate-300'
                }`}>
                  {payoutDay === item.value && (
                    <View className="w-3 h-3 rounded-full bg-amber-500" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <View className="h-4" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
