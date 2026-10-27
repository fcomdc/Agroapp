import { useLocalSearchParams } from 'expo-router';
export const positiveId = (value: string | string[] | undefined): number | undefined => {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
};
export function useRecordParams() {
  const params = useLocalSearchParams<{ id?: string; idBovino?: string; codigo?: string }>();
  return { id: positiveId(params.id) ?? 0, idBovino: positiveId(params.idBovino) ?? 0, codigo: params.codigo ?? '' };
}
