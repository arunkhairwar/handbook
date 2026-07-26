import { Colors } from "@/constants/Colors";
import { TextInput } from "@/src/components/input/TextInput";
import { Button } from "@/src/components/ui/Button";
import { DateTimePicker } from "@/src/components/ui/DateTimePicker";
import { Divider } from "@/src/components/ui/Divider";
import { SelectClient } from "@/src/components/ui/SelectClient";
import { useSite } from "@/src/hooks/useSite";
import { createSiteSchema } from "@/src/schema/sites.schema";
import { CreateSiteData } from "@/src/services/site.service";
import { FontAwesome } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { z } from "zod";

type SiteFormValues = z.infer<typeof createSiteSchema>;

export default function AddSiteScreen() {
  const router = useRouter();
  const { createSite, isLoading } = useSite();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(createSiteSchema),
    defaultValues: {
      name: "",
      client: "",
      estimatedBudget: 0,
      startDate: undefined,
      expectedEndDate: undefined,
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
    const cleanData: CreateSiteData = { ...data };
    const hasAddressInput =
      data.address &&
      Object.values(data.address).some(
        (val) => val !== "" && val !== undefined,
      );

    if (!hasAddressInput) {
      delete cleanData.address;
    }

    try {
      await createSite(cleanData);
      router.back();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 pb-10"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Site Info Section */}
        <Text
          className="text-base font-semibold mb-3"
          style={{ color: Colors.primary }}
        >
          Site Information
          <Text
            className="text-sm font-normal"
            style={{ color: Colors.textSecondary }}
          >
            {"  (साइट की जानकारी भरें)"}
          </Text>
        </Text>

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
          name="client"
          render={({ field: { onChange, value } }) => (
            <SelectClient
              label="Client"
              required
              selectedValue={value}
              onSelect={onChange}
              error={errors.client?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="estimatedBudget"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Estimated Budget (अनुमानित लागत)"
              numericOnly
              placeholder="0"
              value={value ? value.toString() : ""}
              onChangeText={(val) => onChange(val ? Number(val) : undefined)}
              error={errors.estimatedBudget?.message}
              leftElement={
                <View className="w-10 h-10 items-center justify-center">
                  <FontAwesome name="rupee" size={20} color="#94a3b8" />
                </View>
              }
            />
          )}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  label="Start Date"
                  value={value}
                  onChange={(date) => onChange(date)}
                  onlyDate
                  error={errors.startDate?.message}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="expectedEndDate"
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  label="Expected End"
                  value={value}
                  onChange={(date) => onChange(date)}
                  onlyDate
                  error={errors.expectedEndDate?.message}
                />
              )}
            />
          </View>
        </View>

        {/* Divider */}
        <Divider />
        {/* Address Section */}
        <Text
          className="text-base font-semibold mb-3"
          style={{ color: Colors.primary }}
        >
          Address Details
          <Text
            className="text-sm font-normal"
            style={{ color: Colors.textSecondary }}
          >
            {"  (Optional)"}
          </Text>
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

        <View className="flex-row gap-3">
          <View className="flex-1">
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
          </View>
          <View className="flex-1">
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
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
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
          </View>
          <View className="flex-1">
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
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom button */}
      <View
        className="px-5 pb-6 pt-3"
        style={{
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          backgroundColor: Colors.background,
        }}
      >
        <Button
          title="Add Site"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
