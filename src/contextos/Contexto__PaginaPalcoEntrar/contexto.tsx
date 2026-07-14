'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Eventos_Emite, Eventos_Envia, Eventos_EnviaERecebe, type EMIT__Palco_diagnosticoAudio, type EMIT__Palco_encerrado, type EMIT__Palco_estadoAtualizado, type EMIT__Palco_fluxoAtualizado, type EMIT__Palco_transcricaoAtualizada, type PalcoEstadoDto, type FluxoMusicaDto, type PalcoParticipanteDto, type PalcoParticipantePapel, type PalcoTranscricaoUtterance, type RESPONSE__Palco_entrar, type RESPONSE__Palco_finalizar, type RESPONSE__Palco_definirPapel, type RESPONSE__Palco_fluxoAdicionarMusica, type RESPONSE__Palco_fluxoAlternarLigacao, type RESPONSE__Palco_fluxoCriarLigacao, type RESPONSE__Palco_fluxoMoverPulso, type RESPONSE__Palco_fluxoRemoverMusica, type RESPONSE__Palco_fluxoSilenciar, type RESPONSE__Palco_verificarTranscricao, type WsErrorResponse } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectPalcoNaCentral } from 'Redux/selectors/audioPaginaSelectors';
import { setPalcoNaCentral } from 'Redux/slices/audioPaginaSlice';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoCopiarParaClipboard } from 'Contextos/ContextoCopiarParaClipboard/contexto';
import SPA__PaginaPalco__Participante from 'Conteineres/PaginaPalco/paginas/SPA__PaginaPalco__Participante/SPA__PaginaPalco__Participante';
import SPA__PaginaPalco__Admin from 'Conteineres/PaginaPalco/paginas/SPA__PaginaPalco__Admin/SPA__PaginaPalco__Admin';

type FluxoPaginaPalcoEntrar = 'FECHADO' | 'AGUARDANDO' | 'OUVINTE' | 'FALANTE' | 'COMANDO';

