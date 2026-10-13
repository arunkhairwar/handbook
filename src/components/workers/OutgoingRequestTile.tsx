import { Badge } from "@/src/components/ui/Badge";
import { WorkforceRequest, WorkforceRequestStatus } from "@/src/types/worker.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

interface OutgoingRequestTileProps {
  request: WorkforceRequest;
  onCancel?: (request: WorkforceRequest) => void;
  isCancelling?: boolean;
}

export function OutgoingRequestTile({
  request,
  onCancel,
  isCancelling,
}: OutgoingRequestTileProps) {
  const fullName = [
    request.receiver.firstName,
    request.receiver.middleName,
    request.receiver.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = (
    (request.receiver.firstName?.[0] ?? "") +
    (request.receiver.lastName?.[0] ?? "")
  ).toUpperCase() || "W";

  const rejectionReason = request.reason || request.rejectionReason;

  return (
    <View className="flex-row items-center justify-between bg-card rounded-2xl p-4 mb-3 border border-border/60 shadow-sm">
      {/* Avatar + info */}
      <View className="flex-row items-center flex-1 mr-3">
        <View className="w-11 h-11 rounded-full bg-primary/10 justify-center items-center mr-3 border border-primary/20">
          <Text className="text-sm font-bold text-primary">{initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-text" numberOfLines={1}>
            {fullName}
          </Text>
          <Text className="text-xs text-text-secondary mt-0.5">
            {request.receiver.countryCode} {request.receiver.mobile}
          </Text>
          {request.status === "REJECTED" && rejectionReason ? (
            <Text className="text-xs text-error mt-1 italic" numberOfLines={2}>
              Reason: {rejectionReason}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Right: status + cancel */}
      <View className="items-end gap-1.5">
        <Badge
          title={STATUS_LABEL[request.status]}
          variant={STATUS_VARIANT[request.status]}
        />
        {request.status === "PENDING" && onCancel && (
          <TouchableOpacity
            testID={`cancel-request-${request.id}`}
            className="flex-row items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 active:opacity-70 mt-1"
            onPress={() => onCancel(request)}
            disabled={isCancelling}
          >
            <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
            <Text className="text-xs font-semibold text-error">Cancel</Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}
