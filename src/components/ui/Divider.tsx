import React from "react";
import { View } from "react-native";

type DeviderProps = {
  classname?: string;
};
export function Divider({ classname }: DeviderProps) {
  return <View className={`my-4 h-[1px] bg-[#E2E8F0] ${classname}`} />;
}
