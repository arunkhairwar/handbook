import { userAtom } from "@/src/atoms/auth.atoms";
import { useStore } from "@/store/mockStore";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "@/src/components/ui/Button";

export default function WorkerDashboard() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const allAttendance = useStore((state) => state.attendance);
  const allPayments = useStore((state) => state.payments);
  const sites = useStore((state) => state.sites);

  const attendance = useMemo(
    () => allAttendance.filter((a) => a.workerId === user?.id),
    [allAttendance, user?.id],
  );
  const payments = useMemo(
    () => allPayments.filter((p) => p.relatedId === user?.id),
    [allPayments, user?.id],
  ); // Income for worker (expense for contractor)

  if (!user) return null;

  const daysWorked = attendance.length;
  // Calculate unique sites
  const uniqueSiteIds = [...new Set(attendance.map((a) => a.siteId))];
  const mySites = sites.filter((s) => uniqueSiteIds.includes(s.id));

  const totalReceived = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="p-4 pt-16">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-slate-800">
          Namaste, {user.name}
        </Text>
        <Text className="text-base text-slate-500">
          {user.role} ({user.mobile})
        </Text>
      </View>

      <View className="flex-row justify-between mb-4">
        <View className="flex-1 mx-1 items-center p-4 bg-white rounded-lg shadow-sm">
          <Text className="text-sm text-slate-500 mb-1">Days Worked</Text>
          <Text className="text-2xl font-bold text-slate-900">{daysWorked}</Text>
        </View>
        <View className="flex-1 mx-1 items-center p-4 bg-white rounded-lg shadow-sm">
          <Text className="text-sm text-slate-500 mb-1">Sites</Text>
          <Text className="text-2xl font-bold text-slate-900">{mySites.length}</Text>
        </View>
      </View>

      <View className="mb-5 p-4 bg-white rounded-lg shadow-sm">
        <Text className="text-sm text-slate-500 mb-1">Total Payment Received</Text>
        <Text className="text-2xl font-bold text-emerald-500">
          ₹{totalReceived}
        </Text>
      </View>

      <Text className="text-lg font-bold mb-3">Recent Work</Text>
      {attendance.slice(0, 5).map((a, idx) => {
        const site = sites.find((s) => s.id === a.siteId);
        return (
          <View
            key={idx}
            className="flex-row justify-between items-center mb-2 p-3 bg-white rounded-lg shadow-sm"
          >
            <View>
              <Text className="font-semibold">
                {site?.name || "Unknown Site"}
              </Text>
              <Text className="text-xs text-slate-500">{a.date}</Text>
            </View>
            <Text className="text-emerald-500 font-bold">Present</Text>
          </View>
        );
      })}

      <Button
        title="Logout"
        variant="danger"
        onPress={() => router.replace("../(auth)/login")}
        style={{ marginTop: 24 }}
      />
    </ScrollView>
  );
}
