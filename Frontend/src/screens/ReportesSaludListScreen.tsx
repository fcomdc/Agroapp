import { palette } from '../theme/tokens';
import Screen from '../components/Screen';
import { useRecordParams } from '../hooks/useRecordParams';
import type { ReporteSalud } from '../types/models';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { formatDateTime } from '../utils/helpers';
import { ReportesSaludDB } from '../database/repositories/ReportesSaludDB';
import EmptyState from '../components/EmptyState';

const GRAVEDAD_COLORS: Record<string, string> = {
  Baja: '#28634B',
  Media: '#A66443',
  Alta: '#F44336',
  Critica: '#B71C1C',
};

const ESTADO_COLORS: Record<string, string> = {
  Pendiente: '#A66443',
  EnRevision: '#4D716B',
  Atendido: '#28634B',
  Cerrado: '#757575',
};

export default function ReportesSaludListScreen() {
  const router = useRouter();
  const params = useRecordParams();
  const idBovino = params.idBovino;
  const [reportes, setReportes] = useState<ReporteSalud[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      let data = [];
      if (filtroEstado === 'Pendientes') {
        data = await ReportesSaludDB.getPendientes();
      } else if (filtroEstado === 'Todos') {
        data = await ReportesSaludDB.getAll();
      } else {
        data = await ReportesSaludDB.getByEstado(filtroEstado);
      }
      setReportes(
        (data || []).filter(
          (item) => !idBovino || String(item.IdBovino) === String(idBovino),
        ),
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los reportes de salud');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtroEstado, idBovino]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.filtersBar}>
        {['Todos', 'Pendientes', 'Atendido'].map((estado) => {
          const isActive = filtroEstado === estado;
          return (
            <TouchableOpacity
              key={estado}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFiltroEstado(estado)}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {estado}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={palette.forest}
          style={{ marginTop: 40 }}
        />
      ) : reportes.length === 0 ? (
        <EmptyState
          icon="pulse-outline"
          title="Sin Reportes Médicos"
          description="No hay incidencias de salud registradas con este criterio."
        />
      ) : (
        <FlatList
          data={reportes}
          keyExtractor={(item) => item.IdReporte.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadData();
              }}
              colors={[palette.forest]}
            />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 112 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => {
            const gravColor = GRAVEDAD_COLORS[item.Gravedad] || palette.clay;
            const estColor = ESTADO_COLORS[item.Estado] || palette.muted;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/salud/[id]',
                    params: { id: item.IdReporte },
                  })
                }
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bovinoTitle}>
                      {item.NombreBovino
                        ? `${item.NombreBovino} (${item.CodigoBovino})`
                        : `Bovino: ${item.CodigoBovino || item.IdBovino}`}
                    </Text>
                    <Text style={styles.dateText}>
                      {formatDateTime(item.FechaReporte)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: gravColor + '20' },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: gravColor }]}>
                      {item.Gravedad}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sintomasText} numberOfLines={2}>
                  {item.Sintomas}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={[styles.statePill, { borderColor: estColor }]}>
                    <Text style={[styles.stateText, { color: estColor }]}>
                      {item.Estado}
                    </Text>
                  </View>
                  <Text style={styles.reporterText}>
                    Reportó: {item.NombreUsuario || 'Desconocido'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({ pathname: '/salud/crear', params: { idBovino } })
        }
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  filtersBar: {
    flexDirection: 'row',
    backgroundColor: palette.cream,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E6DB',
  },
  filterChip: {
    flex: 1,
    paddingVertical: 7,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  filterChipActive: { backgroundColor: palette.forest },
  filterText: { fontSize: 13, fontWeight: '600', color: palette.muted },
  filterTextActive: { color: '#FFF' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bovinoTitle: { fontSize: 16, fontWeight: 'bold', color: palette.ink },
  dateText: { fontSize: 12, color: palette.muted, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  sintomasText: {
    fontSize: 14,
    color: palette.ink,
    marginVertical: 10,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statePill: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  stateText: { fontSize: 12, fontWeight: '600' },
  reporterText: { fontSize: 12, color: palette.muted, flexShrink: 1 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.forest,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
