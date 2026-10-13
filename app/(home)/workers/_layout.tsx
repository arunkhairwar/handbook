import { Colors } from '@/constants/Colors';
import BackButton from '@/src/components/ui/BackButton';
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
            <Stack.Screen name="index" options={{ title: 'My Workforce' }} />
            <Stack.Screen name="[id]" options={{ title: 'Worker Profile' }} />
            <Stack.Screen
                name="requests"
                options={{
                    title: 'Workforce Requests',
                    headerLeft: () => <BackButton className="ml-2" />,
                }}
            />
        </Stack>
    );
}



