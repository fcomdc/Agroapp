import type { SQLiteBindValue } from 'expo-sqlite';
import type { Database, StorageRow, WriteResult } from '../types/database';
import { getNativeSQLite } from './NativeSQLite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// ADAPTADOR FALLBACK BASADO EN ASYNCSTORAGE (Para Expo Go / Web)
// ============================================================================

const STORAGE_PREFIX = '@AgroApp:table:';

const TABLES_CONFIG: Record<string, { pk: string; autoInc: number }> = {
  Usuarios: { pk: 'IdUsuario', autoInc: 1 },
  Ubicaciones: { pk: 'IdUbicacion', autoInc: 1 },
  Bovinos: { pk: 'IdBovino', autoInc: 1 },
  NFC: { pk: 'IdNFC', autoInc: 1 },
  Pesos: { pk: 'IdPeso', autoInc: 1 },
  Vacunaciones: { pk: 'IdVacunacion', autoInc: 1 },
  ReportesSalud: { pk: 'IdReporte', autoInc: 1 },
  Reproducciones: { pk: 'IdReproduccion', autoInc: 1 },
  Partos: { pk: 'IdParto', autoInc: 1 },
  CriasParto: { pk: 'IdCria', autoInc: 1 },
};

class AsyncStorageDatabase implements Database {
  memoryCache: Record<string, StorageRow[]>;
  isLoaded: boolean;
  loadingPromise: Promise<void> | null;
  existingTables: Set<string>;
  writeQueue: Promise<unknown>;
  constructor() {
    this.memoryCache = {};
    this.isLoaded = false;
    this.loadingPromise = null;
    this.existingTables = new Set();
    this.writeQueue = Promise.resolve();
  }

  async loadAll() {
    if (this.isLoaded) return;
    if (this.loadingPromise) return this.loadingPromise;
    this.loadingPromise = this.loadTables();
    return this.loadingPromise;
  }

