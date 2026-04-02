import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export type FabVariant = 'primary' | 'success' | 'danger' | 'warning';

interface FloatingActionButtonProps extends TouchableOpacityProps {
    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    iconColor?: string;
    variant?: FabVariant;
    onPress: () => void;
    className?: string;
}

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
    const getBackgroundColor = () => {
        switch (variant) {
            case 'success': return Colors.success;
            case 'danger': return Colors.error;
            case 'warning': return Colors.warning;
            case 'primary':
            default: return Colors.primary;
        }
    };

    return (
        <TouchableOpacity
            className={`justify-center items-center ${className || ''}`}
            style={[
                styles.fab,
                { backgroundColor: getBackgroundColor() },
                style
            ]}
            onPress={onPress}
            {...props}
        >
            <Ionicons name={iconName} size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});
