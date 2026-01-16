import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store/mockStore';
import { Worker } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WorkersListScreen() {
    const workers = useStore(state => state.workers);
    const router = useRouter();
    const addWorker = useStore(state => state.addWorker);
    const [modalVisible, setModalVisible] = useState(false);

    const [name, setName] = useState('');
    const [role, setRole] = useState<'MISTRI' | 'HELPER'>('HELPER');
    const [wage, setWage] = useState('');
    const [mobile, setMobile] = useState('');

    const handleAddWorker = () => {
        if (!name || !wage || !mobile) return;

        const newWorker: Worker = {
            id: Math.random().toString(),
            name,
            role,
            dailyWage: Number(wage),
            mobile,
        };

        addWorker(newWorker);
        setModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setRole('HELPER');
        setWage('');
        setMobile('');
    };

    const renderItem = ({ item }: { item: Worker }) => (
        <TouchableOpacity onPress={() => router.push(`../workers/${item.id}`)}>
            <Card style={styles.card}>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.role}>{item.role} • ₹{item.dailyWage}/day</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={workers}
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

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Worker</Text>

                        <Input
                            label="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <Input
                            label="Mobile"
                            value={mobile}
                            onChangeText={setMobile}
                            keyboardType="number-pad"
                            maxLength={10}
                        />
                        <Input
                            label="Daily Wage (₹)"
                            value={wage}
                            onChangeText={setWage}
                            keyboardType="numeric"
                        />

                        <View style={{ marginVertical: 8 }}>
                            <Text style={{ marginBottom: 4, fontWeight: '500' }}>Role</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    title="Mistri"
                                    variant={role === 'MISTRI' ? 'primary' : 'outline'}
                                    onPress={() => setRole('MISTRI')}
                                    style={{ flex: 1, marginRight: 4, backgroundColor: role === 'MISTRI' ? Colors.primary : 'transparent' }}
                                />
                                <Button
                                    title="Helper"
                                    variant={role === 'HELPER' ? 'primary' : 'outline'}
                                    onPress={() => setRole('HELPER')}
                                    style={{ flex: 1, marginLeft: 4, backgroundColor: role === 'HELPER' ? Colors.primary : 'transparent' }}
                                />
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => setModalVisible(false)}
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <Button
                                title="Add Worker"
                                onPress={handleAddWorker}
                                style={{ flex: 1, marginLeft: 8 }}
                                disabled={!name || !wage || !mobile}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { padding: 16 },
    card: { marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontSize: 16, fontWeight: 'bold' },
    role: { fontSize: 14, color: Colors.textSecondary },
    fab: {
        position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28,
        backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center',
        elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    modalActions: { flexDirection: 'row', marginTop: 16 },
});
