import type { Bovino } from '../types/models';
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
import { useNavigation } from '@react-navigation/native';
import { Colors, TipoParto } from '../utils/constants';
import { getCurrentDate, isValidDate } from '../utils/helpers';
import { PartosDB } from '../database/PartosDB';
import { CriasPartoDB } from '../database/CriasPartoDB';
import { BovinosDB } from '../database/BovinosDB';
import { useAuth } from '../context/AuthContext';

export default function PartoFormScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [madres, setMadres] = useState<Bovino[]>([]);
  const [selectedMadreId, setSelectedMadreId] = useState<number | null>(null);
  const [fechaParto, setFechaParto] = useState(getCurrentDate());
  const [tipoParto, setTipoParto] = useState('Normal');
  const [cantidadCrias, setCantidadCrias] = useState('1');
  const [observaciones, setObservaciones] = useState('');

  // Datos básicos de la cría
  const [registrarCria, setRegistrarCria] = useState(true);
  const [nombreCria, setNombreCria] = useState('');
  const [sexoCria, setSexoCria] = useState<'M' | 'H'>('H');
  const [pesoNacimiento, setPesoNacimiento] = useState('');
  const [estadoCria, setEstadoCria] = useState('Vivo y Saludable');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMadres() {
      try {
        const list = await BovinosDB.getAll();
        const f = list.filter((b) => b.Sexo === 'H' && b.Estado === 'Activo');
        setMadres(f);
        if (f.length > 0) setSelectedMadreId(f[0].IdBovino);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMadres();
  }, []);

  const handleSave = async () => {
    if (!selectedMadreId) {
      Alert.alert('Validación', 'Debe seleccionar la madre del parto');
      return;
    }
    if (!fechaParto.trim()) {
      Alert.alert('Validación', 'La fecha de parto es requerida (YYYY-MM-DD)');
      return;
    }

    const cant = Number(cantidadCrias);
    if (!Number.isInteger(cant) || cant < 1) {
      Alert.alert('Validación', 'La cantidad de crías debe ser al menos 1');
      return;
    }

    if (registrarCria && pesoNacimiento && (!Number.isFinite(Number(pesoNacimiento)) || Number(pesoNacimiento) <= 0)) {
      Alert.alert('Validación', 'El peso de nacimiento debe ser mayor a cero');
      return;
    }
    if ((fechaParto.trim() && !isValidDate(fechaParto.trim()))) {
      Alert.alert('Validación', 'Ingrese fechas válidas en formato YYYY-MM-DD');
      return;
    }
    try {
      setLoading(true);
      const idParto = await PartosDB.create({
        IdMadre: selectedMadreId,
        FechaParto: fechaParto.trim(),
        TipoParto: tipoParto,
        CantidadCrías: cant,
        Observaciones: observaciones.trim() || null,
        IdUsuario: user?.IdUsuario || user?.id || null,
      });

      // Si se desea registrar la cría de inmediato
      if (registrarCria && idParto) {
        await CriasPartoDB.create({
          IdParto: idParto,
          Sexo: sexoCria,
          Nombre: nombreCria.trim() || null,
          PesoNacimiento: pesoNacimiento ? parseFloat(pesoNacimiento) : null,
          EstadoCria: estadoCria,
          Observaciones: 'Registrado al momento del parto',
        });
      }

      Alert.alert('Éxito', 'Parto y cría registrados con éxito', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar el registro del parto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Madre *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerRow}>
        {madres.map((b) => {
          const isSelected = selectedMadreId === b.IdBovino;
          return (
            <TouchableOpacity
              key={b.IdBovino}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => setSelectedMadreId(b.IdBovino)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {b.Codigo} {b.Nombre ? `(${b.Nombre})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Fecha del Parto (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={fechaParto}
        onChangeText={setFechaParto}
      />

      <Text style={styles.label}>Tipo de Alumbramiento *</Text>
      <View style={styles.tiposRow}>
        {TipoParto.map((tp) => {
          const isSelected = tipoParto === tp;
          return (
            <TouchableOpacity
              key={tp}
              style={[styles.tipoChip, isSelected && styles.tipoChipActive]}
              onPress={() => setTipoParto(tp)}
            >
              <Text style={[styles.tipoChipText, isSelected && styles.tipoChipTextActive]}>
                {tp}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Cantidad de Crías *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cantidadCrias}
        onChangeText={setCantidadCrias}
      />

      <Text style={styles.label}>Observaciones del Parto</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Condiciones del alumbramiento, retención de placenta, etc."
        multiline
        numberOfLines={3}
        value={observaciones}
        onChangeText={setObservaciones}
      />

      {/* Tarjeta para registrar cría */}
      <View style={styles.criaCard}>
        <View style={styles.criaHeader}>
          <Text style={styles.criaTitle}>Registrar Datos de la Cría</Text>
          <TouchableOpacity onPress={() => setRegistrarCria(!registrarCria)}>
            <Text style={{ color: Colors.PRIMARY, fontWeight: 'bold' }}>
              {registrarCria ? 'Omitir' : 'Incluir'}
            </Text>
          </TouchableOpacity>
        </View>

        {registrarCria && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Nombre o Apodo de la Cría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Ternero Lucero"
              value={nombreCria}
              onChangeText={setNombreCria}
            />

            <Text style={styles.label}>Sexo de la Cría *</Text>
            <View style={styles.sexRow}>
              <TouchableOpacity
                style={[styles.sexBtn, sexoCria === 'H' && styles.sexBtnActive]}
                onPress={() => setSexoCria('H')}
              >
                <Text style={[styles.sexText, sexoCria === 'H' && styles.sexTextActive]}>
                  Hembra (H)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sexBtn, sexoCria === 'M' && styles.sexBtnActive]}
                onPress={() => setSexoCria('M')}
              >
                <Text style={[styles.sexText, sexoCria === 'M' && styles.sexTextActive]}>
                  Macho (M)
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Peso al Nacer (Kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 32.5"
              keyboardType="decimal-pad"
              value={pesoNacimiento}
              onChangeText={setPesoNacimiento}
            />

            <Text style={styles.label}>Estado de la Cría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Vivo y Saludable, Débil, etc."
              value={estadoCria}
              onChangeText={setEstadoCria}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.btnDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitBtnText}>Guardar Parto</Text>
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
  tiposRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
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
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
  },
  textArea: { height: 75, textAlignVertical: 'top' },
  criaCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  criaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  criaTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.PRIMARY },
  sexRow: { flexDirection: 'row', marginBottom: 12 },
  sexBtn: {
    flex: 1,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#FFF',
  },
  sexBtnActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  sexText: { fontSize: 13, fontWeight: '600', color: Colors.TEXT },
  sexTextActive: { color: '#FFF' },
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

