import type { Bovino } from '../types/models';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import React, { useState, useEffect } from 'react';
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
import { Colors, Gravedad } from '../utils/constants';
import { ReportesSaludDB } from '../database/ReportesSaludDB';
import { BovinosDB } from '../database/BovinosDB';
import { useAuth } from '../context/AuthContext';

export default function ReporteSaludFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ReporteSaludForm'>>();
  const { user } = useAuth();

  const idBovinoParam = route.params?.idBovino || route.params?.IdBovino;

  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [selectedBovinoId, setSelectedBovinoId] = useState<number | null>(idBovinoParam || null);
  const [sintomas, setSintomas] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [gravedad, setGravedad] = useState('Media');
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
    if (!sintomas.trim()) {
      Alert.alert('Validación', 'Por favor describa los síntomas observados');
      return;
    }

    try {
      setLoading(true);
      await ReportesSaludDB.create({
        IdBovino: selectedBovinoId,
        IdUsuario: user?.IdUsuario || user?.id || 1,
        Sintomas: sintomas.trim(),
        Observaciones: observaciones.trim() || null,
        Gravedad: gravedad,
        Estado: 'Pendiente',
      });

      Alert.alert('Éxito', 'Reporte de salud registrado para revisión veterinaria', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar el reporte de salud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Bovino Afectado *</Text>
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

      <Text style={styles.label}>Nivel de Gravedad *</Text>
      <View style={styles.gravedadRow}>
        {Gravedad.map((g) => {
          const isSelected = gravedad === g;
          let activeColor = Colors.PRIMARY;
          if (g === 'Media') activeColor = '#FF9800';
          if (g === 'Alta') activeColor = '#F44336';
          if (g === 'Critica') activeColor = '#B71C1C';

          return (
            <TouchableOpacity
              key={g}
              style={[
                styles.gravBtn,
                isSelected && { backgroundColor: activeColor, borderColor: activeColor },
              ]}
              onPress={() => setGravedad(g)}
            >
              <Text style={[styles.gravText, isSelected && { color: '#FFF' }]}>{g}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Síntomas Observados *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ej. Fiebre, renguera en pata derecha, falta de apetito, secreción nasal..."
        multiline
        numberOfLines={4}
        value={sintomas}
        onChangeText={setSintomas}
      />

      <Text style={styles.label}>Observaciones Adicionales</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Detalles del corral, cambios recientes en pasturas, etc."
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
          <Text style={styles.submitBtnText}>Emitir Reporte Médico</Text>
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
  label: { fontSize: 14, fontWeight: '600', color: Colors.TEXT, marginBottom: 6, marginTop: 4 },
  gravedadRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  gravBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  gravText: { fontSize: 13, fontWeight: 'bold', color: Colors.TEXT_LIGHT },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  submitBtn: {
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

