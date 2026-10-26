import type { Usuario } from '../types/models';
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
import { formatDate } from '../utils/helpers';
import { UsuariosDB } from '../database/UsuariosDB';
import EmptyState from '../components/EmptyState';

const ROL_COLORS: Record<string, string> = {
  Administrador: '#D32F2F',
  Veterinario: '#1976D2',
  Trabajador: '#388E3C',
};

export default function UsuariosScreen() {
  const navigation = useNavigation();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UsuariosDB.getAll();
      setUsuarios(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
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

  const handleDeactivate = (idUsuario: number, usuarioName: string) => {
    if (usuarioName === 'admin') {
      Alert.alert('Aviso', 'El usuario admin principal no se puede desactivar.');
      return;
    }

    Alert.alert(
      'Desactivar Usuario',
      `¿Desea desactivar la cuenta de ${usuarioName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar',
          style: 'destructive',
          onPress: async () => {
            try {
              await UsuariosDB.remove(idUsuario);
              loadData();
            } catch {
              Alert.alert('Error', 'No se pudo desactivar el usuario');
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
      ) : usuarios.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="Sin Usuarios"
          description="Cree cuentas para el personal de su explotación agropecuaria."
        />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.IdUsuario.toString()}
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
            const rolColor = ROL_COLORS[item.Rol] || Colors.PRIMARY;
            const isActivo = item.Estado === 1;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.avatarCircle, { backgroundColor: rolColor + '20' }]}>
                    <Ionicons name="person" size={20} color={rolColor} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.nameText}>{item.NombreCompleto}</Text>
                    <Text style={styles.userText}>@{item.Usuario}</Text>
                  </View>
                  <View style={[styles.rolBadge, { backgroundColor: rolColor + '18' }]}>
                    <Text style={[styles.rolText, { color: rolColor }]}>{item.Rol}</Text>
                  </View>
                </View>

                <View style={styles.footerRow}>
                  <Text style={styles.dateText}>Registrado: {formatDate(item.FechaRegistro)}</Text>
                  {item.Usuario !== 'admin' && (
                    <TouchableOpacity
                      onPress={() => handleDeactivate(item.IdUsuario, item.Usuario)}
                    >
                      <Ionicons
                        name={isActivo ? 'person-remove-outline' : 'trash-outline'}
                        size={18}
                        color={Colors.DANGER}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('UsuarioForm')}
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
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: { fontSize: 16, fontWeight: 'bold', color: Colors.TEXT },
  userText: { fontSize: 13, color: Colors.TEXT_LIGHT, marginTop: 1 },
  rolBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  rolText: { fontSize: 12, fontWeight: 'bold' },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  dateText: { fontSize: 12, color: Colors.TEXT_LIGHT },
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

