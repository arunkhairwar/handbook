import { Colors } from "@/constants/Colors";
import { Badge } from "@/src/components/ui/Badge";
import { Card } from "@/src/components/ui/Card";
import { Divider } from "@/src/components/ui/Divider";
import { FullScreenLoader } from "@/src/components/ui/FullScreenLoader";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { ScreenHeader } from "@/src/components/ui/ScreenHeader";
import { useSiteDetails } from "@/src/hooks/useSite";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { ScrollView, Text, View } from "react-native";

export default function SiteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: site, isLoading, error } = useSiteDetails(id);

  if (isLoading) {
    return <FullScreenLoader message="Loading site details..." />;
  }

  if (error || !site) {
    return (
      <SafeAreaWrapper className="flex-1 bg-[#F8FAFC]">
        <ScreenHeader label="Site Details" />
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle-outline" size={60} color={Colors.error} />
          <Text className="text-lg font-semibold text-slate-800 mt-4">
            Site Not Found
          </Text>
          <Text className="text-sm text-slate-500 text-center mt-2">
            The site you are looking for does not exist or could not be loaded.
          </Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  const formatDate = (dateString?: string | null) =>
    dateString ? moment(dateString).format("DD MMM YYYY") : "Not set";

  const formatCurrency = (amount?: number | null) =>
    amount !== undefined && amount !== null ? `₹ ${amount.toLocaleString("en-IN")}` : "Not set";

  return (
    <SafeAreaWrapper className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header section card */}
        <Card className="mb-4 bg-white border border-slate-200">
          <View className="flex-row items-center justify-between mb-3">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: Colors.tiles.site.background }}
            >
              <Ionicons
                name="business-outline"
                size={24}
                color={Colors.tiles.site.icon}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-900" numberOfLines={2}>
                {site.name}
              </Text>
            </View>
            <Badge title="ONGOING" variant="success" />
          </View>
        </Card>

        {/* Project Metrics Section */}
        <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
          Project Metrics
        </Text>
        <Card className="mb-4 bg-white border border-slate-200">
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-lg bg-amber-50 items-center justify-center mr-3">
                <Ionicons name="wallet-outline" size={20} color={Colors.accent} />
              </View>
              <View>
                <Text className="text-xs text-slate-400">Estimated Budget</Text>
                <Text className="text-base font-bold text-slate-800">
                  {formatCurrency(site.estimatedBudget)}
                </Text>
              </View>
            </View>
          </View>
          <Divider />
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center flex-1">
              <View className="w-9 h-9 rounded-lg bg-blue-50 items-center justify-center mr-3">
                <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400">Start Date</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {formatDate(site.startDate)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center flex-1">
              <View className="w-9 h-9 rounded-lg bg-rose-50 items-center justify-center mr-3">
                <Ionicons name="calendar-outline" size={20} color={Colors.error} />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400">Expected End</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {formatDate(site.expectedEndDate)}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Address Details */}
        {site.profile?.address && (
          <>
            <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Address Details
            </Text>
            <Card className="mb-4 bg-white border border-slate-200">
              <View className="flex-row items-start py-1">
                <View className="w-9 h-9 rounded-lg bg-purple-50 items-center justify-center mr-3 mt-0.5">
                  <Ionicons name="location-outline" size={20} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-400">Location Address</Text>
                  {site.profile.address.addressLine1 && (
                    <Text className="text-sm text-slate-800 mt-1">
                      {site.profile.address.addressLine1}
                    </Text>
                  )}
                  {site.profile.address.addressLine2 && (
                    <Text className="text-sm text-slate-800">
                      {site.profile.address.addressLine2}
                    </Text>
                  )}
                  <Text className="text-sm font-semibold text-slate-800 mt-0.5">
                    {site.profile.address.city}, {site.profile.address.state}
                  </Text>
                  <Text className="text-sm text-slate-500 mt-0.5">
                    PIN: {site.profile.address.pincode}
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
