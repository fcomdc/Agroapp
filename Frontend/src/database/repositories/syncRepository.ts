import { getDatabase } from '../Database';
import type { PendingOperation } from '../mutations';
export const syncRepository = {
  getPending: async () => {
    const db = await getDatabase();
    return db.getAllAsync<PendingOperation>("SELECT * FROM OperacionesPendientes WHERE Estado = ? ORDER BY FechaCreacion", ['Pendiente']);
  },
  acknowledge: async (operationId: string) => {
    const db = await getDatabase();
    await db.runAsync('UPDATE OperacionesPendientes SET Estado = ? WHERE IdOperacion = ?', ['Confirmada', operationId]);
  },
};
