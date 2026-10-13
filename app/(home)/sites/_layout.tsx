import { Colors } from "@/constants/Colors";
import BackButton from "@/src/components/ui/BackButton";
import { Stack } from "expo-router";

export default function SitesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { color: Colors.primary, fontWeight: "bold" },
        headerTintColor: Colors.primary,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "All Sites" }} />
      <Stack.Screen
        name="add"
        options={{
          title: "Add New Site",
          headerLeft: () => <BackButton className="ml-2" />,
        }}
      />
      <Stack.Screen name="[id]" options={{ title: "Site Details" }} />
    </Stack>
  );
}
