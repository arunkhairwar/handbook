import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/src/lib/utils';

export type FabVariant = 'primary' | 'success' | 'danger' | 'warning';

interface FloatingActionButtonProps extends TouchableOpacityProps {
    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    iconColor?: string;
    variant?: FabVariant;
    onPress: () => void;
    className?: string;
}

const variantBgClasses: Record<FabVariant, string> = {
    primary: 'bg-primary',
    success: 'bg-success',
    danger: 'bg-error',
    warning: 'bg-warning',
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    iconName = 'add',
    iconSize = 30,
    iconColor = '#fff',
    variant = 'primary',
    onPress,
    style,
    className,
    ...props
}) => {
    return (
        <TouchableOpacity
            className={cn(
                'absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg elevation-5',
                variantBgClasses[variant],
                className
            )}
            style={style}
            onPress={onPress}
            activeOpacity={0.8}
            {...props}
        >
            <Ionicons name={iconName} size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
};
