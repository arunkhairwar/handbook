import { Colors } from "@/constants/Colors";
import Avatar from "@/src/components/ui/Avatar";
import BackButton from "@/src/components/ui/BackButton";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.background, borderWidth: 2 },
        headerTitleStyle: { color: Colors.primary, fontWeight: "bold" },
        headerRight: () => <Avatar />,
        tabBarActiveTintColor: Colors.success,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clients",
          headerShown: false, // We will use stack inside
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sites"
        options={{
          title: "Sites",
          headerShown: false, // We will use stack inside
          tabBarIcon: ({ color }) => (
            <Ionicons name="business-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workers"
        options={{
          title: "Workers",
          headerShown: false, // Stack inside
          tabBarIcon: ({ color }) => (
            <Ionicons name="construct-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Payments",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cash-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: "Profile",
          headerShown: true,
          headerLeft: () => <BackButton />,
          headerRight: () => null,
        }}
      />
    </Tabs>
  );
}
