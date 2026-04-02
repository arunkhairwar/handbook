import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Site } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  const router = useRouter();

  return (
    <Card className="mb-3">
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-base font-bold text-slate-900">
            {site.name}
          </Text>
          <Text className="text-sm text-slate-500">{site.clientName}</Text>
        </View>
        <Badge label={site.status} variant="success" />
      </View>

      <View>
        <Text className="text-sm font-medium text-slate-900">
          Budget: ₹{site.estimatedBudget.toLocaleString()}
        </Text>
        <Button
          title="View Details"
          variant="outline"
          style={{ height: 36, marginTop: 8 }}
          onPress={() => router.push(`../sites/${site.id}`)}
        />
      </View>
    </Card>
  );
}
