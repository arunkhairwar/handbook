import { Colors } from "@/constants/Colors";
import { TextInput } from "@/src/components/input/TextInput";
import { Button } from "@/src/components/ui/Button";
import { createSiteSchema } from "@/src/schema/sites.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Text, View, ScrollView } from "react-native";
import { z } from "zod";

interface AddSiteModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (site: z.infer<typeof createSiteSchema>) => Promise<void>;
  isLoading: boolean;
}

type SiteFormValues = z.infer<typeof createSiteSchema>;

export function AddSiteModal({
  visible,
  onClose,
  onAdd,
  isLoading,
}: AddSiteModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(createSiteSchema),
    defaultValues: {
      name: "",
      clientId: "",
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
      },
    },
  });

  const onSubmit = async (data: SiteFormValues) => {
    // Clean up address if it's completely empty to match optional schema
    const cleanData = { ...data };
    const hasAddressInput =
      data.address &&
      Object.values(data.address).some(
        (val) => val !== "" && val !== undefined,
      );

    if (!hasAddressInput) {
      delete cleanData.address;
    }

    try {
      await onAdd(cleanData);
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
        <View className="bg-white rounded-2xl p-6" style={{ maxHeight: "85%" }}>
          <Text
            className="text-xl font-bold mb-4"
            style={{ color: Colors.primary }}
          >
            Add New Site
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Site Name *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. Dream House Project"
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="clientId"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Client ID *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. 12345"
                  error={errors.clientId?.message}
                />
              )}
            />

            <Text className="text-lg font-semibold mt-2 mb-4 text-gray-700">
              Address Details (Optional)
            </Text>

            <Controller
              control={control}
              name="address.addressLine1"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Address Line 1"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. Flat 101, Building A"
                  error={errors.address?.addressLine1?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address.addressLine2"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Address Line 2"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. Near Park"
                  error={errors.address?.addressLine2?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address.city"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="City"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. Mumbai"
                  error={errors.address?.city?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address.state"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="State"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. Maharashtra"
                  error={errors.address?.state?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address.pincode"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Pincode"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  numericOnly
                  placeholder="e.g. 400001"
                  error={errors.address?.pincode?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address.country"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Country"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. India"
                  error={errors.address?.country?.message}
                />
              )}
            />
          </ScrollView>

          <View className="flex-row mt-4 pt-2">
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleClose}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Add Site"
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
