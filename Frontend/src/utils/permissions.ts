import type { Role } from '../types/models';
export type Permission = 'manageHerd' | 'manageFarm' | 'manageUsers' | 'associateNfc' | 'diagnose' | 'record';
export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  if (permission === 'record') return true;
  if (permission === 'diagnose') return role === 'Veterinario';
  return role === 'Administrador';
}
