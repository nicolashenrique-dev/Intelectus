import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import styles from '../../styles/estilos';
import { getBaseUrl } from '../../utils';
import { useFocusEffect } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Principal = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [trilhaAtual, setTrilhaAtual] = useState(null);
  const [destaques, setDestaques] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [abaAtual, setAbaAtual] = useState('Home');

  // Usar o UID vindo do login ou mock
  const uid = route.params?.uid || 'mock-uid';

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUrl = getBaseUrl();

      // Buscar trilha do usuário
      const resTrilha = await fetch(`${baseUrl}/api/roadmap/user/${uid}`);
      const dataTrilha = await resTrilha.json();
      if (dataTrilha.success) setTrilhaAtual(dataTrilha.roadmap);
      else setTrilhaAtual(null);

      // Buscar destaques
      const resDestaques = await fetch(`${baseUrl}/api/itens/destaques`);
      const dataDestaques = await resDestaques.json();
      if (dataDestaques.success) setDestaques(dataDestaques.destaques);

    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [uid])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const calculateProgress = (trilha) => {
    if (!trilha?.nodes) return 0;
    const completed = trilha.nodes.filter(n => n.status === 'completed').length;
    return Math.round((completed / trilha.nodes.length) * 100);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.screenAccentTop} />
      <View style={styles.screenAccentBottom} />

      <ScrollView
        contentContainerStyle={styles.mainContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        showsVerticalScrollIndicator={false}
      >
        {abaAtual === 'Home' ? (
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.greetingTitle}>Olá, Estudante!</Text>
                <Text style={styles.greetingSubtitle}>Pronto para continuar seus estudos?</Text>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.logoutButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Sua Trilha Atual</Text>
                <Text style={styles.sectionSubtitle}>Acompanhe seu progresso e continue evoluindo.</Text>
              </View>

              {trilhaAtual ? (
                <TouchableOpacity
                  style={styles.roadmapCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Roadmap', { roadmap: trilhaAtual, uid })}
                >
                  <View style={styles.roadmapCardTopRow}>
                    <Text style={styles.roadmapBadge}>Em Andamento</Text>
                    <Text style={styles.roadmapProgressBadge}>{calculateProgress(trilhaAtual)}%</Text>
                  </View>
                  <Text style={styles.roadmapTitle}>{trilhaAtual.title}</Text>
                  <Text style={styles.roadmapSubtitle}>{trilhaAtual.description}</Text>
                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${calculateProgress(trilhaAtual)}%` }]} />
                  </View>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressText}>Progresso geral</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.emptyStateCard}>
                  <Text style={styles.emptyStateTitle}>Nenhuma trilha ativa</Text>
                  <Text style={styles.emptyStateText}>Crie um roteiro de estudos personalizado com ajuda da nossa inteligência artificial para começar sua jornada.</Text>
                  <TouchableOpacity
                    style={styles.emptyStateButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Quiz', { uid })}
                  >
                    <Text style={styles.emptyStateButtonText}>+ Gerar Trilha com IA</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={[styles.section, { marginTop: 24 }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trilhas em Destaque</Text>
                <Text style={styles.sectionSubtitle}>Explore os roteiros mais acessados da plataforma.</Text>
              </View>

              {destaques.length > 0 ? (
                destaques.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.highlightCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Quiz', { uid })}
                  >
                    <View style={styles.highlightTopRow}>
                      <Text style={styles.highlightTitle}>{item.name}</Text>
                      <Text style={styles.highlightLevel}>{item.level}</Text>
                    </View>
                    <Text style={styles.highlightDescription}>Explore os principais fundamentos desta trilha para alavancar sua carreira.</Text>
                    <View style={styles.tagList}>
                      {item.tags?.map((tag, index) => (
                        <View key={index} style={styles.tagChip}>
                          <Text style={styles.tagChipText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyListCard}>
                  <Text style={styles.emptyListTitle}>Nada por aqui ainda</Text>
                  <Text style={styles.emptyListText}>Novas trilhas serão adicionadas em breve.</Text>
                </View>
              )}
            </View>
          </View>
        ) : abaAtual === 'Profile' ? (
          <View style={styles.profileContainer}>
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <View style={styles.profileAvatar}>
                <Feather name="user" size={40} color="#818cf8" />
              </View>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 16 }}>Estudante Intelectus</Text>
              <Text style={{ color: '#94a3b8', fontSize: 15, marginTop: 4 }}>Plano Iniciante</Text>
            </View>

            <View style={styles.cardsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Módulos</Text>
                <Text style={styles.statValue}>{trilhaAtual?.nodes?.length || 0}</Text>
              </View>
              <View style={[styles.statCard, styles.statCardPrimary]}>
                <Text style={styles.statLabel}>Progresso</Text>
                <Text style={styles.statValue}>{calculateProgress(trilhaAtual)}%</Text>
              </View>
            </View>

            <View style={[styles.section, { marginTop: 12 }]}>
              <Text style={styles.sectionTitle}>Configurações</Text>

              <TouchableOpacity style={styles.moduleItem}>
                <View style={styles.moduleIcon}><Feather name="settings" size={20} color="#cbd5e1" /></View>
                <Text style={styles.moduleTitle}>Preferências</Text>
                <Feather name="chevron-right" size={20} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.moduleItem}>
                <View style={[styles.moduleIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}><Feather name="log-out" size={20} color="#ef4444" /></View>
                <Text style={[styles.moduleTitle, { color: '#ef4444' }]}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.95)', 'rgba(5, 8, 16, 0.98)']}
          style={styles.bottomNavInner}
        >
          <TouchableOpacity style={styles.navItem} onPress={() => setAbaAtual('Home')}>
            <Feather name="home" size={24} color={abaAtual === 'Home' ? '#818cf8' : '#64748b'} />
            <Text style={[styles.navText, abaAtual === 'Home' && styles.navTextActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Quiz', { uid })}>
            <View style={styles.navFab}>
              <LinearGradient colors={['#818cf8', '#4f46e5']} style={styles.navFabInner}>
                <Feather name="plus" size={28} color="#fff" />
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setAbaAtual('Profile')}>
            <Feather name="user" size={24} color={abaAtual === 'Profile' ? '#818cf8' : '#64748b'} />
            <Text style={[styles.navText, abaAtual === 'Profile' && styles.navTextActive]}>Perfil</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default Principal;
