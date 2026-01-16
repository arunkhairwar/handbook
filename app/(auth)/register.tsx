import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store/mockStore';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const register = useStore(state => state.register);

    const validate = () => {
        let isValid = true;
        const newErrors: { [key: string]: string } = {};

        if (!form.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!form.mobile) {
            newErrors.mobile = 'Mobile number is required';
            isValid = false;
        } else if (form.mobile.length !== 10) {
            newErrors.mobile = 'Mobile number must be 10 digits';
            isValid = false;
        }

        if (!form.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1000));

        const success = register({
            name: form.name,
            mobile: form.mobile,
            email: form.email,
            role: 'CONTRACTOR' // Default to Contractor
        }, form.password);

        setLoading(false);

        if (success) {
            Alert.alert('Success', 'Account created successfully');
            router.replace('../(admin)/dashboard');
        } else {
            Alert.alert('Error', 'Failed to register');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to manage your sites</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="Enter full name"
                        value={form.name}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                        error={errors.name}
                    />

                    <Input
                        label="Mobile Number"
                        placeholder="Enter mobile number"
                        keyboardType="number-pad"
                        maxLength={10}
                        value={form.mobile}
                        onChangeText={(text) => setForm({ ...form, mobile: text })}
                        error={errors.mobile}
                    />

                    <Input
                        label="Email"
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        placeholder="Create password"
                        secureTextEntry={!showPassword}
                        value={form.password}
                        onChangeText={(text) => setForm({ ...form, password: text })}
                        error={errors.password}
                        rightIcon={showPassword ? 'eye-off' : 'eye'}
                        onRightIconPress={() => setShowPassword(!showPassword)}
                    />

                    <Button
                        title="Register"
                        onPress={handleRegister}
                        isLoading={loading}
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/login" asChild>
                            <Text style={styles.link}>Login</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    link: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
