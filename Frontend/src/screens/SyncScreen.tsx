import Screen from '../components/Screen';
import { useCallback, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { syncRepository } from '../database/repositories/syncRepository';
import type { PendingOperation } from '../database/mutations';
import { pushPendingOperations } from '../services/syncService';
import { API_URL } from '../services/apiClient';
import { palette, ui } from '../theme/tokens';
import { formatDateTime } from '../utils/helpers';
import ScreenHeading from '../components/ScreenHeading';
import Button from '../components/Button';
const names: Record<string, string> = { Bovinos: 'Ficha bovina', Pesos: 'Medición', ReportesSalud: 'Reporte de salud', Ubicaciones: 'Ubicación', Vacunaciones: 'Vacunación', Reproducciones: 'Reproducción', Partos: 'Parto', CriasParto: 'Cría', NFC: 'Etiqueta NFC' };
const actions: Record<string, string> = { create: 'Registro nuevo', update: 'Cambio guardado', delete: 'Baja guardada' };
export default function SyncScreen() {
  const [pending, setPending] = useState<PendingOperation[]>([]); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const load = useCallback(async () => { try { setPending(await syncRepository.getPending()); } catch { setMessage('No se pudo consultar la lista de pendientes.'); } }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const send = async () => {
    setBusy(true); setMessage('');
    try { const count = await pushPendingOperations(); setMessage(`${count} registros confirmados por el servidor.`); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'No se pudo enviar. Los registros se conservan.'); }
    finally { await load(); setBusy(false); }
  };
  return <Screen><ScrollView style={ui.page} contentContainerStyle={ui.content}><ScreenHeading eyebrow="TRABAJO SIN CONEXIÓN" title="El campo va contigo" subtitle="Cada registro se guarda en este teléfono antes de intentar enviarlo." />
    <View style={[ui.card, { backgroundColor: palette.pale, gap: 12 }]}><Ionicons name="phone-portrait-outline" size={30} color={palette.green} /><Text style={ui.section}>{pending.length} envíos pendientes</Text><Text style={ui.subtitle}>Tus cambios permanecen guardados en este teléfono.</Text></View>
    <Button label="Enviar registros pendientes" icon="cloud-upload-outline" disabled={!API_URL || !pending.length} loading={busy} onPress={() => void send()} />
    {message ? <Text accessibilityRole="alert" style={ui.subtitle}>{message}</Text> : null}
    <Text style={ui.section}>Cambios por enviar</Text>
    {pending.length ? pending.slice(0, 100).map(o => <View key={o.IdOperacion} style={{ borderBottomWidth: 1, borderColor: palette.line, paddingVertical: 12, gap: 5 }}><Text style={ui.label}>{names[o.Entidad] || o.Entidad} · #{o.IdLocal}</Text><Text style={ui.subtitle}>{actions[o.Accion] || 'Cambio guardado'}</Text><Text style={[ui.subtitle, { fontSize: 11 }]}>{formatDateTime(o.FechaCreacion)}</Text></View>) : <Text style={ui.subtitle}>No hay cambios pendientes.</Text>}
  </ScrollView></Screen>;
}
