import { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useRecordParams } from '../hooks/useRecordParams';
import { useAuth } from '../context/AuthContext';
import { BovinosDB } from '../database/repositories/BovinosDB';
import { PesosDB } from '../database/repositories/PesosDB';
import { estimateWeight } from '../utils/measurements';
import { formatDateToday, isValidDate } from '../utils/helpers';
import { palette, ui } from '../theme/tokens';
import FormScreen from '../components/FormScreen';
import ScreenHeading from '../components/ScreenHeading';
import PickerSelect from '../components/PickerSelect';
import Button from '../components/Button';

export default function PesoFormScreen() {
  const { idBovino } = useRecordParams(); const user = useAuth(s => s.user);
  const [selected, setSelected] = useState(String(idBovino || ''));
  const [animals, setAnimals] = useState<{ value: string; label: string }[]>([]);
  const [girths, setGirths] = useState(['', '', '']); const [lengths, setLengths] = useState(['', '', '']);
  const [date, setDate] = useState(formatDateToday()); const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [submitted, setSubmitted] = useState(false);
  useEffect(() => { BovinosDB.getAll().then(data => setAnimals(data.filter(b => b.Estado === 'Activo' || b.IdBovino === idBovino).map(b => ({ value: String(b.IdBovino), label: `${b.Nombre || b.Codigo} · ${b.Codigo}` })))).catch(() => setError('No se pudo cargar el ganado. Vuelve a abrir esta pantalla.')); }, [idBovino]);
  const values = (items: string[]) => items.map(v => Number(v.replace(',', '.')));
  const estimate = useMemo(() => { try { return estimateWeight(values(girths), values(lengths)); } catch { return null; } }, [girths, lengths]);
  const validDate = isValidDate(date) && date <= formatDateToday();
  const save = async () => {
    setSubmitted(true); setError('');
    if (!estimate || !selected || !validDate || !user || saving || !animals.some(a => a.value === selected)) return;
    setSaving(true);
    try {
      await PesosDB.create({ IdBovino: Number(selected), Peso: estimate.kg, FechaPeso: date, IdUsuario: user.IdUsuario, Observaciones: notes.trim() || null, Perimetros: JSON.stringify(values(girths)), Longitudes: JSON.stringify(values(lengths)), Metodo: estimate.version });
      router.back();
    } catch { setError('No se pudo guardar la sesión. Revisa los datos e inténtalo de nuevo.'); }
    finally { setSaving(false); }
  };
  const readings = (label: string, items: string[], set: (v: string[]) => void) => <View style={ui.card}><Text style={ui.label}>{label} · cm</Text><Text style={[ui.subtitle, { fontSize: 12, marginBottom: 14 }]}>Retira y coloca de nuevo la cinta en cada lectura.</Text><View style={[ui.row, { flexWrap: 'wrap', alignItems: 'stretch' }]}>{items.map((value, i) => <View key={i} style={{ flex: 1, minWidth: 88, gap: 7 }}><Text style={ui.eyebrow}>LECTURA {i + 1}</Text><TextInput accessibilityLabel={`${label} lectura ${i + 1}`} keyboardType="decimal-pad" placeholder="0.0" placeholderTextColor={palette.muted} style={ui.input} value={value} onChangeText={v => set(items.map((old, j) => j === i ? v : old))} /></View>)}</View>{submitted && items.some(v => !Number.isFinite(Number(v.replace(',', '.'))) || Number(v.replace(',', '.')) <= 0) ? <Text style={ui.error}>Completa las tres lecturas con números mayores que cero.</Text> : null}</View>;
  return <FormScreen style={ui.page} contentContainerStyle={ui.content}>
    <ScreenHeading eyebrow="SESIÓN DE MEDICIÓN" title="De la cinta al registro" subtitle="Tres lecturas por dimensión. AgroApp usa la mediana de cada grupo." />
    <View><Text style={ui.label}>Bovino *</Text><PickerSelect options={animals} selectedValue={selected} onValueChange={setSelected} />{!animals.length ? <Text style={ui.subtitle}>Primero registra un bovino activo.</Text> : null}{submitted && !selected ? <Text style={ui.error}>Selecciona al bovino que mediste.</Text> : null}</View>
    {readings('Perímetro torácico', girths, setGirths)}{readings('Longitud corporal', lengths, setLengths)}
    <View style={[ui.card, { backgroundColor: palette.pale }]}><Text style={ui.eyebrow}>PESO ESTIMADO · SCHAEFFER</Text><Text style={[ui.title, { marginVertical: 8 }]}>{estimate ? `${estimate.kg.toFixed(1)} kg` : '— kg'}</Text><Text style={ui.subtitle}>{estimate ? `Medianas: ${estimate.girth} cm de perímetro y ${estimate.length} cm de longitud.` : 'Completa las seis lecturas para calcular.'}</Text><Text style={[ui.subtitle, { fontSize: 11, marginTop: 10 }]}>Es una estimación por medidas corporales. Revisa los puntos de medición con el profesional de la finca.</Text></View>
    <View><Text style={ui.label}>Fecha · AAAA-MM-DD *</Text><TextInput accessibilityLabel="Fecha de medición" style={ui.input} value={date} onChangeText={setDate} />{submitted && !validDate ? <Text style={ui.error}>Usa una fecha válida sin días futuros.</Text> : null}</View>
    <View><Text style={ui.label}>Observaciones de la sesión</Text><TextInput style={[ui.input, { minHeight: 90, textAlignVertical: 'top', paddingTop: 14 }]} multiline placeholder="Postura, instrumento, condiciones…" value={notes} onChangeText={setNotes} /></View>
    <Text style={[ui.subtitle, { fontSize: 12 }]}>Registrado por {user?.NombreCompleto}.</Text>
    {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}<Button label="Guardar medición" icon="checkmark" loading={saving} onPress={() => void save()} />
  </FormScreen>;
}
