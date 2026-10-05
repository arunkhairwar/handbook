import { Badge } from "@/src/components/ui/Badge";
import { WorkforceRequest, WorkforceRequestStatus } from "@/src/types/worker.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

interface IncomingRequestTileProps {
  request: WorkforceRequest;
  onPress?: (request: WorkforceRequest) => void;
  onAccept?: (request: WorkforceRequest) => void;
  onReject?: (request: WorkforceRequest) => void;
  isUpdating?: boolean;
}

export function IncomingRequestTile({
  request,
  onPress,
  onAccept,
  onReject,
  isUpdating = false,
}: IncomingRequestTileProps) {
  // Extract sender details or fallback to receiver
  const sender = request.sender || request.receiver;
  const senderName = [sender?.firstName, sender?.middleName, sender?.lastName]
    .filter(Boolean)
    .join(" ") || "Workforce Team";

  const initials = (
    (sender?.firstName?.[0] ?? "") + (sender?.lastName?.[0] ?? "")
  ).toUpperCase() || "W";

  const workforceName = request.workforce?.name;
  const rejectionReason = request.reason || request.rejectionReason;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={() => onPress?.(request)}
      className="bg-card rounded-2xl p-4 mb-3.5 border border-border/60 shadow-sm"
    >
      {/* Header Row: Sender info + Status Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-11 h-11 rounded-full bg-accent/15 justify-center items-center mr-3 border border-accent/25">
            <Text className="text-sm font-bold text-accent">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-text" numberOfLines={1}>
              {senderName}
            </Text>
            {sender?.mobile ? (
              <Text className="text-xs text-text-secondary mt-0.5">
                {sender.countryCode ? `${sender.countryCode} ` : ""}{sender.mobile}
              </Text>
            ) : null}
          </View>
        </View>

        <Badge
          title={STATUS_LABEL[request.status]}
          variant={STATUS_VARIANT[request.status]}
        />
      </View>

      {/* Workforce or Role info if present */}
      {(workforceName || request.role) && (
        <View className="flex-row flex-wrap items-center gap-2 mb-3 bg-background/70 p-2.5 rounded-xl border border-border/40">
          {workforceName ? (
            <View className="flex-row items-center mr-2">
              <Ionicons name="people-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text className="text-xs font-semibold text-text-secondary">
                {workforceName}
              </Text>
            </View>
          ) : null}
          {request.role ? (
            <View className="flex-row items-center">
              <Ionicons name="construct-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text className="text-xs font-medium text-text-secondary">
                Role: {request.role}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Rejection reason if rejected */}
      {request.status === "REJECTED" && rejectionReason ? (
        <View className="mb-3 p-2.5 rounded-xl bg-red-50/80 border border-red-100">
          <Text className="text-xs text-error font-medium">
            Reason: {rejectionReason}
          </Text>
        </View>
      ) : null}

      {/* Action Buttons for Pending Requests */}
      {request.status === "PENDING" && (
        <View className="flex-row items-center gap-2.5 pt-1 border-t border-border/40 mt-1">
          {/* Reject Button */}
          <TouchableOpacity
            testID={`reject-request-${request.id}`}
            className="flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-xl border border-red-300 bg-red-50/60 active:opacity-70"
            onPress={() => onReject?.(request)}
            disabled={isUpdating}
          >
            <Ionicons name="close-circle-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
            <Text className="text-xs font-bold text-error">Reject</Text>
          </TouchableOpacity>

          {/* Accept Button */}
          <TouchableOpacity
            testID={`accept-request-${request.id}`}
            className="flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-xl bg-emerald-600 active:opacity-80 shadow-sm"
            onPress={() => onAccept?.(request)}
            disabled={isUpdating}
          >

            {isUpdating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text className="text-xs font-bold text-white">Accept</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
