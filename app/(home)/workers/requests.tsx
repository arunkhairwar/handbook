import { IncomingRequestsList } from "@/src/components/workers/IncomingRequestsList";
import { OutgoingRequestsList } from "@/src/components/workers/OutgoingRequestsList";
import { RequestTabsHeader } from "@/src/components/workers/RequestTabsHeader";
import {
  useIncomingWorkforceRequests,
  useSentWorkforceRequests,
} from "@/src/hooks";
import { WorkforceRequest } from "@/src/types/worker.types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function WorkforceRequestsScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();

  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");
  const [ready, setReady] = useState(false);

  // Resolve the correct tab from params before rendering to avoid flash
  useEffect(() => {
    setActiveTab(params.tab === "outgoing" ? "outgoing" : "incoming");
    setReady(true);
  }, [params.tab]);

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

  // Option / placeholder callback for future request details screen
  const handleDetailsPress = (_request: WorkforceRequest) => {
    // Placeholder ready for future detail screen navigation
  };

  if (!ready) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <RequestTabsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        incomingCount={pendingIncomingCount}
        outgoingCount={pendingOutgoingCount}
      />

      {activeTab === "incoming" ? (
        <IncomingRequestsList onDetailsPress={handleDetailsPress} />
      ) : (
        <OutgoingRequestsList />
      )}
    </View>
  );
}
