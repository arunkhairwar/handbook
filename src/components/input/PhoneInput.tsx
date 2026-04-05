import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import CountryPicker, { CountryCode, Country } from "react-native-country-picker-modal";
import { TextInput } from "./TextInput";

interface PhoneInputProps extends React.ComponentProps<typeof TextInput> {
  value?: string;
  onChangeText?: (text: string) => void;
  disableCountrySelection?: boolean;
}

export function PhoneInput({ value = "", onChangeText, disableCountrySelection = false, ...props }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState<string>("91");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    if (value && value.startsWith("+")) {
      if (value.startsWith(`+${callingCode}`)) {
        setPhoneNumber(value.substring(callingCode.length + 1));
      }
    } else {
      setPhoneNumber(value);
    }
  }, [value, callingCode]);

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2);
    const newCallingCode = country.callingCode[0];
    setCallingCode(newCallingCode);
    if (onChangeText) {
      onChangeText(`+${newCallingCode}${phoneNumber}`);
    }
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    if (onChangeText) {
      onChangeText(`+${callingCode}${text}`);
    }
  };

  const pickerElement = (
    <View className="pl-4 pr-1 justify-center items-center flex-row" pointerEvents={disableCountrySelection || props.readOnly ? "none" : "auto"}>
      <CountryPicker
        countryCode={countryCode}
        withFilter
        withFlag
        withCallingCode
        withEmoji
        onSelect={handleCountrySelect}
        theme={{
          backgroundColor: "transparent",
          flagSizeButton: 24,
        }}
        containerButtonStyle={{ padding: 0, margin: 0 }}
      />
      <Text className="text-secondary-900 dark:text-white font-medium ml-1">
        +{callingCode}
      </Text>
    </View>
  );

  return (
    <TextInput
      {...props}
      leftElement={pickerElement}
      value={phoneNumber}
      onChangeText={handlePhoneChange}
      numericOnly
    />
  );
}
