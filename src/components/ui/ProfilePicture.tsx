import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useImagePicker } from "@/src/hooks/useImagePicker";
import FullScreenMediaView from "./FullScreenMediaView";
import ProfilePictureActionModal from "./ProfilePictureActionModal";

// Attractive avatar background colors
const AVATAR_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#84CC16", // Lime
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet

  "#D946EF", // Fuchsia
  "#0EA5E9", // Sky
  "#10B981", // Emerald
  "#E11D48", // Rose
];

/** Generate a deterministic color from a name string */
const getColorForName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

interface ProfilePictureProps {
  /** Current image URI or URL */
  imageUri?: string | null;
  /** Fallback name for initials when no image */
  name?: string;
  /** Size of the avatar circle (default: 120) */
  size?: number;
  /** Called with the new local URI after the user picks & crops an image */
  onImageChange?: (uri: string) => void;
  /** If true, hides the edit functionality (view only) */
  readOnly?: boolean;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  imageUri,
  name = "",
  size = 120,
  onImageChange,
  readOnly = false,
}) => {
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);

  const { pickImage, isPickerLoading } = useImagePicker({
    aspect: [1, 1],
    quality: 0.8,
    maxFileSize: 5 * 1024 * 1024,
  });

  // Get first letter of name
  const getFirstLetter = (): string => {
    if (!name) return "?";
    return name.trim()[0]?.toUpperCase() || "?";
  };

  // Deterministic random background color based on name
  const avatarBgColor = useMemo(() => getColorForName(name), [name]);

  const handleViewPicture = () => {
    setActionModalVisible(false);
    if (imageUri) {
      setFullScreenVisible(true);
    }
  };

  const handleChangePicture = async () => {
    setActionModalVisible(false);
    const uri = await pickImage();
    if (uri && onImageChange) {
      onImageChange(uri);
    }
  };

  const handlePress = () => {
    if (readOnly) {
      if (imageUri) setFullScreenVisible(true);
      return;
    }

    // If no image, skip the action modal and directly open picker
    if (!imageUri) {
      handleChangePicture();
      return;
    }

    setActionModalVisible(true);
  };

  const borderRadius = size / 2;
  const editBadgeSize = size * 0.3;

  return (
    <>
      {/* Avatar with edit badge */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={{
          width: size,
          height: size,
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Circular clipped container for avatar content */}
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isPickerLoading ? (
            <View
              className="items-center justify-center"
              style={{
                width: size,
                height: size,
                backgroundColor: Colors.border,
              }}
            >
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: size, height: size }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              className="items-center justify-center"
              style={{
                width: size,
                height: size,
                backgroundColor: avatarBgColor,
              }}
            >
              <Text
                className="font-bold text-white"
                style={{ fontSize: size * 0.45 }}
              >
                {getFirstLetter()}
              </Text>
            </View>
          )}
        </View>

        {/* Edit badge */}
        {!readOnly && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: editBadgeSize,
              height: editBadgeSize,
              borderRadius: editBadgeSize / 2,
              backgroundColor: Colors.accent,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "#fff",
            }}
          >
            <Ionicons name="camera" size={editBadgeSize * 0.55} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      {/* Action Sheet Modal — only shown when imageUri exists */}
      <ProfilePictureActionModal
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        onViewPicture={handleViewPicture}
        onChangePicture={handleChangePicture}
      />

      {/* Full Screen Viewer */}
      {imageUri && (
        <FullScreenMediaView
          visible={fullScreenVisible}
          imageUri={imageUri}
          onClose={() => setFullScreenVisible(false)}
        />
      )}
    </>
  );
};

export default ProfilePicture;
