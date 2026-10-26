import type { Bovino } from '../types/models';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import React, { useState, useEffect } from 'react';
import {
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
import { getCurrentDate, isValidDate } from '../utils/helpers';
import { VacunacionesDB } from '../database/VacunacionesDB';
import { BovinosDB } from '../database/BovinosDB';
import { useAuth } from '../context/AuthContext';

export default function VacunacionFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'VacunacionForm'>>();
  const { user } = useAuth();

  const idBovinoParam = route.params?.idBovino || route.params?.IdBovino;

  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [selectedBovinoId, setSelectedBovinoId] = useState<number | null>(idBovinoParam || null);
  const [fechaAplicacion, setFechaAplicacion] = useState(getCurrentDate());
  const [proximaAplicacion, setProximaAplicacion] = useState('');
  const [dosis, setDosis] = useState('');
  const [lote, setLote] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBovinos() {
      try {
        const list = await BovinosDB.getAll();
        const active = list.filter((b) => b.Estado === 'Activo');
        setBovinos(active);
        if (!selectedBovinoId && active.length > 0) {
          setSelectedBovinoId(active[0].IdBovino);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchBovinos();
  }, [selectedBovinoId]);

  const handleSave = async () => {
    if (!selectedBovinoId) {
      Alert.alert('Validación', 'Debe seleccionar un bovino');
      return;
    }
    if (!fechaAplicacion.trim()) {
      Alert.alert('Validación', 'La fecha de aplicación es requerida (YYYY-MM-DD)');
      return;
    }
    if (!dosis.trim()) {
      Alert.alert('Validación', 'Debe especificar el nombre del medicamento o dosis');
      return;
    }

    if ((fechaAplicacion.trim() && !isValidDate(fechaAplicacion.trim())) || (proximaAplicacion.trim() && !isValidDate(proximaAplicacion.trim()))) {
      Alert.alert('Validación', 'Ingrese fechas válidas en formato YYYY-MM-DD');
      return;
    }
    try {
      setLoading(true);
      await VacunacionesDB.create({
        IdBovino: selectedBovinoId,
        FechaAplicacion: fechaAplicacion.trim(),
        ProximaAplicacion: proximaAplicacion.trim() || null,
        Dosis: dosis.trim(),
        Lote: lote.trim() || null,
        IdUsuario: user?.IdUsuario || user?.id || null,
        Observaciones: observaciones.trim() || null,
      });

      Alert.alert('Éxito', 'Vacuna registrada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar la vacunación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Bovino *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerRow}>
        {bovinos.map((b) => {
          const isSelected = selectedBovinoId === b.IdBovino;
          return (
            <TouchableOpacity
              key={b.IdBovino}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => setSelectedBovinoId(b.IdBovino)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {b.Codigo} {b.Nombre ? `(${b.Nombre})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Medicamento / Vacuna / Dosis *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Aftosa 5ml, Desparasitante Ivermectina"
        value={dosis}
        onChangeText={setDosis}
      />

      <Text style={styles.label}>Lote del Frasco</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. LOT-2026-X99"
        value={lote}
        onChangeText={setLote}
      />

      <Text style={styles.label}>Fecha de Aplicación (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={fechaAplicacion}
        onChangeText={setFechaAplicacion}
      />

      <Text style={styles.label}>Próxima Aplicación / Refuerzo (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="Opcional: YYYY-MM-DD"
        value={proximaAplicacion}
        onChangeText={setProximaAplicacion}
      />

      <Text style={styles.label}>Observaciones / Reacciones</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notas sobre la aplicación o estado del animal..."
        multiline
        numberOfLines={3}
        value={observaciones}
        onChangeText={setObservaciones}
      />

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.btnDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitBtnText}>Guardar Vacunación</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.TEXT, marginBottom: 8 },
  pickerRow: { flexDirection: 'row', marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  chipText: { fontSize: 13, color: Colors.TEXT },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: '600', color: Colors.TEXT, marginBottom: 6 },
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
  submitBtn: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

