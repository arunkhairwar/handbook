import { Colors } from "@/constants/Colors";
import { TextInput } from "@/src/components/input";
import { AuthWrapper } from "@/src/components/auth/AuthWrapper";
import { Button } from "@/src/components/ui/Button";
import { useSendOtp, useLogin } from "@/src/hooks";
import { useAuthFlowStore } from "@/src/store/auth.store";
import { VerifyOtpFormData, verifyOtpSchema } from "@/src/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { AppRoutes } from "@/src/routes";

export default function VerifyOtpScreen() {
  const sendOtpMutation = useSendOtp();
  const loginMutation = useLogin();
  const userPhone = useAuthFlowStore((s) => s.userPhone);
  const clearUserPhone = useAuthFlowStore((s) => s.clearUserPhone);

  const [countdown, setCountdown] = useState<number>(30);
  const timerRef = useRef<any>(null);

  // Redirect back to login if no phone is available (e.g. deep-link)
  // useEffect(() => {
  //   if (!userPhone) {
  //     router.replace("/login");
  //   }
  // }, [userPhone]);

  const otpForm = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    mode: "onChange",
    defaultValues: {
      phone: userPhone,
      otp: "",
    },
  });

  // Keep form phone in sync with store
  useEffect(() => {
    if (userPhone) {
      otpForm.setValue("phone", userPhone);
    }
  }, [userPhone, otpForm]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await sendOtpMutation.mutateAsync(userPhone);
      Toast.show({
        type: "success",
        text1: "OTP Resent",
        text2: "A new OTP has been sent",
      });
      setCountdown(30);
      otpForm.setValue("otp", "");
    } catch {
      // Error toast handled globally by MutationCache
    }
  };

  const handleVerifyOtp = async (data: VerifyOtpFormData) => {
    try {
      const result = await loginMutation.mutateAsync({
        phone: userPhone,
        otp: data.otp,
      });
      Toast.show({
        type: "success",
        text1: `Welcome ${result.user.firstName}`,
        text2: result.message,
      });
      clearUserPhone();
      router.replace(AppRoutes.ADMIN.DASHBOARD);
    } catch {
      // Error toast handled globally by MutationCache
    }
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 7) return phone;
    return `${phone.substring(0, 6)}*****${phone.substring(phone.length - 2)}`;
  };

  return (
    <AuthWrapper
      title="Verify OTP"
      description="Enter the code sent to your phone."
    >
      <View className="w-full">
        {/* Masked phone badge */}
        <View className="bg-slate-50 p-4 rounded-xl mb-6 flex-row items-center border border-slate-100">
          <View className="flex-1">
            <Text className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
              Sent OTP to
            </Text>
            <Text className="text-base font-bold text-slate-700">
              {maskPhone(userPhone)}
            </Text>
          </View>
        </View>

        <Controller
          control={otpForm.control}
          name="otp"
          render={({ field: { onChange, onBlur, value } }: any) => (
            <TextInput
              required
              label="OTP Verification"
              placeholder="Enter 6-digit OTP"
              leftIcon="shield-checkmark-outline"
              keyboardType="number-pad"
              maxLength={6}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={otpForm.formState.errors.otp?.message}
            />
          )}
        />

        <Button
          title="Verify OTP"
          onPress={otpForm.handleSubmit(handleVerifyOtp)}
          isLoading={loginMutation.isPending}
          style={{ marginTop: 12 }}
        />

        <View className="flex-row justify-between items-center mt-6 px-1">
          <TouchableOpacity onPress={handleResendOtp} disabled={countdown > 0}>
            <View className="flex-row justify-center mt-6">
              <Text className="text-slate-500 text-sm">
                Back to Login{" "}
              </Text>
              <Link href="/login" asChild>
                <Text className="text-slate-800 text-sm font-bold">
                  Login
                </Text>
              </Link>
            </View>
            <Text
              style={{
                color: countdown > 0 ? "#94a3b8" : Colors.primary,
                fontWeight: "bold",
              }}
              className="text-sm"
            >
              Resend OTP
            </Text>
          </TouchableOpacity>

          {countdown > 0 && (
            <Text className="text-slate-400 text-sm font-medium">
              in {countdown}s
            </Text>
          )}
        </View>
      </View>
    </AuthWrapper>
  );
}
