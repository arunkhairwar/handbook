import { AppRoutes } from "@/src/routes";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RequestTabsHeaderProps {
  activeTab: "outgoing" | "incoming";
  outgoingCount?: number;
  incomingCount?: number;
}

export function RequestTabsHeader({
  activeTab,
  outgoingCount = 0,
  incomingCount = 0,
}: RequestTabsHeaderProps) {
  const router = useRouter();

  const handleTabPress = (tab: "outgoing" | "incoming") => {
    if (tab === activeTab) return;
    if (tab === "outgoing") {
      router.replace(AppRoutes.WORKFORCE.OUTGOING_REQUESTS as any);
    } else {
      router.replace(AppRoutes.WORKFORCE.INCOMING_REQUESTS as any);
    }
  };

  return (
    <View className="px-4 pt-3 pb-2 bg-card border-b border-border">
      <View className="flex-row bg-background rounded-xl p-1 border border-border">
        {/* Outgoing Tab */}
        <TouchableOpacity
          id="tab-outgoing-requests"
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
            activeTab === "outgoing"
              ? "bg-primary shadow-sm"
              : "bg-transparent"
          }`}
          onPress={() => handleTabPress("outgoing")}
        >
          <Text
            className={`text-xs font-bold ${
              activeTab === "outgoing" ? "text-white" : "text-text-secondary"
            }`}
          >
            Sent / Outgoing
          </Text>
          {outgoingCount > 0 && (
            <View
              className={`ml-1.5 px-1.5 py-0.5 rounded-full ${
                activeTab === "outgoing" ? "bg-white/20" : "bg-border"
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  activeTab === "outgoing" ? "text-white" : "text-text-secondary"
                }`}
              >
                {outgoingCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Incoming Tab */}
        <TouchableOpacity
          id="tab-incoming-requests"
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
            activeTab === "incoming"
              ? "bg-primary shadow-sm"
              : "bg-transparent"
          }`}
          onPress={() => handleTabPress("incoming")}
        >
          <Text
            className={`text-xs font-bold ${
              activeTab === "incoming" ? "text-white" : "text-text-secondary"
            }`}
          >
            Received / Incoming
          </Text>
          {incomingCount > 0 && (
            <View
              className={`ml-1.5 px-1.5 py-0.5 rounded-full ${
                activeTab === "incoming" ? "bg-white/20" : "bg-border"
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  activeTab === "incoming" ? "text-white" : "text-text-secondary"
                }`}
              >
                {incomingCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
