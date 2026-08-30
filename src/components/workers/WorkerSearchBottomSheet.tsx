import { Colors } from "@/constants/Colors";
import { Input } from "@/src/components/ui/Input";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import {
  useSearchWorkers,
  useSendWorkforceRequest,
} from "@/src/hooks";
import { WorkerSearchResult } from "@/src/types/worker.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { WorkerSearchResultTile } from "./WorkerSearchResultTile";

type FilterType = "q" | "name" | "mobile" | "address";

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "q", label: "All" },
  { key: "name", label: "Name" },
  { key: "mobile", label: "Mobile" },
  { key: "address", label: "Address" },
];

interface WorkerSearchBottomSheetProps {
  visible: boolean;
  workforceId: string;
  onClose: () => void;
}

export function WorkerSearchBottomSheet({
  visible,
  workforceId,
  onClose,
}: WorkerSearchBottomSheetProps) {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("q");
  // Track request-sent state locally so the + turns to ✓ immediately
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Debounce search — only query after 400ms of no typing
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedText, setDebouncedText] = useState("");

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedText(text), 400);
  }, []);

  const query = useMemo(
    () => ({
      [activeFilter]: debouncedText || undefined,
    }),
    [activeFilter, debouncedText]
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSearchWorkers(query, visible && debouncedText.length > 0);

  const workers: WorkerSearchResult[] = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data]
  );

  const { mutate: sendRequest } = useSendWorkforceRequest();

  const handleInvite = (worker: WorkerSearchResult) => {
    setSendingId(worker.id);
    sendRequest(
      { receiverId: worker.id, workforceId },
      {
        onSuccess: () => {
          setSentIds((prev) => new Set([...prev, worker.id]));
          Toast.show({
            type: "success",
            text1: "Request sent!",
            text2: `Invite sent to ${worker.firstName}`,
          });
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: "Failed to send",
            text2: err?.response?.data?.message || "Try again",
          });
        },
        onSettled: () => setSendingId(null),
      }
    );
  };

  const handleClose = () => {
    setSearchText("");
    setDebouncedText("");
    setSentIds(new Set());
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} id="close-worker-search-btn">
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Find Workers</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Input
            id="worker-search-input"
            placeholder="Search workers..."
            value={searchText}
            onChangeText={handleSearch}
            rightIcon="search-outline"
            autoFocus
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              id={`filter-chip-${f.key}`}
              style={[
                styles.chip,
                activeFilter === f.key && styles.chipActive,
              ]}
              onPress={() => {
                setActiveFilter(f.key);
                setDebouncedText(searchText);
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === f.key && styles.chipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner message="Searching..." />
        ) : debouncedText.length === 0 ? (
          <View style={styles.emptyHint}>
            <Ionicons name="search-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyHintText}>
              Type a name or mobile to search workers
            </Text>
          </View>
        ) : (
          <FlatList
            data={workers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <WorkerSearchResultTile
                worker={item}
                requestSent={sentIds.has(item.id)}
                isLoading={sendingId === item.id}
                onInvite={handleInvite}
              />
            )}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              <View style={styles.emptyHint}>
                <Text style={styles.emptyHintText}>No workers found</Text>
              </View>
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <LoadingSpinner message="Loading more..." />
              ) : null
            }
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* TODO: Backend should filter out workers already in the workforce
            or with a pending request (workforceId filter param not yet supported) */}
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
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#fff",
  },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: "#fff",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyHint: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyHintText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
