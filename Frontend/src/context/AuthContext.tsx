import type { PropsWithChildren } from 'react';
import type { SessionUser, Usuario } from '../types/models';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase } from '../database/Database';
import { UsuariosDB } from '../database/UsuariosDB';

interface AuthValue {
  user: SessionUser | null;
  isLoading: boolean;
  login: (usuario: string, contrasena: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}
const toSessionUser = (record: Usuario): SessionUser => ({ ...record, id: record.IdUsuario, usuario: record.Usuario, nombre_completo: record.NombreCompleto, rol: record.Rol });
const AuthContext = createContext<AuthValue | null>(null);

const AUTH_STORAGE_KEY = '@AgroApp:user';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al iniciar la app
  useEffect(() => {
    const restoreSession = async () => {
      try {
        await initDatabase();
        const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          const saved = JSON.parse(storedUser);
          const current = await UsuariosDB.getById(saved.IdUsuario ?? saved.id);
          if (current?.Estado === 1) setUser(toSessionUser(current));
          else await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  /**
   * Iniciar sesión con usuario y contraseña
   * @param {string} usuario - Nombre de usuario
   * @param {string} contrasena - Contraseña del usuario
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const login = useCallback(async (usuario: string, contrasena: string) => {
    try {
      const result = await UsuariosDB.login(usuario, contrasena);

      if (result) {
        const userData = toSessionUser(result);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, message: 'Error al iniciar sesión. Intente nuevamente.' };
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, []);

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de autenticación
 * @returns {{ user: object|null, isLoading: boolean, login: Function, logout: Function }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;

