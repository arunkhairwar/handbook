import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";


const Avatar = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={() => router.push("/profile")}
    >
      <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
    </TouchableOpacity>
  );
};

export default Avatar;