import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSecureValue, setSecureValue, StorageKeys } from '../../storage/secure-storage';
import PayoutDayModal, { DAYS_OF_WEEK } from './PayoutDayModal';

export default function WeeklyPayoutAlert() {
  const [payoutDay, setPayoutDay] = useState(5); // default Friday
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPayoutDay = async () => {
      try {
        const storedDay = await getSecureValue(StorageKeys.PAYOUT_DAY);
        if (storedDay !== null) {
          setPayoutDay(parseInt(storedDay, 10));
        }
      } catch (error) {
        if (__DEV__) console.error("Failed to load payout day", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPayoutDay();
  }, []);

  const handleDaySelect = async (dayValue: number) => {
    setPayoutDay(dayValue);
    setModalVisible(false);
    await setSecureValue(StorageKeys.PAYOUT_DAY, dayValue.toString());
  };

  const { isToday, formattedDate, dayName } = useMemo(() => {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const daysUntilPayout = (payoutDay - todayDayOfWeek + 7) % 7;
    
    const payoutDate = new Date();
    payoutDate.setDate(today.getDate() + (daysUntilPayout === 0 ? 0 : daysUntilPayout));

    const selectedDayObj = DAYS_OF_WEEK.find(d => d.value === payoutDay);

    return {
      isToday: daysUntilPayout === 0,
      formattedDate: new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short'
      }).format(payoutDate),
      dayName: selectedDayObj?.label || 'Friday'
    };
  }, [payoutDay]);

  if (isLoading) return null;

  return (
    <>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        className={`mb-5 p-4 rounded-2xl flex-row items-center border ${isToday ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}
      >
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isToday ? 'bg-amber-100' : 'bg-slate-200'}`}>
          <Ionicons name="calendar-outline" size={24} color={isToday ? '#d97706' : '#64748b'} />
        </View>
        <View className="flex-1 pr-2">
          <Text className={`text-base font-bold ${isToday ? 'text-amber-900' : 'text-slate-800'}`}>
            {isToday ? "Today is Payout Day!" : "Upcoming Payout"}
          </Text>
          <Text className={`text-sm mt-1 ${isToday ? 'text-amber-700' : 'text-slate-500'}`}>
            Worker payments are scheduled for <Text className="font-bold">{isToday ? "Today" : `${dayName}, ${formattedDate}`}</Text>.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={isToday ? '#d97706' : '#94a3b8'} />
      </TouchableOpacity>

      <PayoutDayModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        payoutDay={payoutDay}
        onDaySelect={handleDaySelect}
      />
    </>
  );
}
