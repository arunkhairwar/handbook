import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";


const Avatar = () => {
  return (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={() => console.log("Profile clicked")}
    >
      <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
    </TouchableOpacity>
  );
};

export default Avatar;