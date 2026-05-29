'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Eventos_Emite, Eventos_Envia, Eventos_EnviaERecebe, type EMIT__Palco_encerrado, type EMIT__Palco_estadoAtualizado, type EMIT__Palco_receberAnswer, type EMIT__Palco_receberIceCandidate, type EMIT__Palco_receberOffer, type PalcoEstadoDto, type PalcoParticipantePapel, type RESPONSE__Palco_entrar, type TesteVoz_DescricaoSessao, type TesteVoz_IceCandidate, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import SPA__PaginaPalco__Participante from 'Conteineres/PaginaPalco/paginas/SPA__PaginaPalco__Participante/SPA__PaginaPalco__Participante';

type PeerMap = Map<number, RTCPeerConnection>;
type AudioMap = Map<number, HTMLAudioElement>;

const ICE_SERVERS: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
];

function criaDescricaoSessao(descricao: RTCSessionDescriptionInit): TesteVoz_DescricaoSessao | null {
    if (!descricao.sdp) return null;
    if (descricao.type !== 'offer' && descricao.type !== 'answer') return null;
    return { type: descricao.type, sdp: descricao.sdp };
};

function criaIceCandidate(candidate: RTCIceCandidate): TesteVoz_IceCandidate | null {
    if (!candidate.candidate) return null;
    return { candidate: candidate.candidate, sdpMid: candidate.sdpMid, sdpMLineIndex: candidate.sdpMLineIndex };
};

function entrarWs(): Promise<RESPONSE__Palco_entrar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.entrar, {}, {
            onSuccess: (response: RESPONSE__Palco_entrar) => { resolve(response); },
            onError: (error: WsErrorResponse) => { reject(error); },
            timeoutMs: 8000,
        });
    });
};

function verificarEstadoWs(): Promise<PalcoEstadoDto> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.verificarEstado, {}, {
            onSuccess: (response: PalcoEstadoDto) => { resolve(response); },
            onError: (error: WsErrorResponse) => { reject(error); },
            timeoutMs: 8000,
        });
    });
};

interface Contexto__PaginaPalcoEntrar__Props {
    entrando: boolean;
    conectado: boolean;
    meuPapel: PalcoParticipantePapel | null;
    estado: PalcoEstadoDto | null;
    logs: string[];
    entrarNoPalco: () => void;
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
    const [logs, setLogs] = useState<string[]>([]);

    const localStreamRef = useRef<MediaStream | null>(null);
    const peersRef = useRef<PeerMap>(new Map());
    const audiosRef = useRef<AudioMap>(new Map());
    const iceCandidatesPendentesRef = useRef<Map<number, TesteVoz_IceCandidate[]>>(new Map());
    const webRtcInicializadoRef = useRef(false);

    const adicionaLog = useCallback((mensagem: string): void => {
        const horario = new Date().toLocaleTimeString();
        setLogs(logsAtuais => [`[${horario}] ${mensagem}`, ...logsAtuais].slice(0, 80));
    }, []);

    const removeAudioRemoto = useCallback((idUsuario: number): void => {
        const audio = audiosRef.current.get(idUsuario);
        if (!audio) return;
        audio.pause();
        audio.srcObject = null;
        audio.remove();
        audiosRef.current.delete(idUsuario);
    }, []);

    const fecharPeer = useCallback((idUsuario: number): void => {
        const peer = peersRef.current.get(idUsuario);
        if (peer) peer.close();
        peersRef.current.delete(idUsuario);
        iceCandidatesPendentesRef.current.delete(idUsuario);
        removeAudioRemoto(idUsuario);
    }, [removeAudioRemoto]);

    const conectarAudioRemoto = useCallback((idUsuario: number, stream: MediaStream): void => {
        let audio = audiosRef.current.get(idUsuario);
        if (!audio) {
            audio = document.createElement('audio');
            audio.autoplay = true;
            audio.setAttribute('playsinline', 'true');
            document.body.appendChild(audio);
            audiosRef.current.set(idUsuario, audio);
        }
        audio.srcObject = stream;
        audio.play().catch(() => { adicionaLog(`Autoplay bloqueado para usuário ${idUsuario}.`); });
    }, [adicionaLog]);

    const enviarIceCandidate = useCallback((idUsuarioDestino: number, candidate: TesteVoz_IceCandidate): void => {
        eventoWs(Eventos_Envia.Palco.eventos.enviarIceCandidate, { idUsuarioDestino, candidate });
    }, []);

    const enviarOffer = useCallback((idUsuarioDestino: number, offer: TesteVoz_DescricaoSessao): void => {
        eventoWs(Eventos_Envia.Palco.eventos.enviarOffer, { idUsuarioDestino, offer });
    }, []);

    const enviarAnswer = useCallback((idUsuarioDestino: number, answer: TesteVoz_DescricaoSessao): void => {
        eventoWs(Eventos_Envia.Palco.eventos.enviarAnswer, { idUsuarioDestino, answer });
    }, []);

