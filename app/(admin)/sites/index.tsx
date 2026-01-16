import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store/mockStore';
import { Site } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SitesListScreen() {
    const sites = useStore(state => state.sites);
    const router = useRouter();
    const addSite = useStore(state => state.addSite);
    const [modalVisible, setModalVisible] = useState(false);

    // New Site Form State
    const [newSiteName, setNewSiteName] = useState('');
    const [clientName, setClientName] = useState('');
    const [budget, setBudget] = useState('');

    const handleAddSite = () => {
        if (!newSiteName || !clientName || !budget) return;

        const newSite: Site = {
            id: Math.random().toString(36).substr(2, 9),
            name: newSiteName,
            clientName,
            startDate: new Date().toISOString(),
            expectedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'ONGOING',
            estimatedBudget: Number(budget),
        };

        addSite(newSite);
        setModalVisible(false);
        setNewSiteName('');
        setClientName('');
        setBudget('');
    };

    const renderItem = ({ item }: { item: Site }) => (
        <TouchableOpacity onPress={() => router.push(`./(admin)/sites/${item.id}`)}>
            <Card style={styles.card}>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.client}>{item.clientName}</Text>
                    </View>
                    <Badge
                        label={item.status}
                        variant={item.status === 'ONGOING' ? 'success' : 'default'}
                    />
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sites}
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
                        <Text style={styles.modalTitle}>Add New Site</Text>

                        <Input
                            label="Site Name"
                            value={newSiteName}
                            onChangeText={setNewSiteName}
                            placeholder="e.g. Sharma Renovations"
                        />
                        <Input
                            label="Client Name"
                            value={clientName}
                            onChangeText={setClientName}
                            placeholder="e.g. Mr. Sharma"
                        />
                        <Input
                            label="Estimated Budget"
                            value={budget}
                            onChangeText={setBudget}
                            keyboardType="numeric"
                            placeholder="500000"
                        />

                        <View style={styles.modalActions}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => setModalVisible(false)}
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <Button
                                title="Create Site"
                                onPress={handleAddSite}
                                style={{ flex: 1, marginLeft: 8 }}
                                disabled={!newSiteName || !clientName || !budget}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 16,
    },
    card: {
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    client: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: Colors.primary,
    },
    modalActions: {
        flexDirection: 'row',
        marginTop: 16,
    },
});
