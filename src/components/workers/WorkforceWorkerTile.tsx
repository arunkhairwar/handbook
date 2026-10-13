import { Badge } from "@/src/components/ui/Badge";
import { WorkforceWorker, WorkerRole } from "@/src/types/worker.types";
import React from "react";
import { Text, View } from "react-native";

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
    <View className="flex-row items-center bg-card rounded-xl p-3.5 mb-2.5 shadow-sm elevation-2">
      {/* Avatar */}
      <View className="w-11 h-11 rounded-full bg-primary/10 justify-center items-center mr-3">
        <Text className="text-base font-bold text-primary">{initials}</Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-text">{fullName}</Text>
        <Text className="text-xs text-text-secondary mt-0.5">
          {worker.user.countryCode} {worker.user.mobile}
        </Text>
      </View>

      {/* Right side: role + wage */}
      <View className="items-end gap-1">
        <Badge title={ROLE_LABELS[worker.role]} variant="primary" />
        <Text className="text-xs text-text-secondary font-medium">₹{worker.wage}/day</Text>
      </View>
    </View>
  );
}
