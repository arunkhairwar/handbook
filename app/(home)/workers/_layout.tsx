import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

function RequestsBackButton() {
    const router = useRouter();
    return (
        <Pressable onPress={() => router.back()} className="ml-2 mr-2">
            <Ionicons name="arrow-back-outline" size={24} color={Colors.primary} />
        </Pressable>
    );
}

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
                    headerLeft: () => <RequestsBackButton />,
                }}
            />
        </Stack>
    );
}



