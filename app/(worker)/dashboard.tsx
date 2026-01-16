import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store/mockStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function WorkerDashboard() {
    const router = useRouter();
    const user = useStore(state => state.user);
    const attendance = useStore(state => state.attendance.filter(a => a.workerId === user?.id));
    const payments = useStore(state => state.payments.filter(p => p.relatedId === user?.id)); // Income for worker (expense for contractor)
    const sites = useStore(state => state.sites);

    if (!user) return null;

    const daysWorked = attendance.length;
    // Calculate unique sites
    const uniqueSiteIds = [...new Set(attendance.map(a => a.siteId))];
    const mySites = sites.filter(s => uniqueSiteIds.includes(s.id));

    const totalReceived = payments.reduce((acc, p) => acc + p.amount, 0);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Namaste, {user.name}</Text>
                <Text style={styles.subtitle}>{user.role} ({user.mobile})</Text>
            </View>

            <View style={styles.statsContainer}>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Days Worked</Text>
                    <Text style={styles.statValue}>{daysWorked}</Text>
                </Card>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Sites</Text>
                    <Text style={styles.statValue}>{mySites.length}</Text>
                </Card>
            </View>

            <Card style={{ marginBottom: 20 }}>
                <Text style={styles.statLabel}>Total Payment Received</Text>
                <Text style={[styles.statValue, { color: Colors.success }]}>₹{totalReceived}</Text>
            </Card>

            <Text style={styles.sectionHeader}>Recent Work</Text>
            {attendance.slice(0, 5).map((a, idx) => {
                const site = sites.find(s => s.id === a.siteId);
                return (
                    <Card key={idx} style={styles.row}>
                        <View>
                            <Text style={styles.siteName}>{site?.name || 'Unknown Site'}</Text>
                            <Text style={styles.date}>{a.date}</Text>
                        </View>
                        <Text style={styles.present}>Present</Text>
                    </Card>
                );
            })}

            <Button title="Logout" variant="danger" onPress={() => router.replace('../(auth)/login')} style={{ marginTop: 24 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, paddingTop: 60 },
    header: { marginBottom: 24 },
    greeting: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
    subtitle: { fontSize: 16, color: Colors.textSecondary },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    statCard: { flex: 1, marginHorizontal: 4, alignItems: 'center', padding: 16 },
    statLabel: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
    statValue: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: 12 },
    siteName: { fontWeight: '600' },
    date: { fontSize: 12, color: Colors.textSecondary },
    present: { color: Colors.success, fontWeight: 'bold' }
});
