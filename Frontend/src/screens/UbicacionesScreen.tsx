import type { Ubicacion } from '../types/models';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../utils/constants';
import { UbicacionesDB } from '../database/UbicacionesDB';
import EmptyState from '../components/EmptyState';

export default function UbicacionesScreen() {
  const navigation = useNavigation();
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
    }, [loadData])
  );

  const handleDelete = (idUbicacion: number) => {
    Alert.alert(
      'Desactivar Ubicación',
      '¿Desea dar de baja esta ubicación?',
      [
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
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 40 }} />
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
              colors={[Colors.PRIMARY]}
            />
          }
          contentContainerStyle={{ padding: 16 }}
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
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => navigation.navigate('UbicacionForm', { ubicacion: item })}
                >
                  <Ionicons name="create-outline" size={22} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.IdUbicacion)}>
                  <Ionicons name="trash-outline" size={22} color={Colors.DANGER} />
                </TouchableOpacity>
              </View>

              {item.Descripcion ? (
                <Text style={styles.descText}>{item.Descripcion}</Text>
              ) : null}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('UbicacionForm')}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
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
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.TEXT },
  tipoText: { fontSize: 13, color: Colors.TEXT_LIGHT, marginTop: 2 },
  descText: { fontSize: 13, color: Colors.TEXT, marginTop: 10, paddingLeft: 4 },
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

