import type { Peso } from '../types/models';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../utils/constants';
import EmptyState from '../components/EmptyState';
import { PesosDB } from '../database/PesosDB';

export default function PesosScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Pesos'>>();
  const IdBovino = route.params?.IdBovino || route.params?.idBovino || route.params?.id;
  const codigo = route.params?.codigo || '';
  const [pesos, setPesos] = useState<Peso[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPesos = useCallback(async () => {
    try {
      const data = IdBovino ? await PesosDB.getByBovino(IdBovino) : [];
      setPesos(data);
    } catch (e) {
      console.log('Error loading pesos:', e);
    }
  }, [IdBovino]);

  useFocusEffect(
    useCallback(() => {
      loadPesos();
    }, [loadPesos])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPesos();
    setRefreshing(false);
  };

  const latestPeso = pesos.length > 0 ? pesos[0] : null;

  const renderPeso = ({ item }: { item: Peso }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Ionicons name="scale" size={22} color={COLORS.SECONDARY} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardDate}>{item.FechaPeso}</Text>
        {item.Observaciones ? (
          <Text style={styles.cardObs} numberOfLines={1}>{item.Observaciones}</Text>
        ) : null}
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardWeight}>{item.Peso} kg</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Latest Weight Header */}
      {latestPeso && (
        <View style={styles.latestCard}>
          <Text style={styles.latestLabel}>Último Peso Registrado</Text>
          <Text style={styles.latestValue}>{latestPeso.Peso} kg</Text>
          <Text style={styles.latestDate}>{latestPeso.FechaPeso}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Historial de Pesos {codigo ? `- ${codigo}` : ''}
      </Text>

      <FlatList
        data={pesos}
        keyExtractor={(item) => String(item.IdPeso)}
        renderItem={renderPeso}
        contentContainerStyle={pesos.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY]} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="scale"
            title="Sin registros de peso"
            message="Registra el primer peso de este bovino"
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PesoForm', { IdBovino })}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.WHITE} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  latestCard: {
    backgroundColor: COLORS.PRIMARY,
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  latestLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  latestValue: {
    color: COLORS.WHITE,
    fontSize: 42,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  latestDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardLeft: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.SECONDARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  cardObs: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  cardRight: {},
  cardWeight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});

