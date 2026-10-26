import type { Vacunacion } from '../types/models';
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
import { formatDate } from '../utils/helpers';
import { VacunacionesDB } from '../database/VacunacionesDB';
import EmptyState from '../components/EmptyState';

export default function VacunacionesListScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'VacunacionesList'>>();
  const idBovino = route.params?.IdBovino || route.params?.idBovino;
  const [vacunas, setVacunas] = useState<Vacunacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState('todas'); // 'todas' | 'proximas'

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (filterMode === 'proximas') {
        const data = await VacunacionesDB.getProximas();
        setVacunas((data || []).filter(item => !idBovino || String(item.IdBovino) === String(idBovino)));
      } else {
        const data = await VacunacionesDB.getAll();
        setVacunas((data || []).filter(item => !idBovino || String(item.IdBovino) === String(idBovino)));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar las vacunaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterMode, idBovino]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = (idVacunacion: number) => {
    Alert.alert(
      'Eliminar Registro',
      '¿Desea eliminar esta aplicación de vacuna?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await VacunacionesDB.remove(idVacunacion);
              loadData();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, filterMode === 'todas' && styles.filterBtnActive]}
          onPress={() => setFilterMode('todas')}
        >
          <Text style={[styles.filterText, filterMode === 'todas' && styles.filterTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filterMode === 'proximas' && styles.filterBtnActive]}
          onPress={() => setFilterMode('proximas')}
        >
          <Text style={[styles.filterText, filterMode === 'proximas' && styles.filterTextActive]}>
            🔔 Próximas Dosis
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 40 }} />
      ) : vacunas.length === 0 ? (
        <EmptyState
          icon="medkit-outline"
          title="Sin Vacunaciones"
          description={filterMode === 'proximas' ? 'No hay vacunas programadas próximas.' : 'Aún no se han registrado vacunas.'}
        />
      ) : (
        <FlatList
          data={vacunas}
          keyExtractor={(item) => item.IdVacunacion.toString()}
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
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="shield-checkmark" size={20} color="#FFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.bovinoTitle}>
                    {item.NombreBovino ? `${item.NombreBovino} (${item.CodigoBovino})` : `Bovino: ${item.CodigoBovino || item.IdBovino}`}
                  </Text>
                  <Text style={styles.dosisText}>
                    Dosis: {item.Dosis || 'N/A'} {item.Lote ? `| Lote: ${item.Lote}` : ''}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.IdVacunacion)}>
                  <Ionicons name="trash-outline" size={20} color={Colors.DANGER} />
                </TouchableOpacity>
              </View>

              <View style={styles.datesRow}>
                <View>
                  <Text style={styles.dateLabel}>Aplicación</Text>
                  <Text style={styles.dateVal}>{formatDate(item.FechaAplicacion)}</Text>
                </View>
                {item.ProximaAplicacion && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.dateLabel}>Próxima Cita</Text>
                    <Text style={[styles.dateVal, { color: Colors.WARNING, fontWeight: 'bold' }]}>
                      {formatDate(item.ProximaAplicacion)}
                    </Text>
                  </View>
                )}
              </View>

              {item.Observaciones ? (
                <Text style={styles.obsText}>Notas: {item.Observaciones}</Text>
              ) : null}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('VacunacionForm', { idBovino })}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#F0F0F0',
  },
  filterBtnActive: { backgroundColor: Colors.PRIMARY },
  filterText: { fontWeight: '600', color: Colors.TEXT_LIGHT },
  filterTextActive: { color: '#FFF' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bovinoTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.TEXT },
  dosisText: { fontSize: 13, color: Colors.TEXT_LIGHT, marginTop: 2 },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  dateLabel: { fontSize: 11, color: Colors.TEXT_LIGHT, textTransform: 'uppercase' },
  dateVal: { fontSize: 13, color: Colors.TEXT, marginTop: 2 },
  obsText: { fontSize: 12, color: Colors.TEXT_LIGHT, fontStyle: 'italic', marginTop: 8 },
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

