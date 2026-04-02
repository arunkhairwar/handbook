import React from 'react';
import { View, Text } from 'react-native';
import { useStore } from '@/store/mockStore';
import StatCard from './StatCard';

export default function FinancialSummary() {
  const { payments, expenses } = useStore();

  const totalIncome = payments
    .filter((p) => p.type === 'INCOME')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPaidToWorkers = payments
    .filter((p) => p.type === 'EXPENSE')
    .reduce((acc, p) => acc + p.amount, 0);

  const materialExpenses = expenses.reduce((acc, e) => acc + e.cost, 0);

  const totalDistributed = totalPaidToWorkers + materialExpenses;
  const netProfit = totalIncome - totalDistributed;

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-slate-800 mb-4">Financials</Text>
      
      <View className="bg-white flex-row items-center justify-between rounded-2xl p-5 border border-slate-100 shadow-sm mb-4">
        <View>
          <Text className="text-sm font-medium text-slate-500 mb-1">Net Balance</Text>
          <Text className={`text-3xl font-bold ${netProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            ₹{netProfit.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between -mx-1">
        <StatCard 
          title="Received" 
          value={`₹${(totalIncome / 1000).toFixed(1)}k`} 
          icon="arrow-down-outline" 
          color="#10b981" 
          bgColor="bg-emerald-50" 
        />
        <StatCard 
          title="Distributed" 
          value={`₹${(totalDistributed / 1000).toFixed(1)}k`} 
          icon="arrow-up-outline" 
          color="#f43f5e" 
          bgColor="bg-rose-50" 
        />
      </View>
    </View>
  );
}
