import type { Database } from '../types/database';

// Additive migrations preserve databases created by earlier app builds.
export async function migrateDatabase(db: Database) {
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(Pesos)');
  for (const [name, type] of [['Perimetros', 'TEXT'], ['Longitudes', 'TEXT'], ['Metodo', 'TEXT']]) {
    if (!columns.some(c => c.name === name)) await db.execAsync(`ALTER TABLE Pesos ADD COLUMN ${name} ${type};`);
  }
  await db.execAsync(`CREATE TABLE IF NOT EXISTS OperacionesPendientes (
    IdOperacion TEXT PRIMARY KEY NOT NULL, Entidad TEXT NOT NULL, Accion TEXT NOT NULL,
    IdLocal INTEGER NOT NULL, DatosJson TEXT NOT NULL, FechaCreacion TEXT NOT NULL,
    Estado TEXT NOT NULL DEFAULT 'Pendiente'
  ); CREATE INDEX IF NOT EXISTS idx_operaciones_estado ON OperacionesPendientes(Estado);
  CREATE INDEX IF NOT EXISTS idx_pesos_bovino_fecha ON Pesos(IdBovino, FechaPeso);
  CREATE INDEX IF NOT EXISTS idx_reportes_bovino ON ReportesSalud(IdBovino);`);
}
