export const SCHAEFFER_VERSION = 'schaeffer-cm-kg-v1';
export function medianOfThree(readings: readonly number[]): number {
  if (readings.length !== 3 || readings.some(v => !Number.isFinite(v) || v <= 0)) throw new Error('Escribe tres lecturas positivas por dimensión.');
  return [...readings].sort((a, b) => a - b)[1];
}
export function estimateWeight(girths: readonly number[], lengths: readonly number[]) {
  const girth = medianOfThree(girths); const length = medianOfThree(lengths);
  // Exact conversion of (girth_inches² × length_inches / 300) pounds.
  const kg = 0.45359237 * length * girth ** 2 / (300 * 2.54 ** 3);
  return { girth, length, kg: Math.round(kg * 100) / 100, version: SCHAEFFER_VERSION };
}
export function dailyWeightChange(latest: { Peso: number; FechaPeso: string }, previous: { Peso: number; FechaPeso: string }) {
  const days = (Date.parse(`${latest.FechaPeso.slice(0, 10)}T00:00:00Z`) - Date.parse(`${previous.FechaPeso.slice(0, 10)}T00:00:00Z`)) / 86400000;
  return days > 0 ? { days, kgPerDay: (latest.Peso - previous.Peso) / days } : null;
}
