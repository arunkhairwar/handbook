import { Colors } from "@/constants/Colors";
import { CreateWorkforceModal } from "@/src/components/workers/CreateWorkforceModal";
import { WorkerSearchBottomSheet } from "@/src/components/workers/WorkerSearchBottomSheet";
import { WorkforceRequestsSheet } from "@/src/components/workers/WorkforceRequestsSheet";
import { WorkforceWorkerTile } from "@/src/components/workers/WorkforceWorkerTile";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FloatingActionButton } from "@/src/components/ui/FloatingActionButton";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import {
  useSentWorkforceRequests,
  useWorkforceWorkers,
} from "@/src/hooks";
import { workforceAtom } from "@/src/atoms/workforce.atom";
import { Workforce, WorkforceWorker } from "@/src/types/worker.types";
import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WorkersListScreen() {
  const [workforce, setWorkforce] = useAtom(workforceAtom);

  // Sheets visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearchSheet, setShowSearchSheet] = useState(false);
  const [showRequestsSheet, setShowRequestsSheet] = useState(false);

  // Local search for filtering confirmed workforce members
  const [memberSearch, setMemberSearch] = useState("");

  // Load workforce workers when workforce exists
  const {
    data: allWorkers,
    isLoading: workersLoading,
    refetch: refetchWorkers,
  } = useWorkforceWorkers(workforce?.id ?? null);

  // Load sent requests for badge count
  const { data: sentRequests } = useSentWorkforceRequests(!!workforce);

  const pendingCount = useMemo(
    () => sentRequests?.filter((r) => r.status === "PENDING").length ?? 0,
    [sentRequests]
  );

  // Filter workers locally by name search
  const filteredWorkers: WorkforceWorker[] = useMemo(() => {
    if (!allWorkers) return [];
    if (!memberSearch.trim()) return allWorkers;
    const q = memberSearch.toLowerCase();
    return allWorkers.filter((w) => {
      const name = `${w.user.firstName} ${w.user.middleName ?? ""} ${w.user.lastName}`.toLowerCase();
      return name.includes(q) || w.user.mobile.includes(q);
    });
  }, [allWorkers, memberSearch]);

  const handleWorkforceCreated = (created: Workforce) => {
    setWorkforce(created);
    setShowCreateModal(false);
  };

  // ─── State 1: No workforce ───────────────────────────────────────────────
  if (!workforce) {
    return (
      <View style={styles.container}>
        <EmptyState
          iconName="people-outline"
          title="No Workforce Yet"
          description="Create your workforce to start managing your team of workers."
        />

        <TouchableOpacity
          id="create-workforce-cta-btn"
          style={styles.ctaButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.ctaButtonText}>Create Workforce</Text>
        </TouchableOpacity>

        <CreateWorkforceModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleWorkforceCreated}
        />
      </View>
    );
  }

  // ─── States 2 & 3: Workforce exists ─────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header: Search + Requests button */}
      <View style={styles.headerBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={Colors.textSecondary} style={{ marginRight: 6 }} />
          <TextInput
            id="workforce-member-search"
            placeholder="Search members..."
            placeholderTextColor={Colors.textSecondary}
            value={memberSearch}
            onChangeText={setMemberSearch}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          id="view-requests-btn"
          style={styles.requestsBtn}
          onPress={() => setShowRequestsSheet(true)}
        >
          <Ionicons name="paper-plane-outline" size={20} color={Colors.primary} />
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {pendingCount > 9 ? "9+" : pendingCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Workforce name label */}
      {workforce.name ? (
        <View style={styles.workforceLabel}>
          <Text style={styles.workforceName}>{workforce.name}</Text>
          <Text style={styles.workforceCount}>
            {allWorkers?.length ?? 0} / {workforce.maxMemberCount} members
          </Text>
        </View>
      ) : null}

      {/* Workers list */}
      {workersLoading ? (
        <LoadingSpinner fullScreen message="Loading team..." />
      ) : (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <WorkforceWorkerTile worker={item} />}
          refreshControl={
            <RefreshControl
              refreshing={workersLoading}
              onRefresh={refetchWorkers}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            memberSearch ? (
              <EmptyState
                iconName="search-outline"
                title="No match found"
                description={`No members matching "${memberSearch}"`}
              />
            ) : (
              <EmptyState
                iconName="person-add-outline"
                title="No workers yet"
                description="Tap the + button to invite workers to join your team."
              />
            )
          }
        />
      )}

      {/* FAB to open worker search */}
      <FloatingActionButton
        id="add-worker-fab"
        variant="primary"
        onPress={() => setShowSearchSheet(true)}
      />

      {/* Worker Search Full-Screen Sheet */}
      <WorkerSearchBottomSheet
        visible={showSearchSheet}
        workforceId={workforce.id}
        onClose={() => setShowSearchSheet(false)}
      />

      {/* Sent Requests Full-Screen Sheet */}
      <WorkforceRequestsSheet
        visible={showRequestsSheet}
        onClose={() => setShowRequestsSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // ── No-workforce CTA ──
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
    marginBottom: 40,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  // ── Header bar ──
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
  requestsBtn: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  workforceLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary + "08",
  },
  workforceName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  workforceCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
});
