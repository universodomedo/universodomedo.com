'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Eventos_Envia, Eventos_EnviaERecebe, type AberturaTutorialPayload } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';
import { eventoWs, getSocket, useSocketEpoch } from 'Hooks/useEventoWs';
import { botoesVisiveisDoPasso, type BotoesVisiveisPassoTutorial } from 'Uteis/tutorial/botoesPassoTutorial';
import { ESTADO_INICIAL_TUTORIAL_ABERTURA, reducerTutorialAbertura } from './tutorialAberturaReducer';

export interface ContextoTutorialAberturaProps {
    aberturaAtual: AberturaTutorialPayload | null;
    indicePasso: number;
    instanciaAberturaId: number;
    temFila: boolean;
    ehVinculado: boolean;
    botoes: BotoesVisiveisPassoTutorial;
    erroConclusao: string | null;
    concluindo: boolean;
    enfileirar: (payload: AberturaTutorialPayload) => void;
    avancar: () => void;
    voltar: () => void;
    fechar: () => void;
    confirmarAbertura: (idUsuarioTutorial: number) => void;
    concluir: (idUsuarioTutorial: number, instanciaAberturaId: number) => void;
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
    const { listar } = useContextoEventosUsuario();
    const epoch = useSocketEpoch();

    const [erroConclusao, setErroConclusao] = useState<string | null>(null);
    const [concluindo, setConcluindo] = useState(false);

    // Instância vigente em ref: callbacks WS tardios comparam contra ela sem capturar estado velho.
    const instanciaAtualRef = useRef(estado.instanciaAberturaId);
    instanciaAtualRef.current = estado.instanciaAberturaId;

    const enfileirar = useCallback((payload: AberturaTutorialPayload) => dispatch({ tipo: 'ENFILEIRAR', payload }), []);
    const avancar = useCallback(() => dispatch({ tipo: 'AVANCAR' }), []);
    const voltar = useCallback(() => dispatch({ tipo: 'VOLTAR' }), []);
    const fechar = useCallback(() => dispatch({ tipo: 'FECHAR' }), []);

    // Etapa 12: ACK de abertura (envia, fire-and-forget). Disparado pelo modal ao montar a abertura vinculada; sem reação ao resultado; nunca recarrega a Central.
    const confirmarAbertura = useCallback((idUsuarioTutorial: number) => { eventoWs(Eventos_Envia.Tutoriais.eventos.confirmarAberturaTutorial, { idUsuarioTutorial }); }, []);

    // Etapa 12: conclusão (envia-e-recebe) amarrada à instância capturada no clique. Sucesso: encerra SÓ se ainda for a instância vigente (reducer guarda) + recarrega a Central; erro: mantém aberto + retry, só na instância vigente.
    const concluir = useCallback((idUsuarioTutorial: number, instanciaAberturaId: number) => {
        setConcluindo(true);
        eventoWs(Eventos_EnviaERecebe.Tutoriais.eventos.concluirTutorial, { idUsuarioTutorial }, {
            onSuccess: () => {
                dispatch({ tipo: 'CONCLUIR_SE_ATUAL', instanciaAberturaId });
                listar();
                if (instanciaAtualRef.current === instanciaAberturaId) { setConcluindo(false); setErroConclusao(null); }
            },
            onError: () => { if (instanciaAtualRef.current === instanciaAberturaId) { setConcluindo(false); setErroConclusao('Não foi possível concluir o Tutorial. Tente novamente.'); } },
        });
    }, [listar]);

    // Etapa 11: estado 100% runtime. Logout OU queda de conexão (epoch) limpam o Tutorial aberto e a fila; reconexão começa vazia. Sem storage.
    useEffect(() => {
        if (!estaAutenticado || !getSocket()?.connected) dispatch({ tipo: 'RESET' });
    }, [estaAutenticado, epoch]);

    // Etapa 12: troca da abertura visível limpa o estado de conclusão (não deixa concluindo/erro preso de outra abertura).
    useEffect(() => { setConcluindo(false); setErroConclusao(null); }, [estado.instanciaAberturaId]);

    const ehVinculado = estado.aberturaAtual?.usuarioTutorial != null;
    const total = estado.aberturaAtual?.tutorial.passos.length ?? 0;
    const botoes = useMemo(() => botoesVisiveisDoPasso(estado.indicePasso, total, ehVinculado), [estado.indicePasso, total, ehVinculado]);

    const api = useMemo<ContextoTutorialAberturaProps>(() => ({ aberturaAtual: estado.aberturaAtual, indicePasso: estado.indicePasso, instanciaAberturaId: estado.instanciaAberturaId, temFila: estado.fila.length > 0, ehVinculado, botoes, erroConclusao, concluindo, enfileirar, avancar, voltar, fechar, confirmarAbertura, concluir }), [estado.aberturaAtual, estado.indicePasso, estado.instanciaAberturaId, estado.fila.length, ehVinculado, botoes, erroConclusao, concluindo, enfileirar, avancar, voltar, fechar, confirmarAbertura, concluir]);

    return <ContextoTutorialAbertura.Provider value={api}>{children}</ContextoTutorialAbertura.Provider>;
};
