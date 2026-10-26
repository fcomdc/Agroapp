import type { Reproduccion } from '../types/models';
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
import { ReproduccionesDB } from '../database/ReproduccionesDB';
import EmptyState from '../components/EmptyState';

const RESULT_COLORS: Record<string, string> = {
  Preñada: '#2E7D32',
  'No Preñada': '#D32F2F',
  Pendiente: '#F57C00',
};

export default function ReproduccionesScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Reproducciones'>>();
  const idBovino = route.params?.IdBovino || route.params?.idBovino;
  const [reproducciones, setReproducciones] = useState<Reproduccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState('todas'); // 'todas' | 'prenadas'

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (filterMode === 'prenadas') {
        const data = await ReproduccionesDB.getPreñadas();
        setReproducciones((data || []).filter(item => !idBovino || String(item.IdBovino) === String(idBovino)));
      } else {
        const data = await ReproduccionesDB.getAll();
        setReproducciones((data || []).filter(item => !idBovino || String(item.IdBovino) === String(idBovino)));
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los registros de reproducción');
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
          style={[styles.filterBtn, filterMode === 'prenadas' && styles.filterBtnActive]}
          onPress={() => setFilterMode('prenadas')}
        >
          <Text style={[styles.filterText, filterMode === 'prenadas' && styles.filterTextActive]}>
            🤰 Preñadas Confirmadas
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 40 }} />
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
              colors={[Colors.PRIMARY]}
            />
          }
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const resColor = RESULT_COLORS[item.Resultado] || Colors.WARNING;

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
                  <View style={[styles.badge, { backgroundColor: resColor + '20' }]}>
                    <Text style={[styles.badgeText, { color: resColor }]}>
                      {item.Resultado || 'Pendiente'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => handleDelete(item.IdReproduccion)}
                  >
                    <Ionicons name="trash-outline" size={20} color={Colors.DANGER} />
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
                      <Text style={[styles.dateVal, { color: Colors.PRIMARY, fontWeight: 'bold' }]}>
                        {formatDate(item.FechaProbableParto)}
                      </Text>
                    </View>
                  )}
                </View>

                {item.Observaciones ? (
                  <Text style={styles.obsText}>Notas: {item.Observaciones}</Text>
                ) : null}
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ReproduccionForm', { idBovino })}
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
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bovinoTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.TEXT },
  subText: { fontSize: 13, color: Colors.TEXT_LIGHT, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
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

