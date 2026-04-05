import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

interface UseImagePickerOptions {
  aspect?: [number, number];
  quality?: number;
  maxFileSize?: number;
}

interface UseImagePickerReturn {
  pickImage: () => Promise<string | null>;
  isPickerLoading: boolean;
}

export const useImagePicker = (
  options?: UseImagePickerOptions
): UseImagePickerReturn => {
  const [isPickerLoading, setIsPickerLoading] = useState(false);

  const {
    aspect = [1, 1],
    quality = 0.8,
    maxFileSize = MAX_FILE_SIZE,
  } = options || {};

  const pickImage = useCallback(async (): Promise<string | null> => {
    setIsPickerLoading(true);
    try {
      // 1. Request permission (OS remembers the choice — won't re-ask if already granted)
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Required",
          text2:
            "Please grant media library access from your device settings to pick an image.",
        });
        return null;
      }

      // 2. Launch picker with built-in crop editor
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect,
        quality,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];

      // 3. Validate file size
      if (asset.fileSize && asset.fileSize > maxFileSize) {
        const sizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
        Toast.show({
          type: "error",
          text1: "File Too Large",
          text2: `Please select an image smaller than ${sizeMB} MB.`,
        });
        return null;
      }

      return asset.uri;
    } catch (error: any) {
      console.error("Image picker error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Failed to pick image",
      });
      return null;
    } finally {
      setIsPickerLoading(false);
    }
  }, [aspect, quality, maxFileSize]);

  return { pickImage, isPickerLoading };
};
