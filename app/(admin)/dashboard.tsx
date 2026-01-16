import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store/mockStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ContractorDashboard() {
    const { sites, user, payments, expenses } = useStore();
    const router = useRouter();

    const activeSites = sites.filter(s => s.status === 'ONGOING');

    // Simple Financials Calculation (Mock)
    // In real app, we would sum up from payments array
    const totalReceived = payments.filter(p => p.type === 'INCOME').reduce((acc, p) => acc + p.amount, 0);
    const totalPaid = payments.filter(p => p.type === 'EXPENSE').reduce((acc, p) => acc + p.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.cost, 0); // Material expenses

    // Total Outflow = Payments to Workers + Material Expenses ? 
    // Requirement says: "Payment types: Client -> Contractor (income), Contractor -> Worker (expense)"
    // So totalPaid is Worker Wages paid. totalExpenses is Material cost using 'expenses' array?
    // Let's assume Total Expense = Worker Payments + Material Expenses.

    const grandTotalExpense = totalPaid + totalExpenses;
    const netProfit = totalReceived - grandTotalExpense;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, {user?.name}</Text>
                <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.summaryContainer}>
                <Card style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Net Profit</Text>
                    <Text style={[styles.summaryValue, { color: netProfit >= 0 ? Colors.success : Colors.error }]}>
                        ₹{netProfit.toLocaleString()}
                    </Text>
                </Card>

                <View style={styles.row}>
                    {/* <Card style={[styles.miniCard, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.miniLabel}>Received</Text>
                        <Text style={styles.miniValue}>₹{totalReceived.toLocaleString()}</Text>
                    </Card>
                    <Card style={[styles.miniCard, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.miniLabel}>Spent</Text>
                        <Text style={[styles.miniValue, { color: Colors.error }]}>₹{grandTotalExpense.toLocaleString()}</Text>
                    </Card> */}
                    <Text>Card will be displaying here</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Active Sites ({activeSites.length})</Text>
                {activeSites.map(site => (
                    <Card key={site.id} style={styles.siteCard}>
                        <View style={styles.siteHeader}>
                            <View>
                                <Text style={styles.siteName}>{site.name}</Text>
                                <Text style={styles.clientName}>{site.clientName}</Text>
                            </View>
                            <Badge label={site.status} variant="success" />
                        </View>

                        <View style={styles.siteStats}>
                            <Text style={styles.siteBudget}>Budget: ₹{site.estimatedBudget.toLocaleString()}</Text>
                            <Button
                                title="View Details"
                                variant="outline"
                                style={{ height: 36, marginTop: 8 }}
                                onPress={() => router.push(`../sites/${site.id}`)}
                            />
                        </View>
                    </Card>
                ))}
                {activeSites.length === 0 && (
                    <Text style={styles.emptyText}>No active sites.</Text>
                )}
            </View>

            <Button title="Logout" variant="danger" onPress={() => router.replace('../(auth)/login')} style={{ marginTop: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    date: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    summaryContainer: {
        marginBottom: 24,
    },
    summaryCard: {
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
    },
    miniCard: {
        // padding: 12,
    },
    miniLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    miniValue: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 12,
    },
    siteCard: {
        marginBottom: 12,
    },
    siteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    siteName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    clientName: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    siteStats: {},
    siteBudget: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '500',
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        marginTop: 20,
    },
});
