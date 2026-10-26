import type { Ubicacion, NewUbicacion } from '../types/models';
import type { SQLiteBindValue } from 'expo-sqlite';
import { getDatabase } from './Database';

/**
 * Operaciones CRUD para la tabla Ubicaciones
 */

/** Obtener todas las ubicaciones */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Ubicacion>(
    'SELECT * FROM Ubicaciones ORDER BY Nombre'
  );
};

/** Obtener ubicación por ID */
export const getById = async (id: number) => {
  const db = await getDatabase();
  return await db.getFirstAsync<Ubicacion>(
    'SELECT * FROM Ubicaciones WHERE IdUbicacion = ?',
    [id]
  );
};

/** Crear una nueva ubicación */
export const create = async (data: NewUbicacion) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO Ubicaciones (Nombre, Tipo, Descripcion, Estado)
     VALUES (?, ?, ?, ?)`,
    [
      data.Nombre,
      data.Tipo || null,
      data.Descripcion || null,
      data.Estado !== undefined ? data.Estado : 1,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar una ubicación existente */
export const update = async (id: number, data: Partial<NewUbicacion>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.Nombre !== undefined) {
    fields.push('Nombre = ?');
    values.push(data.Nombre);
  }
  if (data.Tipo !== undefined) {
    fields.push('Tipo = ?');
    values.push(data.Tipo);
  }
  if (data.Descripcion !== undefined) {
    fields.push('Descripcion = ?');
    values.push(data.Descripcion);
  }
  if (data.Estado !== undefined) {
    fields.push('Estado = ?');
    values.push(data.Estado);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const result = await db.runAsync(
    `UPDATE Ubicaciones SET ${fields.join(', ')} WHERE IdUbicacion = ?`,
    values
  );
  return result.changes;
};

/** Eliminar (desactivar) una ubicación */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'UPDATE Ubicaciones SET Estado = 0 WHERE IdUbicacion = ?',
    [id]
  );
  return result.changes;
};

/** Obtener ubicaciones activas */
export const getActivas = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Ubicacion>(
    'SELECT * FROM Ubicaciones WHERE Estado = 1 ORDER BY Nombre'
  );
};

export const UbicacionesDB = { getAll, getById, create, update, remove, getActivas };
export default UbicacionesDB;


