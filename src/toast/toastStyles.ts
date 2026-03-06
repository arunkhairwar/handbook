import { StyleSheet } from "react-native";

export const getBaseToastStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? "#1e293b" : "#ffffff",
  borderRadius: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 8,
  borderLeftWidth: 6,
  paddingVertical: 12,
  marginHorizontal: 16,
});

export const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },

  message: {
    fontSize: 13,
  },

  toggle: {
    marginTop: 4,
  },

  toggleText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
  },
});
