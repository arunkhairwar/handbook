import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store/mockStore';
import { Payment } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentsScreen() {
    const { payments, sites, addPayment } = useStore();
    const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

    // Add Income State
    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedSiteId, setSelectedSiteId] = useState('');
    const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'BANK'>('CASH');

    const filteredPayments = payments.filter(p => {
        if (filter === 'ALL') return true;
        return p.type === filter;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleAddIncome = () => {
        if (!amount || !selectedSiteId) return;

        const payment: Payment = {
            id: Math.random().toString(),
            type: 'INCOME',
            relatedId: selectedSiteId,
            amount: Number(amount),
            date: new Date().toISOString(),
            mode: paymentMode,
        };

        addPayment(payment);
        setModalVisible(false);
        setAmount('');
        setSelectedSiteId('');
    };

    const getRelatedName = (item: Payment) => {
        if (item.type === 'INCOME') {
            const site = sites.find(s => s.id === item.relatedId);
            return site ? site.name : 'Unknown Site';
        } else {
            // Expense (Worker Payment) - we need worker list but I can't access it easily without selecting all
            // For now just show "Worker Payment" or handle in store with a getter?
            // I'll just say "Worker/Material"
            // Actually store has workers. check `useStore` hook usage.
            // I can access workers from store.
            const workers = useStore.getState().workers;
            const worker = workers.find(w => w.id === item.relatedId);
            return worker ? worker.name : 'Worker Payment';
        }
    };

    const renderItem = ({ item }: { item: Payment }) => (
        <Card style={styles.card}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.relatedName}>{getRelatedName(item)}</Text>
                    <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.amount, { color: item.type === 'INCOME' ? Colors.success : Colors.error }]}>
                        {item.type === 'INCOME' ? '+' : '-'} ₹{item.amount}
                    </Text>
                    <Badge label={item.mode} />
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.filters}>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'ALL' && styles.activeFilter]}
                    onPress={() => setFilter('ALL')}
                >
                    <Text style={[styles.filterText, filter === 'ALL' && styles.activeFilterText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'INCOME' && styles.activeFilter]}
                    onPress={() => setFilter('INCOME')}
                >
                    <Text style={[styles.filterText, filter === 'INCOME' && styles.activeFilterText]}>Income</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'EXPENSE' && styles.activeFilter]}
                    onPress={() => setFilter('EXPENSE')}
                >
                    <Text style={[styles.filterText, filter === 'EXPENSE' && styles.activeFilterText]}>Expense</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredPayments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Add Income Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Receive Payment (Income)</Text>
                        <Input
                            label="Amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />

                        <Text style={{ fontWeight: '500', marginBottom: 8 }}>Select Site</Text>
                        <View style={{ marginBottom: 16 }}>
                            {sites.map(site => (
                                <TouchableOpacity
                                    key={site.id}
                                    style={[styles.siteOption, selectedSiteId === site.id && styles.selectedSite]}
                                    onPress={() => setSelectedSiteId(site.id)}
                                >
                                    <Text style={[styles.siteText, selectedSiteId === site.id && { color: '#fff' }]}>{site.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={{ fontWeight: '500', marginBottom: 8 }}>Mode</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                            {['CASH', 'UPI', 'BANK'].map((mode) => (
                                <TouchableOpacity
                                    key={mode}
                                    onPress={() => setPaymentMode(mode as any)}
                                    style={[
                                        styles.modeButton,
                                        paymentMode === mode && { backgroundColor: Colors.primary, borderColor: Colors.primary }
                                    ]}
                                >
                                    <Text style={[styles.modeText, paymentMode === mode && { color: '#fff' }]}>{mode}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <Button title="Cancel" variant="outline" onPress={() => setModalVisible(false)} style={{ flex: 1, marginRight: 8 }} />
                            <Button title="Save" onPress={handleAddIncome} style={{ flex: 1, marginLeft: 8 }} disabled={!amount || !selectedSiteId} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    filters: { flexDirection: 'row', padding: 16, paddingBottom: 0 },
    filterChip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.card, marginRight: 8, borderWidth: 1, borderColor: Colors.border
    },
    activeFilter: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    filterText: { color: Colors.textSecondary, fontWeight: '600' },
    activeFilterText: { color: '#fff' },
    list: { padding: 16 },
    card: { marginBottom: 8, padding: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    relatedName: { fontSize: 16, fontWeight: 'bold' },
    date: { fontSize: 12, color: Colors.textSecondary },
    amount: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    fab: {
        position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28,
        backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center', // Green for money in
        elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    siteOption: { padding: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, marginBottom: 8 },
    selectedSite: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    siteText: { fontSize: 14 },
    modalActions: { flexDirection: 'row', marginTop: 16 },
    modeButton: {
        flex: 1, alignItems: 'center', padding: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, marginHorizontal: 4
    },
    modeText: { fontSize: 12, fontWeight: '600' }
});
