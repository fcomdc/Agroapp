import { apiRequest } from './apiClient';
import { syncRepository } from '../database/repositories/syncRepository';

// Proposed contract to agree with the ASP.NET Core backend. Never acknowledge
// an operation unless the response confirms the same stable operation UUID.
let running: Promise<number> | null = null;
export function pushPendingOperations() {
  if (running) return running;
  running = (async () => {
    const pending = await syncRepository.getPending();
    let count = 0;
    for (const operation of pending) {
      const ack = await apiRequest<{ operationId: string; accepted: boolean }>('/api/sync/operations', {
        method: 'POST', body: JSON.stringify({ operationId: operation.IdOperacion, entity: operation.Entidad, action: operation.Accion, localId: operation.IdLocal, createdAt: operation.FechaCreacion, ...JSON.parse(operation.DatosJson) }),
      });
      if (ack.operationId !== operation.IdOperacion || ack.accepted !== true) throw new Error('El servidor no confirmó este registro. Se mantiene pendiente.');
      await syncRepository.acknowledge(operation.IdOperacion);
      count++;
    }
    return count;
  })().finally(() => { running = null; });
  return running;
}
