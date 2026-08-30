import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { cn } from '@/src/lib/utils';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    containerClassName?: string;
}

export function Input({
    label,
    error,
    rightIcon,
    onRightIconPress,
    style,
    className,
    containerClassName,
    ...props
}: InputProps) {
    return (
        <View className={cn('my-2', containerClassName)}>
            {label && (
                <Text className="text-sm font-medium text-text mb-1">
                    {label}
                </Text>
            )}
            <View
                className={cn(
                    'flex-row items-center border rounded-lg bg-card',
                    error ? 'border-error' : 'border-border'
                )}
            >
                <TextInput
                    className={cn('flex-1 p-3 text-base text-text', className)}
                    style={style}
                    placeholderTextColor="#64748B"
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} className="p-2.5">
                        <Ionicons name={rightIcon} size={20} color="#64748B" />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text className="text-xs text-error mt-1">
                    {error}
                </Text>
            )}
        </View>
    );
}
