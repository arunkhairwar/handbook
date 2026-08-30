import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { cn } from '@/src/lib/utils';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    message?: string;
    color?: string;
    size?: 'small' | 'large' | number;
    className?: string;
}

export function LoadingSpinner({
    fullScreen = false,
    message,
    color,
    size = 'large',
    className,
}: LoadingSpinnerProps) {
    const spinnerColor = color || '#1E293B';

    if (fullScreen) {
        return (
            <View className={cn('flex-1 items-center justify-center bg-card', className)}>
                <ActivityIndicator size={size} color={spinnerColor} />
                {message && (
                    <Text className="mt-3 text-base text-text font-medium">
                        {message}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View className={cn('p-4 items-center justify-center', className)}>
            <ActivityIndicator size={size} color={spinnerColor} />
            {message && (
                <Text className="mt-3 text-base text-text font-medium">
                    {message}
                </Text>
            )}
        </View>
    );
}
