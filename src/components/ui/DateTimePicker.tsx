import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  Modal,
  Text,
} from "react-native";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Input } from "./Input";
import moment from "moment";

export interface DateTimePickerProps {
  value?: Date | string;
  onChange?: (date: Date) => void;
  onlyDate?: boolean;
  onlyTime?: boolean;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  onlyDate = false,
  onlyTime = false,
  label,
  error,
  placeholder,
  disabled = false,
}: DateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const hasBoth = !onlyDate && !onlyTime;

  const parsedValue =
    value && moment(value).isValid() ? moment(value).toDate() : null;
  const [tempDate, setTempDate] = useState<Date>(parsedValue || new Date());

  const handlePress = () => {
    if (disabled) return;
    setTempDate(parsedValue || new Date());
    setMode(onlyTime ? "time" : "date");
    setShowPicker(true);
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selectedDate) {
        if (hasBoth && mode === "date") {
          setTempDate(selectedDate);
          setMode("time");
          setTimeout(() => setShowPicker(true), 100);
        } else {
          if (onChange) {
            if (hasBoth && mode === "time" && tempDate) {
              const finalDate = new Date(tempDate);
              finalDate.setHours(selectedDate.getHours());
              finalDate.setMinutes(selectedDate.getMinutes());
              onChange(finalDate);
            } else {
              onChange(selectedDate);
            }
          }
        }
      }
    } else {
      // iOS
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleIosDone = () => {
    setShowPicker(false);
    if (onChange) {
      onChange(tempDate);
    }
  };

  const getFormattedValue = () => {
    if (!parsedValue) return "";
    if (onlyDate) return moment(parsedValue).format("DD-MM-YYYY");
    if (onlyTime) return moment(parsedValue).format("hh:mm A");
    return moment(parsedValue).format("DD-MM-YYYY hh:mm A");
  };

  const iosMode = onlyDate ? "date" : onlyTime ? "time" : "datetime";

  return (
    <View className="w-full">
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View pointerEvents="none">
          <Input
            label={label}
            value={getFormattedValue()}
            placeholder={
              placeholder ||
              (onlyDate
                ? "DD-MM-YYYY"
                : onlyTime
                  ? "HH:MM AM/PM"
                  : "DD-MM-YYYY HH:MM AM/PM")
            }
            error={error}
            editable={false}
            rightIcon={onlyTime ? "time-outline" : "calendar-outline"}
          />
        </View>
      </TouchableOpacity>

      {Platform.OS === "android" && showPicker && (
        <RNDateTimePicker
          value={
            mode === "time" && hasBoth ? tempDate : parsedValue || new Date()
          }
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal visible={showPicker} transparent animationType="slide">
          <TouchableOpacity
            className="flex-1 justify-end bg-black/40"
            activeOpacity={1}
            onPress={handleIosDone}
          >
            <View
              className="bg-card pb-5"
              onStartShouldSetResponder={() => true}
            >
              <View className="flex-row justify-end p-4 border-b border-border bg-background">
                <TouchableOpacity
                  onPress={handleIosDone}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text className="text-primary text-base font-bold">Done</Text>
                </TouchableOpacity>
              </View>
              <RNDateTimePicker
                value={tempDate}
                mode={iosMode}
                display="spinner"
                onChange={handleChange}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}
