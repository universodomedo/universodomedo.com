'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Palco_estadoAtualizado, type PalcoEstadoDto, type PalcoParticipantePapel, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import SPA__PaginaPalco__Admin from 'Conteineres/PaginaPalco/paginas/SPA__PaginaPalco__Admin/SPA__PaginaPalco__Admin';

type ResultadoAcaoPalcoAdmin = PalcoEstadoDto | Record<string, never>;

function criarPalcoWs(): Promise<PalcoEstadoDto> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.admin_criar, {}, { onSuccess: (response: PalcoEstadoDto) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function encerrarPalcoWs(): Promise<Record<string, never>> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.admin_encerrar, {}, { onSuccess: (response: Record<string, never>) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function verificarEstadoWs(): Promise<PalcoEstadoDto> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.verificarEstado, {}, { onSuccess: (response: PalcoEstadoDto) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function definirPapelWs(idUsuario: number, papel: PalcoParticipantePapel): Promise<Record<string, never>> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.admin_definirPapel, { idUsuario, papel }, { onSuccess: (response: Record<string, never>) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function extraiMensagemErroPalcoAdmin(erro: Error | WsErrorResponse): string { return erro instanceof Error ? erro.message : erro.mensagem ?? 'Erro desconhecido.'; };

interface Contexto__PaginaPalcoAdmin__Props {
    estado: PalcoEstadoDto | null;
    processando: boolean;
    erro: string | null;
    handleCriar: () => void;
    handleEncerrar: () => void;
    handleDefinirPapel: (idUsuario: number, papel: PalcoParticipantePapel) => void;
};

const Contexto__PaginaPalcoAdmin = createContext<Contexto__PaginaPalcoAdmin__Props | undefined>(undefined);

export const useContexto__PaginaPalcoAdmin = (): Contexto__PaginaPalcoAdmin__Props => {
    const context = useContext(Contexto__PaginaPalcoAdmin);
    if (!context) throw new Error('useContexto__PaginaPalcoAdmin precisa estar dentro de um Contexto__PaginaPalcoAdmin__Provider');
    return context;
};

export const Contexto__PaginaPalcoAdmin__Provider = () => {
    const [estado, setEstado] = useState<PalcoEstadoDto | null>(null);
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        verificarEstadoWs().then(s => { setEstado(s); }).catch(() => {});
    }, []);

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.estadoAtualizado, {
        onSuccess: (data: EMIT__Palco_estadoAtualizado) => { setEstado(data); },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.encerrado, {
        onSuccess: () => { setEstado({ ativo: false, participantes: [] }); },
    });

    const executar = useCallback(async (acao: () => Promise<ResultadoAcaoPalcoAdmin>): Promise<void> => {
        if (processando) return;
        setProcessando(true);
        setErro(null);
        try {
            await acao();
        } catch (e) {
            setErro(extraiMensagemErroPalcoAdmin(e as Error | WsErrorResponse));
        } finally {
            setProcessando(false);
        }
    }, [processando]);

    const handleCriar = useCallback(() => {
        executar(async () => { const s = await criarPalcoWs(); setEstado(s); return s; }).catch(() => {});
    }, [executar]);

    const handleEncerrar = useCallback(() => {
        executar(encerrarPalcoWs).catch(() => {});
    }, [executar]);

    const handleDefinirPapel = useCallback((idUsuario: number, papel: PalcoParticipantePapel) => {
        executar(() => definirPapelWs(idUsuario, papel)).catch(() => {});
    }, [executar]);

    return (
        <Contexto__PaginaPalcoAdmin.Provider value={{ estado, processando, erro, handleCriar, handleEncerrar, handleDefinirPapel }}>
            <SPA__PaginaPalco__Admin />
        </Contexto__PaginaPalcoAdmin.Provider>
    );
};