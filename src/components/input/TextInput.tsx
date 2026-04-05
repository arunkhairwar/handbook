import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TextInputProps = RNTextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftElement?: React.ReactNode;
  isPassword?: boolean;
  numericOnly?: boolean;
  required?: boolean;
  readOnly?: boolean;
};

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      leftElement,
      isPassword = false,
      numericOnly = false,
      required = false,
      readOnly = false,
      className,
      onChangeText,
      ...props
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    const handleChangeText = (text: string) => {
      if (numericOnly) {
        const numericText = text.replace(/[^0-9]/g, "");
        onChangeText?.(numericText);
      } else {
        onChangeText?.(text);
      }
    };

    return (
      <View className={`mb-4 ${className || ""}`}>
        {label && (
          <Text className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold mb-2">
            {label}
            {required && <Text className="text-error-500"> *</Text>}
          </Text>
        )}
        <View
          className={`flex-row items-center rounded-2xl px-4 border-2 ${
            readOnly
              ? "bg-secondary-200 dark:bg-secondary-800 border-secondary-300 dark:border-secondary-700 opacity-70"
              : error
                ? "bg-secondary-50 dark:bg-secondary-800 border-error-500"
                : isFocused
                  ? "border-primary-500 bg-white dark:bg-secondary-800"
                  : "bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-transparent"
          }`}
        >
          {leftElement ? (
            leftElement
          ) : leftIcon ? (
            <View className="w-10 h-10 items-center justify-center">
              <Ionicons
                name={leftIcon}
                size={20}
                color={error ? "#ef4444" : isFocused ? "#3b82f6" : "#94a3b8"}
              />
            </View>
          ) : null}
          <RNTextInput
            ref={ref}
            className="flex-1 py-4 text-start text-secondary-900 dark:text-white"
            placeholderTextColor="#94a3b8"
            secureTextEntry={isPassword && !isPasswordVisible}
            keyboardType={numericOnly ? "number-pad" : props.keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={handleChangeText}
            readOnly={readOnly}
            editable={!readOnly}
            {...props}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              className="w-10 h-10 items-center justify-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#94a3b8"
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="alert-circle" size={14} color="#ef4444" />
            <Text className="text-red-500 text-sm ml-1">{error}</Text>
          </View>
        )}
      </View>
    );
  },
);

TextInput.displayName = "TextInput";
