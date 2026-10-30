import type { SQLiteBindValue } from "expo-sqlite";

export type StorageValue = SQLiteBindValue | undefined;
export type StorageRow = Record<string, StorageValue>;
export interface WriteResult {
  changes: number;
  lastInsertRowId: number;
}
export interface Database {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: SQLiteBindValue[]): Promise<WriteResult>;
  getAllAsync<T>(sql: string, params?: SQLiteBindValue[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: SQLiteBindValue[]): Promise<T | null>;
}
