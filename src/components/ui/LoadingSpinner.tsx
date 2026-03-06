import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    message?: string;
    color?: string;
    size?: 'small' | 'large' | number;
}

export function LoadingSpinner({
    fullScreen = false,
    message,
    color,
    size = 'large',
}: LoadingSpinnerProps) {
    // Default to a primary color if available, or a fallback color
    const spinnerColor = color || (Colors.primary ?? '#0000ff');

    if (fullScreen) {
        return (
            <View style={styles.fullScreenContainer}>
                <ActivityIndicator size={size} color={spinnerColor} />
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={spinnerColor} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    message: {
        marginTop: 12,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});
