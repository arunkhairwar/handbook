import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
    label: string;
    color?: string; // Optional override
    variant?: 'success' | 'warning' | 'default';
}

export function Badge({ label, color, variant = 'default' }: BadgeProps) {
    let backgroundColor = Colors.border;
    let textColor = Colors.text;

    if (variant === 'success') {
        backgroundColor = '#DCFCE7'; // Green 100
        textColor = '#166534'; // Green 800
    } else if (variant === 'warning') {
        backgroundColor = '#FEF3C7'; // Amber 100
        textColor = '#92400E'; // Amber 800
    } else if (color) {
        backgroundColor = color;
        textColor = '#fff';
    }

    return (
        <View style={[styles.badge, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    },
});
