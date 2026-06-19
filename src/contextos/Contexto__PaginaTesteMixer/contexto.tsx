'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Mixer_estadoAtualizado, type MixerEstadoDto, type RESPONSE__Mixer_verificarEstado, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';

function verificarEstadoMixerWs(): Promise<RESPONSE__Mixer_verificarEstado> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Mixer.eventos.verificarEstado, {}, { onSuccess: (response: RESPONSE__Mixer_verificarEstado) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

export interface Contexto__PaginaTesteMixer__Props {
    estado: MixerEstadoDto | null;
};

const Contexto__PaginaTesteMixer = createContext<Contexto__PaginaTesteMixer__Props | undefined>(undefined);

export const useContexto__PaginaTesteMixer = (): Contexto__PaginaTesteMixer__Props => {
    const context = useContext(Contexto__PaginaTesteMixer);
    if (!context) throw new Error('useContexto__PaginaTesteMixer precisa estar dentro de um Contexto__PaginaTesteMixer__Provider');
    return context;
};

export function Contexto__PaginaTesteMixer__Provider({ children }: { children: ReactNode }) {
    const [estado, setEstado] = useState<MixerEstadoDto | null>(null);

    useEffect(() => {
        verificarEstadoMixerWs().then(s => { setEstado(s); }).catch(() => { setEstado(null); });
    }, []);

    useRecebeEmitWs(Eventos_Emite.Mixer.eventos.estadoAtualizado, (data: EMIT__Mixer_estadoAtualizado) => { setEstado(data); });

    return (
        <Contexto__PaginaTesteMixer.Provider value={{ estado }}>
            {children}
        </Contexto__PaginaTesteMixer.Provider>
    );
};