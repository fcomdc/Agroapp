import type { NfcTag, NewNfcTag } from '../../types/models';
import type { SQLiteBindValue } from 'expo-sqlite';
import { getDatabase } from '../Database';

/**
 * Operaciones CRUD para la tabla NFC
 */

/** Obtener todos los registros NFC con datos del bovino */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<NfcTag>(
    `SELECT n.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino
     FROM NFC n
     INNER JOIN Bovinos b ON n.IdBovino = b.IdBovino
     ORDER BY n.FechaAsignacion DESC`
  );
};

/** Obtener registros NFC por bovino */
export const getByBovino = async (idBovino: number) => {
  const db = await getDatabase();
  return await db.getAllAsync<NfcTag>(
    'SELECT * FROM NFC WHERE IdBovino = ? ORDER BY FechaAsignacion DESC',
    [idBovino]
  );
};

/** Crear un nuevo registro NFC */
export const create = async (data: NewNfcTag) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO NFC (IdBovino, UID_NFC, TipoTag, Estado)
     VALUES (?, ?, ?, ?)`,
    [
      data.IdBovino,
      data.UID_NFC,
      data.TipoTag || null,
      data.Estado !== undefined ? data.Estado : 1,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un registro NFC */
export const update = async (id: number, data: Partial<NewNfcTag>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.IdBovino !== undefined) {
    fields.push('IdBovino = ?');
    values.push(data.IdBovino);
  }
  if (data.UID_NFC !== undefined) {
    fields.push('UID_NFC = ?');
    values.push(data.UID_NFC);
  }
  if (data.TipoTag !== undefined) {
    fields.push('TipoTag = ?');
    values.push(data.TipoTag);
  }
  if (data.Estado !== undefined) {
    fields.push('Estado = ?');
    values.push(data.Estado);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const result = await db.runAsync(
    `UPDATE NFC SET ${fields.join(', ')} WHERE IdNFC = ?`,
    values
  );
  return result.changes;
};

/** Eliminar (desactivar) un registro NFC */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'UPDATE NFC SET Estado = 0 WHERE IdNFC = ?',
    [id]
  );
  return result.changes;
};

/** Obtener registro NFC por UID */
export const getByUID = async (uid: string) => {
  const db = await getDatabase();
  return await db.getFirstAsync<NfcTag>(
    `SELECT n.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino
     FROM NFC n
     INNER JOIN Bovinos b ON n.IdBovino = b.IdBovino
     WHERE n.UID_NFC = ? AND n.Estado = 1`,
    [uid]
  );
};

export const NfcDB = { getAll, getByBovino, create, update, remove, getByUID };
export default NfcDB;


