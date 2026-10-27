import type { Peso, NewPeso } from '../../types/models';
import type { SQLiteBindValue } from 'expo-sqlite';
import { getDatabase } from '../Database';

/**
 * Operaciones CRUD para la tabla Pesos
 */

/** Obtener todos los registros de peso con datos del bovino */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Peso>(
    `SELECT p.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            u.NombreCompleto AS NombreUsuario
     FROM Pesos p
     INNER JOIN Bovinos b ON p.IdBovino = b.IdBovino
     LEFT JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
     ORDER BY p.FechaPeso DESC`
  );
};

/** Obtener registros de peso por bovino */
export const getByBovino = async (idBovino: number) => {
  const db = await getDatabase();
  return await db.getAllAsync<Peso>(
    `SELECT p.*, u.NombreCompleto AS NombreUsuario
     FROM Pesos p
     LEFT JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
     WHERE p.IdBovino = ?
     ORDER BY p.FechaPeso DESC`,
    [idBovino]
  );
};


/** Crear un nuevo registro de peso */
export const create = async (data: NewPeso) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO Pesos (IdBovino, Peso, FechaPeso, IdUsuario, Observaciones, Perimetros, Longitudes, Metodo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.IdBovino,
      data.Peso,
      data.FechaPeso,
      data.IdUsuario || null,
      data.Observaciones || null,
      data.Perimetros || null, data.Longitudes || null, data.Metodo || null,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un registro de peso */
export const update = async (id: number, data: Partial<NewPeso>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.IdBovino !== undefined) {
    fields.push('IdBovino = ?');
    values.push(data.IdBovino);
  }
  if (data.Peso !== undefined) {
    fields.push('Peso = ?');
    values.push(data.Peso);
  }
  if (data.FechaPeso !== undefined) {
    fields.push('FechaPeso = ?');
    values.push(data.FechaPeso);
  }
  if (data.IdUsuario !== undefined) {
    fields.push('IdUsuario = ?');
    values.push(data.IdUsuario);
  }
  if (data.Observaciones !== undefined) {
    fields.push('Observaciones = ?');
    values.push(data.Observaciones);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const result = await db.runAsync(
    `UPDATE Pesos SET ${fields.join(', ')} WHERE IdPeso = ?`,
    values
  );
  return result.changes;
};

/** Eliminar un registro de peso */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'DELETE FROM Pesos WHERE IdPeso = ?',
    [id]
  );
  return result.changes;
};

/** Obtener el último peso registrado de un bovino */
export const getLatestByBovino = async (idBovino: number) => {
  const db = await getDatabase();
  return await db.getFirstAsync<Peso>(
    `SELECT p.*, u.NombreCompleto AS NombreUsuario
     FROM Pesos p
     LEFT JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
     WHERE p.IdBovino = ?
     ORDER BY p.FechaPeso DESC
     LIMIT 1`,
    [idBovino]
  );
};

export const PesosDB = { getAll, getByBovino, create, insert: create, update, remove, delete: remove, getLatestByBovino };
export default PesosDB;




