import { palette } from '../../../theme/tokens';
import Screen from '../../../components/Screen';
import FilterChip from '../../../components/FilterChip';
import { useRecordParams } from '../../../hooks/useRecordParams';
import type { Reproduccion } from '../../../types/models';
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

import { formatDate } from '../../../utils/helpers';
import { ReproduccionesDB } from '../../../database/repositories/ReproduccionesDB';
import EmptyState from '../../../components/EmptyState';

const RESULT_COLORS: Record<string, string> = {
  Preñada: '#2E7D32',
  'No Preñada': '#D32F2F',
  Pendiente: '#F57C00',
};

export default function ReproduccionesScreen() {
  const router = useRouter();
  const params = useRecordParams();
  const idBovino = params.idBovino;
  const [reproducciones, setReproducciones] = useState<Reproduccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState('todas'); // 'todas' | 'prenadas'

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (filterMode === 'prenadas') {
        const data = await ReproduccionesDB.getPreñadas();
        setReproducciones(
          (data || []).filter(
            (item) => !idBovino || String(item.IdBovino) === String(idBovino),
          ),
        );
      } else {
        const data = await ReproduccionesDB.getAll();
        setReproducciones(
          (data || []).filter(
            (item) => !idBovino || String(item.IdBovino) === String(idBovino),
          ),
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error',
        'No se pudieron cargar los registros de reproducción',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterMode, idBovino]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleDelete = (idReproduccion: number) => {
    Alert.alert(
      'Eliminar Registro',
      '¿Desea eliminar este registro reproductivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ReproduccionesDB.remove(idReproduccion);
              loadData();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          },
        },
      ],
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.filterContainer}>
        <FilterChip
          label="Todas"
          selected={filterMode === 'todas'}
          onPress={() => setFilterMode('todas')}
        />
        <FilterChip
          label="Preñadas"
          icon="checkmark-circle-outline"
          selected={filterMode === 'prenadas'}
          onPress={() => setFilterMode('prenadas')}
        />
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={palette.forest}
          style={{ marginTop: 40 }}
        />
      ) : reproducciones.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Sin Registros Reproductivos"
          description="Inicie registrando servicios de monta natural o inseminación artificial."
        />
      ) : (
        <FlatList
          data={reproducciones}
          keyExtractor={(item) => item.IdReproduccion.toString()}
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
            const resColor = RESULT_COLORS[item.Resultado] || palette.clay;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bovinoTitle}>
                      {item.NombreBovino
                        ? `${item.NombreBovino} (${item.CodigoBovino})`
                        : `Hembra: ${item.CodigoBovino || item.IdBovino}`}
                    </Text>
                    <Text style={styles.subText}>{item.TipoReproduccion}</Text>
                  </View>
                  <View
                    style={[styles.badge, { backgroundColor: resColor + '20' }]}
                  >
                    <Text style={[styles.badgeText, { color: resColor }]}>
                      {item.Resultado || 'Pendiente'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => handleDelete(item.IdReproduccion)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={palette.danger}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.datesRow}>
                  <View>
                    <Text style={styles.dateLabel}>Fecha Servicio</Text>
                    <Text style={styles.dateVal}>
                      {formatDate(item.FechaMonta || item.FechaInseminacion)}
                    </Text>
                  </View>
                  {item.FechaProbableParto && (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.dateLabel}>Parto Estimado</Text>
                      <Text
                        style={[
                          styles.dateVal,
                          { color: palette.forest, fontWeight: 'bold' },
                        ]}
                      >
                        {formatDate(item.FechaProbableParto)}
                      </Text>
                    </View>
                  )}
                </View>

                {item.Observaciones ? (
                  <Text style={styles.obsText}>
                    Notas: {item.Observaciones}
                  </Text>
                ) : null}
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({ pathname: '/reproduccion/crear', params: { idBovino } })
        }
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    flexWrap: 'wrap',
    backgroundColor: palette.cream,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E6DB',
  },
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
    alignItems: 'center',
  },
  bovinoTitle: { fontSize: 16, fontWeight: 'bold', color: palette.ink },
  subText: { fontSize: 13, color: palette.muted, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F6F5EF',
  },
  dateLabel: {
    fontSize: 11,
    color: palette.muted,
    textTransform: 'uppercase',
  },
  dateVal: { fontSize: 13, color: palette.ink, marginTop: 2 },
  obsText: {
    fontSize: 12,
    color: palette.muted,
    fontStyle: 'italic',
    marginTop: 8,
  },
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
