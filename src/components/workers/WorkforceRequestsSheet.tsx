import { Colors } from "@/constants/Colors";
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
  StyleSheet,
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
      <View style={styles.card}>
        {/* Avatar + info */}
        <View style={styles.left}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.mobile}>
              {item.receiver.countryCode} {item.receiver.mobile}
            </Text>
            {item.status === "REJECTED" && item.rejectionReason ? (
              <Text style={styles.reason} numberOfLines={2}>
                Reason: {item.rejectionReason}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Right: status + cancel */}
        <View style={styles.right}>
          <Badge
            title={STATUS_LABEL[item.status]}
            variant={STATUS_VARIANT[item.status]}
          />
          {item.status === "PENDING" && (
            <TouchableOpacity
              id={`cancel-request-${item.id}`}
              style={styles.cancelBtn}
              onPress={() => handleCancel(item)}
              disabled={isCancelling}
            >
              <Ionicons name="close-circle-outline" size={22} color={Colors.error} />
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} id="close-requests-sheet-btn">
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Sent Requests</Text>
          <TouchableOpacity onPress={() => refetch()} id="refresh-requests-btn">
            <Ionicons name="refresh-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <LoadingSpinner message="Loading requests..." />
        ) : (
          <FlatList
            data={requests ?? []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons
                  name="paper-plane-outline"
                  size={48}
                  color={Colors.border}
                />
                <Text style={styles.emptyText}>No requests sent yet</Text>
              </View>
            }
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary + "22",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  mobile: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  reason: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    fontStyle: "italic",
  },
  right: {
    alignItems: "flex-end",
    gap: 6,
  },
  cancelBtn: {
    padding: 2,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
