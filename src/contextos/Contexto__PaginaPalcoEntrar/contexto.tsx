'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Palco_encerrado, type EMIT__Palco_estadoAtualizado, type EMIT__Palco_tokenMidia, type PalcoEstadoDto, type PalcoParticipanteDto, type PalcoParticipantePapel, type RESPONSE__Palco_entrar, type WsErrorResponse } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import SPA__PaginaPalco__Participante from 'Conteineres/PaginaPalco/paginas/SPA__PaginaPalco__Participante/SPA__PaginaPalco__Participante';
import { usePalcoAudio } from './usePalcoAudio';

type FluxoPaginaPalcoEntrar = 'FECHADO' | 'AGUARDANDO' | 'OUVINTE' | 'FALANTE';

function entrarWs(): Promise<RESPONSE__Palco_entrar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.entrar, {}, { onSuccess: (response: RESPONSE__Palco_entrar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function verificarEstadoWs(): Promise<PalcoEstadoDto> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.verificarEstado, {}, { onSuccess: (response: PalcoEstadoDto) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

interface Contexto__PaginaPalcoEntrar__Props {
    fluxo: FluxoPaginaPalcoEntrar;
    entrando: boolean;
    conectado: boolean;
    meuPapel: PalcoParticipantePapel | null;
    estado: PalcoEstadoDto | null;
    participantesAudio: PalcoParticipanteDto[];
    livekitToken: string | null;
    livekitUrl: string | null;
    logs: string[];
    adicionaLog: (mensagem: string) => void;
    sairLocalmente: () => void;
};

const Contexto__PaginaPalcoEntrar = createContext<Contexto__PaginaPalcoEntrar__Props | undefined>(undefined);

export const useContexto__PaginaPalcoEntrar = (): Contexto__PaginaPalcoEntrar__Props => {
    const context = useContext(Contexto__PaginaPalcoEntrar);
    if (!context) throw new Error('useContexto__PaginaPalcoEntrar precisa estar dentro de um Contexto__PaginaPalcoEntrar__Provider');
    return context;
};

export const Contexto__PaginaPalcoEntrar__Provider = () => {
    const { usuarioLogado } = useContextoAutenticacao();

    const [entrando, setEntrando] = useState(false);
    const [conectado, setConectado] = useState(false);
    const [meuPapel, setMeuPapel] = useState<PalcoParticipantePapel | null>(null);
    const [estado, setEstado] = useState<PalcoEstadoDto | null>(null);
    const [livekitToken, setLivekitToken] = useState<string | null>(null);
    const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const conectadoRef = useRef(false);
    const removidoRef = useRef(false);

    const adicionaLog = useCallback((mensagem: string): void => {
        const horario = new Date().toLocaleTimeString();
        setLogs(logsAtuais => [`[${horario}] ${mensagem}`, ...logsAtuais].slice(0, 80));
    }, []);

    const sairLocalmente = useCallback((): void => {
        conectadoRef.current = false;
        removidoRef.current = true;
        setEntrando(false);
        setConectado(false);
        setMeuPapel(null);
        setEstado(null);
        setLivekitToken(null);
        setLivekitUrl(null);
        adicionaLog('Saiu do palco.');
    }, [adicionaLog]);

    const entrarNoPalco = useCallback(async (): Promise<void> => {
        if (entrando || conectadoRef.current || removidoRef.current) return;
        setEntrando(true);
        try {
            const entrada = await entrarWs();
            const papelInicial = entrada.meuPapel ?? 'aguardando';
            conectadoRef.current = true;
            setConectado(true);
            setMeuPapel(papelInicial);
            setEstado({ ativo: entrada.ativo, participantes: entrada.participantes });
            adicionaLog(`Entrou no palco como ${papelInicial}.`);
        } catch {
            adicionaLog('Não foi possível entrar no palco.');
        } finally {
            setEntrando(false);
        }
    }, [adicionaLog, entrando]);

    useEffect(() => { conectadoRef.current = conectado; }, [conectado]);

    useEffect(() => {
        verificarEstadoWs().then(s => { setEstado(s); }).catch(() => {});
    }, []);

    useEffect(() => {
        if (!estado?.ativo) { removidoRef.current = false; return; }
        if (conectado || entrando || removidoRef.current) return;
        entrarNoPalco().catch(() => {});
    }, [conectado, entrando, entrarNoPalco, estado?.ativo]);

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.estadoAtualizado, {
        onSuccess: (data: EMIT__Palco_estadoAtualizado) => {
            setEstado(data);

            if (!conectadoRef.current) return;

            const meuId = usuarioLogado?.id;
            if (meuId === undefined) return;

            const eu = data.participantes.find(p => p.idUsuario === meuId);
            if (!eu) {
                adicionaLog('Você foi removido do palco pelo administrador.');
                sairLocalmente();
                return;
            }

            setMeuPapel(eu.papel);

            // Limpar token quando rebaixado para aguardando — LiveKit desconecta via hook cleanup.
            if (eu.papel === 'aguardando') { setLivekitToken(null); setLivekitUrl(null); };
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.encerrado, {
        onSuccess: (_data: EMIT__Palco_encerrado) => {
            adicionaLog('O palco foi encerrado pelo administrador.');
            sairLocalmente();
        },
    });

    // Token LiveKit emitido pelo backend quando o papel muda para falante ou ouvinte.
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.tokenMidia, {
        onSuccess: (data: EMIT__Palco_tokenMidia) => {
            setLivekitToken(data.token);
            setLivekitUrl(data.livekitUrl);
            adicionaLog('Token de mídia recebido — conectando ao LiveKit.');
        },
    });

    useEffect(() => {
        window.addEventListener('beforeunload', sairLocalmente);
        return () => {
            window.removeEventListener('beforeunload', sairLocalmente);
            sairLocalmente();
        };
    }, [sairLocalmente]);

    const participantesAudio = useMemo(() => estado?.participantes.filter(p => p.papel !== 'aguardando') ?? [], [estado?.participantes]);
    const fluxo = resolveFluxoPaginaPalcoEntrar(estado, conectado, meuPapel);

    return (
        <Contexto__PaginaPalcoEntrar.Provider value={{ fluxo, entrando, conectado, meuPapel, estado, participantesAudio, livekitToken, livekitUrl, logs, adicionaLog, sairLocalmente }}>
            <Conteiner__PaginaPalcoEntrar__Interno />
        </Contexto__PaginaPalcoEntrar.Provider>
    );
};

const Conteiner__PaginaPalcoEntrar__Interno = criaConteiner<PropsConteiner__PaginaPalcoEntrar>({ useEstado, resolveSaida });

type PropsConteiner__PaginaPalcoEntrar = Contexto__PaginaPalcoEntrar__Props;

function resolveSaida(props: PropsConteiner__PaginaPalcoEntrar): SaidaConteiner {
    if (props.fluxo === 'FALANTE') return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Falante__Provider, {});
    if (props.fluxo === 'OUVINTE') return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Ouvinte__Provider, {});
    return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Aguardando__Provider, {});
};