    const obtemOuCriaPeer = useCallback((idUsuarioRemoto: number): RTCPeerConnection | null => {
        const peerExistente = peersRef.current.get(idUsuarioRemoto);
        if (peerExistente) return peerExistente;

        const localStream = localStreamRef.current;
        if (!localStream) { adicionaLog('Microfone local não inicializado.'); return null; }

        const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        localStream.getAudioTracks().forEach(track => { peer.addTrack(track, localStream); });

        peer.onicecandidate = (evento: RTCPeerConnectionIceEvent): void => {
            if (!evento.candidate) return;
            const candidate = criaIceCandidate(evento.candidate);
            if (!candidate) return;
            enviarIceCandidate(idUsuarioRemoto, candidate);
        };

        peer.ontrack = (evento: RTCTrackEvent): void => {
            const stream = evento.streams[0];
            if (!stream) return;
            conectarAudioRemoto(idUsuarioRemoto, stream);
        };

        peer.onconnectionstatechange = (): void => {
            adicionaLog(`Conexão com ${idUsuarioRemoto}: ${peer.connectionState}.`);
        };

        peersRef.current.set(idUsuarioRemoto, peer);
        adicionaLog(`Criando conexão WebRTC com ${idUsuarioRemoto}.`);

        return peer;
    }, [adicionaLog, conectarAudioRemoto, enviarIceCandidate]);

    const aplicarIcePendentes = useCallback(async (idUsuarioRemoto: number, peer: RTCPeerConnection): Promise<void> => {
        const pendentes = iceCandidatesPendentesRef.current.get(idUsuarioRemoto) ?? [];
        iceCandidatesPendentesRef.current.delete(idUsuarioRemoto);
        for (const candidate of pendentes) { await peer.addIceCandidate(new RTCIceCandidate(candidate)); }
    }, []);

    const iniciarConexaoComUsuario = useCallback(async (idUsuarioRemoto: number): Promise<void> => {
        if (idUsuarioRemoto === usuarioLogado?.id) return;
        const peer = obtemOuCriaPeer(idUsuarioRemoto);
        if (!peer) return;
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const descricao = criaDescricaoSessao(offer);
        if (!descricao) { adicionaLog(`Não foi possível criar offer para ${idUsuarioRemoto}.`); return; }
        enviarOffer(idUsuarioRemoto, descricao);
        adicionaLog(`Offer enviada para ${idUsuarioRemoto}.`);
    }, [adicionaLog, enviarOffer, obtemOuCriaPeer, usuarioLogado?.id]);

