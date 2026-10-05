import { EmptyState } from "@/src/components/ui/EmptyState";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { OutgoingRequestTile } from "@/src/components/workers/OutgoingRequestTile";
import {
  useCancelWorkforceRequest,
  useSentWorkforceRequests,
} from "@/src/hooks";
import { WorkforceRequest } from "@/src/types/worker.types";
import React from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export function OutgoingRequestsList() {
  const {
    data: requests,
    isLoading,
    isRefetching,
    refetch,
  } = useSentWorkforceRequests();

  const { mutate: cancelRequest, isPending: isCancelling } =
    useCancelWorkforceRequest();

  const handleCancel = (request: WorkforceRequest) => {
    const receiverName = [request.receiver.firstName, request.receiver.lastName]
      .filter(Boolean)
      .join(" ");

    Alert.alert(
      "Cancel Request?",
      `Are you sure you want to cancel the invite sent to ${receiverName}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            cancelRequest(request.id, {
              onSuccess: () => {
                Toast.show({
                  type: "success",
                  text1: "Request Cancelled",
                  text2: `Invite to ${receiverName} was cancelled.`,
                });
              },
              onError: (err: any) => {
                Toast.show({
                  type: "error",
                  text1: "Failed to cancel",
                  text2: err?.response?.data?.message || "Please try again.",
                });
              },
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading sent requests..." />;
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={requests ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, flexGrow: 1 }}
        renderItem={({ item }) => (
          <OutgoingRequestTile
            request={item}
            onCancel={handleCancel}
            isCancelling={isCancelling}
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
            iconName="paper-plane-outline"
            title="No Sent Requests"
            description="You haven't sent any workforce invites yet. Invite workers from the Workers tab."
          />
        }
      />
    </View>
  );
}
