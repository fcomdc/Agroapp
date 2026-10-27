import { randomUUID } from 'expo-crypto';
import { getDatabaseActor } from './actor';

export const entityKeys: Record<string, string> = {
  Bovinos: 'IdBovino', Ubicaciones: 'IdUbicacion', NFC: 'IdNFC', Pesos: 'IdPeso',
  Vacunaciones: 'IdVacunacion', ReportesSalud: 'IdReporte', Reproducciones: 'IdReproduccion',
  Partos: 'IdParto', CriasParto: 'IdCria',
};
export interface PendingOperation {
  IdOperacion: string; Entidad: string; Accion: string; IdLocal: number;
  DatosJson: string; FechaCreacion: string; Estado: string;
}
export function mutationTarget(sql: string) {
  const match = sql.trim().match(/^(INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+(\w+)/i);
  if (!match || !entityKeys[match[2]]) return null;
  return { entity: match[2], action: match[1].startsWith('INSERT') ? 'create' : match[1] === 'UPDATE' ? 'update' : 'delete', key: entityKeys[match[2]] };
}
export function makeOperation(entity: string, action: string, id: number, row: unknown): PendingOperation {
  return {
    IdOperacion: randomUUID(), Entidad: entity, Accion: action, IdLocal: id,
    DatosJson: JSON.stringify({ record: row, actor: getDatabaseActor(), baseVersion: null }),
    FechaCreacion: new Date().toISOString(), Estado: 'Pendiente',
  };
}
export const insertOperationSql = `INSERT INTO OperacionesPendientes
  (IdOperacion, Entidad, Accion, IdLocal, DatosJson, FechaCreacion, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)`;
export const operationValues = (o: PendingOperation) => [o.IdOperacion, o.Entidad, o.Accion, o.IdLocal, o.DatosJson, o.FechaCreacion, o.Estado];
