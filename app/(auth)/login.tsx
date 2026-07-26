import { PhoneInput, TextInput } from "@/src/components/input";
import { Button } from "@/src/components/ui/Button";
import { useAuth } from "@/src/hooks";
import {
  LoginFormData,
  VerifyOtpFormData,
  loginSchema,
  verifyOtpSchema,
} from "@/src/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type LoginStep = "PHONE" | "OTP";

export default function LoginScreen() {
  const { login, sendOtp, isLoading } = useAuth();
  const [step, setStep] = useState<LoginStep>("PHONE");
  const [countdown, setCountdown] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Form for Phone input
  const phoneForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  // Form for OTP input
  const otpForm = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
      otp: "",
    },
  });

  // Track phone number updates
  const activePhone = phoneForm.watch("phone");

  // Sync phone number to otpForm whenever it changes
  useEffect(() => {
    otpForm.setValue("phone", activePhone);
  }, [activePhone, otpForm]);

  // Handle Resend Countdown
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

  const handleSendOtp = async (data: LoginFormData) => {
    const success = await sendOtp(data.phone);
    if (success) {
      setStep("OTP");
      setCountdown(30);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    const success = await sendOtp(activePhone);
    if (success) {
      setCountdown(30);
      otpForm.setValue("otp", "");
    }
  };

  const handleVerifyOtp = async (data: VerifyOtpFormData) => {
    try {
      await login({ phone: data.phone, otp: data.otp });
    } catch {
      // Errors handled by useAuth toast notifications
    }
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 7) return phone;
    return `${phone.substring(0, 6)}*****${phone.substring(phone.length - 2)}`;
  };

  return (
    <SafeAreaWrapper>
      <View className="flex-1 justify-center p-6">
        <Text className="text-4xl font-bold text-slate-800 text-center mb-2">
          SiteKhata
        </Text>
        <Text className="text-base text-slate-500 text-center mb-12">
          Manage your sites and workers
        </Text>

        {step === "PHONE" ? (
          // --- STEP 1: ENTER PHONE ---
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
              isLoading={isLoading}
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
        ) : (
          // --- STEP 2: VERIFY OTP ---
          <View className="w-full">
            <View className="bg-slate-50 p-4 rounded-xl mb-6 flex-row items-center border border-slate-100">
              <View className="flex-1">
                <Text className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                  Sent OTP to
                </Text>
                <Text className="text-base font-bold text-slate-700">
                  {maskPhone(activePhone)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setStep("PHONE")}
                className="bg-white p-2 rounded-full border border-slate-200"
              >
                <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
              </TouchableOpacity>
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
              title="Verify & Login"
              onPress={otpForm.handleSubmit(handleVerifyOtp)}
              isLoading={isLoading}
              style={{ marginTop: 12 }}
            />

            <View className="flex-row justify-between items-center mt-6 px-1">
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={countdown > 0}
              >
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
        )}
      </View>
    </SafeAreaWrapper>
  );
}
