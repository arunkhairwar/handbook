import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useStore } from "@/store/mockStore";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useStore((state) => state.login);

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = login(email, password);
    setLoading(false);

    if (success) {
      const user = useStore.getState().user;
      if (user?.role === "CONTRACTOR") {
        router.replace("../(admin)/dashboard");
      } else {
        router.replace("../(worker)/dashboard");
      }
    } else {
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <View className="flex-1 justify-center p-6">
        <Text className="text-4xl font-bold text-slate-800 text-center mb-2">
          SiteKhata
        </Text>
        <Text className="text-base text-slate-500 text-center mb-12">
          Manage your sites and workers
        </Text>

        <View className="w-full">
          <Input
            label="Email"
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            error={errors.password}
            rightIcon={showPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Button title="Login" onPress={handleLogin} isLoading={loading} />

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
    </KeyboardAvoidingView>
  );
}
