import { TextInput } from "@/src/components/input";
import { Button } from "@/src/components/ui/Button";
import { useAuth } from "@/src/hooks";
import { RegisterFormData, registerSchema } from "@/src/schema/auth.schema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ROLE_OPTIONS = [
  { label: "Contractor", value: "CONTRACTOR" as const },
  { label: "Worker", value: "WORKER" as const },
];

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const [roleModalVisible, setRoleModalVisible] = useState(false);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
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
              <TextInput
                label="Mobile Number"
                placeholder="Enter mobile number"
                leftIcon="call-outline"
                numericOnly
                maxLength={10}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.mobile?.message as string | undefined}
              />
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }: any) => (
              <TextInput
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

          {/* Role Selector */}
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }: any) => (
              <View className="mb-4">
                <Text className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold mb-2">
                  Role
                </Text>
                <TouchableOpacity
                  onPress={() => setRoleModalVisible(true)}
                  activeOpacity={0.7}
                  className={`flex-row items-center bg-secondary-50 dark:bg-secondary-800 rounded-2xl px-4 border-2 ${
                    errors.role
                      ? "border-error-500"
                      : "border-secondary-200 dark:border-transparent"
                  }`}
                >
                  <View className="w-10 h-10 items-center justify-center">
                    <Ionicons
                      name="briefcase-outline"
                      size={20}
                      color={errors.role ? "#ef4444" : "#94a3b8"}
                    />
                  </View>
                  <Text
                    className={`flex-1 py-4 text-base ${
                      value
                        ? "text-secondary-900 dark:text-white"
                        : "text-[#94a3b8]"
                    }`}
                  >
                    {value
                      ? ROLE_OPTIONS.find((r) => r.value === value)?.label
                      : "Select your role"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>

                {errors.role && (
                  <View className="flex-row items-center mt-2">
                    <Ionicons
                      name="alert-circle"
                      size={14}
                      color="#ef4444"
                    />
                    <Text className="text-error-500 text-sm ml-1">
                      {errors.role?.message as string}
                    </Text>
                  </View>
                )}

                {/* Role Selection Modal */}
                <Modal
                  transparent
                  visible={roleModalVisible}
                  animationType="fade"
                  onRequestClose={() => setRoleModalVisible(false)}
                >
                  <Pressable
                    className="flex-1 bg-black/40 justify-end"
                    onPress={() => setRoleModalVisible(false)}
                  >
                    <Pressable
                      className="bg-white dark:bg-secondary-900 rounded-t-3xl p-6 pb-10"
                      onPress={(e) => e.stopPropagation()}
                    >
                      <Text className="text-lg font-bold text-secondary-900 dark:text-white mb-4">
                        Select Role
                      </Text>

                      {ROLE_OPTIONS.map((option) => {
                        const isSelected = value === option.value;
                        return (
                          <TouchableOpacity
                            key={option.value}
                            onPress={() => {
                              onChange(option.value);
                              setRoleModalVisible(false);
                            }}
                            className={`flex-row items-center p-4 rounded-xl mb-2 border-2 ${
                              isSelected
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800"
                            }`}
                          >
                            <Ionicons
                              name={
                                option.value === "CONTRACTOR"
                                  ? "construct-outline"
                                  : "hammer-outline"
                              }
                              size={22}
                              color={isSelected ? "#3b82f6" : "#94a3b8"}
                            />
                            <Text
                              className={`ml-3 text-base font-medium ${
                                isSelected
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-secondary-700 dark:text-secondary-300"
                              }`}
                            >
                              {option.label}
                            </Text>
                            {isSelected && (
                              <View className="ml-auto">
                                <Ionicons
                                  name="checkmark-circle"
                                  size={22}
                                  color="#3b82f6"
                                />
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </Pressable>
                  </Pressable>
                </Modal>
              </View>
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
    </KeyboardAvoidingView>
  );
}
