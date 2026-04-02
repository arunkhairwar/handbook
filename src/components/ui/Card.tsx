import { cn } from "@/src/lib/utils";
import React from "react";
import { View, ViewProps } from "react-native";


interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "bg-white rounded-xl p-4 my-2 border border-slate-200 shadow-sm elevation-3",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
