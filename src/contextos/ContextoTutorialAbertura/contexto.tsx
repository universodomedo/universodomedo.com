'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { AberturaTutorialPayload } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { getSocket, useSocketEpoch } from 'Hooks/useEventoWs';
import { botoesVisiveisDoPasso, type BotoesVisiveisPassoTutorial } from 'Uteis/tutorial/botoesPassoTutorial';
import { ESTADO_INICIAL_TUTORIAL_ABERTURA, reducerTutorialAbertura } from './tutorialAberturaReducer';

export interface ContextoTutorialAberturaProps {
    aberturaAtual: AberturaTutorialPayload | null;
    indicePasso: number;
    temFila: boolean;
    ehVinculado: boolean;
    botoes: BotoesVisiveisPassoTutorial;
    enfileirar: (payload: AberturaTutorialPayload) => void;
    avancar: () => void;
    voltar: () => void;
    fechar: () => void;
    concluir: () => void;
};

const ContextoTutorialAbertura = createContext<ContextoTutorialAberturaProps | undefined>(undefined);

export function useContextoTutorialAbertura(): ContextoTutorialAberturaProps {
    const ctx = useContext(ContextoTutorialAbertura);
    if (!ctx) throw new Error('useContextoTutorialAbertura precisa estar dentro de ContextoTutorialAberturaProvider');
    return ctx;
};

export function ContextoTutorialAberturaProvider({ children }: { children: React.ReactNode }) {
    const [estado, dispatch] = useReducer(reducerTutorialAbertura, ESTADO_INICIAL_TUTORIAL_ABERTURA);
    const { estaAutenticado } = useContextoAutenticacao();
    const epoch = useSocketEpoch();

    const enfileirar = useCallback((payload: AberturaTutorialPayload) => dispatch({ tipo: 'ENFILEIRAR', payload }), []);
    const avancar = useCallback(() => dispatch({ tipo: 'AVANCAR' }), []);
    const voltar = useCallback(() => dispatch({ tipo: 'VOLTAR' }), []);
    const fechar = useCallback(() => dispatch({ tipo: 'FECHAR' }), []);
    const concluir = useCallback(() => dispatch({ tipo: 'CONCLUIR' }), []);

    // Etapa 11: estado 100% runtime. Logout OU queda de conexão (epoch) limpam o Tutorial aberto e a fila; reconexão começa vazia. RESET é idempotente (StrictMode-safe). Sem storage.
    useEffect(() => {
        if (!estaAutenticado || !getSocket()?.connected) dispatch({ tipo: 'RESET' });
    }, [estaAutenticado, epoch]);

    const ehVinculado = estado.aberturaAtual?.usuarioTutorial != null;
    const total = estado.aberturaAtual?.tutorial.passos.length ?? 0;
    const botoes = useMemo(() => botoesVisiveisDoPasso(estado.indicePasso, total, ehVinculado), [estado.indicePasso, total, ehVinculado]);

    const api = useMemo<ContextoTutorialAberturaProps>(() => ({ aberturaAtual: estado.aberturaAtual, indicePasso: estado.indicePasso, temFila: estado.fila.length > 0, ehVinculado, botoes, enfileirar, avancar, voltar, fechar, concluir }), [estado.aberturaAtual, estado.indicePasso, estado.fila.length, ehVinculado, botoes, enfileirar, avancar, voltar, fechar, concluir]);

    return <ContextoTutorialAbertura.Provider value={api}>{children}</ContextoTutorialAbertura.Provider>;
};
