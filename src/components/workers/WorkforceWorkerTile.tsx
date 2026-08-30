import { Colors } from "@/constants/Colors";
import { Badge } from "@/src/components/ui/Badge";
import { WorkforceWorker, WorkerRole } from "@/src/types/worker.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ROLE_LABELS: Record<WorkerRole, string> = {
  HELPER: "Helper",
  MISTRI: "Mistri",
  ELECTRICIAN: "Electrician",
  PLUMBER: "Plumber",
  PAINTER: "Painter",
  CARPENTER: "Carpenter",
  COOLY: "Cooly",
};

interface WorkforceWorkerTileProps {
  worker: WorkforceWorker;
}

export function WorkforceWorkerTile({ worker }: WorkforceWorkerTileProps) {
  const fullName = [worker.user.firstName, worker.user.middleName, worker.user.lastName]
    .filter(Boolean)
    .join(" ");
  const initials = (worker.user.firstName[0] + (worker.user.lastName[0] ?? "")).toUpperCase();

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.mobile}>{worker.user.countryCode} {worker.user.mobile}</Text>
      </View>

      {/* Right side: role + wage */}
      <View style={styles.right}>
        <Badge title={ROLE_LABELS[worker.role]} variant="primary" />
        <Text style={styles.wage}>₹{worker.wage}/day</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + "22",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
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
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  wage: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
