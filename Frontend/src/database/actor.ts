let actor: { id: number; name: string } | null = null;
export const setDatabaseActor = (value: typeof actor) => { actor = value; };
export const getDatabaseActor = () => actor;
