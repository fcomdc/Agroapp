import type * as SQLite from 'expo-sqlite';

// The browser uses AsyncStorage, without loading the native SQLite bundle.
export const getNativeSQLite = async (): Promise<typeof SQLite | null> => null;

