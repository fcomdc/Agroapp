import Screen from '../components/Screen';
import { useCallback, useState, type ComponentProps } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect, type Href } from 'expo-router';
import { BovinosDB } from '../database/repositories/BovinosDB';
import { PesosDB } from '../database/repositories/PesosDB';
import type { Bovino, Peso } from '../types/models';
import { useRecordParams } from '../hooks/useRecordParams';
import { useAuth } from '../context/AuthContext';
import { calcularEdad, formatDate } from '../utils/helpers';
import { palette, fonts, ui } from '../theme/tokens';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

export default function BovinoDetailScreen() {
  const { id } = useRecordParams(); const isAdmin = useAuth(s => s.user?.Rol === 'Administrador');
  const [animal, setAnimal] = useState<Bovino | null>(null); const [weight, setWeight] = useState<Peso | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useFocusEffect(useCallback(() => {
    let active = true;
    Promise.all([BovinosDB.getById(id), PesosDB.getLatestByBovino(id)]).then(([a, w]) => { if (active) { setAnimal(a); setWeight(w); setError(''); } }).catch(() => { if (active) setError('No se pudo abrir esta ficha.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]));
  if (loading) return <Screen contentStyle={ui.content}><Text style={ui.subtitle}>Abriendo la ficha…</Text></Screen>;
  if (!animal || error) return <Screen><EmptyState title={error || 'Ficha no encontrada'} description="Vuelve al listado para seleccionar un bovino." iconSize={40} /></Screen>;
  const sections: { title: string; subtitle: string; icon: ComponentProps<typeof Ionicons>['name']; href: Href }[] = [
    { title: 'Medidas y peso', subtitle: 'Sesiones con cinta y evolución', icon: 'resize-outline', href: { pathname: '/pesos', params: { idBovino: id } } },
    { title: 'Cuaderno de salud', subtitle: 'Observaciones y atención veterinaria', icon: 'heart-outline', href: { pathname: '/reportes', params: { idBovino: id } } },
    { title: 'Vacunaciones', subtitle: 'Aplicaciones y próximos refuerzos', icon: 'medical-outline', href: { pathname: '/vacunas', params: { idBovino: id } } },
    { title: 'Reproducción', subtitle: 'Montas, inseminación y seguimiento', icon: 'git-merge-outline', href: { pathname: '/reproduccion', params: { idBovino: id } } },
    { title: 'Identificación NFC', subtitle: 'Etiquetas asociadas a esta ficha', icon: 'scan-outline', href: { pathname: '/nfc', params: { idBovino: id } } },
  ];
  return <Screen><ScrollView style={ui.page} contentContainerStyle={ui.content}>
    <View style={s.identity}><View style={s.avatar}><MaterialCommunityIcons name="cow" size={65} color={palette.green} /></View><View style={{ gap: 7, flex: 1 }}><Text style={ui.eyebrow}>{animal.Codigo}</Text><Text style={[ui.title, { fontSize: 31 }]}>{animal.Nombre || 'Sin nombre'}</Text><View style={s.status}><View style={{ height: 5, width: 5, borderRadius: 3, backgroundColor: palette.green }} /><Text style={s.statusText}>{animal.Estado}</Text></View></View></View>
    <View style={s.metrics}><View style={{ flex: 1, gap: 6 }}><Text style={s.metricLabel}>{weight?.Metodo ? 'PESO ESTIMADO' : 'ÚLTIMO PESO'}</Text><Text style={s.weight}>{weight ? `${weight.Peso.toFixed(1)}` : '—'}<Text style={{ fontSize: 15 }}> {weight ? 'kg' : ''}</Text></Text><Text style={s.metricHint}>{weight ? formatDate(weight.FechaPeso) : 'Sin mediciones todavía'}</Text></View><View style={{ flex: 1, gap: 8 }}><Ionicons name="location-outline" size={23} color={palette.green} /><Text style={s.place}>{animal.NombreUbicacion || 'Sin ubicación'}</Text><Text style={s.metricHint}>Ubicación registrada</Text></View></View>
    <View style={ui.card}><Text style={[ui.eyebrow, { marginBottom: 18 }]}>PARA CONOCERLO MEJOR</Text>{[['Sexo', animal.Sexo === 'H' ? 'Hembra' : 'Macho'], ['Edad', animal.FechaNacimiento ? calcularEdad(animal.FechaNacimiento) : 'Sin registrar'], ['Raza', animal.Raza || 'Sin registrar'], ['Color', animal.Color || 'Sin registrar']].map(([label, value]) => <View key={label} style={s.fact}><Text style={ui.subtitle}>{label}</Text><Text style={s.factValue}>{value}</Text></View>)}</View>
    <Text style={ui.section}>Su historial</Text><View style={{ marginTop: -10 }}>{sections.map(section => <Pressable key={section.title} accessibilityRole="button" onPress={() => router.push(section.href)} style={s.section}><View style={s.icon}><Ionicons name={section.icon} size={22} color={palette.green} /></View><View style={{ flex: 1, gap: 4 }}><Text style={s.sectionTitle}>{section.title}</Text><Text style={s.metricHint}>{section.subtitle}</Text></View><Ionicons name="chevron-forward" color={palette.muted} size={18} /></Pressable>)}</View>
    {animal.Observaciones ? <View style={[ui.card, { backgroundColor: palette.sand }]}><Text style={ui.label}>Notas de campo</Text><Text style={[ui.subtitle, { color: palette.ink }]}>{animal.Observaciones}</Text></View> : null}
    {isAdmin ? <Button label="Editar ficha o cambiar estado" icon="create-outline" variant="secondary" onPress={() => router.push({ pathname: '/bovinos/editar', params: { id } })} /> : null}
  </ScrollView></Screen>;
}
const s = StyleSheet.create({ identity: { flexDirection: 'row', alignItems: 'center', gap: 20 }, avatar: { backgroundColor: palette.pale, width: 108, height: 126, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }, status: { flexDirection: 'row', gap: 6, alignItems: 'center' }, statusText: { color: palette.green, fontSize: 12 }, metrics: { padding: 22, backgroundColor: palette.pale, borderRadius: 20, flexDirection: 'row', gap: 20, alignItems: 'center' }, metricLabel: { fontSize: 9, color: palette.green, letterSpacing: 1.2 }, weight: { fontFamily: fonts.heading, fontSize: 37, color: palette.forest }, metricHint: { color: palette.muted, fontSize: 11, lineHeight: 16 }, place: { color: palette.ink, fontWeight: '600', fontSize: 14 }, fact: { flexDirection: 'row', gap: 16, justifyContent: 'space-between', marginBottom: 11 }, factValue: { flex: 1, textAlign: 'right', color: palette.ink, fontSize: 14, fontWeight: '500' }, section: { flexDirection: 'row', gap: 13, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: palette.line }, icon: { backgroundColor: palette.pale, borderRadius: 13, padding: 13 }, sectionTitle: { fontSize: 15, fontWeight: '600', color: palette.ink } });
