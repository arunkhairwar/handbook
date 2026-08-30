import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useCreateWorkforce } from "@/src/hooks/useWorkforce";
import { Workforce } from "@/src/types/worker.types";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface CreateWorkforceModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated: (workforce: Workforce) => void;
}

export function CreateWorkforceModal({
  visible,
  onClose,
  onCreated,
}: CreateWorkforceModalProps) {
  const [name, setName] = useState("");
  const [maxMembers, setMaxMembers] = useState("");

  const { mutate: createWorkforce, isPending } = useCreateWorkforce();

  const handleCreate = () => {
    createWorkforce(
      {
        name: name.trim() || undefined,
        maxMemberCount: maxMembers ? parseInt(maxMembers, 10) : undefined,
      },
      {
        onSuccess: (data) => {
          Toast.show({
            type: "success",
            text1: "Workforce created! 🎉",
            text2: data.name
              ? `"${data.name}" is ready`
              : "Your workforce is ready",
          });
          setName("");
          setMaxMembers("");
          onCreated(data);
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: "Failed to create",
            text2:
              err?.response?.data?.message || "Something went wrong",
          });
        },
      }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 justify-end"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Tap overlay to dismiss */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 bg-black/45" />
        </TouchableWithoutFeedback>

        <View className="bg-card rounded-t-3xl p-6 pb-10">
          {/* Handle */}
          <View className="w-10 h-1 bg-border rounded-full self-center mb-4" />

          {/* Header */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-text">Create Your Workforce</Text>
            <TouchableOpacity onPress={onClose} id="close-create-workforce-modal">
              <Text className="text-lg text-text-secondary p-1">✕</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-text-secondary mb-4">
            Give your team a name and set how many workers can join.
          </Text>

          <Input
            id="workforce-name-input"
            label="Team Name (optional)"
            placeholder="e.g. Sharma's Team"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Input
            id="workforce-max-members-input"
            label="Max Members (optional, default 10)"
            placeholder="10"
            value={maxMembers}
            onChangeText={setMaxMembers}
            keyboardType="number-pad"
          />

          <Button
            title={isPending ? "Creating..." : "Create Workforce"}
            onPress={handleCreate}
            disabled={isPending}
            className="mt-2"
          />

          {isPending && (
            <ActivityIndicator
              className="mt-2"
              color="#1E293B"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
