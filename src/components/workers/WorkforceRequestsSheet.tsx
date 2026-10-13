import { Badge } from "@/src/components/ui/Badge";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import {
  useCancelWorkforceRequest,
  useSentWorkforceRequests,
} from "@/src/hooks";
import { WorkforceRequest, WorkforceRequestStatus } from "@/src/types/worker.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const STATUS_VARIANT: Record<
  WorkforceRequestStatus,
  "warning" | "success" | "error"
> = {
  PENDING: "warning",
  ACCEPTED: "success",
  REJECTED: "error",
};

const STATUS_LABEL: Record<WorkforceRequestStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

interface WorkforceRequestsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function WorkforceRequestsSheet({
  visible,
  onClose,
}: WorkforceRequestsSheetProps) {
  const { data: requests, isLoading, refetch } = useSentWorkforceRequests(visible);
  const { mutate: cancelRequest, isPending: isCancelling } =
    useCancelWorkforceRequest();

  const handleCancel = (request: WorkforceRequest) => {
    Alert.alert(
      "Cancel Request?",
      `Cancel the invite sent to ${request.receiver.firstName}?`,
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
                  text1: "Request cancelled",
                });
              },
              onError: (err: any) => {
                Toast.show({
                  type: "error",
                  text1: "Failed to cancel",
                  text2: err?.response?.data?.message || "Try again",
                });
              },
            });
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: WorkforceRequest }) => {
    const fullName = [
      item.receiver.firstName,
      item.receiver.middleName,
      item.receiver.lastName,
    ]
      .filter(Boolean)
      .join(" ");
    const initials = (
      item.receiver.firstName[0] + (item.receiver.lastName[0] ?? "")
    ).toUpperCase();

    return (
      <View className="flex-row items-center justify-between bg-card rounded-xl p-3.5 mb-2.5 shadow-sm elevation-2">
        {/* Avatar + info */}
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-primary/10 justify-center items-center mr-3">
            <Text className="text-sm font-bold text-primary">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-text">{fullName}</Text>
            <Text className="text-xs text-text-secondary mt-0.5">
              {item.receiver.countryCode} {item.receiver.mobile}
            </Text>
            {item.status === "REJECTED" && item.rejectionReason ? (
              <Text className="text-xs text-error mt-1 italic" numberOfLines={2}>
                Reason: {item.rejectionReason}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Right: status + cancel */}
        <View className="items-end gap-1.5 ml-2">
          <Badge
            title={STATUS_LABEL[item.status]}
            variant={STATUS_VARIANT[item.status]}
          />
          {item.status === "PENDING" && (
            <TouchableOpacity
              id={`cancel-request-${item.id}`}
              className="p-0.5"
              onPress={() => handleCancel(item)}
              disabled={isCancelling}
            >
              <Ionicons name="close-circle-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-14 pb-3 bg-card border-b border-border">
          <TouchableOpacity onPress={onClose} id="close-requests-sheet-btn">
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-text">Sent Requests</Text>
          <TouchableOpacity onPress={() => refetch()} id="refresh-requests-btn">
            <Ionicons name="refresh-outline" size={22} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <LoadingSpinner message="Loading requests..." />
        ) : (
          <FlatList
            data={requests ?? []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            renderItem={renderItem}
            ListEmptyComponent={
              <View className="items-center justify-center pt-24 gap-3">
                <Ionicons
                  name="paper-plane-outline"
                  size={48}
                  color="#E2E8F0"
                />
                <Text className="text-sm text-text-secondary">No requests sent yet</Text>
              </View>
            }
          />
        )}
      </View>
    </Modal>
  );
}
