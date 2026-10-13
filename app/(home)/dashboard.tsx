import ActiveSitesList from "@/src/components/dashboard/ActiveSitesList";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import FinancialSummary from "@/src/components/dashboard/FinancialSummary";
import TodayWorkforce from "@/src/components/dashboard/TodayWorkforce";
import WeeklyPayoutAlert from "@/src/components/dashboard/WeeklyPayoutAlert";
import WorkforceRequestsTile from "@/src/components/dashboard/WorkforceRequestsTile";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import React from "react";
import { View } from "react-native";

export default function ContractorDashboard() {
  return (
    <SafeAreaWrapper scrollable edges={["left", "right"]}>
      <View className="p-4 pb-8">
        <DashboardHeader />
        <WeeklyPayoutAlert />
        <FinancialSummary />
        <TodayWorkforce />
        <WorkforceRequestsTile />
        <ActiveSitesList />
      </View>
    </SafeAreaWrapper>
  );
}

