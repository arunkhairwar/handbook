import { SiteTile } from "@/src/components/sites/SiteTile";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FloatingActionButton } from "@/src/components/ui/FloatingActionButton";
import { FullScreenLoader } from "@/src/components/ui/FullScreenLoader";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { useSites } from "@/src/hooks/useSite";
import { AppRoutes } from "@/src/routes";
import { Site } from "@/src/types";
import { Href, useRouter } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";

export default function SitesListScreen() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSites();

  // Extract all sites from the pages
  const sites = data?.pages.flatMap((page) => page.data) ?? [];

  const handleViewSite = (id: string) => {
    router.push(AppRoutes.SITE.DETAIL(id) as Href);
  };

  const renderItem = ({ item }: { item: Site }) => (
    <SiteTile
      data={item}
      status={"Default"}
      onPress={() => handleViewSite(item.id)}
    />
  );

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaWrapper className="flex-1">
      {isLoading ? (
        <FullScreenLoader message="Loading sites..." />
      ) : (
        <FlatList
          data={sites}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title="No sites found"
              description="click + button to create your first site."
              iconName="business-outline"
            />
          }
        />
      )}

      <FloatingActionButton onPress={() => router.push(AppRoutes.SITE.ADD as any)} />
    </SafeAreaWrapper>
  );
}
