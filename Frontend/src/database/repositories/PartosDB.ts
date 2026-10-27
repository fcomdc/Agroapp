import type { Parto, NewParto } from '../../types/models';
import type { SQLiteBindValue } from 'expo-sqlite';
import { getDatabase } from '../Database';

/**
 * Operaciones CRUD para la tabla Partos
 */

/** Obtener todos los partos con datos de la madre */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Parto>(
    `SELECT p.*, b.Codigo AS CodigoMadre, b.Nombre AS NombreMadre,
            u.NombreCompleto AS NombreUsuario
     FROM Partos p
     INNER JOIN Bovinos b ON p.IdMadre = b.IdBovino
     LEFT JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
     ORDER BY p.FechaParto DESC`
  );
};

/** Obtener partos por madre */
export const getByMadre = async (idMadre: number) => {
  const db = await getDatabase();
  return await db.getAllAsync<Parto>(
    `SELECT p.*, u.NombreCompleto AS NombreUsuario
     FROM Partos p
     LEFT JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
     WHERE p.IdMadre = ?
     ORDER BY p.FechaParto DESC`,
    [idMadre]
  );
};

/** Crear un nuevo registro de parto */
export const create = async (data: NewParto) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO Partos (IdMadre, FechaParto, TipoParto, CantidadCrías, Observaciones, IdUsuario)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.IdMadre,
      data.FechaParto,
      data.TipoParto,
      data.CantidadCrías || 1,
      data.Observaciones || null,
      data.IdUsuario || null,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un registro de parto */
export const update = async (id: number, data: Partial<NewParto>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.IdMadre !== undefined) {
    fields.push('IdMadre = ?');
    values.push(data.IdMadre);
  }
  if (data.FechaParto !== undefined) {
    fields.push('FechaParto = ?');
    values.push(data.FechaParto);
  }
  if (data.TipoParto !== undefined) {
    fields.push('TipoParto = ?');
    values.push(data.TipoParto);
  }
  if (data.CantidadCrías !== undefined) {
    fields.push('CantidadCrías = ?');
    values.push(data.CantidadCrías);
  }
  if (data.Observaciones !== undefined) {
    fields.push('Observaciones = ?');
    values.push(data.Observaciones);
  }
  if (data.IdUsuario !== undefined) {
    fields.push('IdUsuario = ?');
    values.push(data.IdUsuario);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const result = await db.runAsync(
    `UPDATE Partos SET ${fields.join(', ')} WHERE IdParto = ?`,
    values
  );
  return result.changes;
};

/** Eliminar un registro de parto */
export const remove = async (id: number) => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM CriasParto WHERE IdParto = ?', [id]);
  const result = await db.runAsync(
    'DELETE FROM Partos WHERE IdParto = ?',
    [id]
  );
  return result.changes;
};

export const PartosDB = { getAll, getByMadre, create, update, remove };
export default PartosDB;


