import { useEffect, type PropsWithChildren } from 'react';
import { useAuthStore } from '../store/authStore';

// Existing features share the single Zustand session store.
export const useAuth = useAuthStore;
export function AuthProvider({ children }: PropsWithChildren) {
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => { void initialize(); }, [initialize]);
  return children;
}
