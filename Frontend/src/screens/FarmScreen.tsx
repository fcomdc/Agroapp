import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useFarmStore } from '../store/farmStore';
import { ui } from '../theme/tokens';
import Button from '../components/Button';
import FormScreen from '../components/FormScreen';
import ScreenHeading from '../components/ScreenHeading';
export default function FarmScreen() {
  const farm = useFarmStore(); const [name, setName] = useState(farm.name); const [location, setLocation] = useState(farm.location); const [error, setError] = useState('');
  return <FormScreen style={ui.page} contentContainerStyle={ui.content}><ScreenHeading eyebrow="IDENTIDAD DE LA FINCA" title="Así nos conocen" />
    <View><Text style={ui.label}>Nombre de la finca *</Text><TextInput accessibilityLabel="Nombre de la finca" style={ui.input} value={name} onChangeText={setName} /></View>
    <View><Text style={ui.label}>Ubicación *</Text><TextInput accessibilityLabel="Ubicación de la finca" style={ui.input} value={location} onChangeText={setLocation} /></View>
    {error ? <Text style={ui.error}>{error}</Text> : null}<Button label="Guardar datos" icon="checkmark" onPress={() => { if (!name.trim() || !location.trim()) { setError('Completa el nombre y la ubicación.'); return; } farm.saveFarm(name, location); router.back(); }} />
  </FormScreen>;
}
