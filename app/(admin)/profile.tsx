import { Colors } from "@/constants/Colors";
import { userAtom } from "@/src/atoms/auth.atoms";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import ProfilePicture from "@/src/components/ui/ProfilePicture";
import { useAuth } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  // Mock data for Admin profile
  const adminProfile = {
    name: "Admin User",
    role: "Super Admin",
    number: "+91 9876543210",
    email: "admin@sitekhata.com",
  };
  const user = useAtomValue(userAtom);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { logout } = useAuth();

  const handleImageChange = (uri: string) => {
    setAvatarUri(uri);
    // TODO: upload the image to your server and update the profile
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center py-10 border-b border-gray-100 bg-blue-50/30">
        <ProfilePicture
          imageUri={avatarUri}
          name={adminProfile.name}
          size={128}
          onImageChange={handleImageChange}
        />
        <View className="flex-col items-center gap-2">
          <Text className="text-2xl font-bold mt-4 text-gray-800">
            {user?.name}
          </Text>
          <Badge
            title={user?.role}
            variant="success"
            textTransform="uppercase"
            // style={{ marginTop: 8 }}
          />
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
              {user?.mobile}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-8">
          <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
            <Ionicons name="mail-outline" size={24} color={Colors.primary} />
          </View>
          <View>
            <Text className="text-sm text-gray-500 mb-1">Email Address</Text>
            <Text className="text-base text-gray-800 font-medium">
              {user?.email}
            </Text>
          </View>
        </View>
        <Button onPress={logout} title="Logout" variant="danger" />
      </View>
    </ScrollView>
  );
}
