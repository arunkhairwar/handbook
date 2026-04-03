import { Colors } from "@/constants/Colors";
import { TextInput } from "@/src/components/input/TextInput";
import { Button } from "@/src/components/ui/Button";
import { createClientSchema } from "@/src/schema/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Text, View } from "react-native";
import { z } from "zod";

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (client: { name: string; mobile: string }) => Promise<void>;
  isLoading: boolean;
}

type ClientFormValues = z.infer<typeof createClientSchema>;

export function AddClientModal({
  visible,
  onClose,
  onAdd,
  isLoading,
}: AddClientModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      mobile: "",
    },
  });

  const onSubmit = async (data: ClientFormValues) => {
    try {
      await onAdd(data);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center p-6">
        <View className="bg-white rounded-2xl p-6">
          <Text
            className="text-xl font-bold mb-4"
            style={{ color: Colors.primary }}
          >
            Add New Client
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Client Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="e.g. Arun bhai"
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="mobile"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Mobile Number"
                maxLength={10}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                numericOnly
                placeholder="e.g. 9876543210"
                error={errors.mobile?.message}
              />
            )}
          />

          <View className="flex-row mt-4">
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleClose}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Add Client"
              onPress={handleSubmit(onSubmit)}
              style={{ flex: 1, marginLeft: 8 }}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
