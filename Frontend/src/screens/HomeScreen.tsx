import type { ComponentProps } from 'react';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { parseLocalDate } from '../utils/helpers';
import { COLORS } from '../utils/constants';
import StatCard from '../components/StatCard';
import { BovinosDB } from '../database/BovinosDB';
import { ReportesSaludDB } from '../database/ReportesSaludDB';
import { VacunacionesDB } from '../database/VacunacionesDB';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalBovinos: 0,
    bovinosActivos: 0,
    reportesPendientes: 0,
    proximasVacunas: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      const allBovinos = await BovinosDB.getAll();
      const activeBovinos = allBovinos.filter((b) => b.Estado === 'Activo');

      let reportesPendientes = 0;
      try {
        const reportes = await ReportesSaludDB.getAll();
        reportesPendientes = reportes.filter(
          (r) => r.Estado === 'Pendiente' || r.Estado === 'EnRevision'
        ).length;
      } catch {
        // Table might not have data yet
      }

      let proximasVacunas = 0;
      try {
        const vacunas = await VacunacionesDB.getAll();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 30);
        proximasVacunas = vacunas.filter((v) => {
          if (!v.ProximaAplicacion) return false;
          const fecha = parseLocalDate(v.ProximaAplicacion);
          return fecha >= today && fecha <= nextWeek;
        }).length;
      } catch {
        // Table might not have data yet
      }

      setStats({
        totalBovinos: allBovinos.length,
        bovinosActivos: activeBovinos.length,
        reportesPendientes,
        proximasVacunas,
      });
    } catch (e) {
      console.log('Error loading stats:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const quickActions: { title: string; icon: ComponentProps<typeof Ionicons>['name']; color: string; onPress: () => void }[] = [
    {
      title: 'Registrar Bovino',
      icon: 'add-circle',
      color: COLORS.PRIMARY,
      onPress: () => navigation.navigate('BovinoForm'),
    },
    {
      title: 'Nuevo Reporte',
      icon: 'document-text',
      color: COLORS.WARNING,
      onPress: () => navigation.navigate('ReporteSaludForm'),
    },
    {
      title: 'Registrar Peso',
      icon: 'scale',
      color: COLORS.INFO,
      onPress: () => navigation.navigate('BovinosList'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.greeting}>
            Hola, {user?.NombreCompleto || user?.Usuario || 'Usuario'}!
          </Text>
          <Text style={styles.subtitle}>Panel de Control</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={48} color={COLORS.WHITE} />
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Bovinos"
          value={stats.totalBovinos}
          icon="analytics"
          color={COLORS.PRIMARY}
        />
        <StatCard
          title="Bovinos Activos"
          value={stats.bovinosActivos}
          icon="checkmark-circle"
          color={COLORS.SECONDARY}
        />
        <StatCard
          title="Reportes Pendientes"
          value={stats.reportesPendientes}
          icon="alert-circle"
          color={COLORS.WARNING}
        />
        <StatCard
          title="Próximas Vacunas"
          value={stats.proximasVacunas}
          icon="medkit"
          color={COLORS.INFO}
        />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.actionsContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon} size={28} color={action.color} />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity Placeholder */}
      <Text style={styles.sectionTitle}>Resumen</Text>
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Ionicons name="trending-up" size={20} color={COLORS.PRIMARY} />
          <Text style={styles.summaryText}>
            {stats.bovinosActivos} bovinos activos de {stats.totalBovinos} registrados
          </Text>
        </View>
        {stats.reportesPendientes > 0 && (
          <View style={styles.summaryRow}>
            <Ionicons name="warning" size={20} color={COLORS.WARNING} />
            <Text style={styles.summaryText}>
              {stats.reportesPendientes} reporte(s) de salud pendientes por atender
            </Text>
          </View>
        )}
        {stats.proximasVacunas > 0 && (
          <View style={styles.summaryRow}>
            <Ionicons name="calendar" size={20} color={COLORS.INFO} />
            <Text style={styles.summaryText}>
              {stats.proximasVacunas} vacunación(es) programadas próximamente
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  watermark: {
    position: 'absolute',
    bottom: 40,
    right: -50,
    width: 320,
    height: 320,
    opacity: 0.05,
    pointerEvents: 'none',
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
    padding: 3,
  },
  headerLogo: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: -15,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.TEXT,
    textAlign: 'center',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginLeft: 12,
    flex: 1,
  },
});

