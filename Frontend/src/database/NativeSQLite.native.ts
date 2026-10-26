import type * as SQLite from 'expo-sqlite';
import { requireOptionalNativeModule } from 'expo';

export const getNativeSQLite = async (): Promise<typeof SQLite | null> => {
  if (!requireOptionalNativeModule('ExpoSQLite')) return null;
  return import('expo-sqlite');
};

