import { Colors } from "@/constants/Colors";
import { userAtom } from "@/src/atoms/auth.atoms";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import ProfilePicture from "@/src/components/ui/ProfilePicture";
import { useLogout } from "@/src/hooks";
import { AppRoutes } from "@/src/routes/app.routes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const logoutMutation = useLogout();

  const handleImageChange = (uri: string) => {
    setAvatarUri(uri);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });
      router.replace(AppRoutes.AUTH.LOGIN);
    } catch {
      // Error toast handled globally by MutationCache
    }
  };

  const getFullName = () => {
    if (!user) return "";
    return [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(" ");
  };

  const formattedMobile = user ? `+${user.countryCode} ${user.mobile}` : "";

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center py-10 border-b border-gray-100 bg-blue-50/30">
        <ProfilePicture
          imageUri={avatarUri}
          name={getFullName() || "User"}
          size={128}
          onImageChange={handleImageChange}
        />
        <View className="flex-col items-center gap-2 mt-4">
          <Text className="text-2xl font-bold text-gray-800">
            {getFullName() || "Loading..."}
          </Text>
          {user && (
            <Badge
              title={
                user?.profile?.availableForWork
                  ? "Available for work"
                  : "Not available for work"
              }
              variant={user?.profile?.availableForWork ? "success" : "warning"}
              textTransform="uppercase"
            />
          )}
        </View>
      </View>

      <View className="px-6 py-8">
        <Text className="text-lg font-bold text-gray-800 mb-6">
          Contact Information
        </Text>

        <View className="flex-row items-center mb-6">
          <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
            <Ionicons name="call-outline" size={24} color={Colors.primary} />
          </View>
          <View>
            <Text className="text-sm text-gray-500 mb-1">Mobile Number</Text>
            <Text className="text-base text-gray-800 font-medium">
              {formattedMobile}
            </Text>
          </View>
        </View>

        {/* Show availability status directly */}
        <View className="flex-row items-center mb-8">
          <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
            <Ionicons name="briefcase-outline" size={24} color={Colors.primary} />
          </View>
          <View>
            <Text className="text-sm text-gray-500 mb-1">Availability Status</Text>
            <Text className="text-base text-gray-800 font-medium">
              {user?.profile?.availableForWork
                ? "Looking for opportunities"
                : "Busy / Contractor"}
            </Text>
          </View>
        </View>

        <Button onPress={handleLogout} title="Logout" variant="danger" isLoading={logoutMutation.isPending} />
      </View>
    </ScrollView>
  );
}

