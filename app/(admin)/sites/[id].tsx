import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store/mockStore';
import { AttendanceRecord, MaterialExpense } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Tab = 'OVERVIEW' | 'LABOR' | 'MATERIALS';

export default function SiteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
    const [expenseName, setExpenseName] = useState('');
    const [expenseCost, setExpenseCost] = useState('');

    const site = useStore(state => state.sites.find(s => s.id === id));
    const expenses = useStore(state => state.expenses.filter(e => e.siteId === id));
    const attendance = useStore(state => state.attendance.filter(a => a.siteId === id));
    const workers = useStore(state => state.workers);
    const addExpense = useStore(state => state.addExpense);
    const markAttendance = useStore(state => state.markAttendance);

    if (!site) return <View style={styles.center}><Text>Site not found</Text></View>;

    const totalMaterials = expenses.reduce((acc, e) => acc + e.cost, 0);
    const totalLabor = attendance.reduce((acc, a) => acc + a.wageSnapshot, 0); // This assumes wageSnapshot is daily wage
    const totalCost = totalMaterials + totalLabor;
    const remainingBudget = site.estimatedBudget - totalCost;

    const handleAddExpense = () => {
        if (!expenseName || !expenseCost) return;
        const expense: MaterialExpense = {
            id: Math.random().toString(),
            siteId: site.id,
            name: expenseName,
            quantity: '1', // simplified
            cost: Number(expenseCost),
            date: new Date().toISOString(),
        };
        addExpense(expense);
        setExpenseName('');
        setExpenseCost('');
    };

    const handleMarkAttendance = (workerId: string, wage: number) => {
        // Just mark present for today for simplicity
        const today = new Date().toISOString().split('T')[0];
        const record: AttendanceRecord = {
            id: Math.random().toString(),
            siteId: site.id,
            workerId,
            date: today,
            isPresent: true,
            wageSnapshot: wage,
        };
        markAttendance(record);
    };

    const isPresentToday = (workerId: string) => {
        const today = new Date().toISOString().split('T')[0];
        return attendance.some(a => a.workerId === workerId && a.date === today);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{site.name}</Text>
                <Text style={styles.subtitle}>{site.clientName}</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'OVERVIEW' && styles.activeTab]}
                    onPress={() => setActiveTab('OVERVIEW')}
                >
                    <Text style={[styles.tabText, activeTab === 'OVERVIEW' && styles.activeTabText]}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'LABOR' && styles.activeTab]}
                    onPress={() => setActiveTab('LABOR')}
                >
                    <Text style={[styles.tabText, activeTab === 'LABOR' && styles.activeTabText]}>Labor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'MATERIALS' && styles.activeTab]}
                    onPress={() => setActiveTab('MATERIALS')}
                >
                    <Text style={[styles.tabText, activeTab === 'MATERIALS' && styles.activeTabText]}>Materials</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'OVERVIEW' && (
                    <>
                        <Card>
                            <Text style={styles.cardHeader}>Financial Summary</Text>
                            <View style={styles.statRow}>
                                <Text>Budget</Text>
                                <Text style={styles.statValue}>₹{site.estimatedBudget.toLocaleString()}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text>Spent (Materials + Labor)</Text>
                                <Text style={[styles.statValue, { color: Colors.error }]}>₹{totalCost.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.statRow, { borderTopWidth: 1, borderColor: Colors.border, paddingTop: 8, marginTop: 8 }]}>
                                <Text style={{ fontWeight: 'bold' }}>Remaining</Text>
                                <Text style={[styles.statValue, { color: remainingBudget < 0 ? Colors.error : Colors.success }]}>
                                    ₹{remainingBudget.toLocaleString()}
                                </Text>
                            </View>
                        </Card>
                    </>
                )}

                {activeTab === 'LABOR' && (
                    <View>
                        <Text style={styles.sectionHeader}>Mark Attendance (Today)</Text>
                        {workers.map(worker => (
                            <Card key={worker.id} style={styles.workerRow}>
                                <View>
                                    <Text style={styles.workerName}>{worker.name}</Text>
                                    <Text style={styles.workerWage}>₹{worker.dailyWage}/day</Text>
                                </View>
                                {isPresentToday(worker.id) ? (
                                    <Badge label="Present" variant="success" />
                                ) : (
                                    <Button
                                        title="Mark Present"
                                        onPress={() => handleMarkAttendance(worker.id, worker.dailyWage)}
                                        style={{ height: 36, paddingHorizontal: 12, marginVertical: 0 }}
                                    />
                                )}
                            </Card>
                        ))}
                        <Text style={styles.sectionHeader}>History</Text>
                        <Text style={{ color: Colors.textSecondary }}>Total Man-days: {attendance.length}</Text>
                    </View>
                )}

                {activeTab === 'MATERIALS' && (
                    <View>
                        <Card>
                            <Text style={styles.cardHeader}>Add Expense</Text>
                            <Input
                                placeholder="Item Name (e.g. Cement)"
                                value={expenseName}
                                onChangeText={setExpenseName}
                            />
                            <Input
                                placeholder="Cost"
                                value={expenseCost}
                                onChangeText={setExpenseCost}
                                keyboardType="numeric"
                            />
                            <Button title="Add" onPress={handleAddExpense} disabled={!expenseName || !expenseCost} />
                        </Card>

                        <Text style={styles.sectionHeader}>Expense History</Text>
                        {expenses.map((e, idx) => (
                            <View key={idx} style={styles.expenseItem}>
                                <Text style={styles.expenseName}>{e.name}</Text>
                                <Text style={styles.expenseCost}>- ₹{e.cost}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    subtitle: {
        color: Colors.textSecondary,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingBottom: 0,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: Colors.primary,
    },
    tabText: {
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    activeTabText: {
        color: Colors.primary,
    },
    content: {
        padding: 16,
    },
    cardHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statValue: {
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 12,
    },
    workerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        padding: 12,
    },
    workerName: {
        fontWeight: '600',
    },
    workerWage: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: '#fff',
    },
    expenseName: {
        fontSize: 16,
    },
    expenseCost: {
        fontWeight: 'bold',
        color: Colors.error,
    },
});
