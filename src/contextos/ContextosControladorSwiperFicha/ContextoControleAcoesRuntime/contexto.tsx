'use client';

import { createContext, useContext } from 'react';
import { Eventos_Envia, type CodigoRecuperarFichaRuntime, type EstadoTemporalSalaDeJogoRuntime, type KeyCombatenteMissaoFuncionalSalaDeJogoRuntime, type SalaDeJogo_Codigo } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';

interface ContextoControleAcoesRuntimeProps {
    executaAcao: (keyAcao: string, keyCombatenteAlvo?: KeyCombatenteMissaoFuncionalSalaDeJogoRuntime) => void;
    executaEsperar: () => void;
    executaPressionarInteragivel: (keyInteragivel: string) => void;
    executaSaqueItem: (keyItem: string) => void;
    estadoTemporalSalaJogo: EstadoTemporalSalaDeJogoRuntime | null;
};

const ContextoControleAcoesRuntime = createContext<ContextoControleAcoesRuntimeProps | undefined>(undefined);

export const useContextoControleAcoesRuntime = (): ContextoControleAcoesRuntimeProps => {
    const context = useContext(ContextoControleAcoesRuntime);
    if (!context) throw new Error('useContextoControleAcoesRuntime precisa estar dentro de um ContextoControleAcoesRuntime');
    return context;
};

export const ContextoControleAcoesRuntimeProvider = ({ children, codigoRecuperarFichaRuntime, codigoSala, estadoTemporalSalaJogo }: { children: React.ReactNode; codigoRecuperarFichaRuntime?: CodigoRecuperarFichaRuntime; codigoSala?: SalaDeJogo_Codigo; estadoTemporalSalaJogo?: EstadoTemporalSalaDeJogoRuntime | null; }) => {
    const { desativarAcoes } = useContextoFichaDePersonagem();

    function executaAcao(keyAcao: string, keyCombatenteAlvo?: KeyCombatenteMissaoFuncionalSalaDeJogoRuntime): void {
        if (desativarAcoes) return;
        if (!codigoRecuperarFichaRuntime) return;
        if (estadoTemporalSalaJogo && estadoTemporalSalaJogo.status === 'RODANDO') return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.executaAcao, { codigoRecuperarFichaRuntime, keyAcao, keyCombatenteAlvo });
    };

    function executaEsperar(): void {
        if (desativarAcoes) return;
        if (!codigoSala) return;
        if (!estadoTemporalSalaJogo || estadoTemporalSalaJogo.status === 'RODANDO') return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.jogadorEsperaSalaJogo, { codigoSala });
    };

    function executaSaqueItem(keyItem: string): void {
        if (desativarAcoes) return;
        if (!codigoSala) return;
        if (!estadoTemporalSalaJogo || estadoTemporalSalaJogo.status === 'RODANDO') return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.jogadorSacaItemSalaJogo, { codigoSala, keyItem });
    };

    // Pressionar um interagivel com acao autorada (v1: vitoria) — o servidor revalida percepcao+alcance e conclui. Sem gate de tempo: pressionar nao e acao temporizada.
    function executaPressionarInteragivel(keyInteragivel: string): void {
        if (desativarAcoes) return;
        if (!codigoSala) return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.jogadorPressionaInteragivelSalaJogo, { codigoSala, keyInteragivel });
    };

    return (
        <ContextoControleAcoesRuntime.Provider value={{ executaAcao, executaEsperar, executaPressionarInteragivel, executaSaqueItem, estadoTemporalSalaJogo: estadoTemporalSalaJogo ?? null }}>
            {children}
        </ContextoControleAcoesRuntime.Provider>
    );
};

export const ContextoControleAcoesRuntimeSomenteLeituraProvider = ({ children }: { children: React.ReactNode; }) => {
    function executaAcao(keyAcao: string, keyCombatenteAlvo?: KeyCombatenteMissaoFuncionalSalaDeJogoRuntime): void { void keyAcao; void keyCombatenteAlvo; return; };
    function executaEsperar(): void { return; };
    function executaPressionarInteragivel(keyInteragivel: string): void { void keyInteragivel; return; };
    function executaSaqueItem(keyItem: string): void { void keyItem; return; };

    return (
        <ContextoControleAcoesRuntime.Provider value={{ executaAcao, executaEsperar, executaPressionarInteragivel, executaSaqueItem, estadoTemporalSalaJogo: null }}>
            {children}
        </ContextoControleAcoesRuntime.Provider>
    );
};