function entrarWs(codigoPalco: string): Promise<RESPONSE__Palco_entrar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.entrar, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_entrar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function verificarEstadoWs(codigoPalco: string): Promise<PalcoEstadoDto> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.verificarEstado, { codigoPalco }, { onSuccess: (response: PalcoEstadoDto) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function verificarTranscricaoWs(codigoPalco: string): Promise<RESPONSE__Palco_verificarTranscricao> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.verificarTranscricao, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_verificarTranscricao) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function definirPapelWs(codigoPalco: string, idUsuario: number, papel: PalcoParticipantePapel): Promise<RESPONSE__Palco_definirPapel> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.definirPapel, { codigoPalco, idUsuario, papel }, { onSuccess: (response: RESPONSE__Palco_definirPapel) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function finalizarWs(codigoPalco: string): Promise<RESPONSE__Palco_finalizar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.finalizar, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_finalizar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

// Edições do Fluxo de Música: envia-e-recebe (o estado novo chega a todos pelo emit fluxoAtualizado); mover é fire-and-forget.
function fluxoAdicionarMusicaWs(codigoPalco: string, idMusica: number, x: number, y: number): Promise<RESPONSE__Palco_fluxoAdicionarMusica> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.fluxoAdicionarMusica, { codigoPalco, idMusica, x, y }, { onSuccess: (response: RESPONSE__Palco_fluxoAdicionarMusica) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function fluxoRemoverMusicaWs(codigoPalco: string, idMusica: number): Promise<RESPONSE__Palco_fluxoRemoverMusica> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.fluxoRemoverMusica, { codigoPalco, idMusica }, { onSuccess: (response: RESPONSE__Palco_fluxoRemoverMusica) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function fluxoCriarLigacaoWs(codigoPalco: string, deMusica: number, deBloco: string, paraMusica: number, paraBloco: string): Promise<RESPONSE__Palco_fluxoCriarLigacao> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.fluxoCriarLigacao, { codigoPalco, deMusica, deBloco, paraMusica, paraBloco }, { onSuccess: (response: RESPONSE__Palco_fluxoCriarLigacao) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function fluxoAlternarLigacaoWs(codigoPalco: string, idLigacao: string): Promise<RESPONSE__Palco_fluxoAlternarLigacao> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.fluxoAlternarLigacao, { codigoPalco, idLigacao }, { onSuccess: (response: RESPONSE__Palco_fluxoAlternarLigacao) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function fluxoMoverPulsoWs(codigoPalco: string, idMusica: number, idBloco: string): Promise<RESPONSE__Palco_fluxoMoverPulso> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.fluxoMoverPulso, { codigoPalco, idMusica, idBloco }, { onSuccess: (response: RESPONSE__Palco_fluxoMoverPulso) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function fluxoSilenciarWs(codigoPalco: string): Promise<RESPONSE__Palco_fluxoSilenciar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.fluxoSilenciar, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_fluxoSilenciar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

interface Contexto__PaginaPalcoEntrar__Props {
    codigoPalco: string;
    fluxo: FluxoPaginaPalcoEntrar;
    entrando: boolean;
    conectado: boolean;
    meuPapel: PalcoParticipantePapel | null;
    possoComandar: boolean;
    estado: PalcoEstadoDto | null;
    diagnostico: EMIT__Palco_diagnosticoAudio | null;
    participantesAudio: PalcoParticipanteDto[];
    transcricao: PalcoTranscricaoUtterance[];
    logs: string[];
    processando: boolean;
    erroComando: string | null;
    compartilharLinkPalco: () => void;
    adicionaLog: (mensagem: string) => void;
    sairLocalmente: () => void;
    handleDefinirPapel: (idUsuario: number, papel: PalcoParticipantePapel) => void;
    handleFinalizar: () => void;
    // Fluxo de Música (grafo espacial + pulso autoritativo do servidor). "fluxo" (sem sufixo) é o fluxo de NAVEGAÇÃO da página.
    fluxoMusica: FluxoMusicaDto;
    handleFluxoAdicionarMusica: (idMusica: number, x: number, y: number) => void;
    handleFluxoRemoverMusica: (idMusica: number) => void;
    handleFluxoMoverMusica: (idMusica: number, x: number, y: number) => void;
    handleFluxoCriarLigacao: (deMusica: number, deBloco: string, paraMusica: number, paraBloco: string) => void;
    handleFluxoAlternarLigacao: (idLigacao: string) => void;
    handleFluxoMoverPulso: (idMusica: number, idBloco: string) => void;
    handleFluxoSilenciar: () => void;
};

const Contexto__PaginaPalcoEntrar = createContext<Contexto__PaginaPalcoEntrar__Props | undefined>(undefined);

export const useContexto__PaginaPalcoEntrar = (): Contexto__PaginaPalcoEntrar__Props => {
    const context = useContext(Contexto__PaginaPalcoEntrar);
    if (!context) throw new Error('useContexto__PaginaPalcoEntrar precisa estar dentro de um Contexto__PaginaPalcoEntrar__Provider');
    return context;
};

export const Contexto__PaginaPalcoEntrar__Provider = ({ codigoPalco }: { codigoPalco: string }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const { copiarParaClipboard } = useContextoCopiarParaClipboard();
    const dispatch = useAppDispatch();
    const palcoNaCentral = useAppSelector(selectPalcoNaCentral);

    const [entrando, setEntrando] = useState(false);
    const [conectado, setConectado] = useState(false);
    const [meuPapel, setMeuPapel] = useState<PalcoParticipantePapel | null>(null);
    const [possoComandar, setPossoComandar] = useState(false);
    const [estado, setEstado] = useState<PalcoEstadoDto | null>(null);
    const [fluxoMusica, setFluxoMusica] = useState<FluxoMusicaDto>({ musicas: [], ligacoes: [], pulso: null });
    const [diagnostico, setDiagnostico] = useState<EMIT__Palco_diagnosticoAudio | null>(null);
    const [transcricao, setTranscricao] = useState<PalcoTranscricaoUtterance[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [processando, setProcessando] = useState(false);
    const [erroComando, setErroComando] = useState<string | null>(null);
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
        setTranscricao([]);
        adicionaLog('Saiu do palco.');
    }, [adicionaLog]);

    const entrarNoPalco = useCallback(async (): Promise<void> => {
        if (entrando || conectadoRef.current || removidoRef.current) return;
        setEntrando(true);
        try {
            const entrada = await entrarWs(codigoPalco);
            const papelInicial = entrada.meuPapel ?? 'aguardando';
            conectadoRef.current = true;
            setConectado(true);
            setMeuPapel(papelInicial);
            setPossoComandar(entrada.possoComandar);
            setEstado({ codigoPalco: entrada.codigoPalco, nome: entrada.nome, ativo: entrada.ativo, idUsuarioDono: entrada.idUsuarioDono, nomeDono: entrada.nomeDono, idSalaChat: entrada.idSalaChat, participantes: entrada.participantes, fluxo: entrada.fluxo });
            setFluxoMusica(entrada.fluxo);
            adicionaLog(`Entrou no palco como ${papelInicial}.`);
        } catch {
            adicionaLog('Não foi possível entrar no palco.');
        } finally {
            setEntrando(false);
        }
    }, [adicionaLog, entrando, codigoPalco]);

    useEffect(() => { conectadoRef.current = conectado; }, [conectado]);

    useEffect(() => {
        verificarEstadoWs(codigoPalco).then(s => { setEstado(s); setFluxoMusica(s.fluxo); }).catch(() => {});
    }, [codigoPalco]);

    // Fluxo de Música: o servidor é a autoridade (edições e avanço do pulso chegam prontos).
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.fluxoAtualizado, {
        onSuccess: (data: EMIT__Palco_fluxoAtualizado) => { if (data.codigoPalco === codigoPalco) setFluxoMusica(data.fluxo); },
    });

    // Estado inicial da transcrição ao ganhar papel de áudio ou comando; as atualizações chegam pelo emit.
    useEffect(() => {
        if (meuPapel !== 'falante' && meuPapel !== 'ouvinte' && !possoComandar) return;
        verificarTranscricaoWs(codigoPalco).then(r => { setTranscricao(r.utterances); }).catch(() => {});
    }, [meuPapel, possoComandar, codigoPalco]);

    useEffect(() => {
        if (!estado?.ativo) { removidoRef.current = false; return; }
        if (conectado || entrando || removidoRef.current) return;
        entrarNoPalco().catch(() => {});
    }, [conectado, entrando, entrarNoPalco, estado?.ativo]);

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.estadoAtualizado, {
        onSuccess: (data: EMIT__Palco_estadoAtualizado) => {
            if (data.codigoPalco !== codigoPalco) return;
            setEstado(data);

            if (!conectadoRef.current) return;

            const meuId = usuarioLogado?.id;
            if (meuId === undefined) return;

            const eu = data.participantes.find(p => p.idUsuario === meuId);
            if (!eu) {
                adicionaLog('Você foi removido do palco.');
                sairLocalmente();
                return;
            }

            setMeuPapel(eu.papel);
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.encerrado, {
        onSuccess: (data: EMIT__Palco_encerrado) => {
            if (data.codigoPalco !== codigoPalco) return;
            adicionaLog('O palco foi finalizado.');
            sairLocalmente();
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.transcricaoAtualizada, {
        onSuccess: (data: EMIT__Palco_transcricaoAtualizada) => { if (data.codigoPalco === codigoPalco) setTranscricao(data.utterances); },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.diagnosticoAudio, {
        onSuccess: (data: EMIT__Palco_diagnosticoAudio) => { if (data.codigoPalco === codigoPalco) setDiagnostico(data); },
    });

    const executarComando = useCallback(async (acao: () => Promise<RESPONSE__Palco_definirPapel | RESPONSE__Palco_finalizar>): Promise<void> => {
        if (processando) return;
        setProcessando(true);
        setErroComando(null);
        try {
            await acao();
        } catch (e) {
            setErroComando(e instanceof Error ? e.message : (e as WsErrorResponse).mensagem ?? 'Erro desconhecido.');
        } finally {
            setProcessando(false);
        }
    }, [processando]);

    const handleDefinirPapel = useCallback((idUsuario: number, papel: PalcoParticipantePapel) => {
        executarComando(() => definirPapelWs(codigoPalco, idUsuario, papel)).catch(() => {});
    }, [executarComando, codigoPalco]);

    const handleFinalizar = useCallback(() => {
        executarComando(() => finalizarWs(codigoPalco)).catch(() => {});
    }, [executarComando, codigoPalco]);

    // Ações do Fluxo de Música (todas de comando; erros caem em erroComando).
    const handleFluxoAdicionarMusica = useCallback((idMusica: number, x: number, y: number) => {
        executarComando(() => fluxoAdicionarMusicaWs(codigoPalco, idMusica, x, y)).catch(() => {});
    }, [executarComando, codigoPalco]);

    const handleFluxoRemoverMusica = useCallback((idMusica: number) => {
        executarComando(() => fluxoRemoverMusicaWs(codigoPalco, idMusica)).catch(() => {});
    }, [executarComando, codigoPalco]);

    // Arrasto do nó: fire-and-forget (1 envio ao soltar; o emit ecoa a posição para os demais comandantes).
    const handleFluxoMoverMusica = useCallback((idMusica: number, x: number, y: number) => {
        eventoWs(Eventos_Envia.Palco.eventos.fluxoMoverMusica, { codigoPalco, idMusica, x, y });
    }, [codigoPalco]);

    const handleFluxoCriarLigacao = useCallback((deMusica: number, deBloco: string, paraMusica: number, paraBloco: string) => {
        executarComando(() => fluxoCriarLigacaoWs(codigoPalco, deMusica, deBloco, paraMusica, paraBloco)).catch(() => {});
    }, [executarComando, codigoPalco]);

    const handleFluxoAlternarLigacao = useCallback((idLigacao: string) => {
        executarComando(() => fluxoAlternarLigacaoWs(codigoPalco, idLigacao)).catch(() => {});
    }, [executarComando, codigoPalco]);

    const handleFluxoMoverPulso = useCallback((idMusica: number, idBloco: string) => {
        executarComando(() => fluxoMoverPulsoWs(codigoPalco, idMusica, idBloco)).catch(() => {});
    }, [executarComando, codigoPalco]);

    const handleFluxoSilenciar = useCallback(() => {
        executarComando(() => fluxoSilenciarWs(codigoPalco)).catch(() => {});
    }, [executarComando, codigoPalco]);

    // A Central é a DONA do áudio do palco: ganhou papel de áudio (promoção ou ouvir) = o palco entra na Central sozinho.
    // O controlador global conecta o LiveKit (publish quando falante) — a página nunca conecta; sair dela não corta nada.
    useEffect(() => {
        if (!estado?.ativo) return;
        if (meuPapel !== 'falante' && meuPapel !== 'ouvinte') return;
        if (palcoNaCentral?.codigoPalco === codigoPalco) return;
        dispatch(setPalcoNaCentral({ codigoPalco, titulo: estado.nome || `Palco de ${estado.nomeDono}`, papel: meuPapel }));
    }, [dispatch, codigoPalco, meuPapel, estado?.ativo, estado?.nome, estado?.nomeDono, palcoNaCentral?.codigoPalco]);

    // Divulgação do evento: copia o link público da página do palco (toast global confirma).
    const compartilharLinkPalco = useCallback(() => {
        copiarParaClipboard(`${window.location.origin}/palco?codigoPalco=${codigoPalco}`).catch(() => {});
    }, [copiarParaClipboard, codigoPalco]);

    useEffect(() => {
        window.addEventListener('beforeunload', sairLocalmente);
        return () => {
            window.removeEventListener('beforeunload', sairLocalmente);
            sairLocalmente();
        };
    }, [sairLocalmente]);

    const participantesAudio = useMemo(() => estado?.participantes.filter(p => p.papel !== 'aguardando') ?? [], [estado?.participantes]);
    const fluxo = resolveFluxoPaginaPalcoEntrar(estado, conectado, meuPapel, possoComandar);

    return (
        <Contexto__PaginaPalcoEntrar.Provider value={{ codigoPalco, fluxo, entrando, conectado, meuPapel, possoComandar, estado, diagnostico, participantesAudio, transcricao, logs, processando, erroComando, compartilharLinkPalco, adicionaLog, sairLocalmente, handleDefinirPapel, handleFinalizar, fluxoMusica, handleFluxoAdicionarMusica, handleFluxoRemoverMusica, handleFluxoMoverMusica, handleFluxoCriarLigacao, handleFluxoAlternarLigacao, handleFluxoMoverPulso, handleFluxoSilenciar }}>
            <Conteiner__PaginaPalcoEntrar__Interno />
        </Contexto__PaginaPalcoEntrar.Provider>
    );
};

// Rota /palco sem código: não há palco a resolver.
export const Contexto__PaginaPalcoSemCodigo__Provider = () => {
    return <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><p>Nenhum palco informado — abra um palco pelo link da sua liberação.</p></main>;
};

const Conteiner__PaginaPalcoEntrar__Interno = criaConteiner<PropsConteiner__PaginaPalcoEntrar>({ useEstado, resolveSaida });

type PropsConteiner__PaginaPalcoEntrar = Contexto__PaginaPalcoEntrar__Props;

function resolveSaida(props: PropsConteiner__PaginaPalcoEntrar): SaidaConteiner {
    if (props.fluxo === 'COMANDO') return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Comando__Provider, {});
    if (props.fluxo === 'FALANTE') return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Falante__Provider, {});
    if (props.fluxo === 'OUVINTE') return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Ouvinte__Provider, {});
    return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Aguardando__Provider, {});
};

function useEstado(): PropsConteiner__PaginaPalcoEntrar { return useContexto__PaginaPalcoEntrar(); };

function resolveFluxoPaginaPalcoEntrar(estado: PalcoEstadoDto | null, conectado: boolean, meuPapel: PalcoParticipantePapel | null, possoComandar: boolean): FluxoPaginaPalcoEntrar {
    if (!estado?.ativo) return 'FECHADO';
    if (conectado && possoComandar) return 'COMANDO';
    if (!conectado || meuPapel === null || meuPapel === 'aguardando') return 'AGUARDANDO';
    if (meuPapel === 'falante') return 'FALANTE';
    return 'OUVINTE';
};

// A mídia (LiveKit + mic + transcrição) é 100% do ControladorPalcoAudioGlobal via Central de Áudio —
// os fluxos da página só apresentam; por isso nenhum deles monta hook de áudio.
function Contexto__PaginaPalcoEntrar__Aguardando__Provider() { return <SPA__PaginaPalco__Participante />; };

function Contexto__PaginaPalcoEntrar__Ouvinte__Provider() { return <SPA__PaginaPalco__Participante />; };

function Contexto__PaginaPalcoEntrar__Falante__Provider() { return <SPA__PaginaPalco__Participante />; };

function Contexto__PaginaPalcoEntrar__Comando__Provider() { return <SPA__PaginaPalco__Admin />; };