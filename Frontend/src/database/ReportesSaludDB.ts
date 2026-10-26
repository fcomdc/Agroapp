import type { ReporteSalud, NewReporteSalud } from '../types/models';
import type { SQLiteBindValue } from 'expo-sqlite';
import { getDatabase } from './Database';

/**
 * Operaciones CRUD para la tabla ReportesSalud
 */

/** Obtener todos los reportes de salud con datos del bovino y usuario */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<ReporteSalud>(
    `SELECT r.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            u.NombreCompleto AS NombreUsuario
     FROM ReportesSalud r
     INNER JOIN Bovinos b ON r.IdBovino = b.IdBovino
     LEFT JOIN Usuarios u ON r.IdUsuario = u.IdUsuario
     ORDER BY r.FechaReporte DESC`
  );
};

/** Obtener reportes de salud por bovino */
export const getByBovino = async (idBovino: number) => {
  const db = await getDatabase();
  return await db.getAllAsync<ReporteSalud>(
    `SELECT r.*, u.NombreCompleto AS NombreUsuario
     FROM ReportesSalud r
     LEFT JOIN Usuarios u ON r.IdUsuario = u.IdUsuario
     WHERE r.IdBovino = ?
     ORDER BY r.FechaReporte DESC`,
    [idBovino]
  );
};

/** Crear un nuevo reporte de salud */
export const create = async (data: NewReporteSalud) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO ReportesSalud (IdBovino, IdUsuario, FechaReporte, Sintomas, Observaciones, Gravedad, Estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.IdBovino,
      data.IdUsuario || null,
      data.FechaReporte || new Date().toISOString().slice(0, 19).replace('T', ' '),
      data.Sintomas || null,
      data.Observaciones || null,
      data.Gravedad,
      data.Estado || 'Pendiente',
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un reporte de salud */
export const update = async (id: number, data: Partial<NewReporteSalud>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.IdBovino !== undefined) {
    fields.push('IdBovino = ?');
    values.push(data.IdBovino);
  }
  if (data.IdUsuario !== undefined) {
    fields.push('IdUsuario = ?');
    values.push(data.IdUsuario);
  }
  if (data.FechaReporte !== undefined) {
    fields.push('FechaReporte = ?');
    values.push(data.FechaReporte);
  }
  if (data.Sintomas !== undefined) {
    fields.push('Sintomas = ?');
    values.push(data.Sintomas);
  }
  if (data.Observaciones !== undefined) {
    fields.push('Observaciones = ?');
    values.push(data.Observaciones);
  }
  if (data.Gravedad !== undefined) {
    fields.push('Gravedad = ?');
    values.push(data.Gravedad);
  }
  if (data.Estado !== undefined) {
    fields.push('Estado = ?');
    values.push(data.Estado);
  }
  if (data.FechaAtencion !== undefined) {
    fields.push('FechaAtencion = ?');
    values.push(data.FechaAtencion);
  }
  if (data.Diagnostico !== undefined) {
    fields.push('Diagnostico = ?');
    values.push(data.Diagnostico);
  }
  if (data.Tratamiento !== undefined) {
    fields.push('Tratamiento = ?');
    values.push(data.Tratamiento);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const result = await db.runAsync(
    `UPDATE ReportesSalud SET ${fields.join(', ')} WHERE IdReporte = ?`,
    values
  );
  return result.changes;
};

/** Eliminar un reporte de salud */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'DELETE FROM ReportesSalud WHERE IdReporte = ?',
    [id]
  );
  return result.changes;
};

/** Obtener reportes por estado */
export const getByEstado = async (estado: string) => {
  const db = await getDatabase();
  return await db.getAllAsync<ReporteSalud>(
    `SELECT r.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            u.NombreCompleto AS NombreUsuario
     FROM ReportesSalud r
     INNER JOIN Bovinos b ON r.IdBovino = b.IdBovino
     LEFT JOIN Usuarios u ON r.IdUsuario = u.IdUsuario
     WHERE r.Estado = ?
     ORDER BY r.FechaReporte DESC`,
    [estado]
  );
};

/** Obtener reportes pendientes (Pendiente o EnRevision) */
export const getPendientes = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<ReporteSalud>(
    `SELECT r.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            u.NombreCompleto AS NombreUsuario
     FROM ReportesSalud r
     INNER JOIN Bovinos b ON r.IdBovino = b.IdBovino
     LEFT JOIN Usuarios u ON r.IdUsuario = u.IdUsuario
     WHERE r.Estado IN ('Pendiente', 'EnRevision')
     ORDER BY
       CASE r.Gravedad
         WHEN 'Critica' THEN 1
         WHEN 'Alta' THEN 2
         WHEN 'Media' THEN 3
         WHEN 'Baja' THEN 4
       END,
       r.FechaReporte DESC`
  );
};

/** Atender un reporte: registrar diagnóstico y tratamiento */
export const atender = async (id: number, diagnostico: string, tratamiento: string) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `UPDATE ReportesSalud
     SET Diagnostico = ?, Tratamiento = ?, Estado = 'Atendido',
         FechaAtencion = datetime('now', 'localtime')
     WHERE IdReporte = ?`,
    [diagnostico, tratamiento, id]
  );
  return result.changes;
};

export const ReportesSaludDB = { getAll, getByBovino, create, update, remove, getByEstado, getPendientes, atender };
export default ReportesSaludDB;


