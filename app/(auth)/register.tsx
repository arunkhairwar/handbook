import { TextInput, PhoneInput } from "@/src/components/input";
import { Button } from "@/src/components/ui/Button";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { useAuth } from "@/src/hooks";
import { RegisterFormData, registerSchema } from "@/src/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

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
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
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
          {/* First Name */}
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }: any) => (
              <TextInput
                required
                label="First Name"
                placeholder="Enter first name"
                leftIcon="person-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.firstName?.message as string | undefined}
              />
            )}
          />

          {/* Middle Name */}
          <Controller
            control={control}
            name="middleName"
            render={({ field: { onChange, onBlur, value } }: any) => (
              <TextInput
                label="Middle Name (Optional)"
                placeholder="Enter middle name"
                leftIcon="person-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ""}
                error={errors.middleName?.message as string | undefined}
              />
            )}
          />

          {/* Last Name */}
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }: any) => (
              <TextInput
                required
                label="Last Name"
                placeholder="Enter last name"
                leftIcon="person-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.lastName?.message as string | undefined}
              />
            )}
          />

          {/* Phone/Mobile */}
          <Controller
            control={control}
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
                error={errors.phone?.message as string | undefined}
              />
            )}
          />

          <Button
            title="Register"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            style={{ marginTop: 12 }}
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
