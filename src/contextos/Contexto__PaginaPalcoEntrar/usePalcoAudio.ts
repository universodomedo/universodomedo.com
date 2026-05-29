'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Eventos_Emite, Eventos_Envia, type EMIT__Palco_receberAnswer, type EMIT__Palco_receberIceCandidate, type EMIT__Palco_receberOffer, type PalcoParticipanteDto, type TesteVoz_DescricaoSessao, type TesteVoz_IceCandidate } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

type PalcoAudioModo = 'ouvinte' | 'falante';
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

export function usePalcoAudio({ modo, participantes, adicionaLog }: { modo: PalcoAudioModo; participantes: PalcoParticipanteDto[]; adicionaLog: (mensagem: string) => void; }) {
    const { usuarioLogado } = useContextoAutenticacao();

    // localStream só existe quando o papel é 'falante'.
    const localStreamRef = useRef<MediaStream | null>(null);
    const peersRef = useRef<PeerMap>(new Map());
    const audiosRef = useRef<AudioMap>(new Map());
    const iceCandidatesPendentesRef = useRef<Map<number, TesteVoz_IceCandidate[]>>(new Map());
    const modoRef = useRef<PalcoAudioModo>(modo);

    const idsParticipantes = useMemo(() => participantes.filter(p => p.papel !== 'aguardando' && p.idUsuario !== usuarioLogado?.id).map(p => p.idUsuario), [participantes, usuarioLogado?.id]);
    const idsParticipantesKey = idsParticipantes.join('|');

    const enviarIceCandidate = useCallback((idUsuarioDestino: number, candidate: TesteVoz_IceCandidate): void => { eventoWs(Eventos_Envia.Palco.eventos.enviarIceCandidate, { idUsuarioDestino, candidate }); }, []);
    const enviarOffer = useCallback((idUsuarioDestino: number, offer: TesteVoz_DescricaoSessao): void => { eventoWs(Eventos_Envia.Palco.eventos.enviarOffer, { idUsuarioDestino, offer }); }, []);
    const enviarAnswer = useCallback((idUsuarioDestino: number, answer: TesteVoz_DescricaoSessao): void => { eventoWs(Eventos_Envia.Palco.eventos.enviarAnswer, { idUsuarioDestino, answer }); }, []);

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

    const fecharConexoesDeAudio = useCallback((): void => {
        Array.from(peersRef.current.keys()).forEach(idUsuario => { fecharPeer(idUsuario); });
        peersRef.current.clear();
        audiosRef.current.clear();
        iceCandidatesPendentesRef.current.clear();
    }, [fecharPeer]);

    // Para e limpa o microfone. Chamada quando o usuário deixa de ser falante.
    const pararMicrofone = useCallback((): void => {
        localStreamRef.current?.getTracks().forEach(track => { track.stop(); });
        localStreamRef.current = null;
    }, []);

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

    // Cria (ou retorna existente) RTCPeerConnection.
    // Falante: adiciona tracks do localStream. Ouvinte: cria transceiver recvonly (sem mic).
    const obtemOuCriaPeer = useCallback((idUsuarioRemoto: number): RTCPeerConnection | null => {
        const peerExistente = peersRef.current.get(idUsuarioRemoto);
        if (peerExistente) return peerExistente;

        const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        const localStream = localStreamRef.current;

        if (modoRef.current === 'falante') {
            if (!localStream) { adicionaLog('Microfone local não inicializado.'); return null; }
            localStream.getAudioTracks().forEach(track => { peer.addTrack(track, localStream); });
        } else {
            peer.addTransceiver('audio', { direction: 'recvonly' });
        }

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

        peer.onconnectionstatechange = (): void => { adicionaLog(`Conexão com ${idUsuarioRemoto}: ${peer.connectionState}.`); };

        peersRef.current.set(idUsuarioRemoto, peer);
        adicionaLog(`Criando conexão WebRTC com ${idUsuarioRemoto}.`);
        return peer;
    }, [adicionaLog, conectarAudioRemoto, enviarIceCandidate]);

    const aplicarIcePendentes = useCallback(async (idUsuarioRemoto: number, peer: RTCPeerConnection): Promise<void> => {
        const pendentes = iceCandidatesPendentesRef.current.get(idUsuarioRemoto) ?? [];
        iceCandidatesPendentesRef.current.delete(idUsuarioRemoto);
        for (const candidate of pendentes) await peer.addIceCandidate(new RTCIceCandidate(candidate));
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

    // Solicita microfone. Chamada apenas na transição para falante.
    const iniciarMicrofone = useCallback(async (): Promise<boolean> => {
        if (modo !== 'falante') return true;
        if (!navigator.mediaDevices?.getUserMedia) { adicionaLog('Este navegador não suporta captura de microfone.'); return false; }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStreamRef.current = stream;
            adicionaLog('Microfone autorizado.');
            return true;
        } catch {
            adicionaLog('Não foi possível capturar microfone.');
            return false;
        }
    }, [adicionaLog, modo]);

    useEffect(() => { modoRef.current = modo; }, [modo]);

    useEffect(() => {
        let cancelado = false;

        const iniciar = async (): Promise<void> => {
            const microfoneOk = await iniciarMicrofone();
            if (!microfoneOk || cancelado) return;

            for (const idUsuarioRemoto of idsParticipantes) {
                if (cancelado) return;
                if (usuarioLogado?.id !== undefined && usuarioLogado.id > idUsuarioRemoto) continue;
                await iniciarConexaoComUsuario(idUsuarioRemoto);
            }
        };

        iniciar().catch(() => { adicionaLog('Falha ao iniciar conexões de áudio.'); });

        return () => {
            cancelado = true;
            pararMicrofone();
            fecharConexoesDeAudio();
        };
    }, [adicionaLog, fecharConexoesDeAudio, idsParticipantesKey, iniciarConexaoComUsuario, iniciarMicrofone, pararMicrofone, usuarioLogado?.id]);

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.receberOffer, {
        onSuccess: (data: EMIT__Palco_receberOffer) => {
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
};