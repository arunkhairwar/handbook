import { Colors } from "@/constants/Colors";
import { WorkerSearchResult } from "@/src/types/worker.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    <View style={styles.container}>
      {/* Avatar */}
      <View style={[styles.avatar, requestSent && styles.avatarSent]}>
        <Text style={[styles.avatarText, requestSent && styles.avatarTextSent]}>
          {initials}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.mobile}>
          {worker.countryCode} {worker.mobile}
        </Text>
      </View>

      {/* Invite button */}
      <TouchableOpacity
        style={[styles.inviteBtn, requestSent && styles.inviteBtnSent]}
        onPress={() => !requestSent && onInvite(worker)}
        disabled={requestSent || isLoading}
        id={`invite-worker-${worker.id}`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : requestSent ? (
          <Ionicons name="checkmark" size={18} color={Colors.success} />
        ) : (
          <Ionicons name="add" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  avatarSent: {
    backgroundColor: Colors.success + "22",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  avatarTextSent: {
    color: Colors.success,
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
  inviteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  inviteBtnSent: {
    backgroundColor: Colors.success + "22",
  },
});
