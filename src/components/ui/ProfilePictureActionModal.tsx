import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface ProfilePictureActionModalProps {
  visible: boolean;
  onClose: () => void;
  onViewPicture: () => void;
  onChangePicture: () => void;
}

const ProfilePictureActionModal: React.FC<ProfilePictureActionModalProps> = ({
  visible,
  onClose,
  onViewPicture,
  onChangePicture,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="rounded-t-2xl bg-white px-5 pb-8 pt-5">
          <Text className="mb-4 text-center text-lg font-bold text-slate-900">
            Profile Picture
          </Text>

          {/* View Picture */}
          <TouchableOpacity
            className="mb-1 flex-row items-center rounded-xl px-3 py-3.5"
            onPress={onViewPicture}
            activeOpacity={0.7}
          >
            <Ionicons
              name="eye-outline"
              size={22}
              color={Colors.primary}
            />
            <Text className="ml-3.5 text-base font-medium text-slate-900">
              View Picture
            </Text>
          </TouchableOpacity>

          {/* Change Picture */}
          <TouchableOpacity
            className="mb-1 flex-row items-center rounded-xl px-3 py-3.5"
            onPress={onChangePicture}
            activeOpacity={0.7}
          >
            <Ionicons
              name="image-outline"
              size={22}
              color={Colors.primary}
            />
            <Text className="ml-3.5 text-base font-medium text-slate-900">
              Change Picture
            </Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            className="mt-2 items-center rounded-xl bg-slate-100 py-3.5"
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text className="text-base font-semibold text-red-500">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ProfilePictureActionModal;
