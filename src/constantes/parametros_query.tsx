export const QUERY_PARAMS = {
    EPISODIO: 'episodio',
    PERSONAGEM: 'personagem',
    SESSAO: 'sessao',
    FICHA: 'ficha_temporaria',
} as const;

export type QueryParamKeys = keyof typeof QUERY_PARAMS;