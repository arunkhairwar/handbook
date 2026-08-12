import { TextInput, PhoneInput } from "@/src/components/input";
import { AuthWrapper } from "@/src/components/auth/AuthWrapper";
import { Button } from "@/src/components/ui/Button";
import { useRegister } from "@/src/hooks";
import { RegisterFormData, registerSchema } from "@/src/schema/auth.schema";
import { useAuthFlowStore } from "@/src/store/auth.store";
import { AppRoutes } from "@/src/routes/app.routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const registerMutation = useRegister();
  const setUserPhone = useAuthFlowStore((s) => s.setUserPhone);

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
     const response = await registerMutation.mutateAsync(data);
      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2: `${response.message}`,
      });
      // Store phone in Zustand so the login screen can pre-fill it
      setUserPhone(data.phone);
      router.replace(AppRoutes.AUTH.LOGIN);
    } catch {
      // Error toast handled globally by MutationCache
    }
  };

  return (
    <AuthWrapper
      title="Create Account"
      description="Sign up to manage your sites"
      scrollable
    >
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
          isLoading={registerMutation.isPending}
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
    </AuthWrapper>
  );
}
