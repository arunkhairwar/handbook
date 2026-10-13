import React from 'react';
import { ActivityIndicator, TouchableOpacity, ViewStyle } from 'react-native';
import { cn } from '@/src/lib/utils';
import { Text } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    className?: string;
}

const variantClasses: Record<string, { button: string; text: string }> = {
    primary: {
        button: 'bg-primary',
        text: 'text-white',
    },
    secondary: {
        button: 'bg-accent',
        text: 'text-white',
    },
    outline: {
        button: 'bg-transparent border border-primary',
        text: 'text-primary',
    },
    danger: {
        button: 'bg-error',
        text: 'text-white',
    },
    disabled: {
        button: 'bg-border',
        text: 'text-text-secondary',
    },
};

export function Button({ title, onPress, variant = 'primary', isLoading, disabled, className, style }: ButtonProps) {
    const effectiveVariant = disabled ? 'disabled' : variant;
    const { button, text } = variantClasses[effectiveVariant];

    return (
        <TouchableOpacity
            className={cn(
                'h-12 rounded-lg justify-center items-center flex-row px-4 my-2',
                button,
                className
            )}
            style={style}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={disabled ? '#64748B' : variant === 'outline' ? '#1E293B' : '#fff'} />
            ) : (
                <Text className={cn('text-base font-semibold', text)}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
