import { WorkerSearchResult } from "@/src/types/worker.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { cn } from "@/src/lib/utils";

interface WorkerSearchResultTileProps {
  worker: WorkerSearchResult;
  /** Whether a request has already been sent to this worker in this session */
  requestSent?: boolean;
  onInvite: (worker: WorkerSearchResult) => void;
  isLoading?: boolean;
}

export function WorkerSearchResultTile({
  worker,
  requestSent = false,
  onInvite,
  isLoading = false,
}: WorkerSearchResultTileProps) {
  const fullName = [worker.firstName, worker.middleName, worker.lastName]
    .filter(Boolean)
    .join(" ");
  const initials = (
    worker.firstName[0] + (worker.lastName[0] ?? "")
  ).toUpperCase();

  return (
    <View className="flex-row items-center py-3 px-1 border-b border-border">
      {/* Avatar */}
      <View
        className={cn(
          "w-10 h-10 rounded-full justify-center items-center mr-3",
          requestSent ? "bg-success/15" : "bg-primary/10"
        )}
      >
        <Text
          className={cn(
            "text-sm font-bold",
            requestSent ? "text-success" : "text-primary"
          )}
        >
          {initials}
        </Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-text">{fullName}</Text>
        <Text className="text-xs text-text-secondary mt-0.5">
          {worker.countryCode} {worker.mobile}
        </Text>
      </View>

      {/* Invite button */}
      <TouchableOpacity
        className={cn(
          "w-9 h-9 rounded-full justify-center items-center",
          requestSent ? "bg-success/15" : "bg-primary"
        )}
        onPress={() => !requestSent && onInvite(worker)}
        disabled={requestSent || isLoading}
        id={`invite-worker-${worker.id}`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : requestSent ? (
          <Ionicons name="checkmark" size={18} color="#10B981" />
        ) : (
          <Ionicons name="add" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}
