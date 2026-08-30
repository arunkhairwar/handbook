import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface FullScreenMediaViewProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

const FullScreenMediaView: React.FC<FullScreenMediaViewProps> = ({
  visible,
  imageUri,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.95)" barStyle="light-content" />
      <View className="flex-1 bg-black/95 justify-center items-center">
        {/* Close Button */}
        <TouchableOpacity
          className="absolute top-12 right-5 z-10 w-10 h-10 rounded-full bg-white/20 justify-center items-center"
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Image */}
        <View
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.7 }}
          className="justify-center items-center"
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: SCREEN_WIDTH * 0.9, height: SCREEN_WIDTH * 0.9 }}
            className="rounded-xl"
            contentFit="contain"
            transition={200}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FullScreenMediaView;
