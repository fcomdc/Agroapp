import { palette } from '../../../theme/tokens';
import { useAuthStore } from '../../../store/authStore';
import { can } from '../../../utils/permissions';
import FormScreen from '../../../components/FormScreen';
import { useRecordParams } from '../../../hooks/useRecordParams';
import type { ReporteSalud } from '../../../types/models';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import { formatDateTime } from '../../../utils/helpers';
import { ReportesSaludDB } from '../../../database/repositories/ReportesSaludDB';

export default function ReporteSaludDetailScreen() {
  const params = useRecordParams();
  const role = useAuthStore((s) => s.user?.Rol);
  const canDiagnose = can(role, 'diagnose');
  const idReporte = params.id;

  const [reporte, setReporte] = useState<ReporteSalud | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const all = await ReportesSaludDB.getAll();
      const found = all.find((r) => r.IdReporte === idReporte);
      if (found) {
        setReporte(found);
        setDiagnostico(found.Diagnostico || '');
        setTratamiento(found.Tratamiento || '');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo cargar la información del reporte');
    } finally {
      setLoading(false);
    }
  }, [idReporte]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleAtender = async () => {
    if (!canDiagnose || saving) return;
    if (!diagnostico.trim()) {
      Alert.alert('Validación', 'Debe registrar el diagnóstico veterinario');
      return;
    }
    if (!tratamiento.trim()) {
      Alert.alert('Validación', 'Debe indicar el tratamiento prescrito');
      return;
    }

    try {
      setSaving(true);
      await ReportesSaludDB.atender(
        idReporte,
        diagnostico.trim(),
        tratamiento.trim(),
      );
      Alert.alert(
        'Éxito',
        'El reporte ha sido marcado como Atendido con su diagnóstico',
      );
      loadData();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar la atención médica');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.forest} />
      </View>
    );
  }

  if (!reporte) {
    return (
      <View style={styles.center}>
        <Text>Reporte no encontrado</Text>
      </View>
    );
  }

  const isAtendido =
    reporte.Estado === 'Atendido' || reporte.Estado === 'Cerrado';

  return (
    <FormScreen
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Tarjeta de Encabezado */}
      <View style={styles.headerCard}>
        <View style={styles.titleRow}>
          <Text style={styles.bovinoTitle}>
            {reporte.NombreBovino
              ? `${reporte.NombreBovino} (${reporte.CodigoBovino})`
              : `Bovino: ${reporte.CodigoBovino}`}
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: isAtendido ? '#E8F5E9' : '#FFF3E0' },
            ]}
          >
            <Text
              style={{
                color: isAtendido ? palette.forest : '#F57C00',
                fontWeight: 'bold',
              }}
            >
              {reporte.Estado}
            </Text>
          </View>
        </View>

        <Text style={styles.subInfo}>
          Gravedad:{' '}
          <Text style={{ fontWeight: 'bold' }}>{reporte.Gravedad}</Text>
        </Text>
        <Text style={styles.subInfo}>
          Fecha de Reporte: {formatDateTime(reporte.FechaReporte)}
        </Text>
        <Text style={styles.subInfo}>
          Reportado por: {reporte.NombreUsuario || 'Personal'}
        </Text>
      </View>

      {/* Síntomas y Observaciones */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Síntomas Presentados</Text>
        <Text style={styles.bodyText}>{reporte.Sintomas}</Text>

        {reporte.Observaciones ? (
          <>
            <Text style={[styles.sectionHeading, { marginTop: 12 }]}>
              Observaciones de Campo
            </Text>
            <Text style={styles.bodyText}>{reporte.Observaciones}</Text>
          </>
        ) : null}
      </View>

      {/* Sección Médica */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>
          {isAtendido
            ? 'Atención veterinaria realizada'
            : 'Revisión veterinaria pendiente'}
        </Text>

        {isAtendido ? (
          <View style={{ marginTop: 8 }}>
            <Text style={styles.label}>Diagnóstico:</Text>
            <Text style={styles.bodyText}>{reporte.Diagnostico}</Text>

            <Text style={[styles.label, { marginTop: 10 }]}>
              Tratamiento Aplicado:
            </Text>
            <Text style={styles.bodyText}>{reporte.Tratamiento}</Text>

            {reporte.FechaAtencion && (
              <Text style={styles.dateAtendido}>
                Atendido el: {formatDateTime(reporte.FechaAtencion)}
              </Text>
            )}
          </View>
        ) : canDiagnose ? (
          <View style={{ marginTop: 8 }}>
            <Text style={styles.label}>Diagnóstico Profesional *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Indique el diagnóstico clínico..."
              multiline
              numberOfLines={3}
              value={diagnostico}
              onChangeText={setDiagnostico}
            />

            <Text style={styles.label}>
              Tratamiento / Medicación / Instrucciones *
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Medicamentos, dosis, días de aislamiento..."
              multiline
              numberOfLines={3}
              value={tratamiento}
              onChangeText={setTratamiento}
            />

            <TouchableOpacity
              style={[styles.btnAtender, saving && styles.btnDisabled]}
              onPress={handleAtender}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnAtenderText}>
                  Completar y Guardar Atención
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.bodyText}>
            El veterinario de la finca registrará el diagnóstico y el
            tratamiento.
          </Text>
        )}
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bovinoTitle: { fontSize: 18, fontWeight: 'bold', color: palette.ink },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  subInfo: { fontSize: 13, color: palette.muted, marginTop: 2 },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.forest,
    marginBottom: 6,
  },
  bodyText: { fontSize: 14, color: palette.ink, lineHeight: 20 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.ink,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F6F5EF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  textArea: { minHeight: 75, textAlignVertical: 'top' },
  dateAtendido: {
    fontSize: 12,
    color: palette.forest,
    fontStyle: 'italic',
    marginTop: 12,
  },
  btnAtender: {
    backgroundColor: palette.forest,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  btnDisabled: { opacity: 0.6 },
  btnAtenderText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});
