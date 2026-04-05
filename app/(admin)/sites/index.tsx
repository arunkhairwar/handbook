import { SiteTile } from "@/src/components/sites/SiteTile";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FloatingActionButton } from "@/src/components/ui/FloatingActionButton";
import { FullScreenLoader } from "@/src/components/ui/FullScreenLoader";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { useSite } from "@/src/hooks/useSite";
import { AppRoutes } from "@/src/routes";
import { Site } from "@/src/types";
import { Href, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

export default function SitesListScreen() {
  const router = useRouter();
  const { sites, isLoading, getAllSites } = useSite();

  useEffect(() => {
    getAllSites();
  }, []);

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

  return (
    <SafeAreaWrapper className="flex-1">
      {isLoading ? (
        <FullScreenLoader message="Loading sites..." />
      ) : (
        <FlatList
          data={sites}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getAllSites} />
          }
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          ListEmptyComponent={
            <EmptyState
              title="No sites found"
              description="click + button to create your first site."
              iconName="business-outline"
            />
          }
        />
      )}

      <FloatingActionButton onPress={() => router.push(AppRoutes.SITE.ADD)} />
    </SafeAreaWrapper>
  );
}
