import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, TouchableWithoutFeedback, Keyboard, Animated, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Certifique-se de instalar: npx expo install expo-linear-gradient
import { darkStyles, lightStyles } from '../../styles/estilos';
import { useTheme } from '../../contexts/ThemeContext';
import { getBaseUrl } from '../../utils';

const LoginScreen = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const styles = isDarkMode ? darkStyles : lightStyles;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(20));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 30,
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
            Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* O LinearGradient substitui o container sólido antigo */}
            <LinearGradient 
                colors={['#5849ff', '#1e1b4b']} // Roxo para Azul Escuro (Estilo Premium)
                style={styles.fbContainer}
            >
                <StatusBar barStyle="light-content" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    bounces={false}
                >
                    <Animated.View style={[styles.fbContentArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        
                        {/* Topo estilo Facebook: Marca centralizada em destaque */}
                        <View style={styles.fbHeaderArea}>
                            <Text style={styles.fbTitle}>IntelectusIA</Text>
                            <Text style={styles.fbSubtitle}>Conecte-se e continue sua trilha de aprendizado.</Text>
                        </View>

                        {/* Bloco Central de Inputs */}
                        <View style={styles.fbFormCard}>
                            <View style={styles.fbInputWrapper}>
                                <TextInput
                                    style={styles.fbInput}
                                    placeholder="E-mail ou número de telefone"
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                            </View>

                            <View style={styles.fbInputWrapper}>
                                <TextInput
                                    style={styles.fbInput}
                                    placeholder="Senha"
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    style={styles.fbPasswordToggle}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={{ fontSize: 13, color: '#6366f1', fontWeight: '600' }}>
                                        {showPassword ? 'Ocultar' : 'Mostrar'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.fbLoginButton, loading && { opacity: 0.8 }]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.fbLoginButtonText}>Entrar</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.fbForgotPassword}>
                                <Text style={styles.fbForgotPasswordText}>Esqueceu a senha?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Rodapé estrutural do Facebook: Link de Cadastro e Dados Escolares bem separados abaixo */}
                        <View style={styles.fbFooterArea}>
                            <TouchableOpacity 
                                style={styles.fbRegisterButton}
                                onPress={() => Alert.alert('Cadastro', 'Funcionalidade em breve!')}
                            >
                                <Text style={styles.fbRegisterButtonText}>Criar nova conta</Text>
                            </TouchableOpacity>

                            <View style={styles.fbSchoolFooter}>
                                <Text style={styles.fbSchoolText}>Grupo: Fellipe, Miguel e Nicolas</Text>
                                <Text style={styles.fbSchoolText}>Professores: Douglas e Ricardo | 3º ano B</Text>
                            </View>
                        </View>

                    </Animated.View>
                </ScrollView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;