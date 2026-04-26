"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EMIT__TesteVoz_receberAnswer, EMIT__TesteVoz_receberIceCandidate, EMIT__TesteVoz_receberOffer, EMIT__TesteVoz_usuarioEntrou, EMIT__TesteVoz_usuarioSaiu, Eventos_Emite, Eventos_Envia, Eventos_EnviaERecebe, PAGINAS, RESPONSE__TesteVoz_entrarNaSala, TesteVoz_DescricaoSessao, TesteVoz_IceCandidate, type WsErrorResponse } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { eventoWs, useRecebeEmitWs } from "Hooks/useEventoWs";

type PeerMap = Map<string, RTCPeerConnection>;
type AudioMap = Map<string, HTMLAudioElement>;

const ICE_SERVERS: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
];

function criaDescricaoSessao(descricao: RTCSessionDescriptionInit): TesteVoz_DescricaoSessao | null {
    if (!descricao.sdp) return null;
    if (descricao.type !== "offer" && descricao.type !== "answer") return null;

    return {
        type: descricao.type,
        sdp: descricao.sdp,
    };
};

function criaIceCandidate(candidate: RTCIceCandidate): TesteVoz_IceCandidate | null {
    if (!candidate.candidate) return null;

    return {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
    };
};

function entrarNaSalaWs(): Promise<RESPONSE__TesteVoz_entrarNaSala> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.TesteVoz.eventos.entrarNaSala, {}, {
            onSuccess: (response: RESPONSE__TesteVoz_entrarNaSala) => { resolve(response); },
            onError: (error: WsErrorResponse) => { reject(error); },
            timeoutMs: 8000,
        });
    });
};


export default function MinhaPagina_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhaPagina}>
            <Pagina />
        </ControladorSlot>
    );
};

