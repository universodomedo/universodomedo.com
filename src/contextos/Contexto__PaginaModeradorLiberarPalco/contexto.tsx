'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Palco_palcosAtualizados, type PalcoResumoDto, type RESPONSE__Palco_criar, type RESPONSE__Palco_finalizar, type RESPONSE__Palco_listarAtivos, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';

function criarPalcoWs(nome: string): Promise<RESPONSE__Palco_criar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.criar, { nome }, { onSuccess: (response: RESPONSE__Palco_criar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function listarAtivosWs(): Promise<RESPONSE__Palco_listarAtivos> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.listarAtivos, {}, { onSuccess: (response: RESPONSE__Palco_listarAtivos) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function finalizarWs(codigoPalco: string): Promise<RESPONSE__Palco_finalizar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.finalizar, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_finalizar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

export interface Contexto__PaginaModeradorLiberarPalco__Props {
    palcos: PalcoResumoDto[];
    processando: boolean;
    erro: string | null;
    criarPalco: (nome: string) => void;
    abrirPalco: (codigoPalco: string) => void;
    finalizarPalco: (codigoPalco: string) => void;
};

const Contexto__PaginaModeradorLiberarPalco = createContext<Contexto__PaginaModeradorLiberarPalco__Props | undefined>(undefined);

export const useContexto__PaginaModeradorLiberarPalco = (): Contexto__PaginaModeradorLiberarPalco__Props => {
    const context = useContext(Contexto__PaginaModeradorLiberarPalco);
    if (!context) throw new Error('useContexto__PaginaModeradorLiberarPalco precisa estar dentro de um Contexto__PaginaModeradorLiberarPalco__Provider');
    return context;
};

export const Contexto__PaginaModeradorLiberarPalco__Provider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [palcos, setPalcos] = useState<PalcoResumoDto[]>([]);
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        listarAtivosWs().then(r => { setPalcos(r.palcos); }).catch(() => {});
    }, []);

    // Lista viva: aberturas e finalizações chegam por push.
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.palcosAtualizados, {
        onSuccess: (data: EMIT__Palco_palcosAtualizados) => { setPalcos(data.palcos); },
    });

    const abrirPalco = useCallback((codigoPalco: string) => { router.push(`/palco?codigoPalco=${encodeURIComponent(codigoPalco)}`); }, [router]);

    // Nome obrigatório: vira o título do evento em tudo (sala de chat, card, notificação, faixa da Central).
    const criarPalco = useCallback((nome: string) => {
        if (processando) return;
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) { setErro('Informe o nome do palco.'); return; }
        setProcessando(true);
        setErro(null);
        criarPalcoWs(nomeLimpo)
            .then(r => { abrirPalco(r.palco.codigoPalco); })
            .catch(e => { setErro(e instanceof Error ? e.message : (e as WsErrorResponse).mensagem ?? 'Não foi possível criar o palco.'); })
            .finally(() => { setProcessando(false); });
    }, [processando, abrirPalco]);

    const finalizarPalco = useCallback((codigoPalco: string) => {
        if (processando) return;
        setProcessando(true);
        setErro(null);
        finalizarWs(codigoPalco)
            .catch(e => { setErro(e instanceof Error ? e.message : (e as WsErrorResponse).mensagem ?? 'Não foi possível finalizar o palco.'); })
            .finally(() => { setProcessando(false); });
    }, [processando]);

    return (
        <Contexto__PaginaModeradorLiberarPalco.Provider value={{ palcos, processando, erro, criarPalco, abrirPalco, finalizarPalco }}>
            {children}
        </Contexto__PaginaModeradorLiberarPalco.Provider>
    );
};