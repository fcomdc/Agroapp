import type { CriaParto, NewCriaParto } from "../../types/models";
import type { SQLiteBindValue } from "expo-sqlite";
import { getDatabase } from "../Database";

/**
 * Operaciones CRUD para la tabla CriasParto
 */

/** Obtener todas las crías con datos del parto y bovino asociado */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<CriaParto>(
    `SELECT c.*, p.FechaParto, p.TipoParto,
            b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino,
            madre.Codigo AS CodigoMadre, madre.Nombre AS NombreMadre
     FROM CriasParto c
     INNER JOIN Partos p ON c.IdParto = p.IdParto
     INNER JOIN Bovinos madre ON p.IdMadre = madre.IdBovino
     LEFT JOIN Bovinos b ON c.IdBovino = b.IdBovino
     ORDER BY p.FechaParto DESC`
  );
};

/** Obtener crías por parto */
export const getByParto = async (idParto: number) => {
  const db = await getDatabase();
  return await db.getAllAsync<CriaParto>(
    `SELECT c.*, b.Codigo AS CodigoBovino, b.Nombre AS NombreBovino
     FROM CriasParto c
     LEFT JOIN Bovinos b ON c.IdBovino = b.IdBovino
     WHERE c.IdParto = ?
     ORDER BY c.IdCria`,
    [idParto]
  );
};

/** Crear un nuevo registro de cría */
export const create = async (data: NewCriaParto) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO CriasParto (IdParto, IdBovino, Sexo, Nombre, PesoNacimiento, EstadoCria, Observaciones)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.IdParto,
      data.IdBovino || null,
      data.Sexo || null,
      data.Nombre || null,
      data.PesoNacimiento || null,
      data.EstadoCria || null,
      data.Observaciones || null,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un registro de cría */
export const update = async (id: number, data: Partial<NewCriaParto>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.IdParto !== undefined) {
    fields.push("IdParto = ?");
    values.push(data.IdParto);
  }
  if (data.IdBovino !== undefined) {
    fields.push("IdBovino = ?");
    values.push(data.IdBovino);
  }
  if (data.Sexo !== undefined) {
    fields.push("Sexo = ?");
    values.push(data.Sexo);
  }
  if (data.Nombre !== undefined) {
    fields.push("Nombre = ?");
    values.push(data.Nombre);
  }
  if (data.PesoNacimiento !== undefined) {
    fields.push("PesoNacimiento = ?");
    values.push(data.PesoNacimiento);
  }
  if (data.EstadoCria !== undefined) {
    fields.push("EstadoCria = ?");
    values.push(data.EstadoCria);
  }
  if (data.Observaciones !== undefined) {
    fields.push("Observaciones = ?");
    values.push(data.Observaciones);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const result = await db.runAsync(
    `UPDATE CriasParto SET ${fields.join(", ")} WHERE IdCria = ?`,
    values
  );
  return result.changes;
};

/** Eliminar un registro de cría */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync("DELETE FROM CriasParto WHERE IdCria = ?", [
    id,
  ]);
  return result.changes;
};

export const CriasPartoDB = { getAll, getByParto, create, update, remove };
export default CriasPartoDB;
