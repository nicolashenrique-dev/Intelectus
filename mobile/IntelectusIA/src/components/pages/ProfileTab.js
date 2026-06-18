import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { darkStyles, lightStyles } from '../../styles/estilos';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileTab = ({ trilhaAtual, calculateProgress, navigation }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

  return (
    <View style={styles.profileContainer}>
      {/* Cabeçalho do Perfil com o Avatar Redondo */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <View style={styles.profileAvatar}>
          <Feather name="user" size={40} color="#818cf8" />
        </View>
        <Text style={{ color: isDarkMode ? '#fff' : '#0f172a', fontSize: 24, fontWeight: '900', marginTop: 16 }}>
          Estudante Intelectus
        </Text>
        <Text style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: 15, marginTop: 4 }}>
          Plano Iniciante
        </Text>
      </View>

      {/* Grid de Estatísticas em Cards (Módulos e Progresso) */}
      <View style={styles.cardsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Módulos</Text>
          <Text style={styles.statValue}>
            {trilhaAtual?.nodes?.length || 0}
          </Text>
        </View>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <Text style={styles.statLabel}>Progresso</Text>
          <Text style={styles.statValue}>
            {calculateProgress ? calculateProgress(trilhaAtual) : 0}%
          </Text>
        </View>
      </View>

      {/* Seção de Listas/Configurações */}
      <View style={[styles.section, { marginTop: 12 }]}>
        <Text style={styles.sectionTitle}>Configurações</Text>

        {/* Item: Notificações */}
        <View style={styles.moduleItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.moduleIcon}>
              <Feather name="bell" size={20} color={isDarkMode ? '#cbd5e1' : '#334155'} />
            </View>
            <Text style={styles.moduleTitle}>Notificações</Text>
          </View>
          <Switch
            trackColor={{ false: '#334155', true: '#4f46e5' }}
            thumbColor={notificationsEnabled ? '#fff' : '#94a3b8'}
            ios_backgroundColor="#334155"
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>

        {/* Item: Modo Escuro */}
        <View style={styles.moduleItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.moduleIcon}>
              <Feather name="moon" size={20} color={isDarkMode ? '#cbd5e1' : '#334155'} />
            </View>
            <Text style={styles.moduleTitle}>Modo Escuro</Text>
          </View>
          <Switch
            trackColor={{ false: '#334155', true: '#4f46e5' }}
            thumbColor={isDarkMode ? '#fff' : '#94a3b8'}
            ios_backgroundColor="#334155"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>

        {/* Item: Sair da Conta */}
        <TouchableOpacity
          style={styles.moduleItem}
          onPress={() => navigation.navigate('Login')}
        >
          <View style={[styles.moduleIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Feather name="log-out" size={20} color="#ef4444" />
          </View>
          <Text style={[styles.moduleTitle, { color: '#ef4444' }]}>
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileTab;