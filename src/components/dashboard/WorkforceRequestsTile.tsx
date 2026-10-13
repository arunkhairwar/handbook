import { useIncomingWorkforceRequests, useSentWorkforceRequests } from "@/src/hooks";
import { AppRoutes } from "@/src/routes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function WorkforceRequestsTile() {
  const router = useRouter();
  const { data: incomingRequests } = useIncomingWorkforceRequests();
  const { data: outgoingRequests } = useSentWorkforceRequests();

  const pendingIncomingCount = useMemo(
    () => incomingRequests?.filter((r) => r.status === "PENDING").length ?? 0,
    [incomingRequests]
  );

  const pendingOutgoingCount = useMemo(
    () => outgoingRequests?.filter((r) => r.status === "PENDING").length ?? 0,
    [outgoingRequests]
  );

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-slate-800">
          Workforce Requests
        </Text>
        <Text className="text-xs font-semibold text-slate-400">
          Team Invites
        </Text>
      </View>

      <View className="flex-row gap-3">
        {/* Incoming Requests Tile */}
        <TouchableOpacity
          testID="dashboard-incoming-requests-tile"
          activeOpacity={0.8}
          className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
          onPress={() =>
            router.push({
              pathname: AppRoutes.WORKFORCE.REQUESTS as any,
              params: { tab: "incoming" },
            })
          }
        >
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center border border-amber-100">
              <Ionicons name="mail-unread-outline" size={20} color="#D97706" />
            </View>
            {pendingIncomingCount > 0 ? (
              <View className="px-2 py-0.5 rounded-full bg-amber-500">
                <Text className="text-[10px] font-bold text-white">
                  {pendingIncomingCount} new
                </Text>
              </View>
            ) : (
              <View className="px-2 py-0.5 rounded-full bg-slate-100">
                <Text className="text-[10px] font-semibold text-slate-500">
                  0 pending
                </Text>
              </View>
            )}
          </View>

          <Text className="text-xl font-bold text-slate-800">
            {pendingIncomingCount}
          </Text>
          <View className="flex-row items-center justify-between mt-0.5">
            <Text className="text-xs font-semibold text-slate-500">
              Incoming
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* Outgoing Requests Tile */}
        <TouchableOpacity
          testID="dashboard-outgoing-requests-tile"
          activeOpacity={0.8}
          className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
          onPress={() =>
            router.push({
              pathname: AppRoutes.WORKFORCE.REQUESTS as any,
              params: { tab: "outgoing" },
            })
          }
        >

          <View className="flex-row items-center justify-between mb-2.5">
            <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center border border-indigo-100">
              <Ionicons name="paper-plane-outline" size={20} color="#4F46E5" />
            </View>
            {pendingOutgoingCount > 0 ? (
              <View className="px-2 py-0.5 rounded-full bg-indigo-500">
                <Text className="text-[10px] font-bold text-white">
                  {pendingOutgoingCount} pending
                </Text>
              </View>
            ) : (
              <View className="px-2 py-0.5 rounded-full bg-slate-100">
                <Text className="text-[10px] font-semibold text-slate-500">
                  0 pending
                </Text>
              </View>
            )}
          </View>


          <Text className="text-xl font-bold text-slate-800">
            {pendingOutgoingCount}
          </Text>
          <View className="flex-row items-center justify-between mt-0.5">
            <Text className="text-xs font-semibold text-slate-500">
              Outgoing
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
