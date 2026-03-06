import { BaseToast } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { getBaseToastStyle } from "./toastStyles";

export default function SuccessToast(props: any, isDark: boolean) {
  return (
    <BaseToast
      {...props}
      style={{
        ...getBaseToastStyle(isDark),
        borderLeftColor: "#22c55e",
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        color: isDark ? "#fff" : "#0f172a",
      }}
      text2Style={{
        fontSize: 13,
        color: isDark ? "#94a3b8" : "#64748b",
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
            backgroundColor: "#22c55e20",
          }}
        >
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
        </View>
      )}
    />
  );
}
