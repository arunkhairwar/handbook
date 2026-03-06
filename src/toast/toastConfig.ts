import { ToastConfig } from "react-native-toast-message";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";
import CustomInfoToast from "./InfoToast";

export const getToastConfig = (isDark: boolean): ToastConfig => ({
  success: (props) => SuccessToast(props, isDark),
  error: (props) => ErrorToast(props, isDark),
  info: (props) => CustomInfoToast(props, isDark),
});
