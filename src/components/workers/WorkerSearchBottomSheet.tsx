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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { WorkerSearchResultTile } from "./WorkerSearchResultTile";
import { cn } from "@/src/lib/utils";

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
    () =>
      data?.pages.flatMap((p) => {
        if (Array.isArray(p?.data)) return p.data;
        if (Array.isArray((p as any)?.results)) return (p as any).results;
        if (Array.isArray(p)) return p;
        return [];
      }) ?? [],
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
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-14 pb-2 bg-card border-b border-border">
          <TouchableOpacity onPress={handleClose} id="close-worker-search-btn">
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-text">Find Workers</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View className="px-4 pt-3 bg-card">
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
        <View className="flex-row px-4 pb-3 gap-2 bg-card border-b border-border">
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              id={`filter-chip-${f.key}`}
              className={cn(
                "px-3.5 py-1.5 rounded-full",
                activeFilter === f.key ? "bg-primary" : "bg-border"
              )}
              onPress={() => {
                setActiveFilter(f.key);
                setDebouncedText(searchText);
              }}
            >
              <Text
                className={cn(
                  "text-xs font-medium",
                  activeFilter === f.key ? "text-white" : "text-text-secondary"
                )}
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
          <View className="flex-1 items-center justify-center pt-20 gap-3">
            <Ionicons name="search-outline" size={48} color="#E2E8F0" />
            <Text className="text-sm text-text-secondary text-center">
              Type a name or mobile to search workers
            </Text>
          </View>
        ) : (
          <FlatList
            data={workers}
            keyExtractor={(item, index) => item?.id ?? index.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}
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
              <View className="flex-1 items-center justify-center pt-20 gap-3">
                <Text className="text-sm text-text-secondary text-center">No workers found</Text>
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
      </View>
    </Modal>
  );
}
