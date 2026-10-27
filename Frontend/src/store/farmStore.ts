import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FarmState { name: string; location: string; saveFarm: (name: string, location: string) => void; }
export const useFarmStore = create<FarmState>()(persist((set) => ({
  name: 'El Esfuerzo', location: 'Rivas, Nicaragua',
  saveFarm: (name, location) => set({ name: name.trim(), location: location.trim() }),
}), { name: '@AgroApp:finca', storage: createJSONStorage(() => AsyncStorage) }));

interface HerdFilters {
  query: string; status: string;
  setQuery: (query: string) => void; setStatus: (status: string) => void;
}
export const useHerdFilters = create<HerdFilters>((set) => ({
  query: '', status: 'Activo', setQuery: (query) => set({ query }), setStatus: (status) => set({ status }),
}));
