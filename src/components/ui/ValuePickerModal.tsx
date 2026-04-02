import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface PickerOption {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
  description?: string;
}

interface ValuePickerModalProps {
  visible: boolean;
  onClose: () => void;
  options: PickerOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  title?: string;
}

interface ValuePickerProps {
  label?: string;
  error?: string;
  required?: boolean;
  options: PickerOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  title?: string;
  placeholder?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  className?: string;
}

export function ValuePickerModal({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title = "Select an option",
}: ValuePickerModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-white dark:bg-secondary-900 rounded-t-3xl p-6 pb-10"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-lg font-bold text-secondary-900 dark:text-white mb-4">
            {title}
          </Text>

          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                className={`flex-row items-center p-4 rounded-xl mb-2 border-2 ${
                  isSelected
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800"
                }`}
              >
                {option.icon && (
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={isSelected ? "#3b82f6" : "#94a3b8"}
                  />
                )}
                <View className={`flex-1 ${option.icon ? "ml-3" : ""}`}>
                  <Text
                    className={`text-base font-medium ${
                      isSelected
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-secondary-700 dark:text-secondary-300"
                    }`}
                  >
                    {option.label}
                  </Text>
                  {option.description && (
                    <Text
                      className={`text-sm mt-0.5 ${
                        isSelected
                          ? "text-primary-500/70 dark:text-primary-400/70"
                          : "text-secondary-500 dark:text-secondary-400"
                      }`}
                    >
                      {option.description}
                    </Text>
                  )}
                </View>
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
  );
}

export function ValuePicker({
  label,
  error,
  required = false,
  options,
  selectedValue,
  onSelect,
  title = "Select an option",
  placeholder = "Select an option",
  leftIcon = "briefcase-outline",
  className,
}: ValuePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  return (
    <View className={`mb-4 ${className || ""}`}>
      {label && (
        <Text className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold mb-2">
          {label}
          {required && <Text className="text-error-500"> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        className={`flex-row items-center bg-secondary-50 dark:bg-secondary-800 rounded-2xl px-4 border-2 ${
          error
            ? "border-error-500"
            : "border-secondary-200 dark:border-transparent"
        }`}
      >
        <View className="w-10 h-10 items-center justify-center">
          <Ionicons
            name={leftIcon}
            size={20}
            color={error ? "#ef4444" : "#94a3b8"}
          />
        </View>
        <Text
          className={`flex-1 py-4 text-base ${
            selectedValue
              ? "text-secondary-900 dark:text-white"
              : "text-[#94a3b8]"
          }`}
        >
          {selectedLabel || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#94a3b8" />
      </TouchableOpacity>

      {error && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="alert-circle" size={14} color="#ef4444" />
          <Text className="text-error-500 text-sm ml-1">{error}</Text>
        </View>
      )}

      <ValuePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={options}
        selectedValue={selectedValue}
        onSelect={onSelect}
        title={title}
      />
    </View>
  );
}
