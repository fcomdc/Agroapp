import { setDatabaseActor } from "../database/actor";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initDatabase } from "../database/Database";
import { UsuariosDB } from "../database/repositories/UsuariosDB";
import { sessionStorage } from "../services/sessionStorage";
import type { SessionUser, Usuario } from "../types/models";

interface AuthState {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}
const toSessionUser = (u: Usuario): SessionUser => ({
  ...u,
  id: u.IdUsuario,
  usuario: u.Usuario,
  nombre_completo: u.NombreCompleto,
  rol: u.Rol,
});
let initializing: Promise<void> | null = null;
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  initialize: () => {
    if (initializing) return initializing;
    set({ isLoading: true, error: null });
    initializing = (async () => {
      try {
        await initDatabase();
        const raw = await sessionStorage.get();
        // Old unprotected sessions require one fresh sign-in; data is retained.
        await AsyncStorage.removeItem("@AgroApp:user");
        if (raw) {
          let id = 0;
          try {
            id = Number(JSON.parse(raw).id);
          } catch {
            await sessionStorage.clear();
          }
          const current = id > 0 ? await UsuariosDB.getById(id) : null;
          if (current?.Estado === 1) {
            setDatabaseActor({
              id: current.IdUsuario,
              name: current.NombreCompleto,
            });
            set({ user: toSessionUser(current) });
          } else await sessionStorage.clear();
        }
      } catch {
        set({
          error: "No se pudo abrir la información local. Vuelve a intentarlo.",
        });
      } finally {
        set({ isLoading: false });
        initializing = null;
      }
    })();
    return initializing;
  },
  login: async (username, password) => {
    try {
      const current = await UsuariosDB.login(username.trim(), password);
      if (!current)
        return { success: false, message: "Revisa tu usuario y contraseña." };
      await sessionStorage.clear();
      await sessionStorage.set(JSON.stringify({ id: current.IdUsuario }));
      setDatabaseActor({ id: current.IdUsuario, name: current.NombreCompleto });
      set({ user: toSessionUser(current), error: null });
      return { success: true };
    } catch {
      return {
        success: false,
        message: "No se pudo iniciar sesión. Inténtalo de nuevo.",
      };
    }
  },
  logout: async () => {
    await sessionStorage.clear();
    setDatabaseActor(null);
    set({ user: null });
  },
}));
