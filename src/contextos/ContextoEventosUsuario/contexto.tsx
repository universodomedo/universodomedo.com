'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Eventos_EnviaERecebe, EventoUsuarioDto } from 'types-nora-api';

import { eventoWs, useSocketEpoch } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { paraItemCentral, EventoUsuarioCentralItem } from './eventoUsuarioCentralItem';
import { useTutorialIntervencao, PosicaoIntervencaoTutorial } from './useTutorialIntervencao';

export interface ContextoEventosUsuarioProps {
    eventos: EventoUsuarioDto[];
    itens: EventoUsuarioCentralItem[];
    carregando: boolean;
    aberto: boolean;
    naoLidos: number;
    alternarAberto: () => void;
    listar: () => void;
    sincronizarAposNotificacaoRecebida: () => void;
    marcarLido: (idEvento: number) => void;
    tutorialAberto: EventoUsuarioCentralItem | null;
    alvoVisualLocalizado: string | null;
    posicaoIntervencao: PosicaoIntervencaoTutorial;
    abrirTutorial: (idEvento: number) => void;
    fecharTutorial: () => void;
    confirmarTutorial: () => void;
};

const ContextoEventosUsuario = createContext<ContextoEventosUsuarioProps | undefined>(undefined);

export function useContextoEventosUsuario(): ContextoEventosUsuarioProps {
    const ctx = useContext(ContextoEventosUsuario);
    if (!ctx) throw new Error('useContextoEventosUsuario precisa estar dentro de ContextoEventosUsuarioProvider');
    return ctx;
};

export function ContextoEventosUsuarioProvider({ children }: { children: React.ReactNode }) {
    const [eventos, setEventos] = useState<EventoUsuarioDto[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [aberto, setAberto] = useState(false);

    const { estaAutenticado } = useContextoAutenticacao();
    const epoch = useSocketEpoch();

    // Busca a lista do backend (fonte da verdade). silencioso=true não mexe em `carregando` (sync pós-toast sem ruído visual).
    const buscarEventos = useCallback((silencioso: boolean) => {
        if (!silencioso) setCarregando(true);
        eventoWs(Eventos_EnviaERecebe.EventosUsuario.eventos.obterMeusEventos, {}, {
            onSuccess: resp => { setEventos(resp.eventos); if (!silencioso) setCarregando(false); },
            onError: () => { if (!silencioso) setCarregando(false); },
        });
    }, []);

    // Lista os eventos do próprio usuário pelo backend (fonte da verdade).
    const listar = useCallback(() => buscarEventos(false), [buscarEventos]);

    // Etapa 8: sincronização silenciosa após notificacaoRecebida — atualiza `eventos` sem abrir a central nem ligar `carregando`.
    const sincronizarAposNotificacaoRecebida = useCallback(() => buscarEventos(true), [buscarEventos]);

    // Marca como lido e adota a lista atualizada que o backend devolve (sem mutar estado local como verdade).
    const marcarLido = useCallback((idEvento: number) => {
        eventoWs(Eventos_EnviaERecebe.EventosUsuario.eventos.marcarEventoComoLido, { idEvento }, {
            onSuccess: resp => { setEventos(resp.eventos); },
        });
    }, []);

    const alternarAberto = useCallback(() => { setAberto(prev => !prev); }, []);

    // Carrega do backend ao abrir a central.
    useEffect(() => { if (aberto) listar(); }, [aberto, listar]);

    // Etapa 9: estado inicial/reconexão. Autenticou/reconectou (epoch) => sincroniza silenciosamente; desautenticou => limpa e fecha.
    useEffect(() => {
        if (!estaAutenticado) {
            setEventos([]);
            setCarregando(false);
            setAberto(false);
            return;
        }
        buscarEventos(true);
    }, [estaAutenticado, epoch, buscarEventos]);

    const naoLidos = useMemo(() => eventos.filter(evento => !evento.dataLeitura).length, [eventos]);

    // Etapa 11: itens prontos para render (contexto prepara; componente não interpreta formato/dados/datas).
    const itens = useMemo(() => eventos.map(paraItemCentral), [eventos]);

    // Etapa 12: estado/ações da intervenção visual de tutorial (lógica isolada em hook para manter o contexto pequeno).
    const { tutorialAberto, alvoVisualLocalizado, posicaoIntervencao, abrirTutorial, fecharTutorial, confirmarTutorial } = useTutorialIntervencao(itens, marcarLido, estaAutenticado);

    const api = useMemo<ContextoEventosUsuarioProps>(() => ({ eventos, itens, carregando, aberto, naoLidos, alternarAberto, listar, sincronizarAposNotificacaoRecebida, marcarLido, tutorialAberto, alvoVisualLocalizado, posicaoIntervencao, abrirTutorial, fecharTutorial, confirmarTutorial }), [eventos, itens, carregando, aberto, naoLidos, alternarAberto, listar, sincronizarAposNotificacaoRecebida, marcarLido, tutorialAberto, alvoVisualLocalizado, posicaoIntervencao, abrirTutorial, fecharTutorial, confirmarTutorial]);

    return (
        <ContextoEventosUsuario.Provider value={api}>
            {children}
        </ContextoEventosUsuario.Provider>
    );
};
