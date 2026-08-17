'use client';

import { createContext, useContext } from 'react';
import { Eventos_Envia, type CodigoRecuperarFichaRuntime, type EstadoTemporalSalaDeJogoRuntime, type KeyCombatenteMissaoFuncionalSalaDeJogoRuntime, type SalaDeJogo_Codigo, type TipoAcaoInteragivelSalaDeJogoRuntime } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';

interface ContextoControleAcoesRuntimeProps {
    executaAcao: (keyAcao: string, keyCombatenteAlvo?: KeyCombatenteMissaoFuncionalSalaDeJogoRuntime) => void;
    executaEsperar: () => void;
    executaPressionarInteragivel: (keyInteragivel: string, tipoAcao: TipoAcaoInteragivelSalaDeJogoRuntime) => void;
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

    // Executar uma acao autorada de interagivel ('vitoria' = Pressionar; 'sair_da_sala' = Sair) — o servidor revalida percepcao+alcance e roteia pelo tipo. Sem gate de tempo: nao e acao temporizada.
    function executaPressionarInteragivel(keyInteragivel: string, tipoAcao: TipoAcaoInteragivelSalaDeJogoRuntime): void {
        if (desativarAcoes) return;
        if (!codigoSala) return;

        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.jogadorPressionaInteragivelSalaJogo, { codigoSala, keyInteragivel, tipoAcao });
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
    function executaPressionarInteragivel(keyInteragivel: string, tipoAcao: TipoAcaoInteragivelSalaDeJogoRuntime): void { void keyInteragivel; void tipoAcao; return; };
    function executaSaqueItem(keyItem: string): void { void keyItem; return; };

    return (
        <ContextoControleAcoesRuntime.Provider value={{ executaAcao, executaEsperar, executaPressionarInteragivel, executaSaqueItem, estadoTemporalSalaJogo: null }}>
            {children}
        </ContextoControleAcoesRuntime.Provider>
    );
};
