import { PhoneInput } from "@/src/components/input";
import { AuthWrapper } from "@/src/components/auth/AuthWrapper";
import { Button } from "@/src/components/ui/Button";
import { useSendOtp } from "@/src/hooks";
import { LoginFormData, loginSchema } from "@/src/schema/auth.schema";
import { useAuthFlowStore } from "@/src/store/auth.store";
import { AppRoutes } from "@/src/routes/app.routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const sendOtpMutation = useSendOtp();
  const setUserPhone = useAuthFlowStore((s) => s.setUserPhone);

  const phoneForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  const handleSendOtp = async (data: LoginFormData) => {
    try {
      await sendOtpMutation.mutateAsync(data.phone);
      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "OTP has been sent successfully",
      });
      // Persist phone in Zustand so the verify-otp screen can read it
      setUserPhone(data.phone);
      router.push(AppRoutes.AUTH.VERIFY_OTP);
    } catch {
      // Error toast handled globally by MutationCache
    }
  };

  return (
    <AuthWrapper title="Sign In" description="Please enter your details.">
      <View className="w-full">
        <Controller
          control={phoneForm.control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }: any) => (
            <PhoneInput
              label="Mobile Number"
              required
              disableCountrySelection
              placeholder="Enter mobile number"
              maxLength={10}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={phoneForm.formState.errors.phone?.message}
            />
          )}
        />

        <Button
          title="Send OTP"
          onPress={phoneForm.handleSubmit(handleSendOtp)}
          isLoading={sendOtpMutation.isPending}
          style={{ marginTop: 12 }}
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-500 text-sm">
            Don't have an account?{" "}
          </Text>
          <Link href="/register" asChild>
            <Text className="text-slate-800 text-sm font-bold">Register</Text>
          </Link>
        </View>
      </View>
    </AuthWrapper>
  );
}
