import React from "react";
import { View } from "react-native";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import WeeklyPayoutAlert from "@/src/components/dashboard/WeeklyPayoutAlert";
import FinancialSummary from "@/src/components/dashboard/FinancialSummary";
import TodayWorkforce from "@/src/components/dashboard/TodayWorkforce";
import ActiveSitesList from "@/src/components/dashboard/ActiveSitesList";

export default function ContractorDashboard() {
  return (
    <SafeAreaWrapper scrollable edges={["left", "right"]}>
      <View className="p-4 pb-8">
        <DashboardHeader />
        <WeeklyPayoutAlert />
        <FinancialSummary />
        <TodayWorkforce />
        <ActiveSitesList />
      </View>
    </SafeAreaWrapper>
  );
}
