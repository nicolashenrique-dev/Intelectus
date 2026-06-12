import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, TouchableWithoutFeedback, Keyboard, Animated, ActivityIndicator, Alert, Platform, StatusBar } from 'react-native';
import styles from '../../styles/estilos';
import { getBaseUrl } from '../../utils';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(30));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 9,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            const baseUrl = getBaseUrl();
            const response = await fetch(`${baseUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                navigation.replace('Dashboard', { uid: data.user?.uid || 'mock-uid' });
            } else {
                Alert.alert('Falha no Login', data.message || 'Credenciais inválidas');
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique se o backend está rodando no IP correto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                >
                    <Animated.View style={[styles.loginFormArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <Text style={styles.titleGradient}>IntelectusIA</Text>
                        <Text style={styles.subtitle}>Faça login para continuar sua trilha</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="seu@email.com"
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    style={styles.passwordToggle}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={{ fontSize: 16, color: '#94a3b8' }}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="large" />
                            ) : (
                                <Text style={styles.buttonText}>Entrar</Text>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.registerText}>
                            Não tem uma conta? <Text style={styles.registerLink} onPress={() => Alert.alert('Cadastro', 'Funcionalidade em breve!')}>Criar agora</Text>
                        </Text>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Grupo: Fellipe, Miguel e Nicolas</Text>
                            <Text style={styles.footerText}>Professores: Douglas e Ricardo | 3º ano B</Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;
