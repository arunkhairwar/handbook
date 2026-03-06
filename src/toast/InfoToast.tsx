import { InfoToast } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { getBaseToastStyle } from "./toastStyles";

export default function CustomInfoToast(props: any, isDark: boolean) {
  return (
    <InfoToast
      {...props}
      style={{
        ...getBaseToastStyle(isDark),
        borderLeftColor: "#3b82f6",
      }}
      renderLeadingIcon={() => (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 12,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#3b82f620",
          }}
        >
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
        </View>
      )}
    />
  );
}
