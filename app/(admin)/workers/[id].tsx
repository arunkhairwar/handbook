import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store/mockStore';
import { Payment } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WorkerProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const worker = useStore(state => state.workers.find(w => w.id === id));
    const attendance = useStore(state => state.attendance.filter(a => a.workerId === id));
    const payments = useStore(state => state.payments.filter(p => p.relatedId === id && p.type === 'EXPENSE'));
    const addPayment = useStore(state => state.addPayment);

    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'BANK'>('CASH');

    if (!worker) return <View style={styles.center}><Text>Worker not found</Text></View>;

    const totalEarned = attendance.reduce((acc, a) => acc + a.wageSnapshot, 0);
    const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
    const balance = totalEarned - totalPaid;

    const handleAddPayment = () => {
        if (!amount) return;

        const payment: Payment = {
            id: Math.random().toString(),
            type: 'EXPENSE', // To worker
            relatedId: worker.id,
            amount: Number(amount),
            date: new Date().toISOString(),
            mode: paymentMode,
        };

        addPayment(payment);
        setModalVisible(false);
        setAmount('');
        Alert.alert('Success', 'Payment recorded');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Card style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{worker.name.charAt(0)}</Text>
                </View>
                <Text style={styles.name}>{worker.name}</Text>
                <Text style={styles.role}>{worker.role}</Text>
                <Text style={styles.role}>{worker.mobile}</Text>
            </Card>

            <Card>
                <Text style={styles.cardHeader}>Financials</Text>
                <View style={styles.statRow}>
                    <Text>Total Work Value</Text>
                    <Text style={styles.statValue}>₹{totalEarned}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text>Total Paid</Text>
                    <Text style={[styles.statValue, { color: Colors.success }]}>₹{totalPaid}</Text>
                </View>
                <View style={[styles.statRow, { borderTopWidth: 1, borderColor: Colors.border, paddingTop: 8, marginTop: 8 }]}>
                    <Text style={{ fontWeight: 'bold' }}>Pending Balance</Text>
                    <Text style={[styles.statValue, { color: balance > 0 ? Colors.error : Colors.success }]}>
                        ₹{balance}
                    </Text>
                </View>

                <Button
                    title="Make Payment"
                    onPress={() => setModalVisible(true)}
                    style={{ marginTop: 16 }}
                />
            </Card>

            <Text style={styles.sectionHeader}>Payment History</Text>
            {payments.length === 0 ? (
                <Text style={{ color: Colors.textSecondary }}>No payments recorded.</Text>
            ) : (
                payments.map(p => (
                    <Card key={p.id} style={styles.paymentCard}>
                        <View style={styles.row}>
                            <Text style={styles.paymentDate}>{new Date(p.date).toLocaleDateString()}</Text>
                            <Text style={styles.paymentAmount}>₹{p.amount}</Text>
                        </View>
                        <Text style={styles.paymentMode}>{p.mode}</Text>
                    </Card>
                ))
            )}

            {/* Payment Modal */}
            <Modal visible={modalVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Record Payment to {worker.name}</Text>
                        <Input
                            label="Amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />

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
                            <Button title="Save" onPress={handleAddPayment} style={{ flex: 1, marginLeft: 8 }} />
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    profileCard: { alignItems: 'center', marginBottom: 20 },
    avatar: {
        width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.border,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12
    },
    avatarText: { fontSize: 24, fontWeight: 'bold', color: Colors.textSecondary },
    name: { fontSize: 20, fontWeight: 'bold' },
    role: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
    cardHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    statValue: { fontWeight: 'bold' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 12, color: Colors.primary },
    paymentCard: { marginBottom: 8, padding: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    paymentDate: { fontSize: 14, color: Colors.textSecondary },
    paymentAmount: { fontSize: 16, fontWeight: 'bold', color: Colors.success },
    paymentMode: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, textTransform: 'uppercase' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    modalActions: { flexDirection: 'row', marginTop: 16 },
    modeButton: {
        flex: 1, alignItems: 'center', padding: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, marginHorizontal: 4
    },
    modeText: { fontSize: 12, fontWeight: '600' }
});
