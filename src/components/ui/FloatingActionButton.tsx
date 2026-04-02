import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface FloatingActionButtonProps extends TouchableOpacityProps {
    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    iconColor?: string;
    backgroundColor?: string;
    onPress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    iconName = 'add',
    iconSize = 30,
    iconColor = '#fff',
    backgroundColor = Colors.primary,
    onPress,
    style,
    ...props
}) => {
    return (
        <TouchableOpacity
            style={[styles.fab, { backgroundColor }, style]}
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
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
