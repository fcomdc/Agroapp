import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './apiClient';
export interface Prediction { animalLocalId: number; kg: number; issuedAt: string; targetDate: string; modelVersion: string; method: 'ridge'; }
const key = (id: number) => `@AgroApp:pronostico:${id}`;
export const predictionService = {
  getCached: async (id: number): Promise<Prediction | null> => {
    const raw = await AsyncStorage.getItem(key(id));
    if (!raw) return null;
    try { const p = JSON.parse(raw); return p.method === 'ridge' && Number.isFinite(p.kg) && p.kg > 0 && p.animalLocalId === id ? p : null; } catch { return null; }
  },
  fetch: async (id: number): Promise<Prediction> => {
    const p = await apiRequest<Prediction>(`/api/bovinos/local/${id}/prediccion`);
    if (p.method !== 'ridge' || p.animalLocalId !== id || !Number.isFinite(p.kg) || p.kg <= 0 || !p.modelVersion || !p.targetDate || !p.issuedAt) throw new Error('El servidor no devolvió un pronóstico válido.');
    await AsyncStorage.setItem(key(id), JSON.stringify(p));
    return p;
  },
};
