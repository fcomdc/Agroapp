import type { ReporteSalud } from '../types/models';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
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
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Colors } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';
import { ReportesSaludDB } from '../database/ReportesSaludDB';
import EmptyState from '../components/EmptyState';

const GRAVEDAD_COLORS: Record<string, string> = {
  Baja: '#4CAF50',
  Media: '#FF9800',
  Alta: '#F44336',
  Critica: '#B71C1C',
};

const ESTADO_COLORS: Record<string, string> = {
  Pendiente: '#FF9800',
  EnRevision: '#2196F3',
  Atendido: '#4CAF50',
  Cerrado: '#757575',
};

export default function ReportesSaludListScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ReportesSaludList'>>();
  const idBovino = route.params?.IdBovino || route.params?.idBovino;
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
      setReportes((data || []).filter(item => !idBovino || String(item.IdBovino) === String(idBovino)));
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
    }, [loadData])
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtersBar}>
        {['Todos', 'Pendientes', 'Atendido'].map((estado) => {
          const isActive = filtroEstado === estado;
          return (
            <TouchableOpacity
              key={estado}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFiltroEstado(estado)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {estado}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 40 }} />
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
              colors={[Colors.PRIMARY]}
            />
          }
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const gravColor = GRAVEDAD_COLORS[item.Gravedad] || Colors.WARNING;
            const estColor = ESTADO_COLORS[item.Estado] || Colors.TEXT_LIGHT;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ReporteSaludDetail', { idReporte: item.IdReporte })
                }
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bovinoTitle}>
                      {item.NombreBovino
                        ? `${item.NombreBovino} (${item.CodigoBovino})`
                        : `Bovino: ${item.CodigoBovino || item.IdBovino}`}
                    </Text>
                    <Text style={styles.dateText}>{formatDateTime(item.FechaReporte)}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: gravColor + '20' }]}>
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
                    <Text style={[styles.stateText, { color: estColor }]}>{item.Estado}</Text>
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
        onPress={() => navigation.navigate('ReporteSaludForm', { idBovino })}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  filtersBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterChip: {
    flex: 1,
    paddingVertical: 7,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  filterChipActive: { backgroundColor: Colors.PRIMARY },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.TEXT_LIGHT },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bovinoTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.TEXT },
  dateText: { fontSize: 12, color: Colors.TEXT_LIGHT, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  sintomasText: { fontSize: 14, color: Colors.TEXT, marginVertical: 10, lineHeight: 20 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statePill: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  stateText: { fontSize: 12, fontWeight: '600' },
  reporterText: { fontSize: 12, color: Colors.TEXT_LIGHT },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});

