import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../utils/constants';
import { formatDateToday, isValidDate } from '../utils/helpers';
import { PesosDB } from '../database/PesosDB';

export default function PesoFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'PesoForm'>>();
  const IdBovino = route.params?.IdBovino || route.params?.idBovino || route.params?.id;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Peso: '',
    FechaPeso: formatDateToday(),
    Observaciones: '',
  });

  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!IdBovino) {
      Alert.alert('Validación', 'Debe seleccionar un bovino');
      return false;
    }
    const peso = Number(form.Peso);
    if (!form.Peso || !Number.isFinite(peso) || peso <= 0) {
      Alert.alert('Validación', 'El peso debe ser mayor a 0');
      return false;
    }
    if (!form.FechaPeso.trim()) {
      Alert.alert('Validación', 'La fecha es obligatoria');
      return false;
    }
    if (!isValidDate(form.FechaPeso)) {
      Alert.alert('Validación', 'La fecha debe tener formato AAAA-MM-DD');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!IdBovino || !validate()) return;
    setLoading(true);
    try {
      await PesosDB.insert({
        IdBovino,
        Peso: Number(form.Peso),
        FechaPeso: form.FechaPeso,
        Observaciones: form.Observaciones,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el peso: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formCard}>
        <Text style={styles.label}>Peso (kg) *</Text>
        <TextInput
          style={styles.input}
          value={form.Peso}
          onChangeText={(v) => updateField('Peso', v)}
          placeholder="Ej: 450.5"
          placeholderTextColor={COLORS.TEXT_LIGHT}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Fecha (AAAA-MM-DD) *</Text>
        <TextInput
          style={styles.input}
          value={form.FechaPeso}
          onChangeText={(v) => updateField('FechaPeso', v)}
          placeholder="2024-01-15"
          placeholderTextColor={COLORS.TEXT_LIGHT}
        />

        <Text style={styles.label}>Observaciones</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.Observaciones}
          onChangeText={(v) => updateField('Observaciones', v)}
          placeholder="Observaciones adicionales..."
          placeholderTextColor={COLORS.TEXT_LIGHT}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.WHITE} />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.WHITE} />
            <Text style={styles.saveButtonText}>Guardar Peso</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

