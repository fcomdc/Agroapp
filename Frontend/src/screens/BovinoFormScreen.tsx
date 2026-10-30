import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { BovinosDB } from '../database/repositories/BovinosDB';
import { UbicacionesDB } from '../database/repositories/UbicacionesDB';
import type { Sex, NewBovino } from '../types/models';
import { useRecordParams } from '../hooks/useRecordParams';
import { useAuthStore } from '../store/authStore';
import { isValidDate, formatDateToday } from '../utils/helpers';
import { ui, palette } from '../theme/tokens';
import FormScreen from '../components/FormScreen';
import Button from '../components/Button';
import PickerSelect from '../components/PickerSelect';
import ScreenHeading from '../components/ScreenHeading';

const initial = {
  Codigo: '',
  Nombre: '',
  Sexo: 'H' as Sex,
  FechaNacimiento: '',
  Raza: '',
  Color: '',
  IdUbicacion: '',
  Estado: 'Activo',
  Observaciones: '',
};
export default function BovinoFormScreen() {
  const { id } = useRecordParams();
  const isEditing = usePathname().endsWith('/editar');
  const isAdmin = useAuthStore((s) => s.user?.Rol === 'Administrador');
  const [form, setForm] = useState(initial);
  const [locations, setLocations] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [places, animal] = await Promise.all([
          UbicacionesDB.getAll(),
          isEditing && id ? BovinosDB.getById(id) : Promise.resolve(null),
        ]);
        if (!active) return;
        setLocations(
          places.map((p) => ({
            label: p.Nombre,
            value: String(p.IdUbicacion),
          })),
        );
        if (isEditing && !animal) {
          setError('No se encontró la ficha para editar.');
          return;
        }
        if (animal)
          setForm({
            Codigo: animal.Codigo,
            Nombre: animal.Nombre || '',
            Sexo: animal.Sexo,
            FechaNacimiento: animal.FechaNacimiento || '',
            Raza: animal.Raza || '',
            Color: animal.Color || '',
            IdUbicacion: animal.IdUbicacion ? String(animal.IdUbicacion) : '',
            Estado: animal.Estado,
            Observaciones: animal.Observaciones || '',
          });
      } catch {
        if (active)
          setError(
            'No se pudo cargar la información. Vuelve a abrir esta pantalla.',
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, isEditing]);
  const change = (field: keyof typeof initial, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };
  const save = async () => {
    if (saving || !isAdmin || loading || error) return;
    const validation: Record<string, string> = {};
    if (!form.Codigo.trim())
      validation.Codigo = 'Escribe el código de identificación.';
    if (
      form.FechaNacimiento &&
      (!isValidDate(form.FechaNacimiento) ||
        form.FechaNacimiento > formatDateToday())
    )
      validation.FechaNacimiento =
        'Usa una fecha válida, sin días futuros, en AAAA-MM-DD.';
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    try {
      const duplicate = await BovinosDB.getByCode(form.Codigo.trim());
      if (duplicate && duplicate.IdBovino !== id) {
        setErrors({ Codigo: 'Este código ya pertenece a otra ficha.' });
        return;
      }
      const data: NewBovino = {
        ...form,
        Codigo: form.Codigo.trim(),
        Nombre: form.Nombre.trim() || null,
        FechaNacimiento: form.FechaNacimiento || null,
        IdUbicacion: form.IdUbicacion ? Number(form.IdUbicacion) : null,
      };
      if (isEditing) await BovinosDB.update(id, data);
      else await BovinosDB.create(data);
      router.back();
    } catch {
      setErrors({
        save: 'No se pudo guardar. Tu información sigue en el formulario.',
      });
    } finally {
      setSaving(false);
    }
  };
  const field = (
    key: Exclude<keyof typeof initial, 'Sexo' | 'Estado' | 'IdUbicacion'>,
    label: string,
    placeholder: string,
  ) => (
    <View key={key}>
      <Text style={ui.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={form[key]}
        onChangeText={(v) => change(key, v)}
        style={[
          ui.input,
          key === 'Observaciones' && {
            minHeight: 100,
            paddingTop: 14,
            textAlignVertical: 'top',
          },
          errors[key] ? { borderColor: palette.danger } : null,
        ]}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        multiline={key === 'Observaciones'}
        autoCapitalize={key === 'Codigo' ? 'characters' : 'sentences'}
      />
      {errors[key] ? <Text style={ui.error}>{errors[key]}</Text> : null}
    </View>
  );
  return (
    <FormScreen style={ui.page} contentContainerStyle={ui.content}>
      <ScreenHeading
        eyebrow="IDENTIDAD Y TRAZABILIDAD"
        title={isEditing ? 'Editar su ficha' : 'Un nuevo integrante'}
        subtitle="El código identifica al animal durante todo su seguimiento."
      />
      {error ? (
        <Text accessibilityRole="alert" style={ui.error}>
          {error}
        </Text>
      ) : loading ? (
        <Text style={ui.subtitle}>Abriendo ficha…</Text>
      ) : (
        <>
          {field('Codigo', 'Código del bovino *', 'Ej. BOV-008')}
          {field('Nombre', 'Nombre', '¿Cómo lo llaman en la finca?')}
          <View>
            <Text style={ui.label}>Sexo</Text>
            <PickerSelect<Sex>
              options={[
                { label: 'Hembra', value: 'H' },
                { label: 'Macho', value: 'M' },
              ]}
              selectedValue={form.Sexo}
              onValueChange={(v) => change('Sexo', v)}
            />
          </View>
          {field(
            'FechaNacimiento',
            'Nacimiento · AAAA-MM-DD',
            'Deja vacío si no se conoce',
          )}
          {field('Raza', 'Raza', 'Ej. Gyr, Brahman, cruce…')}
          {field(
            'Color',
            'Color o señas particulares',
            'Para reconocerlo en campo',
          )}
          <View>
            <Text style={ui.label}>Ubicación actual</Text>
            <PickerSelect
              options={[{ label: 'Sin asignar', value: '' }, ...locations]}
              selectedValue={form.IdUbicacion}
              onValueChange={(v) => change('IdUbicacion', v)}
            />
          </View>
          <View>
            <Text style={ui.label}>Estado</Text>
            <PickerSelect
              options={['Activo', 'Vendido', 'Fallecido', 'Trasladado'].map(
                (value) => ({ label: value, value }),
              )}
              selectedValue={form.Estado}
              onValueChange={(v) => change('Estado', v)}
            />
            <Text style={ui.subtitle}>
              El historial se conserva al cambiar el estado.
            </Text>
          </View>
          {field(
            'Observaciones',
            'Observaciones',
            'Algo que debamos recordar…',
          )}
          {errors.save ? (
            <Text accessibilityRole="alert" style={ui.error}>
              {errors.save}
            </Text>
          ) : null}
          <Button
            label={isEditing ? 'Guardar cambios' : 'Guardar ficha'}
            icon="checkmark"
            loading={saving}
            onPress={() => void save()}
          />
        </>
      )}
    </FormScreen>
  );
}
