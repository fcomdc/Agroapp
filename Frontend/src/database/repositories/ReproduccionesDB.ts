import type { Reproduccion, NewReproduccion } from '../../types/models';
import type { SQLiteBindValue } from 'expo-sqlite';
import { getDatabase } from '../Database';

/**
 * Operaciones CRUD para la tabla Reproducciones
 */

/** Obtener todas las reproducciones con datos del bovino */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Reproduccion>(
    `SELECT r.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            u.NombreCompleto AS NombreUsuario
     FROM Reproducciones r
     INNER JOIN Bovinos b ON r.IdBovino = b.IdBovino
     LEFT JOIN Usuarios u ON r.IdUsuario = u.IdUsuario
     ORDER BY r.FechaRegistro DESC`
  );
};

/** Obtener reproducciones por bovino */
export const getByBovino = async (idBovino: number) => {
  const db = await getDatabase();
  return await db.getAllAsync<Reproduccion>(
    `SELECT r.*, u.NombreCompleto AS NombreUsuario
     FROM Reproducciones r
     LEFT JOIN Usuarios u ON r.IdUsuario = u.IdUsuario
     WHERE r.IdBovino = ?
     ORDER BY r.FechaRegistro DESC`,
    [idBovino]
  );
};

/** Crear un nuevo registro de reproducción */
export const create = async (data: NewReproduccion) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO Reproducciones (IdBovino, FechaMonta, TipoReproduccion, FechaInseminacion, Resultado, FechaConfirmacion, FechaProbableParto, Observaciones, IdUsuario)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.IdBovino,
      data.FechaMonta || null,
      data.TipoReproduccion || null,
      data.FechaInseminacion || null,
      data.Resultado || 'Pendiente',
      data.FechaConfirmacion || null,
      data.FechaProbableParto || null,
      data.Observaciones || null,
      data.IdUsuario || null,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un registro de reproducción */
export const update = async (id: number, data: Partial<NewReproduccion>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.IdBovino !== undefined) {
    fields.push('IdBovino = ?');
    values.push(data.IdBovino);
  }
  if (data.FechaMonta !== undefined) {
    fields.push('FechaMonta = ?');
    values.push(data.FechaMonta);
  }
  if (data.TipoReproduccion !== undefined) {
    fields.push('TipoReproduccion = ?');
    values.push(data.TipoReproduccion);
  }
  if (data.FechaInseminacion !== undefined) {
    fields.push('FechaInseminacion = ?');
    values.push(data.FechaInseminacion);
  }
  if (data.Resultado !== undefined) {
    fields.push('Resultado = ?');
    values.push(data.Resultado);
  }
  if (data.FechaConfirmacion !== undefined) {
    fields.push('FechaConfirmacion = ?');
    values.push(data.FechaConfirmacion);
  }
  if (data.FechaProbableParto !== undefined) {
    fields.push('FechaProbableParto = ?');
    values.push(data.FechaProbableParto);
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
    `UPDATE Reproducciones SET ${fields.join(', ')} WHERE IdReproduccion = ?`,
    values
  );
  return result.changes;
};

/** Eliminar un registro de reproducción */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'DELETE FROM Reproducciones WHERE IdReproduccion = ?',
    [id]
  );
  return result.changes;
};

/** Obtener bovinos preñadas */
export const getPreñadas = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Reproduccion>(
    `SELECT r.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            u.NombreCompleto AS NombreUsuario
     FROM Reproducciones r
     INNER JOIN Bovinos b ON r.IdBovino = b.IdBovino
     LEFT JOIN Usuarios u ON r.IdUsuario = u.IdUsuario
     WHERE r.Resultado = 'Preñada'
       AND b.Estado = 'Activo'
     ORDER BY r.FechaProbableParto ASC`
  );
};

export const ReproduccionesDB = { getAll, getByBovino, create, update, remove, getPreñadas };
export default ReproduccionesDB;


