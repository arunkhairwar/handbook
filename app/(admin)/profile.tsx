import { Colors } from "@/constants/Colors";
import ProfilePicture from "@/src/components/ui/ProfilePicture";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  // Mock data for Admin profile
  const adminProfile = {
    name: "Admin User",
    role: "Super Admin",
    number: "+91 9876543210",
    email: "admin@sitekhata.com",
  };

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

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
        <Text className="text-2xl font-bold mt-4 text-gray-800">
          {adminProfile.name}
        </Text>
        <Text
          className="text-lg font-medium mt-1"
          style={{ color: Colors.primary }}
        >
          {adminProfile.role}
        </Text>
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
              {adminProfile.number}
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
              {adminProfile.email}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center py-4 rounded-xl mt-4"
          style={{ backgroundColor: "#fee2e2" }}
          onPress={() => {
            // Mock logout or just go back for now
            router.back();
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold ml-2 text-base">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