  async loadTables() {
    for (const tableName of Object.keys(TABLES_CONFIG)) {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_PREFIX + tableName);
        if (raw !== null) {
          this.existingTables.add(tableName);
          const rows = JSON.parse(raw);
          if (!Array.isArray(rows)) throw new Error(`Tabla inválida: ${tableName}`);
          this.memoryCache[tableName] = rows;
        } else {
          this.memoryCache[tableName] = [];
        }
      } catch (e) {
        this.loadingPromise = null;
        throw e;
      }
    }
    this.isLoaded = true;
  }

  async saveTable(tableName: string) {
    try {
      const data = this.memoryCache[tableName] || [];
      await AsyncStorage.setItem(STORAGE_PREFIX + tableName, JSON.stringify(data));
    } catch (e) {
      console.error(`Error guardando tabla ${tableName}:`, e);
      throw e;
    }
  }

  getTable(name: string) {
    // Normalizar nombre de tabla
    const clean = name.replace(/[`"'\[\]]/g, '').trim();
    for (const key of Object.keys(TABLES_CONFIG)) {
      if (key.toLowerCase() === clean.toLowerCase()) {
        if (!this.memoryCache[key]) this.memoryCache[key] = [];
        return { name: key, data: this.memoryCache[key], config: TABLES_CONFIG[key] };
      }
    }
    return null;
  }

  async execAsync(_sql: string): Promise<void> {
    await this.loadAll();

    // Si la tabla Usuarios está vacía, inicializar datos por defecto
    const usuarios = this.memoryCache['Usuarios'] || [];
    if (!this.existingTables.has('Usuarios') && usuarios.length === 0) {
      usuarios.push({
        IdUsuario: 1,
        NombreCompleto: 'Administrador del Sistema',
        Usuario: 'admin',
        Contrasena: 'admin123',
        Rol: 'Administrador',
        Estado: 1,
        FechaRegistro: new Date().toISOString(),
      });
      this.memoryCache['Usuarios'] = usuarios;
      await this.saveTable('Usuarios');
    }

    // Datos de muestra iniciales si no hay ubicaciones
    const ubicaciones = this.memoryCache['Ubicaciones'] || [];
    if (!this.existingTables.has('Ubicaciones') && ubicaciones.length === 0) {
      ubicaciones.push(
        { IdUbicacion: 1, Nombre: 'Potrero La Esperanza', Tipo: 'Potrero', Descripcion: 'Pasto estrella con sombra', Estado: 1 },
        { IdUbicacion: 2, Nombre: 'Corral de Manejo #1', Tipo: 'Corral', Descripcion: 'Corral con embudo y báscula', Estado: 1 }
      );
      this.memoryCache['Ubicaciones'] = ubicaciones;
      await this.saveTable('Ubicaciones');
    }

    // Bovinos iniciales de muestra si no hay
    const bovinos = this.memoryCache['Bovinos'] || [];
    if (!this.existingTables.has('Bovinos') && bovinos.length === 0) {
      bovinos.push(
        {
          IdBovino: 1,
          Codigo: 'BOV-001',
          Nombre: 'Esperanza',
          Sexo: 'H',
          FechaNacimiento: '2022-04-10',
          Raza: 'Gyr Lechero',
          Color: 'Blanco / Rojo',
          IdUbicacion: 1,
          Estado: 'Activo',
          Observaciones: 'Vaca lechera reproductora',
          FechaRegistro: new Date().toISOString(),
        },
        {
          IdBovino: 2,
          Codigo: 'BOV-002',
          Nombre: 'Toro Relámpago',
          Sexo: 'M',
          FechaNacimiento: '2021-08-15',
          Raza: 'Brahman Gris',
          Color: 'Gris Claro',
          IdUbicacion: 1,
          Estado: 'Activo',
          Observaciones: 'Semental reproductor',
          FechaRegistro: new Date().toISOString(),
        }
      );
      this.memoryCache['Bovinos'] = bovinos;
      await this.saveTable('Bovinos');
    }

    return;
  }

  runAsync(sql: string, params: SQLiteBindValue[] = []): Promise<WriteResult> {
    const operation = this.writeQueue.then(async () => {
      await this.loadAll();
      const before = JSON.parse(JSON.stringify(this.memoryCache));
      try {
        return await this.executeRun(sql, params);
      } catch (error) {
        this.memoryCache = before;
        throw error;
      }
    });
    this.writeQueue = operation.catch(() => {});
    return operation;
  }

  async executeRun(sql: string, params: SQLiteBindValue[] = []): Promise<WriteResult> {
    await this.loadAll();
    sql = sql.replace(/\s+/g, ' ').trim();

    // 1. INSERT
    const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES/i);
    if (insertMatch) {
      const targetTable = this.getTable(insertMatch[1]);
      if (targetTable) {
        const cols = insertMatch[2].split(',').map((c) => c.replace(/[`"'\[\]]/g, '').trim());
        const newRecord: StorageRow = {};

        // Auto ID
        let maxId = 0;
        targetTable.data.forEach((r) => {
          const val = Number(r[targetTable.config.pk]);
          if (val && val > maxId) maxId = val;
        });
        const newId = maxId + 1;
        newRecord[targetTable.config.pk] = newId;

        // Asignar columnas pasadas por parámetro
        cols.forEach((col, idx) => {
          newRecord[col] = params[idx] !== undefined ? params[idx] : null;
        });

        if (!newRecord.FechaRegistro) {
          newRecord.FechaRegistro = new Date().toISOString();
        }

        const unique = ({ Usuarios: 'Usuario', Bovinos: 'Codigo', NFC: 'UID_NFC' } as Record<string, string>)[targetTable.name];
        if (unique && targetTable.data.some(row => row[unique] === newRecord[unique])) {
          throw new Error('El identificador ya está registrado');
        }
        if (targetTable.name === 'NFC') newRecord.FechaAsignacion = new Date().toISOString();
        targetTable.data.push(newRecord);
        await this.saveTable(targetTable.name);
        return { lastInsertRowId: newId, changes: 1 };
      }
    }

    // 2. UPDATE
    const updateMatch = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+)$/i);
    if (updateMatch) {
      const targetTable = this.getTable(updateMatch[1]);
      if (targetTable) {
        // En nuestros queries, el último parámetro siempre es el ID
        const idParam = params[params.length - 1];

        let changes = 0;
        targetTable.data = targetTable.data.map((item) => {
          if (String(item[targetTable.config.pk]) === String(idParam)) {
            changes++;
            // Aplicar campos
            if (sql.includes("Estado = 'Fallecido'")) {
              item.Estado = 'Fallecido';
            } else if (sql.includes('Estado = 0')) {
              item.Estado = 0;
            } else if (sql.includes("Estado = 'Atendido'")) {
              item.Estado = 'Atendido';
              item.Diagnostico = params[0];
              item.Tratamiento = params[1];
              item.FechaAtencion = new Date().toISOString();
            } else {
              // Set dinámico según params
              const setParts = updateMatch[2].split(',');
              setParts.forEach((part, i) => {
                const colName = part.split('=')[0].replace(/[`"'\[\]]/g, '').trim();
                if (params[i] !== undefined) {
                  item[colName] = params[i];
                }
              });
            }
          }
          return item;
        });

        if (changes > 0) {
          this.memoryCache[targetTable.name] = targetTable.data;
          await this.saveTable(targetTable.name);
        }
        return { changes, lastInsertRowId: 0 };
      }
    }

    // 3. DELETE
    const deleteMatch = sql.match(/DELETE\s+FROM\s+(\w+)\s+WHERE\s+(\w+)\s*=\s*\?/i);
    if (deleteMatch) {
      const targetTable = this.getTable(deleteMatch[1]);
      if (targetTable) {
        const idParam = params[0];
        const beforeLen = targetTable.data.length;
        targetTable.data = targetTable.data.filter(
          (item) => String(item[deleteMatch[2]]) !== String(idParam)
        );
        const changes = beforeLen - targetTable.data.length;
        if (changes > 0) {
          this.memoryCache[targetTable.name] = targetTable.data;
          await this.saveTable(targetTable.name);
        }
        return { changes, lastInsertRowId: 0 };
      }
    }

    return { changes: 0, lastInsertRowId: 0 };
  }

  async selectRows(sql: string, params: SQLiteBindValue[] = []) {
    await this.loadAll();

    // Query de conteo COUNT(*)
    if (sql.includes('COUNT(*)')) {
      const tableMatch = sql.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        const targetTable = this.getTable(tableMatch[1]);
        if (targetTable) {
          let list = targetTable.data;
          if (sql.includes("Estado = 'Activo'")) {
            list = list.filter((x) => x.Estado === 'Activo' || x.Estado === 1);
          }
          return [{ total: list.length }];
        }
      }
      return [{ total: 0 }];
    }

    // Determinar tabla principal
    const fromMatch = sql.match(/FROM\s+(\w+)/i);
    if (!fromMatch) return [];

    const targetTable = this.getTable(fromMatch[1]);
    if (!targetTable) return [];

    let results = [...targetTable.data];

    // Simular JOINs comunes
    const ubicaciones = this.memoryCache['Ubicaciones'] || [];
    const usuarios = this.memoryCache['Usuarios'] || [];
    const bovinos = this.memoryCache['Bovinos'] || [];

    results = results.map((item) => {
      const enriched = { ...item };

      if (targetTable.name === 'CriasParto' && sql.includes('JOIN Partos')) {
        const parto = (this.memoryCache.Partos || []).find(p => p.IdParto === item.IdParto);
        if (parto) {
          enriched.FechaParto = parto.FechaParto;
          enriched.TipoParto = parto.TipoParto;
          enriched.IdMadre = parto.IdMadre;
        }
      }

      // Join Ubicaciones
      if (enriched.IdUbicacion) {
        const u = ubicaciones.find((x) => x.IdUbicacion === enriched.IdUbicacion);
        if (u) enriched.NombreUbicacion = u.Nombre;
      }

      // Join Usuarios
      if (enriched.IdUsuario) {
        const usr = usuarios.find((x) => x.IdUsuario === enriched.IdUsuario);
        if (usr) enriched.NombreUsuario = usr.NombreCompleto;
      }

      // Join Bovinos (para Vacunaciones, Pesos, NFC, Reportes)
      if (enriched.IdBovino) {
        const b = bovinos.find((x) => x.IdBovino === enriched.IdBovino);
        if (b) {
          enriched.CodigoBovino = b.Codigo;
          enriched.NombreBovino = b.Nombre;
        }
      }

      // Join Madre (para Partos)
      if (enriched.IdMadre) {
        const m = bovinos.find((x) => x.IdBovino === enriched.IdMadre);
        if (m) {
          enriched.CodigoMadre = m.Codigo;
          enriched.NombreMadre = m.Nombre;
        }
      }

      return enriched;
    });

    const where = sql.match(/WHERE\s+([\s\S]+?)(?:ORDER BY|LIMIT|$)/i)?.[1] || '';
    let paramIndex = 0;
    const checks: ((row: StorageRow) => boolean)[] = [];
    const predicate = /(?:(\w+)\.)?(\w+)\s*(=\s*(\?|'[^']*'|\d+)|LIKE\s*\?|IN\s*\(([^)]+)\)|IS NOT NULL|>=\s*date\('now', 'localtime'\))/gi;
    for (const match of where.matchAll(predicate)) {
      const [, alias, field, operation, literal, members] = match;
      const expected = operation.includes('?') ? params[paramIndex++] : literal?.replace(/^'|'$/g, '');
      checks.push(row => {
        const source = alias === 'b' && targetTable.name !== 'Bovinos'
          ? bovinos.find(b => b.IdBovino === row.IdBovino) : row;
        const actual = source?.[field];
        if (operation.startsWith('LIKE')) {
          return actual != null && String(actual).toLowerCase().includes(String(expected).replace(/%/g, '').toLowerCase());
        }
        if (operation.startsWith('IN')) return members.split(',').map(v => v.trim().replace(/^'|'$/g, '')).includes(String(actual));
        if (operation === 'IS NOT NULL') return actual != null;
        if (operation.startsWith('>=')) {
          const now = new Date();
          const today = [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
          return actual != null && String(actual) >= today;
        }
        return actual != null && String(actual) === String(expected);
      });
    }
    results = results.filter(row => /\sOR\s/i.test(where) ? checks.some(check => check(row)) : checks.every(check => check(row)));

    const order = sql.match(/ORDER BY\s+([\s\S]+?)(?:LIMIT|$)/i)?.[1]?.trim();
    if (order?.startsWith('CASE')) {
      const priority: Record<string, number> = { Critica: 1, Alta: 2, Media: 3, Baja: 4 };
      results.sort((a,b) => (priority[String(a.Gravedad)] ?? 5) - (priority[String(b.Gravedad)] ?? 5) || String(b.FechaReporte).localeCompare(String(a.FechaReporte)));
    } else if (order) {
      const [, field, direction] = order.match(/(?:\w+\.)?(\w+)(?:\s+(ASC|DESC))?/i) || [];
      results.sort((a,b) => {
        const comparison = typeof a[field] === 'number' ? Number(a[field]) - Number(b[field]) : String(a[field] ?? '').localeCompare(String(b[field] ?? ''));
        return direction === 'DESC' ? -comparison : comparison;
      });
    }

    // Respect explicit projections (especially credentials in Usuarios).
    const projection = sql.match(/^\s*SELECT\s+([\s\S]+?)\s+FROM/i)?.[1];
    if (projection && !projection.includes('*')) {
      const fields = projection.split(',').map(field => field.trim());
      results = results.map(row => Object.fromEntries(fields.map(field => [field, row[field]])));
    }

    // LIMIT
    if (sql.includes('LIMIT 1')) {
      return results.slice(0, 1);
    }

    return results;
  }

  async getAllAsync<T>(sql: string, params: SQLiteBindValue[] = []): Promise<T[]> {
    return await this.selectRows(sql, params) as unknown as T[];
  }

  async getFirstAsync<T>(sql: string, params: SQLiteBindValue[] = []): Promise<T | null> {
    const list = await this.getAllAsync<T>(sql, params);
    return list.length > 0 ? list[0] : null;
  }
}

// Instancia única
let databasePromise: Promise<Database> | null = null;
let initializationPromise: Promise<Database> | null = null;

const openDatabase = async (): Promise<Database> => {

  const savedTables = await AsyncStorage.getAllKeys();
  const hasLegacyData = savedTables.some(key => key.startsWith(STORAGE_PREFIX));
  const native = hasLegacyData ? null : await getNativeSQLite();
  if (native && typeof native.openDatabaseAsync === 'function') {
    try {
      const sqliteDb = await native.openDatabaseAsync('agroapp.db');
      await sqliteDb.execAsync('PRAGMA foreign_keys = ON;');
      await sqliteDb.execAsync('PRAGMA journal_mode = WAL;');
      const nativeDb: Database = {
        execAsync: sql => sqliteDb.execAsync(sql),
        runAsync: (sql, params = []) => sqliteDb.runAsync(sql, params),
        getAllAsync: (sql, params = []) => sqliteDb.getAllAsync(sql, params),
        getFirstAsync: (sql, params = []) => sqliteDb.getFirstAsync(sql, params),
      };

      return nativeDb;
    } catch (e) {
      console.warn('Fallo al abrir SQLite nativo, usando fallback:', e instanceof Error ? e.message : String(e));
    }
  }

  // Fallback con almacenamiento en AsyncStorage
  const fallback = new AsyncStorageDatabase();
  await fallback.loadAll();

  return fallback;
};

export const getDatabase = (): Promise<Database> => {
  if (!initializationPromise) {
    initializationPromise = initializeDatabase().catch(error => {
      initializationPromise = null;
      databasePromise = null;

      throw error;
    });
  }
  return initializationPromise;
};

export const initDatabase = getDatabase;

const initializeDatabase = async (): Promise<Database> => {
  databasePromise ??= openDatabase();
  const db = await databasePromise;

  // Si es SQLite nativo, crear las tablas en SQL
  if (typeof db.execAsync === 'function' && !(db instanceof AsyncStorageDatabase)) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Usuarios (
        IdUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
        NombreCompleto TEXT NOT NULL,
        Usuario TEXT NOT NULL UNIQUE,
        Contrasena TEXT NOT NULL,
        Rol TEXT NOT NULL CHECK (Rol IN ('Administrador', 'Trabajador', 'Veterinario')),
        Estado INTEGER DEFAULT 1,
        FechaRegistro TEXT DEFAULT (datetime('now', 'localtime'))
      );

      CREATE TABLE IF NOT EXISTS Ubicaciones (
        IdUbicacion INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL,
        Tipo TEXT,
        Descripcion TEXT,
        Estado INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS Bovinos (
        IdBovino INTEGER PRIMARY KEY AUTOINCREMENT,
        Codigo TEXT NOT NULL UNIQUE,
        Nombre TEXT,
        Sexo TEXT NOT NULL CHECK (Sexo IN ('M', 'H')),
        FechaNacimiento TEXT,
        Raza TEXT,
        Color TEXT,
        Foto TEXT,
        IdUbicacion INTEGER,
        Estado TEXT DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Vendido', 'Fallecido', 'Trasladado')),
        Observaciones TEXT,
        FechaRegistro TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (IdUbicacion) REFERENCES Ubicaciones(IdUbicacion)
      );

      CREATE TABLE IF NOT EXISTS NFC (
        IdNFC INTEGER PRIMARY KEY AUTOINCREMENT,
        IdBovino INTEGER NOT NULL,
        UID_NFC TEXT NOT NULL UNIQUE,
        TipoTag TEXT,
        Estado INTEGER DEFAULT 1,
        FechaAsignacion TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino)
      );

      CREATE TABLE IF NOT EXISTS Pesos (
        IdPeso INTEGER PRIMARY KEY AUTOINCREMENT,
        IdBovino INTEGER NOT NULL,
        Peso REAL NOT NULL CHECK (Peso > 0),
        FechaPeso TEXT NOT NULL,
        IdUsuario INTEGER,
        Observaciones TEXT,
        FechaRegistro TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino),
        FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
      );

      CREATE TABLE IF NOT EXISTS Vacunaciones (
        IdVacunacion INTEGER PRIMARY KEY AUTOINCREMENT,
        IdBovino INTEGER NOT NULL,
        FechaAplicacion TEXT NOT NULL,
        ProximaAplicacion TEXT,
        Dosis TEXT,
        Lote TEXT,
        IdUsuario INTEGER,
        Observaciones TEXT,
        FechaRegistro TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino),
        FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
      );

      CREATE TABLE IF NOT EXISTS ReportesSalud (
        IdReporte INTEGER PRIMARY KEY AUTOINCREMENT,
        IdBovino INTEGER NOT NULL,
        IdUsuario INTEGER NOT NULL,
        FechaReporte TEXT DEFAULT (datetime('now', 'localtime')),
        Sintomas TEXT NOT NULL,
        Observaciones TEXT,
        Gravedad TEXT NOT NULL CHECK (Gravedad IN ('Baja', 'Media', 'Alta', 'Critica')),
        Estado TEXT DEFAULT 'Pendiente' CHECK (Estado IN ('Pendiente', 'EnRevision', 'Atendido', 'Cerrado')),
        FechaAtencion TEXT,
        Diagnostico TEXT,
        Tratamiento TEXT,
        FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino),
        FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
      );

      CREATE TABLE IF NOT EXISTS Reproducciones (
        IdReproduccion INTEGER PRIMARY KEY AUTOINCREMENT,
        IdBovino INTEGER NOT NULL,
        FechaMonta TEXT,
        TipoReproduccion TEXT NOT NULL CHECK (TipoReproduccion IN ('Monta Natural', 'Inseminacion Artificial')),
        FechaInseminacion TEXT,
        Resultado TEXT DEFAULT 'Pendiente' CHECK (Resultado IN ('Pendiente', 'Preñada', 'No Preñada')),
        FechaConfirmacion TEXT,
        FechaProbableParto TEXT,
        Observaciones TEXT,
        IdUsuario INTEGER,
        FechaRegistro TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino),
        FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
      );

      CREATE TABLE IF NOT EXISTS Partos (
        IdParto INTEGER PRIMARY KEY AUTOINCREMENT,
        IdMadre INTEGER NOT NULL,
        FechaParto TEXT NOT NULL,
        TipoParto TEXT CHECK (TipoParto IN ('Normal', 'Asistido', 'Cesarea', 'Aborto')),
        CantidadCrías INTEGER DEFAULT 1 CHECK (CantidadCrías > 0),
        Observaciones TEXT,
        IdUsuario INTEGER,
        FechaRegistro TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (IdMadre) REFERENCES Bovinos(IdBovino),
        FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
      );

      CREATE TABLE IF NOT EXISTS CriasParto (
        IdCria INTEGER PRIMARY KEY AUTOINCREMENT,
        IdParto INTEGER NOT NULL,
        IdBovino INTEGER,
        Sexo TEXT NOT NULL CHECK (Sexo IN ('M', 'H')),
        Nombre TEXT,
        PesoNacimiento REAL,
        EstadoCria TEXT,
        Observaciones TEXT,
        FOREIGN KEY (IdParto) REFERENCES Partos(IdParto),
        FOREIGN KEY (IdBovino) REFERENCES Bovinos(IdBovino)
      );

      INSERT OR IGNORE INTO Usuarios (IdUsuario, NombreCompleto, Usuario, Contrasena, Rol, Estado)
      VALUES (1, 'Administrador del Sistema', 'admin', 'admin123', 'Administrador', 1);
    `);
  } else {
    // Inicializar fallback
    await db.execAsync('');
  }

  return db;
};

export default { getDatabase, initDatabase };


