import FormScreen from '../components/FormScreen';
import { useRecordParams } from '../hooks/useRecordParams';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../utils/constants';
import { UbicacionesDB } from '../database/repositories/UbicacionesDB';

const TIPOS_UBICACION = ['Potrero', 'Corral', 'Establo', 'Maternidad', 'Enfermería', 'Lote Pastura'];

export default function UbicacionFormScreen() {
  const router = useRouter();
  const params = useRecordParams();
  const ubicacionToEdit = params.id > 0;

  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Potrero');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    UbicacionesDB.getById(params.id).then(record => {
      if (record) { setNombre(record.Nombre); setTipo(record.Tipo || 'Potrero'); setDescripcion(record.Descripcion || ''); }
    }).catch(() => Alert.alert('Error', 'No se pudo cargar la ubicación.'));
  }, [params.id]);

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Validación', 'El nombre de la ubicación es obligatorio');
      return;
    }

    try {
      setLoading(true);
      if (ubicacionToEdit) {
        await UbicacionesDB.update(params.id, {
          Nombre: nombre.trim(),
          Tipo: tipo,
          Descripcion: descripcion.trim() || null,
        });
        router.back();
      } else {
        await UbicacionesDB.create({
          Nombre: nombre.trim(),
          Tipo: tipo,
          Descripcion: descripcion.trim() || null,
          Estado: 1,
        });
        router.back();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar la ubicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen style={styles.container} contentContainerStyle={{ padding: 16 }}>
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
    </FormScreen>
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
  textArea: { minHeight: 80, textAlignVertical: 'top' },
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

