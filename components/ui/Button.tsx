import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', isLoading, disabled, style }: ButtonProps) {
    const getBackgroundColor = () => {
        if (disabled) return Colors.border;
        switch (variant) {
            case 'secondary': return Colors.accent;
            case 'outline': return 'transparent';
            case 'danger': return Colors.error;
            default: return Colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.textSecondary;
        if (variant === 'outline') return Colors.primary;
        if (variant === 'secondary') return '#fff'; // or black depending on accent
        return '#fff';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outline,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginVertical: 8,
    },
    outline: {
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
