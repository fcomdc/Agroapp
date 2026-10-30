import { palette } from '../../../theme/tokens';
import Screen from '../../../components/Screen';
import { useAuthStore } from '../../../store/authStore';
import type { Ubicacion } from '../../../types/models';
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

import { UbicacionesDB } from '../../../database/repositories/UbicacionesDB';
import EmptyState from '../../../components/EmptyState';

export default function UbicacionesScreen() {
  const router = useRouter();
  const isAdmin = useAuthStore((s) => s.user?.Rol === 'Administrador');
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UbicacionesDB.getActivas();
      setUbicaciones(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar las ubicaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleDelete = (idUbicacion: number) => {
    if (!isAdmin) return;
    Alert.alert('Desactivar Ubicación', '¿Desea dar de baja esta ubicación?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Desactivar',
        style: 'destructive',
        onPress: async () => {
          try {
            await UbicacionesDB.remove(idUbicacion);
            loadData();
          } catch {
            Alert.alert('Error', 'No se pudo desactivar');
          }
        },
      },
    ]);
  };

  return (
    <Screen style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={palette.forest}
          style={{ marginTop: 40 }}
        />
      ) : ubicaciones.length === 0 ? (
        <EmptyState
          icon="location-outline"
          title="Sin Ubicaciones"
          description="Agregue potreros, corrales, establos o sectores para organizar sus bovinos."
        />
      ) : (
        <FlatList
          data={ubicaciones}
          keyExtractor={(item) => item.IdUbicacion.toString()}
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
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="map-outline" size={20} color="#FFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.title}>{item.Nombre}</Text>
                  <Text style={styles.tipoText}>{item.Tipo}</Text>
                </View>
                {isAdmin && (
                  <>
                    <TouchableOpacity
                      style={{ marginRight: 10 }}
                      onPress={() =>
                        router.push({
                          pathname: '/ubicaciones/editar',
                          params: { id: item.IdUbicacion },
                        })
                      }
                    >
                      <Ionicons
                        name="create-outline"
                        size={22}
                        color={palette.forest}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.IdUbicacion)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color={palette.danger}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {item.Descripcion ? (
                <Text style={styles.descText}>{item.Descripcion}</Text>
              ) : null}
            </View>
          )}
        />
      )}

      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/ubicaciones/crear')}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.forest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: palette.ink },
  tipoText: { fontSize: 13, color: palette.muted, marginTop: 2 },
  descText: { fontSize: 13, color: palette.ink, marginTop: 10, paddingLeft: 4 },
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