    const responderOffer = useCallback(async (idUsuarioOrigem: number, offer: TesteVoz_DescricaoSessao): Promise<void> => {
        const peer = obtemOuCriaPeer(idUsuarioOrigem);
        if (!peer) return;
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        await aplicarIcePendentes(idUsuarioOrigem, peer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const descricao = criaDescricaoSessao(answer);
        if (!descricao) { adicionaLog(`Não foi possível criar answer para ${idUsuarioOrigem}.`); return; }
        enviarAnswer(idUsuarioOrigem, descricao);
        adicionaLog(`Answer enviada para ${idUsuarioOrigem}.`);
    }, [adicionaLog, aplicarIcePendentes, enviarAnswer, obtemOuCriaPeer]);

    const aplicarAnswer = useCallback(async (idUsuarioOrigem: number, answer: TesteVoz_DescricaoSessao): Promise<void> => {
        const peer = peersRef.current.get(idUsuarioOrigem);
        if (!peer) return;
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
        await aplicarIcePendentes(idUsuarioOrigem, peer);
        adicionaLog(`Answer recebida de ${idUsuarioOrigem}.`);
    }, [adicionaLog, aplicarIcePendentes]);

    const aplicarIceCandidate = useCallback(async (idUsuarioOrigem: number, candidate: TesteVoz_IceCandidate): Promise<void> => {
        const peer = obtemOuCriaPeer(idUsuarioOrigem);
        if (!peer) return;
        if (!peer.remoteDescription) {
            const pendentes = iceCandidatesPendentesRef.current.get(idUsuarioOrigem) ?? [];
            iceCandidatesPendentesRef.current.set(idUsuarioOrigem, [...pendentes, candidate]);
            return;
        }
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }, [obtemOuCriaPeer]);

    const sairLocalmente = useCallback((): void => {
        localStreamRef.current?.getTracks().forEach(track => { track.stop(); });
        localStreamRef.current = null;
        webRtcInicializadoRef.current = false;
        Array.from(peersRef.current.keys()).forEach(idUsuario => { fecharPeer(idUsuario); });
        peersRef.current.clear();
        audiosRef.current.clear();
        iceCandidatesPendentesRef.current.clear();
        setEntrando(false);
        setConectado(false);
        setMeuPapel(null);
        setEstado(null);
        adicionaLog('Saiu do palco.');
    }, [adicionaLog, fecharPeer]);

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.estadoAtualizado, {
        onSuccess: (data: EMIT__Palco_estadoAtualizado) => {
            setEstado(data);
            const meuId = usuarioLogado?.id;
            if (meuId === undefined) return;
            const eu = data.participantes.find(p => p.idUsuario === meuId);
            if (!eu) return;
            setMeuPapel(papelAtual => {
                if (papelAtual !== eu.papel) {
                    adicionaLog(`Seu papel mudou para: ${eu.papel}.`);
                    if (localStreamRef.current) {
                        const micAtivo = eu.papel === 'falante';
                        localStreamRef.current.getAudioTracks().forEach(track => { track.enabled = micAtivo; });
                    }
                    // Promovido de "aguardando" → inicia WebRTC com participantes ativos
                    if (papelAtual === 'aguardando' && eu.papel !== 'aguardando' && !webRtcInicializadoRef.current && localStreamRef.current) {
                        webRtcInicializadoRef.current = true;
                        for (const participante of data.participantes) {
                            if (participante.idUsuario === meuId) continue;
                            if (participante.papel === 'aguardando') continue;
                            iniciarConexaoComUsuario(participante.idUsuario).catch(() => {
                                adicionaLog(`Falha ao iniciar conexão com ${participante.idUsuario}.`);
                            });
                        }
                    }
                }
                return eu.papel;
            });
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.encerrado, {
        onSuccess: (_data: EMIT__Palco_encerrado) => {
            adicionaLog('O palco foi encerrado pelo administrador.');
            sairLocalmente();
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.receberOffer, {
        onSuccess: (data: EMIT__Palco_receberOffer) => {
            adicionaLog(`Offer recebida de ${data.idUsuarioOrigem}.`);
            responderOffer(data.idUsuarioOrigem, data.offer).catch(() => { adicionaLog(`Falha ao responder offer de ${data.idUsuarioOrigem}.`); });
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.receberAnswer, {
        onSuccess: (data: EMIT__Palco_receberAnswer) => {
            aplicarAnswer(data.idUsuarioOrigem, data.answer).catch(() => { adicionaLog(`Falha ao aplicar answer de ${data.idUsuarioOrigem}.`); });
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.receberIceCandidate, {
        onSuccess: (data: EMIT__Palco_receberIceCandidate) => {
            aplicarIceCandidate(data.idUsuarioOrigem, data.candidate).catch(() => { adicionaLog(`Falha ao aplicar ICE candidate de ${data.idUsuarioOrigem}.`); });
        },
    });

    const entrarNoPalco = useCallback(async (): Promise<void> => {
        if (entrando || conectado) return;
        if (!navigator.mediaDevices?.getUserMedia) { adicionaLog('Este navegador não suporta captura de microfone.'); return; }
        setEntrando(true);
        adicionaLog('Solicitando permissão de microfone.');
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStreamRef.current = localStream;
            adicionaLog('Microfone autorizado.');

            const entrada = await entrarWs();

            const papelInicial = entrada.meuPapel ?? 'ouvinte';
            const micAtivo = papelInicial === 'falante';
            localStream.getAudioTracks().forEach(track => { track.enabled = micAtivo; });

            setMeuPapel(papelInicial);
            setEstado({ ativo: entrada.ativo, participantes: entrada.participantes });
            setConectado(true);
            setEntrando(false);
            adicionaLog(`Entrou no palco como ${papelInicial}.`);

            // "aguardando" não inicia WebRTC — aguarda o admin promover
            if (papelInicial !== 'aguardando') {
                webRtcInicializadoRef.current = true;
                const meuId = usuarioLogado?.id;
                for (const participante of entrada.participantes) {
                    if (participante.idUsuario === meuId) continue;
                    if (participante.papel === 'aguardando') continue;
                    iniciarConexaoComUsuario(participante.idUsuario).catch(() => {
                        adicionaLog(`Falha ao iniciar conexão com ${participante.idUsuario}.`);
                    });
                }
            } else {
                adicionaLog('Aguardando aprovação do administrador para entrar no áudio.');
            }
        } catch {
            setEntrando(false);
            adicionaLog('Não foi possível entrar no palco.');
            localStreamRef.current?.getTracks().forEach(track => { track.stop(); });
            localStreamRef.current = null;
        }
    }, [adicionaLog, conectado, entrando, iniciarConexaoComUsuario, usuarioLogado?.id]);

    useEffect(() => {
        verificarEstadoWs().then(s => { setEstado(s); }).catch(() => {});
    }, []);

    useEffect(() => {
        window.addEventListener('beforeunload', sairLocalmente);
        return () => {
            window.removeEventListener('beforeunload', sairLocalmente);
            sairLocalmente();
        };
    }, [sairLocalmente]);

    return (
        <Contexto__PaginaPalcoEntrar.Provider value={{ entrando, conectado, meuPapel, estado, logs, entrarNoPalco, sairLocalmente }}>
            <SPA__PaginaPalco__Participante />
        </Contexto__PaginaPalcoEntrar.Provider>
    );
};