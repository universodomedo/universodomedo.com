'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Eventos_Envia, GraphqlLeituras } from 'types-nora-api';

import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import { eventoWs, useSocketEpoch } from 'Hooks/useEventoWs';
import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { CentralItem, SELECT_EVENTO_CENTRAL, SELECT_TUTORIAL_CENTRAL, eventoParaItemCentral, tutorialParaItemCentral } from './eventoUsuarioCentralItem';
import { useEventosUsuarioAcoes } from './useEventosUsuarioAcoes';

export interface ContextoEventosUsuarioProps {
    itens: CentralItem[];
    itensPendencias: CentralItem[];
    itensAjudaTutoriais: CentralItem[];
    carregando: boolean;
    aberto: boolean;
    pendentes: number;
    alternarAberto: () => void;
    listar: () => void;
    sincronizarAposNotificacaoRecebida: () => void;
    marcarLido: (idEvento: number) => void;
    solicitarAberturaTutorial: (idUsuarioTutorial: number) => void;
};

const ContextoEventosUsuario = createContext<ContextoEventosUsuarioProps | undefined>(undefined);

export function useContextoEventosUsuario(): ContextoEventosUsuarioProps {
    const ctx = useContext(ContextoEventosUsuario);
    if (!ctx) throw new Error('useContextoEventosUsuario precisa estar dentro de ContextoEventosUsuarioProvider');
    return ctx;
};

export function ContextoEventosUsuarioProvider({ children }: { children: React.ReactNode }) {
    const [aberto, setAberto] = useState(false);
    const { estaAutenticado } = useContextoAutenticacao();
    const epoch = useSocketEpoch();

    const consultaEventos = useNoraGraphQLConsulta(() => GraphqlLeituras.EventoUsuario.eventos.varios({ parametros: { limit: 100, offset: 0 }, select: SELECT_EVENTO_CENTRAL }), { valorInicial: [], carregando: 'Carregando eventos', mensagemErro: 'Não foi possível carregar seus eventos.', executarAoMontar: false, carregamento: NoraApiCarregamento.BARRA });
    const consultaTutoriais = useNoraGraphQLConsulta(() => GraphqlLeituras.UsuarioTutorial.eventos.varios({ parametros: { limit: 100, offset: 0 }, select: SELECT_TUTORIAL_CENTRAL }), { valorInicial: [], carregando: 'Carregando tutoriais', mensagemErro: 'Não foi possível carregar seus tutoriais.', executarAoMontar: false, carregamento: NoraApiCarregamento.BARRA });

    const recarregarEventos = consultaEventos.recarregar;
    const recarregarTutoriais = consultaTutoriais.recarregar;

    // Refetch das duas leituras agregadas (fonte da verdade da Central). best-effort, fire-and-forget. Sem usuário autenticado não consulta (evita request sem sessão e vazamento entre usuários).
    const listar = useCallback(() => {
        if (!estaAutenticado) return;
        void recarregarEventos();
        void recarregarTutoriais();
    }, [estaAutenticado, recarregarEventos, recarregarTutoriais]);

    // Etapa 8: após o toast (notificacaoRecebida) a Central sincroniza com o backend; agora = refetch GraphQL.
    const sincronizarAposNotificacaoRecebida = useCallback(() => { listar(); }, [listar]);

    const { marcarLido } = useEventosUsuarioAcoes(listar);

    // Etapa 14: a Central só SOLICITA a abertura; o modal render-ready global renderiza ao receber abrirTutorial. Nunca conclui nem busca render-ready aqui.
    const solicitarAberturaTutorial = useCallback((idUsuarioTutorial: number) => { eventoWs(Eventos_Envia.Tutoriais.eventos.solicitarAberturaTutorial, { idUsuarioTutorial }); }, []);

    const alternarAberto = useCallback(() => { setAberto(prev => !prev); }, []);

    // Carrega do backend ao abrir a Central.
    useEffect(() => { if (aberto) listar(); }, [aberto, listar]);

    // Estado inicial/reconexão: autenticou/reconectou (epoch) => refetch; desautenticou => fecha a Central (isolamento entre usuários na mesma sessão SPA).
    useEffect(() => {
        if (!estaAutenticado) {
            setAberto(false);
            return;
        }
        listar();
    }, [estaAutenticado, epoch, listar]);

    // Mescla pronta para render (apresentação): eventos + tutoriais ordenados por data desc. Sem usuário autenticado, deriva vazio (não renderiza dado antigo da sessão anterior).
    const itens = useMemo<CentralItem[]>(() => {
        if (!estaAutenticado) return [];
        const eventos = consultaEventos.data.map(eventoParaItemCentral);
        const tutoriais = consultaTutoriais.data.map(tutorialParaItemCentral);
        return [...eventos, ...tutoriais].sort((a, b) => b.dataOrdenacao - a.dataOrdenacao);
    }, [estaAutenticado, consultaEventos.data, consultaTutoriais.data]);

    // Pendências: tudo pendente (flag do backend). Ajuda/Tutoriais: tutoriais concluídos (ação Reabrir).
    const itensPendencias = useMemo(() => itens.filter(item => item.pendente), [itens]);
    const itensAjudaTutoriais = useMemo(() => itens.filter(item => item.tipoItem === 'tutorial' && item.concluido), [itens]);
    const pendentes = itensPendencias.length;
    const carregando = consultaEventos.carregando !== null || consultaTutoriais.carregando !== null;

    const api = useMemo<ContextoEventosUsuarioProps>(() => ({ itens, itensPendencias, itensAjudaTutoriais, carregando, aberto, pendentes, alternarAberto, listar, sincronizarAposNotificacaoRecebida, marcarLido, solicitarAberturaTutorial }), [itens, itensPendencias, itensAjudaTutoriais, carregando, aberto, pendentes, alternarAberto, listar, sincronizarAposNotificacaoRecebida, marcarLido, solicitarAberturaTutorial]);

    return (
        <ContextoEventosUsuario.Provider value={api}>
            {children}
        </ContextoEventosUsuario.Provider>
    );
};
