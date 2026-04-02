import { userAtom } from "@/src/atoms/auth.atoms";
import { SiteCard } from "@/src/components/admin/dashboard/SiteCard";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { useAuth } from "@/src/hooks";
import { useStore } from "@/store/mockStore";
import { useAtomValue } from "jotai";
import React from "react";
import { Text, View } from "react-native";

export default function ContractorDashboard() {
  const { sites, payments, expenses } = useStore();
  const { logout } = useAuth();
  const user = useAtomValue(userAtom);

  const activeSites = sites.filter((s) => s.status === "ONGOING");

  const totalReceived = payments
    .filter((p) => p.type === "INCOME")
    .reduce((acc, p) => acc + p.amount, 0);
  const totalPaid = payments
    .filter((p) => p.type === "EXPENSE")
    .reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.cost, 0);

  const grandTotalExpense = totalPaid + totalExpenses;
  const netProfit = totalReceived - grandTotalExpense;

  return (
    <SafeAreaWrapper scrollable>
      <View className="p-4">
        {/* Header */}
        <View className="mb-5">
          <Text className="text-2xl font-bold text-slate-800">
            Hello, {user?.name}
          </Text>
          <Text className="text-sm text-slate-500">
            {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Financial Summary */}
        <View className="mb-6">
          <Card className="items-center mb-3">
            <Text className="text-sm text-slate-500 mb-1">Net Profit</Text>
            <Text
              className={`text-3xl font-bold ${
                netProfit >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              ₹{netProfit.toLocaleString()}
            </Text>
          </Card>

          <View className="flex-row">
            <Text>Card will be displaying here</Text>
          </View>
        </View>

        {/* Active Sites */}
        <View className="mb-5">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            Active Sites ({activeSites.length})
          </Text>

          {activeSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}

          {activeSites.length === 0 && (
            <Text className="text-center text-slate-500 mt-5">
              No active sites.
            </Text>
          )}
        </View>

        <Button
          title="Logout"
          variant="danger"
          onPress={logout}
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaWrapper>
  );
}
