import { Colors } from "@/constants/Colors";
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
  StyleSheet,
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
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Workforce</Text>
            <TouchableOpacity onPress={onClose} id="close-create-workforce-modal">
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
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
            style={styles.submitBtn}
          />

          {isPending && (
            <ActivityIndicator
              style={{ marginTop: 8 }}
              color={Colors.primary}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  closeBtn: {
    fontSize: 18,
    color: Colors.textSecondary,
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  submitBtn: {
    marginTop: 8,
  },
});
