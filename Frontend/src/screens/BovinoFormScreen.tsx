import type { Sex } from '../types/models';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import React, { useState, useEffect } from 'react';
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
import { isValidDate } from '../utils/helpers';
import { COLORS } from '../utils/constants';
import { BovinosDB } from '../database/BovinosDB';
import { UbicacionesDB } from '../database/UbicacionesDB';
import PickerSelect from '../components/PickerSelect';

const SEXO_OPTIONS: { label: string; value: Sex }[] = [
  { label: 'Macho', value: 'M' },
  { label: 'Hembra', value: 'H' },
];

const ESTADO_OPTIONS = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Vendido', value: 'Vendido' },
  { label: 'Fallecido', value: 'Fallecido' },
  { label: 'Trasladado', value: 'Trasladado' },
];

export default function BovinoFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'BovinoForm'>>();
  const editBovino = route.params?.bovino || null;
  const isEditing = !!editBovino;

  const [loading, setLoading] = useState(false);
  const [ubicaciones, setUbicaciones] = useState<{ label: string; value: string }[]>([]);
  const [form, setForm] = useState({
    Codigo: editBovino?.Codigo || '',
    Nombre: editBovino?.Nombre || '',
    Sexo: editBovino?.Sexo || 'M',
    FechaNacimiento: editBovino?.FechaNacimiento || '',
    Raza: editBovino?.Raza || '',
    Color: editBovino?.Color || '',
    IdUbicacion: editBovino?.IdUbicacion ? String(editBovino.IdUbicacion) : '',
    Estado: editBovino?.Estado || 'Activo',
    Observaciones: editBovino?.Observaciones || '',
  });

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Editar Bovino' : 'Nuevo Bovino' });
    async function loadUbicaciones() {
    try {
      const data = await UbicacionesDB.getAll();
      setUbicaciones(
        data.map((u) => ({
          label: u.Nombre,
          value: String(u.IdUbicacion),
        }))
      );
    } catch (e) {
      console.log('Error loading ubicaciones:', e);
    }
    }
    loadUbicaciones();
  }, [navigation, isEditing]);

  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.Codigo.trim()) {
      Alert.alert('Validación', 'El código es obligatorio');
      return false;
    }
    if (!form.Sexo) {
      Alert.alert('Validación', 'El sexo es obligatorio');
      return false;
    }
    if (!form.FechaNacimiento.trim()) {
      Alert.alert('Validación', 'La fecha de nacimiento es obligatoria');
      return false;
    }
    // Basic date format validation
    if (!isValidDate(form.FechaNacimiento)) {
      Alert.alert('Validación', 'La fecha debe tener formato AAAA-MM-DD');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        ...form,
        IdUbicacion: form.IdUbicacion ? parseInt(form.IdUbicacion) : null,
      };

      if (isEditing) {
        await BovinosDB.update(editBovino.IdBovino, data);
      } else {
        await BovinosDB.insert(data);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el bovino: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formCard}>
        {/* Código */}
        <Text style={styles.label}>Código *</Text>
        <TextInput
          style={styles.input}
          value={form.Codigo}
          onChangeText={(v) => updateField('Codigo', v)}
          placeholder="Ej: BOV-001"
          placeholderTextColor={COLORS.TEXT_LIGHT}
        />

        {/* Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={form.Nombre}
          onChangeText={(v) => updateField('Nombre', v)}
          placeholder="Nombre del bovino"
          placeholderTextColor={COLORS.TEXT_LIGHT}
        />

        {/* Sexo */}
        <Text style={styles.label}>Sexo *</Text>
        <PickerSelect<Sex>
          options={SEXO_OPTIONS}
          selectedValue={form.Sexo}
          onValueChange={(v) => updateField('Sexo', v)}
        />

        {/* Fecha Nacimiento */}
        <Text style={styles.label}>Fecha de Nacimiento * (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={form.FechaNacimiento}
          onChangeText={(v) => updateField('FechaNacimiento', v)}
          placeholder="2023-01-15"
          placeholderTextColor={COLORS.TEXT_LIGHT}
          keyboardType="default"
        />

        {/* Raza */}
        <Text style={styles.label}>Raza</Text>
        <TextInput
          style={styles.input}
          value={form.Raza}
          onChangeText={(v) => updateField('Raza', v)}
          placeholder="Ej: Brahman, Holstein"
          placeholderTextColor={COLORS.TEXT_LIGHT}
        />

        {/* Color */}
        <Text style={styles.label}>Color</Text>
        <TextInput
          style={styles.input}
          value={form.Color}
          onChangeText={(v) => updateField('Color', v)}
          placeholder="Ej: Negro, Pardo"
          placeholderTextColor={COLORS.TEXT_LIGHT}
        />

        {/* Ubicación */}
        <Text style={styles.label}>Ubicación</Text>
        <PickerSelect
          options={[{ label: 'Sin asignar', value: '' }, ...ubicaciones]}
          selectedValue={form.IdUbicacion}
          onValueChange={(v) => updateField('IdUbicacion', v)}
        />

        {/* Estado */}
        <Text style={styles.label}>Estado</Text>
        <PickerSelect
          options={ESTADO_OPTIONS}
          selectedValue={form.Estado}
          onValueChange={(v) => updateField('Estado', v)}
        />

        {/* Observaciones */}
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

      {/* Save Button */}
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
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Text>
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

