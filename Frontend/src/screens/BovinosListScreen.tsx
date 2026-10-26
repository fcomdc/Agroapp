import type { Bovino } from '../types/models';
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../utils/constants';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { BovinosDB } from '../database/BovinosDB';

const STATUS_COLORS: Record<string, string> = {
  Activo: COLORS.PRIMARY,
  Vendido: COLORS.INFO,
  Fallecido: COLORS.DANGER,
  Trasladado: COLORS.WARNING,
};

export default function BovinosListScreen() {
  const navigation = useNavigation();
  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadBovinos = useCallback(async () => {
    try {
      const data = await BovinosDB.getAll();
      setBovinos(data);
    } catch (e) {
      console.log('Error loading bovinos:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBovinos();
    }, [loadBovinos])
  );

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return bovinos.filter(b => !query || b.Codigo?.toLowerCase().includes(query) || b.Nombre?.toLowerCase().includes(query));
  }, [bovinos, searchQuery]);
  const handleSearch = setSearchQuery;

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBovinos();
    setRefreshing(false);
  };

  const renderBovino = ({ item }: { item: Bovino }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BovinoDetail', { id: item.IdBovino })}
      activeOpacity={0.7}
    >
      <View style={styles.cardIcon}>
        <Ionicons name="paw" size={28} color={COLORS.PRIMARY} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.Codigo}</Text>
        {item.Nombre ? <Text style={styles.cardSubtitle}>{item.Nombre}</Text> : null}
        <Text style={styles.cardRaza}>{item.Raza || 'Sin raza'}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: (STATUS_COLORS[item.Estado] || COLORS.TEXT_LIGHT) + '20' },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: STATUS_COLORS[item.Estado] || COLORS.TEXT_LIGHT },
          ]}
        >
          {item.Estado || 'Activo'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar por código o nombre..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.IdBovino)}
        renderItem={renderBovino}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY]} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="paw"
            title="Sin bovinos registrados"
            message="Agrega tu primer bovino pulsando el botón +"
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('BovinoForm')}
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
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  cardRaza: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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

