'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Eventos_Envia, type SalaDeJogo_Codigo } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';

export type DestinoMovimentacaoSalaJogo = {
    readonly x: number;
    readonly y: number;
};

export type ContextoMovimentacaoSalaJogoProps = {
    modoMovimentacaoAtivo: boolean;
    iniciaModoMovimentacao: () => void;
    cancelaModoMovimentacao: () => void;
    confirmaMovimentacao: (destino: DestinoMovimentacaoSalaJogo) => void;
};

const ContextoMovimentacaoSalaJogo = createContext<ContextoMovimentacaoSalaJogoProps | undefined>(undefined);

export function useContextoMovimentacaoSalaJogoOpcional(): ContextoMovimentacaoSalaJogoProps | null {
    return useContext(ContextoMovimentacaoSalaJogo) ?? null;
};

export function ContextoMovimentacaoSalaJogoProvider({ codigoSala, children }: { codigoSala: SalaDeJogo_Codigo; children: ReactNode; }) {
    const [modoMovimentacaoAtivo, setModoMovimentacaoAtivo] = useState(false);
    const iniciaModoMovimentacao = useCallback(() => setModoMovimentacaoAtivo(true), []);
    const cancelaModoMovimentacao = useCallback(() => setModoMovimentacaoAtivo(false), []);
    const confirmaMovimentacao = useCallback((destino: DestinoMovimentacaoSalaJogo) => {
        setModoMovimentacaoAtivo(false);
        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.jogadorMoveSerSalaJogo, { codigoSala, destino });
    }, [codigoSala]);

    const contexto = useMemo<ContextoMovimentacaoSalaJogoProps>(() => ({ modoMovimentacaoAtivo, iniciaModoMovimentacao, cancelaModoMovimentacao, confirmaMovimentacao }), [cancelaModoMovimentacao, confirmaMovimentacao, iniciaModoMovimentacao, modoMovimentacaoAtivo]);

    return (
        <ContextoMovimentacaoSalaJogo.Provider value={contexto}>
            {children}
        </ContextoMovimentacaoSalaJogo.Provider>
    );
};
