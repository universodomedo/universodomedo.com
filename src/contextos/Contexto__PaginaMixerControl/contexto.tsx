'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Mixer_estadoAtualizado, type MixerEstadoDto, type MixerStatusReproducao, type PAYLOAD__Mixer_admin_sincronizar, type RESPONSE__Mixer_admin_sincronizar, type RESPONSE__Mixer_verificarEstado, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';

function verificarEstadoMixerWs(): Promise<RESPONSE__Mixer_verificarEstado> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Mixer.eventos.verificarEstado, {}, { onSuccess: (response: RESPONSE__Mixer_verificarEstado) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function sincronizarMixerWs(payload: PAYLOAD__Mixer_admin_sincronizar): Promise<RESPONSE__Mixer_admin_sincronizar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Mixer.eventos.admin_sincronizar, payload, { onSuccess: (response: RESPONSE__Mixer_admin_sincronizar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

export interface Contexto__PaginaMixerControl__Props {
    estado: MixerEstadoDto | null;
    erro: string | null;
    sincronizarEstado: (status: MixerStatusReproducao, posicaoMs: number) => void;
};

const Contexto__PaginaMixerControl = createContext<Contexto__PaginaMixerControl__Props | undefined>(undefined);

export const useContexto__PaginaMixerControl = (): Contexto__PaginaMixerControl__Props => {
    const context = useContext(Contexto__PaginaMixerControl);
    if (!context) throw new Error('useContexto__PaginaMixerControl precisa estar dentro de um Contexto__PaginaMixerControl__Provider');
    return context;
};

export function Contexto__PaginaMixerControl__Provider({ children }: { children: ReactNode }) {
    const [estado, setEstado] = useState<MixerEstadoDto | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        verificarEstadoMixerWs().then(s => { setEstado(s); }).catch(() => { setErro('Nao foi possivel conectar ao mixer.'); });
    }, []);

    useRecebeEmitWs(Eventos_Emite.Mixer.eventos.estadoAtualizado, {
        onSuccess: (data: EMIT__Mixer_estadoAtualizado) => { setEstado(data); setErro(null); },
        onError: () => { setErro('Nao foi possivel receber atualizacao do mixer.'); },
    });

    const sincronizarEstado = useCallback((status: MixerStatusReproducao, posicaoMs: number): void => {
        setErro(null);
        sincronizarMixerWs({ status, posicaoMs }).then(proximoEstado => { setEstado(proximoEstado); }).catch(() => { setErro('Nao foi possivel sincronizar o player do mixer.'); });
    }, []);

    return (
        <Contexto__PaginaMixerControl.Provider value={{ estado, erro, sincronizarEstado }}>
            {children}
        </Contexto__PaginaMixerControl.Provider>
    );
};