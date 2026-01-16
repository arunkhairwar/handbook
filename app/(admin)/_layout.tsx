import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle: { color: Colors.primary, fontWeight: 'bold' },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textSecondary,
                tabBarStyle: {
                    borderTopColor: Colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}>
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="sites"
                options={{
                    title: 'Sites',
                    headerShown: false, // We will use stack inside
                    tabBarIcon: ({ color }) => <Ionicons name="business-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="workers"
                options={{
                    title: 'Workers',
                    headerShown: false, // Stack inside
                    tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="payments"
                options={{
                    title: 'Payments',
                    tabBarIcon: ({ color }) => <Ionicons name="cash-outline" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
