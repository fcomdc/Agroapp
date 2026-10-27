import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import Screen from '../components/Screen';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { BovinosDB } from '../database/repositories/BovinosDB';
import { ReportesSaludDB } from '../database/repositories/ReportesSaludDB';
import { VacunacionesDB } from '../database/repositories/VacunacionesDB';
import type { Bovino } from '../types/models';
import { useFarmStore } from '../store/farmStore';
import { palette, fonts, ui } from '../theme/tokens';
import BrandMark from '../components/BrandMark';
import CattleCard from '../components/CattleCard';
import EmptyState from '../components/EmptyState';
import { parseLocalDate } from '../utils/helpers';

export default function HomeScreen() {
  const { name, location } = useFarmStore();
  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [stats, setStats] = useState({ reports: 0, vaccines: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      const [animals, reports, vaccines] = await Promise.all([BovinosDB.getAll(), ReportesSaludDB.getAll(), VacunacionesDB.getAll()]);
      setBovinos(animals.filter(b => b.Estado === 'Activo'));
      const limit = new Date(); limit.setDate(limit.getDate() + 30);
      setStats({ reports: reports.filter(r => r.Estado === 'Pendiente' || r.Estado === 'EnRevision').length, vaccines: vaccines.filter(v => v.ProximaAplicacion && parseLocalDate(v.ProximaAplicacion) <= limit).length });
      setError('');
    } catch { setError('No se pudo cargar el resumen. Desliza para volver a intentar.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const day = new Date().toLocaleDateString('es-NI', { weekday: 'long', day: 'numeric', month: 'short' });
  return <Screen>
    <ScrollView contentContainerStyle={ui.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} tintColor={palette.green} />}>
      <View style={[ui.row, { justifyContent: 'space-between' }]}><BrandMark /><Pressable accessibilityRole="button" accessibilityLabel="Abrir gestión de la finca" onPress={() => router.push('/gestion')} style={s.account}><Ionicons name="person-outline" size={19} color={palette.forest} /></Pressable></View>
      <View style={[ui.row, { gap: 7, flexWrap: 'wrap' }]}><Ionicons name="location-outline" size={14} color={palette.green} /><Text style={[s.farm, { flexShrink: 1 }]}>{name}</Text><Text style={[ui.subtitle, { fontSize: 11, flexShrink: 1 }]}>/ {location}</Text></View>
      <View style={{ gap: 5 }}><Text style={ui.eyebrow}>{day.toLocaleUpperCase('es-NI')}</Text><Text style={ui.title}>Tu finca, al día.</Text></View>
      {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
      <View style={s.hero}>
        <View style={s.sun} /><View style={s.hillBack} /><View style={s.hillFront} />
        <View style={{ zIndex: 1, alignItems: 'flex-start' }}><View style={s.local}><View style={s.smallDot} /><Text style={s.localText}>CUADERNO DE CAMPO</Text></View><Text style={s.number}>{loading ? '—' : bovinos.length.toString().padStart(2, '0')}</Text><Text style={s.heroLabel}>bovinos activos</Text><Pressable accessibilityRole="button" onPress={() => router.push('/ganado')} style={s.herdLink}><Text style={s.herdText}>Ver mi ganado</Text><Ionicons name="arrow-forward" size={17} color={palette.lime} /></Pressable></View>
      </View>
      <View style={s.summary}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/salud')} style={s.summaryItem}><View style={ui.row}><Ionicons name="heart-outline" size={19} color={palette.clay} /><Text style={s.summaryNumber}>{loading ? '—' : stats.reports.toString().padStart(2, '0')}</Text></View><Text style={s.summaryLabel}>Reportes pendientes</Text></Pressable>
        <View style={{ width: 1, backgroundColor: palette.line }} />
        <Pressable accessibilityRole="button" onPress={() => router.push('/vacunas')} style={s.summaryItem}><View style={ui.row}><Ionicons name="calendar-outline" size={19} color={palette.green} /><Text style={s.summaryNumber}>{loading ? '—' : stats.vaccines.toString().padStart(2, '0')}</Text></View><Text style={s.summaryLabel}>Vacunas por revisar</Text></Pressable>
      </View>
      <View style={[ui.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text style={ui.section}>Registrar en campo</Text><Text style={s.note}>Siempre a mano</Text></View>
      <View style={[ui.row, { alignItems: 'stretch', flexWrap: 'wrap' }]}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/pesos/crear')} style={[s.action, { backgroundColor: palette.pale }]}><Ionicons name="resize-outline" color={palette.forest} size={24} /><Text style={s.actionTitle}>Medir bovino</Text><Text style={s.actionHint}>Cinta y peso estimado</Text><Ionicons name="arrow-up-right-box-outline" color={palette.green} size={18} /></Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/salud/crear')} style={[s.action, { backgroundColor: palette.sand }]}><Ionicons name="medical-outline" color={palette.clay} size={24} /><Text style={s.actionTitle}>Reportar salud</Text><Text style={s.actionHint}>Observaciones del día</Text><Ionicons name="arrow-up-right-box-outline" color={palette.clay} size={18} /></Pressable>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Identificar bovino con NFC" onPress={() => router.push('/nfc')} style={s.nfc}><View style={s.nfcIcon}><Ionicons name="scan-outline" size={25} color={palette.forest} /></View><View style={{ flex: 1, gap: 4 }}><Text style={s.nfcTitle}>Acercar y reconocer</Text><Text style={s.nfcHint}>Abre una ficha con su etiqueta NFC</Text></View><Ionicons name="arrow-forward" size={21} color={palette.forest} /></Pressable>
      <View style={[ui.row, { justifyContent: 'space-between' }]}><Text style={ui.section}>En el hato</Text><Pressable accessibilityRole="button" onPress={() => router.push('/ganado')} style={{ padding: 8 }}><Text style={s.link}>Ver todos ↗</Text></Pressable></View>
      <View style={{ marginTop: -16 }}>{bovinos.slice(0, 3).map((b, i) => <CattleCard key={b.IdBovino} bovino={b} index={i} />)}{!loading && !bovinos.length ? <EmptyState icon="leaf-outline" title="Aquí comienza tu hato" description="Registra el primer bovino desde Ganado." iconSize={40} /> : null}</View>
      <Pressable accessibilityRole="button" onPress={() => router.push('/sincronizacion')} style={[ui.row, { justifyContent: 'center' }]}><Ionicons name="phone-portrait-outline" color={palette.muted} size={13} /><Text style={[s.note, { flexShrink: 1 }]}>Tus registros se guardan en este teléfono</Text></Pressable>
    </ScrollView>
  </Screen>;
}
const s = StyleSheet.create({
  account: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center' },
  farm: { color: palette.ink, fontWeight: '600', fontSize: 12 },
  hero: { backgroundColor: palette.forest, borderRadius: 24, padding: 23, overflow: 'hidden', minHeight: 225 },
  sun: { position: 'absolute', right: 32, top: 35, width: 53, height: 53, borderRadius: 28, backgroundColor: palette.lime },
  hillBack: { position: 'absolute', width: 350, height: 230, borderRadius: 150, right: -170, bottom: -60, backgroundColor: '#32614A', transform: [{ rotate: '-30deg' }] },
  hillFront: { position: 'absolute', width: 290, height: 150, borderRadius: 110, right: -100, bottom: -100, backgroundColor: '#6F8D55', transform: [{ rotate: '25deg' }] },
  local: { flexDirection: 'row', gap: 6, alignItems: 'center' }, smallDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: palette.lime },
  localText: { color: '#C3D4C8', fontSize: 9, letterSpacing: 1.5, fontWeight: '600' },
  number: { fontFamily: fonts.heading, fontSize: 72, lineHeight: 88, color: palette.paper, marginTop: 5 },
  heroLabel: { color: '#D8E3D5', fontSize: 15 }, herdLink: { marginTop: 20, flexDirection: 'row', gap: 18, alignItems: 'center' }, herdText: { fontSize: 12, fontWeight: '600', color: palette.lime },
  summary: { flexDirection: 'row', borderBottomWidth: 1, borderColor: palette.line, paddingBottom: 20 }, summaryItem: { flex: 1, paddingHorizontal: 10, gap: 6 }, summaryNumber: { fontSize: 25, fontWeight: '500', color: palette.ink }, summaryLabel: { color: palette.muted, fontSize: 11 },
  action: { flexGrow: 1, flexShrink: 1, flexBasis: '44%', minWidth: 140, borderRadius: 18, padding: 16, gap: 9 }, actionTitle: { color: palette.ink, fontSize: 14, fontWeight: '700', marginTop: 3 }, actionHint: { color: palette.muted, fontSize: 10, lineHeight: 16 },
  nfc: { backgroundColor: palette.lime, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }, nfcIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#E6EFCB', alignItems: 'center', justifyContent: 'center' }, nfcTitle: { color: palette.forest, fontSize: 15, fontWeight: '700' }, nfcHint: { color: palette.forest, fontSize: 10, lineHeight: 16 },
  link: { color: palette.green, fontSize: 12, fontWeight: '600' }, note: { color: palette.muted, fontSize: 10 },
});
