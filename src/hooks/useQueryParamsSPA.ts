'use client';

import { useCallback } from 'react';

type QueryParamValor = string | number | null | undefined;

interface AtualizarQueryParamsSPAParams {
    [chave: string]: QueryParamValor;
};

interface AtualizarQueryParamsSPAOpcoes {
    modo?: 'replace' | 'push';
};

export function useQueryParamsSPA() {
    const atualizarQueryParamsSPA = useCallback((paramsAtualizados: AtualizarQueryParamsSPAParams, opcoes?: AtualizarQueryParamsSPAOpcoes): void => {
        const urlAtual = new URL(window.location.href);

        Object.entries(paramsAtualizados).forEach(([chave, valor]) => {
            if (valor === null || valor === undefined || valor === 0 || valor === '') {
                urlAtual.searchParams.delete(chave);
                return;
            }

            urlAtual.searchParams.set(chave, String(valor));
        });

        const novaURL = `${urlAtual.pathname}${urlAtual.search}${urlAtual.hash}`;
        const modo = opcoes?.modo ?? 'replace';

        if (modo === 'push') {
            window.history.pushState(null, '', novaURL);
            return;
        }

        window.history.replaceState(null, '', novaURL);
    }, []);

    return { atualizarQueryParamsSPA };
};