import type { Usuario, UsuarioInput } from "../../types/models";
import type { SQLiteBindValue } from "expo-sqlite";
import { getDatabase } from "../Database";

/**
 * Operaciones CRUD para la tabla Usuarios
 */

/** Obtener todos los usuarios */
export const getAll = async () => {
  const db = await getDatabase();
  return await db.getAllAsync<Usuario>(
    "SELECT IdUsuario, NombreCompleto, Usuario, Rol, Estado, FechaRegistro FROM Usuarios ORDER BY NombreCompleto"
  );
};

/** Obtener usuario por ID */
export const getById = async (id: number) => {
  const db = await getDatabase();
  return await db.getFirstAsync<Usuario>(
    "SELECT IdUsuario, NombreCompleto, Usuario, Rol, Estado, FechaRegistro FROM Usuarios WHERE IdUsuario = ?",
    [id]
  );
};

/** Crear un nuevo usuario */
export const create = async (data: UsuarioInput) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO Usuarios (NombreCompleto, Usuario, Contrasena, Rol, Estado)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.NombreCompleto,
      data.Usuario,
      data.Contrasena,
      data.Rol,
      data.Estado !== undefined ? data.Estado : 1,
    ]
  );
  return result.lastInsertRowId;
};

/** Actualizar un usuario existente */
export const update = async (id: number, data: Partial<UsuarioInput>) => {
  const db = await getDatabase();
  const fields = [];
  const values: SQLiteBindValue[] = [];

  if (data.NombreCompleto !== undefined) {
    fields.push("NombreCompleto = ?");
    values.push(data.NombreCompleto);
  }
  if (data.Usuario !== undefined) {
    fields.push("Usuario = ?");
    values.push(data.Usuario);
  }
  if (data.Contrasena !== undefined) {
    fields.push("Contrasena = ?");
    values.push(data.Contrasena);
  }
  if (data.Rol !== undefined) {
    fields.push("Rol = ?");
    values.push(data.Rol);
  }
  if (data.Estado !== undefined) {
    fields.push("Estado = ?");
    values.push(data.Estado);
  }

  if (fields.length === 0) return 0;

  values.push(id);
  const result = await db.runAsync(
    `UPDATE Usuarios SET ${fields.join(", ")} WHERE IdUsuario = ?`,
    values
  );
  return result.changes;
};

/** Eliminar (desactivar) un usuario */
export const remove = async (id: number) => {
  const db = await getDatabase();
  const result = await db.runAsync(
    "UPDATE Usuarios SET Estado = 0 WHERE IdUsuario = ?",
    [id]
  );
  return result.changes;
};

/** Iniciar sesión: verificar credenciales */
export const login = async (usuario: string, contrasena: string) => {
  const db = await getDatabase();
  return await db.getFirstAsync<Usuario>(
    `SELECT IdUsuario, NombreCompleto, Usuario, Rol, Estado, FechaRegistro
     FROM Usuarios
     WHERE Usuario = ? AND Contrasena = ? AND Estado = 1`,
    [usuario, contrasena]
  );
};

/** Obtener usuarios por rol */
export const getByRol = async (rol: string) => {
  const db = await getDatabase();
  return await db.getAllAsync<Usuario>(
    "SELECT IdUsuario, NombreCompleto, Usuario, Rol, Estado, FechaRegistro FROM Usuarios WHERE Rol = ? AND Estado = 1 ORDER BY NombreCompleto",
    [rol]
  );
};

export const UsuariosDB = {
  getAll,
  getById,
  create,
  update,
  remove,
  login,
  getByRol,
};
export default UsuariosDB;
