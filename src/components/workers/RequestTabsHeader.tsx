import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RequestTabsHeaderProps {
  activeTab: "outgoing" | "incoming";
  onTabChange: (tab: "outgoing" | "incoming") => void;
  outgoingCount?: number;
  incomingCount?: number;
}

export function RequestTabsHeader({
  activeTab,
  onTabChange,
  outgoingCount = 0,
  incomingCount = 0,
}: RequestTabsHeaderProps) {
  return (
    <View className="px-4 pt-3 pb-2 bg-card border-b border-border">
      <View className="flex-row bg-background rounded-xl p-1 border border-border">
        {/* Incoming Tab */}
        <TouchableOpacity
          testID="tab-incoming-requests"
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${activeTab === "incoming"
              ? "bg-primary shadow-sm"
              : "bg-transparent"
            }`}
          onPress={() => onTabChange("incoming")}
        >
          <Text
            className={`text-xs font-bold ${activeTab === "incoming" ? "text-white" : "text-text-secondary"
              }`}
          >
            Received / Incoming
          </Text>
          {incomingCount > 0 && (
            <View
              className={`ml-1.5 px-1.5 py-0.5 rounded-full ${activeTab === "incoming" ? "bg-white/20" : "bg-border"
                }`}
            >
              <Text
                className={`text-[10px] font-bold ${activeTab === "incoming" ? "text-white" : "text-text-secondary"
                  }`}
              >
                {incomingCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Outgoing Tab */}
        <TouchableOpacity
          testID="tab-outgoing-requests"
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${activeTab === "outgoing"
              ? "bg-primary shadow-sm"
              : "bg-transparent"
            }`}
          onPress={() => onTabChange("outgoing")}
        >

          <Text
            className={`text-xs font-bold ${activeTab === "outgoing" ? "text-white" : "text-text-secondary"
              }`}
          >
            Sent / Outgoing
          </Text>
          {outgoingCount > 0 && (
            <View
              className={`ml-1.5 px-1.5 py-0.5 rounded-full ${activeTab === "outgoing" ? "bg-white/20" : "bg-border"
                }`}
            >
              <Text
                className={`text-[10px] font-bold ${activeTab === "outgoing" ? "text-white" : "text-text-secondary"
                  }`}
              >
                {outgoingCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
