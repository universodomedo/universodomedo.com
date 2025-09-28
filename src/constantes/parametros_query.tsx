export const QUERY_PARAMS = {
    EPISODIO: 'episodio',
    PERSONAGEM: 'personagem',
} as const;

export type QueryParamKeys = keyof typeof QUERY_PARAMS;