function Pagina() {
    const [entrando, setEntrando] = useState(false);
    const [conectado, setConectado] = useState(false);
    const [mutado, setMutado] = useState(false);
    const [idUsuarioLocal, setIdUsuarioLocal] = useState<string | null>(null);
    const [usuariosRemotos, setUsuariosRemotos] = useState<string[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const localStreamRef = useRef<MediaStream | null>(null);
    const idUsuarioLocalRef = useRef<string | null>(null);
    const peersRef = useRef<PeerMap>(new Map());
    const audiosRef = useRef<AudioMap>(new Map());
    const iceCandidatesPendentesRef = useRef<Map<string, TesteVoz_IceCandidate[]>>(new Map());

    const adicionaLog = useCallback((mensagem: string): void => {
        const horario = new Date().toLocaleTimeString();

        setLogs(logsAtuais => [`[${horario}] ${mensagem}`, ...logsAtuais].slice(0, 80));
    }, []);

    const adicionaUsuarioRemoto = useCallback((idUsuario: string): void => {
        setUsuariosRemotos(usuariosAtuais => usuariosAtuais.includes(idUsuario) ? usuariosAtuais : [...usuariosAtuais, idUsuario]);
    }, []);

    const removeUsuarioRemoto = useCallback((idUsuario: string): void => {
        setUsuariosRemotos(usuariosAtuais => usuariosAtuais.filter(idUsuarioAtual => idUsuarioAtual !== idUsuario));
    }, []);

    const removeAudioRemoto = useCallback((idUsuario: string): void => {
        const audio = audiosRef.current.get(idUsuario);

        if (!audio) return;

        audio.pause();
        audio.srcObject = null;
        audio.remove();

        audiosRef.current.delete(idUsuario);
    }, []);

    const fecharPeer = useCallback((idUsuario: string): void => {
        const peer = peersRef.current.get(idUsuario);

        if (peer) peer.close();

        peersRef.current.delete(idUsuario);
        iceCandidatesPendentesRef.current.delete(idUsuario);
        removeAudioRemoto(idUsuario);
        removeUsuarioRemoto(idUsuario);
    }, [removeAudioRemoto, removeUsuarioRemoto]);

    const conectarAudioRemoto = useCallback((idUsuario: string, stream: MediaStream): void => {
        let audio = audiosRef.current.get(idUsuario);

        if (!audio) {
            audio = document.createElement("audio");
            audio.autoplay = true;
            audio.setAttribute("playsinline", "true");
            audio.dataset.idUsuario = idUsuario;
            document.body.appendChild(audio);
            audiosRef.current.set(idUsuario, audio);
        }

        audio.srcObject = stream;
        adicionaUsuarioRemoto(idUsuario);
        adicionaLog(`Recebendo áudio de ${idUsuario}.`);
        audio.play().catch(() => { adicionaLog(`O navegador bloqueou autoplay do áudio de ${idUsuario}.`); });
    }, [adicionaLog, adicionaUsuarioRemoto]);

    const enviarIceCandidate = useCallback((idUsuarioDestino: string, candidate: TesteVoz_IceCandidate): void => {
        eventoWs(Eventos_Envia.TesteVoz.eventos.enviarIceCandidate, {
            idUsuarioDestino,
            candidate,
        });
    }, []);

    const enviarOffer = useCallback((idUsuarioDestino: string, offer: TesteVoz_DescricaoSessao): void => {
        eventoWs(Eventos_Envia.TesteVoz.eventos.enviarOffer, {
            idUsuarioDestino,
            offer,
        });
    }, []);

    const enviarAnswer = useCallback((idUsuarioDestino: string, answer: TesteVoz_DescricaoSessao): void => {
        eventoWs(Eventos_Envia.TesteVoz.eventos.enviarAnswer, {
            idUsuarioDestino,
            answer,
        });
    }, []);

    const obtemOuCriaPeer = useCallback((idUsuarioRemoto: string): RTCPeerConnection | null => {
        const peerExistente = peersRef.current.get(idUsuarioRemoto);

        if (peerExistente) return peerExistente;

        const localStream = localStreamRef.current;

        if (!localStream) {
            adicionaLog("Microfone local não inicializado.");
            return null;
        }

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

        peer.oniceconnectionstatechange = (): void => {
            adicionaLog(`ICE com ${idUsuarioRemoto}: ${peer.iceConnectionState}.`);
        };

        peersRef.current.set(idUsuarioRemoto, peer);
        adicionaUsuarioRemoto(idUsuarioRemoto);
        adicionaLog(`Criando conexão WebRTC com ${idUsuarioRemoto}.`);

        return peer;
    }, [adicionaLog, adicionaUsuarioRemoto, conectarAudioRemoto, enviarIceCandidate]);

    const aplicarIcePendentes = useCallback(async (idUsuarioRemoto: string, peer: RTCPeerConnection): Promise<void> => {
        const pendentes = iceCandidatesPendentesRef.current.get(idUsuarioRemoto) ?? [];

        iceCandidatesPendentesRef.current.delete(idUsuarioRemoto);

        for (const candidate of pendentes) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }, []);

    const iniciarConexaoComUsuario = useCallback(async (idUsuarioRemoto: string): Promise<void> => {
        if (idUsuarioRemoto === idUsuarioLocalRef.current) return;

        const peer = obtemOuCriaPeer(idUsuarioRemoto);

        if (!peer) return;

        const offer = await peer.createOffer();

        await peer.setLocalDescription(offer);

        const descricao = criaDescricaoSessao(offer);

        if (!descricao) {
            adicionaLog(`Não foi possível criar offer para ${idUsuarioRemoto}.`);
            return;
        }

        enviarOffer(idUsuarioRemoto, descricao);
        adicionaLog(`Offer enviada para ${idUsuarioRemoto}.`);
    }, [adicionaLog, enviarOffer, obtemOuCriaPeer]);

    const responderOffer = useCallback(async (idUsuarioOrigem: string, offer: TesteVoz_DescricaoSessao): Promise<void> => {
        const peer = obtemOuCriaPeer(idUsuarioOrigem);

        if (!peer) return;

        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        await aplicarIcePendentes(idUsuarioOrigem, peer);

        const answer = await peer.createAnswer();

        await peer.setLocalDescription(answer);

        const descricao = criaDescricaoSessao(answer);

        if (!descricao) {
            adicionaLog(`Não foi possível criar answer para ${idUsuarioOrigem}.`);
            return;
        }

        enviarAnswer(idUsuarioOrigem, descricao);
        adicionaLog(`Answer enviada para ${idUsuarioOrigem}.`);
    }, [adicionaLog, aplicarIcePendentes, enviarAnswer, obtemOuCriaPeer]);

    const aplicarAnswer = useCallback(async (idUsuarioOrigem: string, answer: TesteVoz_DescricaoSessao): Promise<void> => {
        const peer = peersRef.current.get(idUsuarioOrigem);

        if (!peer) return;

        await peer.setRemoteDescription(new RTCSessionDescription(answer));
        await aplicarIcePendentes(idUsuarioOrigem, peer);
        adicionaLog(`Answer recebida de ${idUsuarioOrigem}.`);
    }, [adicionaLog, aplicarIcePendentes]);

    const aplicarIceCandidate = useCallback(async (idUsuarioOrigem: string, candidate: TesteVoz_IceCandidate): Promise<void> => {
        const peer = obtemOuCriaPeer(idUsuarioOrigem);

        if (!peer) return;

        if (!peer.remoteDescription) {
            const pendentes = iceCandidatesPendentesRef.current.get(idUsuarioOrigem) ?? [];

            iceCandidatesPendentesRef.current.set(idUsuarioOrigem, [...pendentes, candidate]);
            return;
        }

        await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }, [obtemOuCriaPeer]);

    useRecebeEmitWs(Eventos_Emite.TesteVoz.eventos.usuarioEntrou, {
        onSuccess: (data: EMIT__TesteVoz_usuarioEntrou) => {
            if (data.idUsuario === idUsuarioLocalRef.current) return;

            adicionaUsuarioRemoto(data.idUsuario);
            adicionaLog(`${data.idUsuario} entrou na sala.`);
        },
    });

    useRecebeEmitWs(Eventos_Emite.TesteVoz.eventos.usuarioSaiu, {
        onSuccess: (data: EMIT__TesteVoz_usuarioSaiu) => {
            fecharPeer(data.idUsuario);
            adicionaLog(`${data.idUsuario} saiu da sala.`);
        },
    });

    useRecebeEmitWs(Eventos_Emite.TesteVoz.eventos.receberOffer, {
        onSuccess: (data: EMIT__TesteVoz_receberOffer) => {
            adicionaLog(`Offer recebida de ${data.idUsuarioOrigem}.`);
            responderOffer(data.idUsuarioOrigem, data.offer).catch(() => { adicionaLog(`Falha ao responder offer de ${data.idUsuarioOrigem}.`); });
        },
    });

    useRecebeEmitWs(Eventos_Emite.TesteVoz.eventos.receberAnswer, {
        onSuccess: (data: EMIT__TesteVoz_receberAnswer) => {
            aplicarAnswer(data.idUsuarioOrigem, data.answer).catch(() => { adicionaLog(`Falha ao aplicar answer de ${data.idUsuarioOrigem}.`); });
        },
    });

    useRecebeEmitWs(Eventos_Emite.TesteVoz.eventos.receberIceCandidate, {
        onSuccess: (data: EMIT__TesteVoz_receberIceCandidate) => {
            aplicarIceCandidate(data.idUsuarioOrigem, data.candidate).catch(() => { adicionaLog(`Falha ao aplicar ICE candidate de ${data.idUsuarioOrigem}.`); });
        },
    });

    const entrarNaSala = useCallback(async (): Promise<void> => {
        if (entrando || conectado) return;

        if (!navigator.mediaDevices?.getUserMedia) {
            adicionaLog("Este navegador não suporta captura de microfone.");
            return;
        }

        setEntrando(true);
        adicionaLog("Solicitando permissão de microfone.");

        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

            localStreamRef.current = localStream;
            adicionaLog("Microfone autorizado.");

            const entrada = await entrarNaSalaWs();

            idUsuarioLocalRef.current = entrada.idUsuario;
            setIdUsuarioLocal(entrada.idUsuario);
            setConectado(true);
            setEntrando(false);
            adicionaLog(`Entrou na sala ${entrada.idSala} como ${entrada.idUsuario}.`);

            entrada.usuariosJaConectados.forEach((idUsuarioRemoto: string) => {
                adicionaUsuarioRemoto(idUsuarioRemoto);
                iniciarConexaoComUsuario(idUsuarioRemoto).catch(() => { adicionaLog(`Falha ao iniciar conexão com ${idUsuarioRemoto}.`); });
            });
        } catch {
            setEntrando(false);
            adicionaLog("Não foi possível entrar na sala de voz.");
            localStreamRef.current?.getTracks().forEach(track => { track.stop(); });
            localStreamRef.current = null;
        }
    }, [adicionaLog, adicionaUsuarioRemoto, conectado, entrando, iniciarConexaoComUsuario]);

    const alternarMute = useCallback((): void => {
        setMutado(mutadoAtual => {
            const proximoMutado = !mutadoAtual;
            const localStream = localStreamRef.current;

            if (localStream) localStream.getAudioTracks().forEach(track => { track.enabled = !proximoMutado; });

            adicionaLog(proximoMutado ? "Microfone mutado." : "Microfone desmutado.");

            return proximoMutado;
        });
    }, [adicionaLog]);

    const sairLocalmente = useCallback((): void => {
        localStreamRef.current?.getTracks().forEach(track => { track.stop(); });
        localStreamRef.current = null;

        Array.from(peersRef.current.keys()).forEach(idUsuario => { fecharPeer(idUsuario); });

        peersRef.current.clear();
        audiosRef.current.clear();
        iceCandidatesPendentesRef.current.clear();

        idUsuarioLocalRef.current = null;

        setEntrando(false);
        setConectado(false);
        setMutado(false);
        setIdUsuarioLocal(null);
        setUsuariosRemotos([]);

        adicionaLog("Limpou conexões locais.");
    }, [adicionaLog, fecharPeer]);

    useEffect(() => {
        window.addEventListener("beforeunload", sairLocalmente);

        return () => {
            window.removeEventListener("beforeunload", sairLocalmente);
            sairLocalmente();
        };
    }, [sairLocalmente]);

    return (
        <main style={{ maxWidth: "56em", margin: "0 auto", padding: "2em", fontFamily: "sans-serif" }}>
            <section style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
                <header>
                    <h1 style={{ margin: 0 }}>Teste de Voz</h1>
                    <p style={{ marginTop: "0.5em" }}>MVP experimental de voz em tempo real usando WebRTC P2P e WebSocket oficial do UDM.</p>
                </header>

                <div style={{ display: "flex", gap: "0.75em", flexWrap: "wrap" }}>
                    <button type="button" onClick={entrarNaSala} disabled={entrando || conectado}>{entrando ? "Entrando..." : "Entrar na sala"}</button>
                    <button type="button" onClick={alternarMute} disabled={!conectado}>{mutado ? "Desmutar" : "Mutar"}</button>
                    <button type="button" onClick={sairLocalmente} disabled={!conectado && !entrando}>Sair</button>
                </div>

                <section style={{ border: "0.1em solid #444", borderRadius: "0.5em", padding: "1em" }}>
                    <h2 style={{ marginTop: 0 }}>Status</h2>
                    <p><strong>Conectado:</strong> {conectado ? "sim" : "não"}</p>
                    <p><strong>Usuário local:</strong> {idUsuarioLocal ?? "nenhum"}</p>
                    <p><strong>Microfone:</strong> {mutado ? "mutado" : "aberto"}</p>
                </section>

                <section style={{ border: "0.1em solid #444", borderRadius: "0.5em", padding: "1em" }}>
                    <h2 style={{ marginTop: 0 }}>Usuários conectados</h2>

                    <ul>
                        {idUsuarioLocal && <li>{idUsuarioLocal} — você</li>}
                        {usuariosRemotos.map(idUsuario => <li key={idUsuario}>{idUsuario}</li>)}
                        {!idUsuarioLocal && usuariosRemotos.length === 0 && <li>Ninguém conectado ainda.</li>}
                    </ul>
                </section>

                <section style={{ border: "0.1em solid #444", borderRadius: "0.5em", padding: "1em" }}>
                    <h2 style={{ marginTop: 0 }}>Logs</h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35em", maxHeight: "24em", overflow: "auto" }}>
                        {logs.map((log, index) => <code key={`${log}-${index}`}>{log}</code>)}
                        {logs.length === 0 && <p>Nenhum log ainda.</p>}
                    </div>
                </section>
            </section>
        </main>
    );
}