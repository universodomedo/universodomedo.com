export const QUERY_PARAMS = {
    EPISODIO: 'episodio',
} as const;

export type QueryParamKeys = keyof typeof QUERY_PARAMS;