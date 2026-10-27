import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import FormScreen from '../components/FormScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useFarmStore } from '../store/farmStore';
import { palette, fonts, ui } from '../theme/tokens';
import Button from '../components/Button';
import BrandMark from '../components/BrandMark';

export default function LoginScreen() {
  const login = useAuth(s => s.login);
  const farm = useFarmStore(s => s.name);
  const [username, setUsername] = useState(''); const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const submit = async () => {
    if (loading) return;
    if (!username.trim() || !password) { setError('Escribe tu usuario y tu contraseña.'); return; }
    setLoading(true); setError('');
    const result = await login(username, password);
    if (!result.success) setError(result.message || 'No se pudo ingresar.');
    setLoading(false);
  };
  return <FormScreen contentContainerStyle={[ui.content, { flexGrow: 1, justifyContent: 'center', maxWidth: 540, gap: 28 }]}>
      <BrandMark size={112} />
      <View style={s.hero}><Text style={s.kicker}>CUADERNO DE CAMPO DIGITAL</Text><Text style={s.heroTitle}>Más cerca{ '\n' }de tu ganado.</Text><View style={s.land}><MaterialCommunityIcons name="cow" color={palette.lime} size={58} /><Ionicons name="leaf-outline" color="#779B70" size={38} /></View><Text style={s.farm}>{farm.toLocaleUpperCase('es-NI')}</Text></View>
      <View style={{ gap: 8 }}><Text style={[ui.title, { fontSize: 29 }]}>Volvamos a la finca</Text><Text style={ui.subtitle}>Consulta y registra, incluso sin señal.</Text></View>
      <View style={{ gap: 16 }}>
        <View><Text style={ui.label}>Usuario</Text><TextInput accessibilityLabel="Usuario" style={ui.input} value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} autoComplete="username" placeholder="Tu usuario" placeholderTextColor={palette.muted} editable={!loading} /></View>
        <View><Text style={ui.label}>Contraseña</Text><View style={s.password}><TextInput accessibilityLabel="Contraseña" style={{ flex: 1, fontSize: 16, minHeight: 50, color: palette.ink }} value={password} onChangeText={setPassword} secureTextEntry={!visible} autoComplete="current-password" placeholder="Tu contraseña" placeholderTextColor={palette.muted} onSubmitEditing={() => void submit()} editable={!loading} /><Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onPress={() => setVisible(!visible)} style={{ padding: 10 }}><Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} color={palette.muted} size={20} /></Pressable></View></View>
        {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
        <Button label="Entrar a mi finca" icon="arrow-forward" loading={loading} onPress={() => void submit()} />
      </View>
      <View style={[ui.row, { justifyContent: 'center', gap: 6 }]}><Ionicons name="phone-portrait-outline" size={13} color={palette.muted} /><Text style={{ fontSize: 11, color: palette.muted }}>La información del campo permanece contigo</Text></View>
  </FormScreen>;
}
const s = StyleSheet.create({ hero: { backgroundColor: palette.forest, padding: 26, borderRadius: 25, overflow: 'hidden' }, kicker: { color: palette.lime, fontSize: 9, letterSpacing: 1.6, fontWeight: '600' }, heroTitle: { fontFamily: fonts.heading, color: palette.paper, fontSize: 37, lineHeight: 43, marginTop: 16 }, land: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 22, marginVertical: 10 }, farm: { color: '#C4D3C3', letterSpacing: 2, fontSize: 10 }, password: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: palette.line, backgroundColor: palette.paper, paddingLeft: 14, borderRadius: 12 } });
