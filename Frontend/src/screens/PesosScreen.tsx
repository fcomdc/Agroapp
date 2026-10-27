import Screen from '../components/Screen';
import { useCallback, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useRecordParams } from '../hooks/useRecordParams';
import { PesosDB } from '../database/repositories/PesosDB';
import type { Peso } from '../types/models';
import { dailyWeightChange } from '../utils/measurements';
import { formatDate } from '../utils/helpers';
import { ui, palette } from '../theme/tokens';
import { predictionService, type Prediction } from '../services/predictionService';
import { API_URL } from '../services/apiClient';
import ScreenHeading from '../components/ScreenHeading';
import Button from '../components/Button';
export default function PesosScreen() {
  const { idBovino } = useRecordParams(); const [weights, setWeights] = useState<Peso[]>([]); const [error, setError] = useState(''); const [prediction, setPrediction] = useState<Prediction | null>(null); const [busy, setBusy] = useState(false);
  useFocusEffect(useCallback(() => { let active = true; Promise.all([PesosDB.getByBovino(idBovino), predictionService.getCached(idBovino)]).then(([w, p]) => { if (active) { setWeights(w); setPrediction(p); } }).catch(() => { if (active) setError('No se pudo cargar el historial.'); }); return () => { active = false; }; }, [idBovino]));
  const latest = weights[0];
  const previous = latest ? weights.find(w => w.FechaPeso.slice(0, 10) < latest.FechaPeso.slice(0, 10) && (w.Metodo || null) === (latest.Metodo || null)) : undefined;
  const gain = latest && previous ? dailyWeightChange(latest, previous) : null;
  const fetchPrediction = async () => { setBusy(true); try { setPrediction(await predictionService.fetch(idBovino)); setError(''); } catch(e) { setError(e instanceof Error ? e.message : 'No se pudo consultar el pronóstico.'); } finally { setBusy(false); } };
  return <Screen><ScrollView style={ui.page} contentContainerStyle={ui.content}><ScreenHeading eyebrow="EVOLUCIÓN DEL ANIMAL" title="Lo que nos dice la cinta" subtitle="Las medidas de cada sesión permanecen en su historial." />
    {latest ? <View style={[ui.card, { backgroundColor: palette.pale, gap: 10 }]}><Text style={ui.eyebrow}>{latest.Metodo ? 'ÚLTIMO PESO ESTIMADO' : 'ÚLTIMO PESO REGISTRADO'}</Text><Text style={ui.title}>{latest.Peso.toFixed(1)} kg</Text><Text style={ui.subtitle}>{formatDate(latest.FechaPeso)}</Text>{gain && previous ? <Text style={[ui.subtitle, { color: palette.green }]}>{gain.kgPerDay >= 0 ? '+' : ''}{gain.kgPerDay.toFixed(2)} kg/día · entre {formatDate(previous.FechaPeso)} y {formatDate(latest.FechaPeso)}</Text> : <Text style={ui.subtitle}>Se necesitan dos sesiones comparables en fechas distintas para calcular la variación diaria.</Text>}</View> : <Text style={ui.subtitle}>Aún no hay mediciones de este bovino.</Text>}
    <Button label="Registrar medición con cinta" icon="resize-outline" onPress={() => router.push({ pathname: '/pesos/crear', params: { idBovino } })} />
    <View style={[ui.card, { gap: 10 }]}><Text style={ui.section}>Proyección a 30 días</Text>{prediction ? <><Text style={ui.title}>{prediction.kg.toFixed(1)} kg</Text><Text style={ui.subtitle}>Para {formatDate(prediction.targetDate)} · emitida {formatDate(prediction.issuedAt)}</Text><Text style={ui.subtitle}>Modelo Ridge · {prediction.modelVersion}</Text></> : <Text style={ui.subtitle}>Aún no hay un pronóstico para este bovino.</Text>}{API_URL ? <Button label="Consultar pronóstico" variant="secondary" loading={busy} onPress={() => void fetchPrediction()} /> : null}</View>
    {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}<Text style={ui.section}>Sesiones guardadas</Text>
    {weights.map(w => <View style={[ui.card, { gap: 10 }]} key={w.IdPeso}><View style={[ui.row, { justifyContent: 'space-between' }]}><Text style={ui.label}>{formatDate(w.FechaPeso)}</Text><Text style={[ui.section, { fontSize: 19 }]}>{w.Peso.toFixed(1)} kg</Text></View><Text style={ui.eyebrow}>{w.Metodo ? 'ESTIMACIÓN CON CINTA' : 'REGISTRO ANTERIOR'}</Text>{w.Perimetros ? <Text style={ui.subtitle}>Perímetro: {JSON.parse(w.Perimetros).join(' · ')} cm</Text> : null}{w.Longitudes ? <Text style={ui.subtitle}>Longitud: {JSON.parse(w.Longitudes).join(' · ')} cm</Text> : null}<Text style={ui.subtitle}>Por {w.NombreUsuario || 'Responsable sin registrar'}</Text>{w.Observaciones ? <Text style={ui.subtitle}>{w.Observaciones}</Text> : null}</View>)}
  </ScrollView></Screen>;
}
