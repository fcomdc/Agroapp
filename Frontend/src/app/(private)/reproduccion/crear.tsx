import { palette } from '../../../theme/tokens';
import FormScreen from '../../../components/FormScreen';
import { useRecordParams } from '../../../hooks/useRecordParams';
import type { Bovino } from '../../../types/models';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  TipoReproduccion,
  ResultadoReproduccion,
} from '../../../utils/constants';
import {
  getCurrentDate,
  isValidDate,
  parseLocalDate,
} from '../../../utils/helpers';
import { ReproduccionesDB } from '../../../database/repositories/ReproduccionesDB';
import { BovinosDB } from '../../../database/repositories/BovinosDB';
import { useAuthStore } from '../../../store/authStore';

export default function ReproduccionFormScreen() {
  const router = useRouter();
  const params = useRecordParams();
  const idBovino = params.idBovino;
  const { user } = useAuthStore();

  const [hembras, setHembras] = useState<Bovino[]>([]);
  const [selectedBovinoId, setSelectedBovinoId] = useState<number | null>(
    idBovino || null,
  );
  const [tipo, setTipo] = useState('Monta Natural');
  const [fechaServicio, setFechaServicio] = useState(getCurrentDate());
  const [resultado, setResultado] = useState('Pendiente');
  const [fechaConfirmacion, setFechaConfirmacion] = useState('');
  const [fechaPartoManual, setFechaProbableParto] = useState<string | null>(
    null,
  );
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHembras() {
      try {
        const list = await BovinosDB.getAll();
        // Filtrar hembras activas
        const f = list.filter((b) => b.Sexo === 'H' && b.Estado === 'Activo');
        setHembras(f);
        if (!idBovino && f.length > 0) {
          setSelectedBovinoId(f[0].IdBovino);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchHembras();
  }, [idBovino]);

  const probableDate = isValidDate(fechaServicio)
    ? parseLocalDate(fechaServicio)
    : null;
  if (probableDate) probableDate.setDate(probableDate.getDate() + 283);
  const automaticDate = probableDate
    ? [
        probableDate.getFullYear(),
        String(probableDate.getMonth() + 1).padStart(2, '0'),
        String(probableDate.getDate()).padStart(2, '0'),
      ].join('-')
    : '';
  const fechaProbableParto = fechaPartoManual ?? automaticDate;

  const handleSave = async () => {
    if (!selectedBovinoId) {
      Alert.alert('Validación', 'Debe seleccionar una hembra reproductora');
      return;
    }
    if (!fechaServicio.trim()) {
      Alert.alert(
        'Validación',
        'La fecha de servicio es obligatoria (AAAA-MM-DD)',
      );
      return;
    }

    if (
      (fechaServicio.trim() && !isValidDate(fechaServicio.trim())) ||
      (fechaConfirmacion.trim() && !isValidDate(fechaConfirmacion.trim())) ||
      (fechaProbableParto.trim() && !isValidDate(fechaProbableParto.trim()))
    ) {
      Alert.alert('Validación', 'Ingrese fechas válidas en formato AAAA-MM-DD');
      return;
    }
    try {
      setLoading(true);
      await ReproduccionesDB.create({
        IdBovino: selectedBovinoId,
        TipoReproduccion: tipo,
        FechaMonta: tipo === 'Monta Natural' ? fechaServicio.trim() : null,
        FechaInseminacion:
          tipo === 'Inseminacion Artificial' ? fechaServicio.trim() : null,
        Resultado: resultado,
        FechaConfirmacion: fechaConfirmacion.trim() || null,
        FechaProbableParto:
          resultado === 'Preñada' ? fechaProbableParto.trim() : null,
        Observaciones: observaciones.trim() || null,
        IdUsuario: user?.IdUsuario || user?.id || null,
      });

      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar la reproducción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.sectionTitle}>Hembra (Vaca / Vaquilla) *</Text>
      {hembras.length === 0 ? (
        <Text style={styles.emptyWarning}>
          No hay hembras activas registradas en el hato.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pickerRow}
        >
          {hembras.map((b) => {
            const isSelected = selectedBovinoId === b.IdBovino;
            return (
              <TouchableOpacity
                key={b.IdBovino}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedBovinoId(b.IdBovino)}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {b.Codigo} {b.Nombre ? `(${b.Nombre})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <Text style={styles.label}>Método Reproductivo *</Text>
      <View style={styles.segmentedRow}>
        {TipoReproduccion.map((t) => {
          const isSelected = tipo === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.segBtn, isSelected && styles.segBtnActive]}
              onPress={() => setTipo(t)}
            >
              <Text
                style={[styles.segText, isSelected && styles.segTextActive]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Fecha de Servicio (AAAA-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD"
        value={fechaServicio}
        onChangeText={(value) => {
          setFechaServicio(value);
          setFechaProbableParto(null);
        }}
      />

      <Text style={styles.label}>Resultado / Diagnóstico de Gestación *</Text>
      <View style={styles.segmentedRow}>
        {ResultadoReproduccion.map((r) => {
          const isSelected = resultado === r;
          return (
            <TouchableOpacity
              key={r}
              style={[styles.segBtn, isSelected && styles.segBtnActive]}
              onPress={() => setResultado(r)}
            >
              <Text
                style={[styles.segText, isSelected && styles.segTextActive]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {resultado === 'Preñada' && (
        <>
          <Text style={styles.label}>
            Fecha Confirmación Palpación / Eco (AAAA-MM-DD)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            value={fechaConfirmacion}
            onChangeText={setFechaConfirmacion}
          />

          <Text style={styles.label}>
            Fecha Probable de Parto (+283 días aprox)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            value={fechaProbableParto}
            onChangeText={setFechaProbableParto}
          />
        </>
      )}

      <Text style={styles.label}>Observaciones / Datos del Toro o Pajuela</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ej. Nombre del toro reproductor, código de pajuela, inseminador..."
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
          <Text style={styles.submitBtnText}>
            Guardar Registro Reproductivo
          </Text>
        )}
      </TouchableOpacity>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: palette.ink,
    marginBottom: 8,
  },
  emptyWarning: { fontSize: 13, color: palette.danger, marginBottom: 12 },
  pickerRow: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    marginRight: 8,
  },
  chipActive: { backgroundColor: palette.forest, borderColor: palette.forest },
  chipText: { fontSize: 13, color: palette.ink },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.ink,
    marginBottom: 6,
    marginTop: 4,
  },
  segmentedRow: { flexDirection: 'row', marginBottom: 14 },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    marginHorizontal: 3,
    borderRadius: 8,
  },
  segBtnActive: {
    backgroundColor: palette.forest,
    borderColor: palette.forest,
  },
  segText: { fontSize: 12, fontWeight: 'bold', color: palette.muted },
  segTextActive: { color: '#FFF' },
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
  submitBtn: {
    backgroundColor: palette.forest,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
