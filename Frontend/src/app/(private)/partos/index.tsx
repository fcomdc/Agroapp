import { palette } from '../../../theme/tokens';
import Screen from '../../../components/Screen';
import type { Parto } from '../../../types/models';
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
import { PartosDB } from '../../../database/repositories/PartosDB';
import EmptyState from '../../../components/EmptyState';

export default function PartosScreen() {
  const router = useRouter();
  const [partos, setPartos] = useState<Parto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PartosDB.getAll();
      setPartos(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los registros de partos');
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

  const handleDelete = (idParto: number) => {
    Alert.alert(
      'Eliminar Registro',
      '¿Desea eliminar este registro de parto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await PartosDB.remove(idParto);
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
      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={palette.forest}
          style={{ marginTop: 40 }}
        />
      ) : partos.length === 0 ? (
        <EmptyState
          icon="leaf-outline"
          title="Sin Registros de Partos"
          description="Registre los nacimientos y alumbramientos ocurridos en el hato."
        />
      ) : (
        <FlatList
          data={partos}
          keyExtractor={(item) => item.IdParto.toString()}
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
                  <Ionicons name="sparkles" size={18} color="#FFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.bovinoTitle}>
                    Madre:{' '}
                    {item.NombreMadre
                      ? `${item.NombreMadre} (${item.CodigoMadre})`
                      : item.CodigoMadre}
                  </Text>
                  <Text style={styles.subText}>
                    Tipo: {item.TipoParto || 'Normal'} • Crías:{' '}
                    {item.CantidadCrías || 1}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.IdParto)}>
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={palette.danger}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.dateText}>
                  Fecha Parto: {formatDate(item.FechaParto)}
                </Text>
                <Text style={styles.userText}>
                  Atendió: {item.NombreUsuario || 'Personal'}
                </Text>
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
        onPress={() => router.push('/partos/crear')}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#28634B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bovinoTitle: { fontSize: 16, fontWeight: 'bold', color: palette.ink },
  subText: { fontSize: 13, color: palette.muted, marginTop: 2 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F6F5EF',
  },
  dateText: { fontSize: 12, color: palette.forest, fontWeight: '600' },
  userText: { fontSize: 12, color: palette.muted },
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
