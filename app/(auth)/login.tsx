import { TextInput } from "@/src/components/input";
import { Button } from "@/src/components/ui/Button";
import { useAuth } from "@/src/hooks";
import { LoginFormData, loginSchema } from "@/src/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaWrapper } from "@/src/components/ui/SafeAreaWrapper";
import { Text, View } from "react-native";

export default function LoginScreen() {
  // const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      // Error already handled in useAuth hook with toast
    }
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

        <View className="w-full">
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }: any) => (
              <TextInput
                label="Password"
                placeholder="Enter your password"
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
            title="Login"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
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
      </View>
    </SafeAreaWrapper>
  );
}
