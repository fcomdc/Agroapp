import type { NfcTag, Bovino } from '../types/models';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { NfcDB } from '../database/NfcDB';
import { BovinosDB } from '../database/BovinosDB';
import EmptyState from '../components/EmptyState';

export default function NfcScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Nfc'>>();
  const idBovino = route.params?.idBovino || route.params?.IdBovino;

  const [tags, setTags] = useState<NfcTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [bovino, setBovino] = useState<Bovino | null>(null);

  // Form states
  const [uid, setUid] = useState('');
  const [tipoTag, setTipoTag] = useState('Arete Oreja');

  const loadData = useCallback(async () => {
    try {
      if (idBovino) {
        const b = await BovinosDB.getById(idBovino);
        setBovino(b);
        const data = await NfcDB.getByBovino(idBovino);
        setTags(data || []);
      } else {
        const data = await NfcDB.getAll();
        setTags(data || []);
      }
    } catch (error) {
      console.error('Error cargando tags NFC:', error);
      Alert.alert('Error', 'No se pudieron cargar los registros NFC');
    } finally {
      setLoading(false);
    }
  }, [idBovino]);

  useFocusEffect(useCallback(() => {
    loadData();
  }, [loadData]));

  const handleSave = async () => {
    if (!uid.trim()) {
      Alert.alert('Validación', 'El código UID del NFC es obligatorio');
      return;
    }
    if (!idBovino) {
      Alert.alert('Aviso', 'Debe seleccionar un bovino para asociar el tag NFC');
      return;
    }

    try {
      await NfcDB.create({
        IdBovino: idBovino,
        UID_NFC: uid.trim(),
        TipoTag: tipoTag,
        Estado: 1,
      });
      setModalVisible(false);
      setUid('');
      Alert.alert('Éxito', 'Tag NFC registrado correctamente');
      loadData();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el tag NFC. Es posible que el UID ya exista.');
    }
  };

  const handleDeactivate = (idNFC: number) => {
    Alert.alert(
      'Desactivar Tag',
      '¿Está seguro de desactivar este identificador NFC?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar',
          style: 'destructive',
          onPress: async () => {
            try {
              await NfcDB.remove(idNFC);
              loadData();
            } catch {
              Alert.alert('Error', 'No se pudo desactivar el tag');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {bovino && (
        <View style={styles.bovinoHeader}>
          <Ionicons name="pricetag-outline" size={24} color={Colors.PRIMARY} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.bovinoTitle}>{bovino.Nombre || 'Sin nombre'}</Text>
            <Text style={styles.bovinoSubtitle}>Código: {bovino.Codigo}</Text>
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 40 }} />
      ) : tags.length === 0 ? (
        <EmptyState
          icon="radio-outline"
          title="Sin Identificadores NFC"
          description={idBovino ? 'Este bovino no tiene aretes o chips NFC asignados.' : 'No hay tags registrados.'}
        />
      ) : (
        <FlatList
          data={tags}
          keyExtractor={(item) => item.IdNFC.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="hardware-chip-outline" size={24} color={Colors.PRIMARY} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.uidText}>{item.UID_NFC}</Text>
                  <Text style={styles.tipoText}>{item.TipoTag || 'Arete Estándar'}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeactivate(item.IdNFC)}>
                  <Ionicons name="trash-outline" size={20} color={Colors.DANGER} />
                </TouchableOpacity>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.dateText}>Asignado: {formatDate(item.FechaAsignacion)}</Text>
                <View style={[styles.badge, { backgroundColor: item.Estado ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Text style={{ color: item.Estado ? Colors.PRIMARY : Colors.DANGER, fontSize: 12, fontWeight: 'bold' }}>
                    {item.Estado ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {idBovino && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Asignar Tag NFC</Text>
            <Text style={styles.label}>UID / Código del Chip *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 04:A2:3B:5C:88"
              value={uid}
              onChangeText={setUid}
            />

            <Text style={styles.label}>Tipo de Tag</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Arete Oreja, Microchip, Collar"
              value={tipoTag}
              onChangeText={setTipoTag}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnSave]}
                onPress={handleSave}
              >
                <Text style={styles.btnSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  bovinoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bovinoTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.TEXT },
  bovinoSubtitle: { fontSize: 14, color: Colors.TEXT_LIGHT },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  uidText: { fontSize: 16, fontWeight: 'bold', color: Colors.TEXT },
  tipoText: { fontSize: 13, color: Colors.TEXT_LIGHT },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  dateText: { fontSize: 12, color: Colors.TEXT_LIGHT },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.PRIMARY, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.TEXT, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  btn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, marginLeft: 10 },
  btnCancel: { backgroundColor: '#ECEFF1' },
  btnCancelText: { color: Colors.TEXT, fontWeight: '600' },
  btnSave: { backgroundColor: Colors.PRIMARY },
  btnSaveText: { color: '#FFF', fontWeight: 'bold' },
});

