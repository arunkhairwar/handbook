import { EmptyState } from "@/src/components/ui/EmptyState";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { IncomingRequestTile } from "@/src/components/workers/IncomingRequestTile";
import {
  useIncomingWorkforceRequests,
  useUpdateWorkforceRequestStatus,
} from "@/src/hooks";
import { WorkforceRequest } from "@/src/types/worker.types";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface IncomingRequestsListProps {
  onDetailsPress?: (request: WorkforceRequest) => void;
}

export function IncomingRequestsList({ onDetailsPress }: IncomingRequestsListProps) {
  const {
    data: requests,
    isLoading,
    isRefetching,
    refetch,
  } = useIncomingWorkforceRequests();

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateWorkforceRequestStatus();

  const [activeUpdatingId, setActiveUpdatingId] = useState<string | null>(null);

  const handleAccept = (request: WorkforceRequest) => {
    const sender = request.sender || request.receiver;
    const name = [sender?.firstName, sender?.lastName].filter(Boolean).join(" ") || "Workforce";

    Alert.alert(
      "Accept Request?",
      `Accept invite from ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          style: "default",
          onPress: () => {
            setActiveUpdatingId(request.id);
            updateStatus(
              {
                requestId: request.id,
                status: "ACCEPTED",
              },
              {
                onSuccess: () => {
                  setActiveUpdatingId(null);
                  Toast.show({
                    type: "success",
                    text1: "Request Accepted",
                    text2: `You joined ${name}'s workforce.`,
                  });
                },
                onError: (err: any) => {
                  setActiveUpdatingId(null);
                  Toast.show({
                    type: "error",
                    text1: "Failed to accept request",
                    text2: err?.response?.data?.message || "Please try again.",
                  });
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleReject = (request: WorkforceRequest) => {
    const sender = request.sender || request.receiver;
    const name = [sender?.firstName, sender?.lastName].filter(Boolean).join(" ") || "Workforce";

    Alert.alert(
      "Reject Request?",
      `Are you sure you want to reject the invite from ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setActiveUpdatingId(request.id);
            updateStatus(
              {
                requestId: request.id,
                status: "REJECTED",
              },
              {
                onSuccess: () => {
                  setActiveUpdatingId(null);
                  Toast.show({
                    type: "info",
                    text1: "Request Rejected",
                    text2: `Invite from ${name} was rejected.`,
                  });
                },
                onError: (err: any) => {
                  setActiveUpdatingId(null);
                  Toast.show({
                    type: "error",
                    text1: "Failed to reject request",
                    text2: err?.response?.data?.message || "Please try again.",
                  });
                },
              }
            );
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading incoming requests..." />;
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={requests ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, flexGrow: 1 }}
        renderItem={({ item }) => (
          <IncomingRequestTile
            request={item}
            onPress={onDetailsPress}
            onAccept={handleAccept}
            onReject={handleReject}
            isUpdating={isUpdating && activeUpdatingId === item.id}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#1E293B"
          />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="mail-unread-outline"
            title="No Incoming Requests"
            description="You have no pending requests or invitations at this moment."
          />
        }
      />
    </View>
  );
}
