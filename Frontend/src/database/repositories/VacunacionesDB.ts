import type { Vacunacion, NewVacunacion } from '../../types/models';
import type { SQLiteBindValue } from 'expo-sqlite';
import { getDatabase } from '../Database';

/**
 * Operaciones CRUD para la tabla Vacunaciones
 */

/** Obtener todas las vacunaciones con datos del bovino */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Vacunacion>(
    `SELECT v.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            u.NombreCompleto AS NombreUsuario
     FROM Vacunaciones v
     INNER JOIN Bovinos b ON v.IdBovino = b.IdBovino
     LEFT JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
     ORDER BY v.FechaAplicacion DESC`
  );
};

/** Obtener vacunaciones por bovino */
export const getByBovino = async (idBovino: number) => {
  const db = await getDatabase();
  return await db.getAllAsync<Vacunacion>(
    `SELECT v.*, u.NombreCompleto AS NombreUsuario
     FROM Vacunaciones v
     LEFT JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
     WHERE v.IdBovino = ?
     ORDER BY v.FechaAplicacion DESC`,
    [idBovino]
  );
};

/** Crear un nuevo registro de vacunación */
export const create = async (data: NewVacunacion) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO Vacunaciones (IdBovino, FechaAplicacion, ProximaAplicacion, Dosis, Lote, IdUsuario, Observaciones)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.IdBovino,
      data.FechaAplicacion,
      data.ProximaAplicacion || null,
      data.Dosis || null,
      data.Lote || null,
      data.IdUsuario || null,
      data.Observaciones || null,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un registro de vacunación */
export const update = async (id: number, data: Partial<NewVacunacion>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.IdBovino !== undefined) {
    fields.push('IdBovino = ?');
    values.push(data.IdBovino);
  }
  if (data.FechaAplicacion !== undefined) {
    fields.push('FechaAplicacion = ?');
    values.push(data.FechaAplicacion);
  }
  if (data.ProximaAplicacion !== undefined) {
    fields.push('ProximaAplicacion = ?');
    values.push(data.ProximaAplicacion);
  }
  if (data.Dosis !== undefined) {
    fields.push('Dosis = ?');
    values.push(data.Dosis);
  }
  if (data.Lote !== undefined) {
    fields.push('Lote = ?');
    values.push(data.Lote);
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
    `UPDATE Vacunaciones SET ${fields.join(', ')} WHERE IdVacunacion = ?`,
    values
  );
  return result.changes;
};

/** Eliminar un registro de vacunación */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'DELETE FROM Vacunaciones WHERE IdVacunacion = ?',
    [id]
  );
  return result.changes;
};

/** Obtener próximas vacunaciones (fecha futura o hoy) */
export const getProximas = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Vacunacion>(
    `SELECT v.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            u.NombreCompleto AS NombreUsuario
     FROM Vacunaciones v
     INNER JOIN Bovinos b ON v.IdBovino = b.IdBovino
     LEFT JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
     WHERE v.ProximaAplicacion IS NOT NULL
       AND v.ProximaAplicacion >= date('now', 'localtime')
       AND b.Estado = 'Activo'
     ORDER BY v.ProximaAplicacion ASC`
  );
};

export const VacunacionesDB = { getAll, getByBovino, create, update, remove, getProximas };
export default VacunacionesDB;


