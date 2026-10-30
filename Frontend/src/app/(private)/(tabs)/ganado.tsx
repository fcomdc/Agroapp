import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import Screen from '../../../components/Screen';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BovinosDB } from '../../../database/repositories/BovinosDB';
import type { Bovino } from '../../../types/models';
import { useHerdFilters } from '../../../store/farmStore';
import { useAuthStore } from '../../../store/authStore';
import { palette, ui } from '../../../theme/tokens';
import CattleCard from '../../../components/CattleCard';
import SearchBar from '../../../components/SearchBar';
import EmptyState from '../../../components/EmptyState';
import ScreenHeading from '../../../components/ScreenHeading';

export default function BovinosListScreen() {
  const { query, status, setQuery, setStatus } = useHerdFilters();
  const isAdmin = useAuthStore((s) => s.user?.Rol === 'Administrador');
  const [animals, setAnimals] = useState<Bovino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      setAnimals(await BovinosDB.getAll());
      setError('');
    } catch {
      setError('No se pudo cargar el ganado. Desliza para volver a intentar.');
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  const filtered = useMemo(
    () =>
      animals.filter(
        (b) =>
          (status === 'Todos' || b.Estado === status) &&
          `${b.Codigo} ${b.Nombre || ''} ${b.Raza || ''}`
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase().trim()),
      ),
    [animals, query, status],
  );
  const activeCount = animals.filter((b) => b.Estado === 'Activo').length;
  const filters = [
    ['Activo', 'Activos'],
    ['Todos', 'Todos'],
    ['Vendido', 'Vendidos'],
    ['Trasladado', 'Trasladados'],
    ['Fallecido', 'Fallecidos'],
  ];
  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(b) => String(b.IdBovino)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingBottom: 30,
          flexGrow: 1,
          width: '100%',
          maxWidth: 880,
          alignSelf: 'center',
        }}
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: 22 }}>
            <CattleCard bovino={item} index={index} />
          </View>
        )}
        ListHeaderComponent={
          <>
            <View style={{ paddingHorizontal: 22, paddingTop: 24, gap: 18 }}>
              <ScreenHeading
                eyebrow="REGISTRO DEL HATO"
                title="Nuestro ganado"
                subtitle={`${activeCount} ${activeCount === 1 ? 'activo' : 'activos'} · ${animals.length} ${animals.length === 1 ? 'ficha' : 'fichas'} en este teléfono`}
                action={
                  isAdmin ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Registrar bovino"
                      onPress={() => router.push('/bovinos/crear')}
                      style={s.add}
                    >
                      <Ionicons name="add" size={25} color={palette.paper} />
                    </Pressable>
                  ) : undefined
                }
              />
            </View>
            <View style={{ width: '100%', maxWidth: 900, alignSelf: 'center' }}>
              <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Nombre, código o raza…"
              />
            </View>
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 22,
                  gap: 8,
                  paddingBottom: 10,
                }}
              >
                {filters.map(([value, label]) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: status === value }}
                    key={value}
                    onPress={() => setStatus(value)}
                    style={[s.chip, status === value && s.selected]}
                  >
                    <Text
                      style={[
                        s.chipText,
                        status === value && { color: palette.paper },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            {error ? (
              <Text style={[ui.error, { paddingHorizontal: 22 }]}>{error}</Text>
            ) : null}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true);
              void load();
            }}
            tintColor={palette.green}
          />
        }
        ListEmptyComponent={
          loading ? undefined : (
            <EmptyState
              icon="leaf-outline"
              title={
                query ? 'Sin coincidencias' : 'No hay fichas en este grupo'
              }
              description={
                query
                  ? 'Prueba otro nombre, código o raza.'
                  : 'Cambia el filtro o registra un bovino.'
              }
              iconSize={45}
            />
          )
        }
      />
    </Screen>
  );
}
const s = StyleSheet.create({
  add: {
    backgroundColor: palette.forest,
    borderRadius: 15,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 17,
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: palette.pale,
  },
  selected: { backgroundColor: palette.forest },
  chipText: { fontSize: 12, fontWeight: '600', color: palette.green },
});
