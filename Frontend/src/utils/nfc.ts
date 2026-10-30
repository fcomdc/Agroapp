export const normalizeUid = (uid: string) =>
  uid
    .trim()
    .replace(/[:\s-]/g, "")
    .toUpperCase();
