'use client';

import { useMemo } from 'react';
import { FichaEmClient, J_DadosFichaEmJogo } from 'types-nora-api';

import { useCache } from 'Redux/hooks/useCache';
import { remontaFichaDeJogo } from 'Helpers/remontaFichaDeJogo';

export type UseFichaDeJogoResult = {
    ficha: FichaEmClient | null;
    carregando: boolean;
    erro: string | null;
};

export function useFichaDeJogo(JDadosFichaEmJogo: J_DadosFichaEmJogo): UseFichaDeJogoResult {
    const cache = useCache();

    const ficha = useMemo(() => {
        if (!cache.pronto) return null;

        try {
            return remontaFichaDeJogo(JDadosFichaEmJogo, cache.dados);
        } catch (err) {
            console.error(err);
            return null;
        }
    }, [JDadosFichaEmJogo, cache]);

    if (!cache.pronto) return { ficha: null, carregando: true, erro: null };
    if (!ficha) return { ficha: null, carregando: false, erro: 'Erro ao montar ficha' };

    return { ficha, carregando: false, erro: null };
};