import type { Bovino, NewBovino } from '../types/models';
import type { SQLiteBindValue } from 'expo-sqlite';
import { getDatabase } from './Database';

/**
 * Operaciones CRUD para la tabla Bovinos
 */

/** Obtener todos los bovinos con su ubicación */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Bovino>(
    `SELECT b.*, u.Nombre AS NombreUbicacion
     FROM Bovinos b
     LEFT JOIN Ubicaciones u ON b.IdUbicacion = u.IdUbicacion
     ORDER BY b.FechaRegistro DESC`
  );
};

/** Obtener bovino por ID con su ubicación */
export const getById = async (id: number) => {
  const db = await getDatabase();
  return await db.getFirstAsync<Bovino>(
    `SELECT b.*, u.Nombre AS NombreUbicacion
     FROM Bovinos b
     LEFT JOIN Ubicaciones u ON b.IdUbicacion = u.IdUbicacion
     WHERE b.IdBovino = ?`,
    [id]
  );
};

/** Obtener bovino por código */
export const getByCode = async (codigo: string) => {
  const db = await getDatabase();
  return await db.getFirstAsync<Bovino>(
    `SELECT b.*, u.Nombre AS NombreUbicacion
     FROM Bovinos b
     LEFT JOIN Ubicaciones u ON b.IdUbicacion = u.IdUbicacion
     WHERE b.Codigo = ?`,
    [codigo]
  );
};

/** Crear un nuevo bovino */
export const create = async (data: NewBovino) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO Bovinos (Codigo, Nombre, Sexo, FechaNacimiento, Raza, Color, Foto, IdUbicacion, Estado, Observaciones)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.Codigo,
      data.Nombre || null,
      data.Sexo,
      data.FechaNacimiento || null,
      data.Raza || null,
      data.Color || null,
      data.Foto || null,
      data.IdUbicacion || null,
      data.Estado || 'Activo',
      data.Observaciones || null,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un bovino existente */
export const update = async (id: number, data: Partial<NewBovino>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.Codigo !== undefined) {
    fields.push('Codigo = ?');
    values.push(data.Codigo);
  }
  if (data.Nombre !== undefined) {
    fields.push('Nombre = ?');
    values.push(data.Nombre);
  }
  if (data.Sexo !== undefined) {
    fields.push('Sexo = ?');
    values.push(data.Sexo);
  }
  if (data.FechaNacimiento !== undefined) {
    fields.push('FechaNacimiento = ?');
    values.push(data.FechaNacimiento);
  }
  if (data.Raza !== undefined) {
    fields.push('Raza = ?');
    values.push(data.Raza);
  }
  if (data.Color !== undefined) {
    fields.push('Color = ?');
    values.push(data.Color);
  }
  if (data.Foto !== undefined) {
    fields.push('Foto = ?');
    values.push(data.Foto);
  }
  if (data.IdUbicacion !== undefined) {
    fields.push('IdUbicacion = ?');
    values.push(data.IdUbicacion);
  }
  if (data.Estado !== undefined) {
    fields.push('Estado = ?');
    values.push(data.Estado);
  }
  if (data.Observaciones !== undefined) {
    fields.push('Observaciones = ?');
    values.push(data.Observaciones);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const result = await db.runAsync(
    `UPDATE Bovinos SET ${fields.join(', ')} WHERE IdBovino = ?`,
    values
  );
  return result.changes;
};

/** Eliminar un bovino (cambiar estado a Fallecido) */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    "UPDATE Bovinos SET Estado = 'Fallecido' WHERE IdBovino = ?",
    [id]
  );
  return result.changes;
};

/** Obtener bovinos por ubicación */
export const getByUbicacion = async (idUbicacion: number) => {
  const db = await getDatabase();
  return await db.getAllAsync<Bovino>(
    `SELECT b.*, u.Nombre AS NombreUbicacion
     FROM Bovinos b
     LEFT JOIN Ubicaciones u ON b.IdUbicacion = u.IdUbicacion
     WHERE b.IdUbicacion = ?
     ORDER BY b.Nombre`,
    [idUbicacion]
  );
};

/** Obtener bovinos por estado */
export const getByEstado = async (estado: string) => {
  const db = await getDatabase();
  return await db.getAllAsync<Bovino>(
    `SELECT b.*, u.Nombre AS NombreUbicacion
     FROM Bovinos b
     LEFT JOIN Ubicaciones u ON b.IdUbicacion = u.IdUbicacion
     WHERE b.Estado = ?
     ORDER BY b.Nombre`,
    [estado]
  );
};

/** Obtener conteo total de bovinos activos */
export const getCount = async () => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM Bovinos WHERE Estado = 'Activo'"
  );
  return result?.total || 0;
};

/** Buscar bovinos por código o nombre */
export const search = async (query: string) => {
  const db = await getDatabase();
  const searchTerm = `%${query}%`;
  return await db.getAllAsync<Bovino>(
    `SELECT b.*, u.Nombre AS NombreUbicacion
     FROM Bovinos b
     LEFT JOIN Ubicaciones u ON b.IdUbicacion = u.IdUbicacion
     WHERE (b.Codigo LIKE ? OR b.Nombre LIKE ?)
     ORDER BY b.Codigo`,
    [searchTerm, searchTerm]
  );
};

export const BovinosDB = { getAll, getById, getByCode, create, insert: create, update, remove, delete: remove, getByUbicacion, getByEstado, getCount, search };
export default BovinosDB;




