import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../utils/constants';
import { UbicacionesDB } from '../database/UbicacionesDB';

const TIPOS_UBICACION = ['Potrero', 'Corral', 'Establo', 'Maternidad', 'Enfermería', 'Lote Pastura'];

export default function UbicacionFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'UbicacionForm'>>();
  const ubicacionToEdit = route.params?.ubicacion;

  const [nombre, setNombre] = useState(ubicacionToEdit?.Nombre || '');
  const [tipo, setTipo] = useState(ubicacionToEdit?.Tipo || 'Potrero');
  const [descripcion, setDescripcion] = useState(ubicacionToEdit?.Descripcion || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Validación', 'El nombre de la ubicación es obligatorio');
      return;
    }

    try {
      setLoading(true);
      if (ubicacionToEdit) {
        await UbicacionesDB.update(ubicacionToEdit.IdUbicacion, {
          Nombre: nombre.trim(),
          Tipo: tipo,
          Descripcion: descripcion.trim() || null,
        });
        Alert.alert('Éxito', 'Ubicación actualizada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await UbicacionesDB.create({
          Nombre: nombre.trim(),
          Tipo: tipo,
          Descripcion: descripcion.trim() || null,
          Estado: 1,
        });
        Alert.alert('Éxito', 'Ubicación registrada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar la ubicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>Nombre de la Ubicación / Lote *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Potrero Norte #3, Corral de Ordeño"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Tipo de Instalación *</Text>
      <View style={styles.tiposRow}>
        {TIPOS_UBICACION.map((t) => {
          const isSelected = tipo === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.tipoChip, isSelected && styles.tipoChipActive]}
              onPress={() => setTipo(t)}
            >
              <Text style={[styles.tipoChipText, isSelected && styles.tipoChipTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Descripción / Capacidad / Notas</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ej. Capacidad 40 cabezas, cuenta con bebedero automático y sombra natural..."
        multiline
        numberOfLines={3}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.btnDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitBtnText}>
            {ubicacionToEdit ? 'Actualizar Ubicación' : 'Guardar Ubicación'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  label: { fontSize: 14, fontWeight: '600', color: Colors.TEXT, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  tiposRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  tipoChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    marginRight: 6,
    marginBottom: 8,
  },
  tipoChipActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  tipoChipText: { fontSize: 13, color: Colors.TEXT },
  tipoChipTextActive: { color: '#FFF', fontWeight: 'bold' },
  submitBtn: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

