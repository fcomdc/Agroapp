import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { palette } from '../../theme/tokens';

export const unstable_settings = { initialRouteName: '(tabs)', anchor: '(tabs)' };
const modalOptions = {
  presentation: Platform.OS === 'web' ? 'modal' as const : 'formSheet' as const,
  headerShown: false,
  sheetAllowedDetents: [0.85, 1],
  sheetGrabberVisible: true,
  sheetCornerRadius: 24,
};
export default function PrivateLayout() {
  const isAdmin = useAuth((s) => s.user?.Rol === 'Administrador');
  return <Stack screenOptions={{ headerStyle: { backgroundColor: palette.cream }, headerTintColor: palette.forest, headerTitleStyle: { fontSize: 17, fontWeight: '600' }, headerShadowVisible: false, contentStyle: { backgroundColor: palette.cream }, headerBackButtonDisplayMode: 'minimal' }}>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="bovinos/[id]" options={{ title: 'Ficha del bovino' }} />
    <Stack.Screen name="pesos/index" options={{ title: 'Seguimiento del peso' }} />
    <Stack.Screen name="pesos/crear" options={{ title: 'Medición corporal' }} />
    <Stack.Screen name="reportes/index" options={{ title: 'Reportes de salud' }} />
    <Stack.Screen name="salud/crear" options={{ ...modalOptions, title: 'Observación de salud' }} />
    <Stack.Screen name="salud/[id]" options={{ title: 'Detalle del reporte' }} />
    <Stack.Screen name="vacunas/index" options={{ title: 'Vacunaciones' }} />
    <Stack.Screen name="vacunas/crear" options={{ ...modalOptions, title: 'Registrar vacuna' }} />
    <Stack.Screen name="reproduccion/index" options={{ title: 'Reproducción' }} />
    <Stack.Screen name="reproduccion/crear" options={{ title: 'Evento reproductivo' }} />
    <Stack.Screen name="partos/index" options={{ title: 'Partos' }} />
    <Stack.Screen name="partos/crear" options={{ title: 'Registrar parto' }} />
    <Stack.Screen name="ubicaciones/index" options={{ title: 'Potreros y ubicaciones' }} />
    <Stack.Screen name="nfc" options={{ title: 'Identificación NFC' }} />
    <Stack.Screen name="sincronizacion" options={{ title: 'Registros del teléfono' }} />
    <Stack.Protected guard={isAdmin}>
      <Stack.Screen name="bovinos/crear" options={{ title: 'Registrar bovino' }} />
      <Stack.Screen name="bovinos/editar" options={{ title: 'Editar ficha' }} />
      <Stack.Screen name="ubicaciones/crear" options={{ ...modalOptions, title: 'Nueva ubicación' }} />
      <Stack.Screen name="ubicaciones/editar" options={{ ...modalOptions, title: 'Editar ubicación' }} />
      <Stack.Screen name="usuarios/index" options={{ title: 'Equipo de la finca' }} />
      <Stack.Screen name="usuarios/crear" options={{ title: 'Agregar integrante' }} />
      <Stack.Screen name="finca" options={{ ...modalOptions, title: 'Datos de la finca' }} />
    </Stack.Protected>
  </Stack>;
}
