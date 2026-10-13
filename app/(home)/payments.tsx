import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { FloatingActionButton } from '@/src/components/ui/FloatingActionButton';
import { useStore } from '@/store/mockStore';
import { Payment } from '@/types';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { cn } from '@/src/lib/utils';

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
            const workers = useStore.getState().workers;
            const worker = workers.find(w => w.id === item.relatedId);
            return worker ? worker.name : 'Worker Payment';
        }
    };

    const renderItem = ({ item }: { item: Payment }) => (
        <Card className="mb-2 p-3">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-base font-bold text-text">{getRelatedName(item)}</Text>
                    <Text className="text-xs text-text-secondary">{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <View className="items-end">
                    <Text className={cn("text-base font-bold mb-1", item.type === 'INCOME' ? "text-success" : "text-error")}>
                        {item.type === 'INCOME' ? '+' : '-'} ₹{item.amount}
                    </Text>
                    <Badge label={item.mode} />
                </View>
            </View>
        </Card>
    );

    return (
        <View className="flex-1 bg-background">
            <View className="flex-row p-4 pb-0 gap-2">
                {(['ALL', 'INCOME', 'EXPENSE'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        className={cn(
                            "px-4 py-2 rounded-full border",
                            filter === tab
                                ? "bg-primary border-primary"
                                : "bg-card border-border"
                        )}
                        onPress={() => setFilter(tab)}
                    >
                        <Text
                            className={cn(
                                "text-sm font-semibold capitalize",
                                filter === tab ? "text-white" : "text-text-secondary"
                            )}
                        >
                            {tab === 'ALL' ? 'All' : tab === 'INCOME' ? 'Income' : 'Expense'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredPayments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
            />

            <FloatingActionButton
                onPress={() => setModalVisible(true)}
                variant="success"
                iconName="add"
            />

            {/* Add Income Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-center p-6">
                    <View className="bg-card rounded-2xl p-6">
                        <Text className="text-lg font-bold text-text mb-4">Receive Payment (Income)</Text>
                        <Input
                            label="Amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />

                        <Text className="font-medium text-text mb-2">Select Site</Text>
                        <View className="mb-4">
                            {sites.map(site => (
                                <TouchableOpacity
                                    key={site.id}
                                    className={cn(
                                        "p-2.5 border rounded-lg mb-2",
                                        selectedSiteId === site.id
                                            ? "bg-primary border-primary"
                                            : "border-border bg-card"
                                    )}
                                    onPress={() => setSelectedSiteId(site.id)}
                                >
                                    <Text
                                        className={cn(
                                            "text-sm font-medium",
                                            selectedSiteId === site.id ? "text-white" : "text-text"
                                        )}
                                    >
                                        {site.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

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
                            <Button title="Save" onPress={handleAddIncome} className="flex-1" disabled={!amount || !selectedSiteId} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
