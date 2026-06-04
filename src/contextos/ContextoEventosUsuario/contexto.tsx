'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Eventos_EnviaERecebe, EventoUsuarioDto } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';

export interface ContextoEventosUsuarioProps {
    eventos: EventoUsuarioDto[];
    carregando: boolean;
    aberto: boolean;
    naoLidos: number;
    alternarAberto: () => void;
    listar: () => void;
    sincronizarAposNotificacaoRecebida: () => void;
    marcarLido: (idEvento: number) => void;
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

    const naoLidos = useMemo(() => eventos.filter(evento => !evento.dataLeitura).length, [eventos]);

    const api = useMemo<ContextoEventosUsuarioProps>(() => ({ eventos, carregando, aberto, naoLidos, alternarAberto, listar, sincronizarAposNotificacaoRecebida, marcarLido }), [eventos, carregando, aberto, naoLidos, alternarAberto, listar, sincronizarAposNotificacaoRecebida, marcarLido]);

    return (
        <ContextoEventosUsuario.Provider value={api}>
            {children}
        </ContextoEventosUsuario.Provider>
    );
};
