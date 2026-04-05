import { SiteTile } from "@/src/components/sites/SiteTile";
import { FloatingActionButton } from "@/src/components/ui/FloatingActionButton";
import { useSite } from "@/src/hooks/useSite";
import { AppRoutes } from "@/src/routes";
import { Href, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, View } from "react-native";
import { Site } from "@/src/types";

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
    <View className="flex-1">
      <FlatList
        data={sites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
      />

      <FloatingActionButton onPress={() => router.push(AppRoutes.SITE.ADD)} />
    </View>
  );
}
