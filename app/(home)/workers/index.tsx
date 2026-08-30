import { workforceAtom } from "@/src/atoms/workforce.atom";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FloatingActionButton } from "@/src/components/ui/FloatingActionButton";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { CreateWorkforceModal } from "@/src/components/workers/CreateWorkforceModal";
import { WorkerSearchBottomSheet } from "@/src/components/workers/WorkerSearchBottomSheet";
import { WorkforceRequestsSheet } from "@/src/components/workers/WorkforceRequestsSheet";
import { WorkforceWorkerTile } from "@/src/components/workers/WorkforceWorkerTile";
import {
  useMyWorkforce,
  useSentWorkforceRequests,
  useWorkforceWorkers,
} from "@/src/hooks";
import { Workforce, WorkforceWorker } from "@/src/types/worker.types";
import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
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

  // Fetch current user's workforce from backend
  const { data: myWorkforce, isLoading: isMyWorkforceLoading } = useMyWorkforce(!workforce);

  useEffect(() => {
    if (myWorkforce) {
      setWorkforce(myWorkforce);
    }
  }, [myWorkforce, setWorkforce]);

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
      <View className="flex-1 bg-background">
        <EmptyState
          iconName="people-outline"
          title="No Workforce Yet"
          description="Create your workforce to start managing your team of workers."
        />

        <TouchableOpacity
          id="create-workforce-cta-btn"
          className="flex-row items-center justify-center mx-8 mb-10 py-3.5 rounded-2xl bg-primary shadow-lg elevation-6"
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text className="text-base font-bold text-white">Create Workforce</Text>
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
    <View className="flex-1 bg-background">
      {/* Header: Search + Requests button */}
      <View className="flex-row items-center px-4 py-2.5 bg-card border-b border-border gap-2.5">
        <View className="flex-1 flex-row items-center bg-background rounded-lg border border-border px-2.5 py-2">
          <Ionicons name="search-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
          <TextInput
            id="workforce-member-search"
            placeholder="Search members..."
            placeholderTextColor="#64748B"
            value={memberSearch}
            onChangeText={setMemberSearch}
            className="flex-1 text-sm text-text p-0"
          />
        </View>

        <TouchableOpacity
          id="view-requests-btn"
          className="relative w-10 h-10 rounded-full bg-primary/10 justify-center items-center"
          onPress={() => setShowRequestsSheet(true)}
        >
          <Ionicons name="paper-plane-outline" size={20} color="#1E293B" />
          {pendingCount > 0 && (
            <View className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full bg-error justify-center items-center px-1">
              <Text className="text-[10px] font-bold text-white">
                {pendingCount > 9 ? "9+" : pendingCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Workforce name label */}
      {workforce.name ? (
        <View className="flex-row justify-between items-center px-4 py-2.5 bg-primary/5">
          <Text className="text-sm font-bold text-primary">{workforce.name}</Text>
          <Text className="text-xs text-text-secondary">
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
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          renderItem={({ item }) => <WorkforceWorkerTile worker={item} />}
          refreshControl={
            <RefreshControl
              refreshing={workersLoading}
              onRefresh={refetchWorkers}
              tintColor="#1E293B"
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
