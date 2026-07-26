import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function WorkersLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle: { color: Colors.primary, fontWeight: 'bold' },
                headerTintColor: Colors.primary,
                contentStyle: { backgroundColor: Colors.background },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'All Workers' }} />
            <Stack.Screen name="[id]" options={{ title: 'Worker Profile' }} />
        </Stack>
    );
}
