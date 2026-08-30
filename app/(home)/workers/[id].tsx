import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { useStore } from '@/store/mockStore';
import { Payment } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { cn } from '@/src/lib/utils';

export default function WorkerProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const worker = useStore(state => state.workers.find(w => w.id === id));
    const attendance = useStore(state => state.attendance.filter(a => a.workerId === id));
    const payments = useStore(state => state.payments.filter(p => p.relatedId === id && p.type === 'EXPENSE'));
    const addPayment = useStore(state => state.addPayment);

    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'BANK'>('CASH');

    if (!worker) return <View className="flex-1 justify-center items-center"><Text className="text-text-secondary">Worker not found</Text></View>;

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
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
            <Card className="items-center mb-5 p-4">
                <View className="w-16 h-16 rounded-full bg-border justify-center items-center mb-3">
                    <Text className="text-2xl font-bold text-text-secondary">{worker.name.charAt(0)}</Text>
                </View>
                <Text className="text-xl font-bold text-text">{worker.name}</Text>
                <Text className="text-sm text-text-secondary mb-1">{worker.role}</Text>
                <Text className="text-sm text-text-secondary">{worker.mobile}</Text>
            </Card>

            <Card className="mb-4 p-4">
                <Text className="text-base font-bold text-text mb-3">Financials</Text>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-text">Total Work Value</Text>
                    <Text className="text-sm font-bold text-text">₹{totalEarned}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-text">Total Paid</Text>
                    <Text className="text-sm font-bold text-success">₹{totalPaid}</Text>
                </View>
                <View className="flex-row justify-between border-t border-border pt-2 mt-2">
                    <Text className="text-sm font-bold text-text">Pending Balance</Text>
                    <Text className={cn("text-sm font-bold", balance > 0 ? "text-error" : "text-success")}>
                        ₹{balance}
                    </Text>
                </View>

                <Button
                    title="Make Payment"
                    onPress={() => setModalVisible(true)}
                    className="mt-4"
                />
            </Card>

            <Text className="text-lg font-bold my-3 text-primary">Payment History</Text>
            {payments.length === 0 ? (
                <Text className="text-sm text-text-secondary">No payments recorded.</Text>
            ) : (
                payments.map(p => (
                    <Card key={p.id} className="mb-2 p-3">
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-text-secondary">{new Date(p.date).toLocaleDateString()}</Text>
                            <Text className="text-base font-bold text-success">₹{p.amount}</Text>
                        </View>
                        <Text className="text-xs text-text-secondary mt-1 uppercase">{p.mode}</Text>
                    </Card>
                ))
            )}

            {/* Payment Modal */}
            <Modal visible={modalVisible} animationType="fade" transparent>
                <View className="flex-1 bg-black/50 justify-center p-6">
                    <View className="bg-card rounded-2xl p-6">
                        <Text className="text-lg font-bold text-text mb-4">Record Payment to {worker.name}</Text>
                        <Input
                            label="Amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />

                        <Text className="font-medium text-text mb-2">Mode</Text>
                        <View className="flex-row justify-between mb-4 gap-2">
                            {(['CASH', 'UPI', 'BANK'] as const).map((mode) => (
                                <TouchableOpacity
                                    key={mode}
                                    onPress={() => setPaymentMode(mode)}
                                    className={cn(
                                        "flex-1 items-center py-2.5 px-2 border rounded-lg",
                                        paymentMode === mode
                                            ? "bg-primary border-primary"
                                            : "border-border bg-card"
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            "text-xs font-semibold",
                                            paymentMode === mode ? "text-white" : "text-text"
                                        )}
                                    >
                                        {mode}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row mt-4 gap-2">
                            <Button title="Cancel" variant="outline" onPress={() => setModalVisible(false)} className="flex-1" />
                            <Button title="Save" onPress={handleAddPayment} className="flex-1" />
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}
