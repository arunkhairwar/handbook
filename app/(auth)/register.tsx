import { TextInput, PhoneInput } from "@/src/components/input";
import { Button } from "@/src/components/ui/Button";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { ValuePicker } from "@/src/components/ui/ValuePickerModal";
import { useAuth } from "@/src/hooks";
import { RegisterFormData, registerSchema } from "@/src/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

const ROLE_OPTIONS = [
  {
    label: "Contractor",
    value: "CONTRACTOR" as const,
    icon: "construct-outline" as const,
  },
  {
    label: "Worker",
    value: "WORKER" as const,
    icon: "hammer-outline" as const,
  },
];

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
    } catch {
      // Error already handled in useAuth hook with toast
    }
  };

  return (
    <SafeAreaWrapper scrollable>
      <View className="flex-1 justify-center p-6">
        <Text className="text-4xl font-bold text-slate-800 text-center mb-2">
          Create Account
        </Text>
        <Text className="text-base text-slate-500 text-center mb-10">
          Sign up to manage your sites
        </Text>

        <View className="w-full">
          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }: any) => (
              <TextInput
                required
                label="Full Name"
                placeholder="Enter full name"
                leftIcon="person-outline"
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message as string | undefined}
              />
            )}
          />

          {/* Mobile */}
          <Controller
            control={control}
            name="mobile"
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
                error={errors.mobile?.message as string | undefined}
              />
            )}
          />
          {/* Role Selector */}
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }: any) => (
              <ValuePicker
                label="Role"
                required
                placeholder="Select your role"
                leftIcon="briefcase-outline"
                options={ROLE_OPTIONS}
                selectedValue={value}
                onSelect={onChange}
                title="Select Role"
                error={errors.role?.message as string | undefined}
              />
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }: any) => (
              <TextInput
                required
                label="Email"
                placeholder="Enter email"
                keyboardType="email-address"
                leftIcon="mail"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message as string | undefined}
              />
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }: any) => (
              <TextInput
                required
                label="Password"
                placeholder="Create password"
                leftIcon="lock-closed-outline"
                isPassword
                autoCapitalize="none"
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            title="Register"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-slate-500 text-sm">
              Already have an account?{" "}
            </Text>
            <Link href="/login" asChild>
              <Text className="text-slate-800 text-sm font-bold">Login</Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