function useEstado(): PropsConteiner__PaginaPalcoEntrar { return useContexto__PaginaPalcoEntrar(); };

function resolveFluxoPaginaPalcoEntrar(estado: PalcoEstadoDto | null, conectado: boolean, meuPapel: PalcoParticipantePapel | null): FluxoPaginaPalcoEntrar {
    if (!estado?.ativo) return 'FECHADO';
    if (!conectado || meuPapel === null || meuPapel === 'aguardando') return 'AGUARDANDO';
    if (meuPapel === 'falante') return 'FALANTE';
    return 'OUVINTE';
};

function Contexto__PaginaPalcoEntrar__Aguardando__Provider() { return <SPA__PaginaPalco__Participante />; };

function Contexto__PaginaPalcoEntrar__Ouvinte__Provider() {
    const { adicionaLog, livekitToken, livekitUrl } = useContexto__PaginaPalcoEntrar();
    usePalcoAudio({ modo: 'ouvinte', token: livekitToken, livekitUrl, adicionaLog });
    return <SPA__PaginaPalco__Participante />;
};

function Contexto__PaginaPalcoEntrar__Falante__Provider() {
    const { adicionaLog, livekitToken, livekitUrl } = useContexto__PaginaPalcoEntrar();
    usePalcoAudio({ modo: 'falante', token: livekitToken, livekitUrl, adicionaLog });
    return <SPA__PaginaPalco__Participante />;
};