import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function ClientsLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle: { color: Colors.primary, fontWeight: 'bold' },
                headerTintColor: Colors.primary,
                contentStyle: { backgroundColor: Colors.background },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'All Clients' }} />
            <Stack.Screen name="[id]" options={{ title: 'Client Details' }} />
        </Stack>
    );
}
