import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new Error('Todavía no se ha conectado el servidor de la finca.');
  const token = Platform.OS === 'web' ? null : await SecureStore.getItemAsync('agroapp.api.token');
  if (!token) throw new Error('Falta iniciar sesión con el servidor. El acceso actual es local.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options, signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers, Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(response.status === 409 ? 'Existe un conflicto de versiones. El registro local se conserva.' : `El servidor no confirmó la operación (${response.status}).`);
    return await response.json() as T;
  } finally { clearTimeout(timeout); }
}
