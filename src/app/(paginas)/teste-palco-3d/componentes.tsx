'use client';

// Rota de teste solta (espelha o padrão do /testevoz): protótipo de áudio 3D sobre o Palco.
// Entra no palco como participante normal; cada falante vira um PannerNode (HRTF) posicionável num plano 2D.
// Descartável por natureza — ao promover a oficial, refatorar para Conteiner/Contexto/SPA.

import { useCallback, useEffect, useRef, useState, type PointerEvent as PointerEventReact } from 'react';
import { useSearchParams } from 'next/navigation';
import { Room, RoomEvent, Track, type RemoteTrack, type RemoteParticipant } from 'livekit-client';
import { Eventos_Emite, Eventos_EnviaERecebe, PAGINAS, type EMIT__Palco_encerrado, type EMIT__Palco_estadoAtualizado, type EMIT__Palco_tokenMidia, type PalcoEstadoDto, type PalcoParticipantePapel, type RESPONSE__Palco_entrar, type WsErrorResponse } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

const PIXELS_POR_METRO = 20;
const CENTRO_SVG = 200;
const RAIO_INICIAL_METROS = 4;

type FalantePosicionado = { identity: string; idUsuario: number; nome: string; x: number; y: number };

function entrarWs(codigoPalco: string): Promise<RESPONSE__Palco_entrar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.entrar, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_entrar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

// Espalha as posições iniciais em círculo (ângulo áureo) para os pontos não nascerem empilhados.
function posicaoInicial(indice: number): { x: number; y: number } { const angulo = indice * 2.399963; return { x: Math.cos(angulo) * RAIO_INICIAL_METROS, y: Math.sin(angulo) * RAIO_INICIAL_METROS }; };

export default function TestePalco3D_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.palco}>
            <Pagina />
        </ControladorSlot>
    );
};

function Pagina() {
    const { usuarioLogado } = useContextoAutenticacao();
    const searchParams = useSearchParams();
    const codigoPalco = searchParams.get('codigoPalco');
    const [entrando, setEntrando] = useState(false);
    const [conectado, setConectado] = useState(false);
    const [meuPapel, setMeuPapel] = useState<PalcoParticipantePapel | null>(null);
    const [falantes, setFalantes] = useState<FalantePosicionado[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const roomRef = useRef<Room | null>(null);
    const pannersRef = useRef<Map<string, PannerNode>>(new Map());
    const fontesRef = useRef<Map<string, MediaStreamAudioSourceNode>>(new Map());
    const elementosRef = useRef<Map<string, HTMLMediaElement>>(new Map());
    const estadoRef = useRef<PalcoEstadoDto | null>(null);
    const conectadoRef = useRef(false);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const arrastoRef = useRef<{ identity: string; pegaX: number; pegaY: number } | null>(null);
    const contadorTesteRef = useRef(0);
    const fontesTesteRef = useRef<Map<string, { oscilador: OscillatorNode; ganho: GainNode; intervalo: ReturnType<typeof setInterval> }>>(new Map());

    const adicionaLog = useCallback((mensagem: string): void => {
        const horario = new Date().toLocaleTimeString();
        setLogs(logsAtuais => [`[${horario}] ${mensagem}`, ...logsAtuais].slice(0, 80));
    }, []);

    // Ponteiro → metros do plano. getScreenCTM embute a escala global do ConteinerEscalavel (--scale).
    const paraMundo = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
        const ctm = svgRef.current?.getScreenCTM();
        if (!ctm) return { x: 0, y: 0 };
        const inv = ctm.inverse();
        const px = inv.a * clientX + inv.c * clientY + inv.e;
        const py = inv.b * clientX + inv.d * clientY + inv.f;
        return { x: (px - CENTRO_SVG) / PIXELS_POR_METRO, y: (py - CENTRO_SVG) / PIXELS_POR_METRO };
    }, []);

    const posicionarPanner = useCallback((identity: string, x: number, y: number): void => {
        const ctx = audioCtxRef.current;
        const panner = pannersRef.current.get(identity);
        if (!ctx || !panner) return;
        // Plano: x = esquerda/direita; y da tela vira Z do WebAudio (cima da tela = -Z = frente do ouvinte).
        panner.positionX.setTargetAtTime(x, ctx.currentTime, 0.05);
        panner.positionY.setTargetAtTime(0, ctx.currentTime, 0.05);
        panner.positionZ.setTargetAtTime(y, ctx.currentTime, 0.05);
    }, []);

    const desligarFalante = useCallback((identity: string): void => {
        fontesRef.current.get(identity)?.disconnect();
        pannersRef.current.get(identity)?.disconnect();
        const elemento = elementosRef.current.get(identity);
        if (elemento) { elemento.remove(); };
        const teste = fontesTesteRef.current.get(identity);
        if (teste) { clearInterval(teste.intervalo); teste.oscilador.stop(); teste.oscilador.disconnect(); teste.ganho.disconnect(); fontesTesteRef.current.delete(identity); };
        fontesRef.current.delete(identity);
        pannersRef.current.delete(identity);
        elementosRef.current.delete(identity);
        setFalantes(atuais => atuais.filter(f => f.identity !== identity));
    }, []);

    // Fonte sintética local: permite testar a espacialização sozinho, sem segunda conta falando.
    const adicionarSomDeTeste = useCallback((): void => {
        const ctx = audioCtxRef.current ?? new AudioContext();
        audioCtxRef.current = ctx;
        ctx.resume().catch(() => {});

        contadorTesteRef.current += 1;
        const identity = `som-teste-${contadorTesteRef.current}`;
        const nome = `Som de teste ${contadorTesteRef.current}`;

        const oscilador = new OscillatorNode(ctx, { type: 'triangle', frequency: 380 + contadorTesteRef.current * 80 });
        const ganho = new GainNode(ctx, { gain: 0 });
        const panner = new PannerNode(ctx, { panningModel: 'HRTF', distanceModel: 'inverse', refDistance: 2, rolloffFactor: 1, maxDistance: 40 });
        oscilador.connect(ganho).connect(panner).connect(ctx.destination);
        oscilador.start();

        // Pulso periódico: transientes localizam muito melhor no HRTF do que tom contínuo.
        const intervalo = setInterval(() => {
            const t = ctx.currentTime;
            ganho.gain.cancelScheduledValues(t);
            ganho.gain.setValueAtTime(0.0001, t);
            ganho.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
            ganho.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        }, 700);

        pannersRef.current.set(identity, panner);
        fontesTesteRef.current.set(identity, { oscilador, ganho, intervalo });

        setFalantes(atuais => {
            const posicao = posicaoInicial(atuais.length);
            posicionarPanner(identity, posicao.x, posicao.y);
            return [...atuais, { identity, idUsuario: -contadorTesteRef.current, nome, x: posicao.x, y: posicao.y }];
        });
        adicionaLog(`${nome} adicionado — arraste o ponto e ouça de fones.`);
    }, [adicionaLog, posicionarPanner]);

    const aoReceberTrack = useCallback((track: RemoteTrack, participant: RemoteParticipant): void => {
        if (track.kind !== Track.Kind.Audio) return;
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const identity = participant.identity;
        const idUsuario = Number(identity.replace('usuario-', ''));
        const nome = estadoRef.current?.participantes.find(p => p.idUsuario === idUsuario)?.nome ?? identity;

        // Chrome só deixa MediaStream remoto alimentar o WebAudio se a track também estiver anexada a um elemento de mídia (mutado).
        const elemento = track.attach();
        elemento.muted = true;
        elemento.style.display = 'none';
        document.body.appendChild(elemento);
        elementosRef.current.set(identity, elemento);

        const fonte = ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
        const panner = new PannerNode(ctx, { panningModel: 'HRTF', distanceModel: 'inverse', refDistance: 2, rolloffFactor: 1, maxDistance: 40 });
        fonte.connect(panner).connect(ctx.destination);
        fontesRef.current.set(identity, fonte);
        pannersRef.current.set(identity, panner);

        setFalantes(atuais => {
            if (atuais.some(f => f.identity === identity)) return atuais;
            const posicao = posicaoInicial(atuais.length);
            posicionarPanner(identity, posicao.x, posicao.y);
            return [...atuais, { identity, idUsuario, nome, x: posicao.x, y: posicao.y }];
        });
        adicionaLog(`Voz de ${nome} entrou no espaço 3D.`);
    }, [adicionaLog, posicionarPanner]);

    const limparTudo = useCallback((): void => {
        roomRef.current?.disconnect();
        roomRef.current = null;
        Array.from(fontesRef.current.keys()).forEach(identity => {
            fontesRef.current.get(identity)?.disconnect();
            pannersRef.current.get(identity)?.disconnect();
            elementosRef.current.get(identity)?.remove();
        });
        Array.from(fontesTesteRef.current.values()).forEach(teste => { clearInterval(teste.intervalo); teste.oscilador.stop(); teste.oscilador.disconnect(); teste.ganho.disconnect(); });
        fontesTesteRef.current.clear();
        fontesRef.current.clear();
        pannersRef.current.clear();
        elementosRef.current.clear();
        arrastoRef.current = null;
        conectadoRef.current = false;
        estadoRef.current = null;
        setFalantes([]);
        setConectado(false);
        setMeuPapel(null);
        setEntrando(false);
    }, []);

    const conectarLiveKit = useCallback((token: string, livekitUrl: string): void => {
        roomRef.current?.disconnect();
        const room = new Room();
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _publication, participant) => { aoReceberTrack(track, participant); });
        room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, _publication, participant) => {
            if (track.kind !== Track.Kind.Audio) return;
            desligarFalante(participant.identity);
            adicionaLog(`Voz de ${participant.identity} saiu do espaço 3D.`);
        });

        room.connect(livekitUrl, token).then(() => {
            adicionaLog('Conectado ao LiveKit — modo espacial ativo.');
        }).catch((e: Error) => {
            adicionaLog(`Erro ao conectar LiveKit: ${e.message}`);
        });
    }, [adicionaLog, aoReceberTrack, desligarFalante]);

    const entrarNoPalco = useCallback(async (): Promise<void> => {
        if (entrando || conectado) return;
        setEntrando(true);

        // Criado no gesto do usuário para não cair na autoplay policy.
        const ctx = audioCtxRef.current ?? new AudioContext();
        audioCtxRef.current = ctx;
        ctx.resume().catch(() => {});

        if (!codigoPalco) { adicionaLog('Informe ?codigoPalco=... na URL para testar um palco vivo.'); setEntrando(false); return; }

        try {
            const entrada = await entrarWs(codigoPalco);
            conectadoRef.current = true;
            estadoRef.current = { codigoPalco: entrada.codigoPalco, nome: entrada.nome, ativo: entrada.ativo, idUsuarioDono: entrada.idUsuarioDono, nomeDono: entrada.nomeDono, idSalaChat: entrada.idSalaChat, participantes: entrada.participantes, fluxo: entrada.fluxo };
            setConectado(true);
            setMeuPapel(entrada.meuPapel ?? 'aguardando');
            adicionaLog('Entrou no palco. Peça a quem comanda para te mover para Assistindo/Participando.');
        } catch {
            adicionaLog('Não foi possível entrar no palco (está aberto?).');
        } finally {
            setEntrando(false);
        }
    }, [adicionaLog, conectado, entrando, codigoPalco]);

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.estadoAtualizado, {
        onSuccess: (data: EMIT__Palco_estadoAtualizado) => {
            estadoRef.current = data;
            if (!conectadoRef.current || !usuarioLogado) return;
            const eu = data.participantes.find(p => p.idUsuario === usuarioLogado.id);
            if (eu) { setMeuPapel(eu.papel); return; };
            adicionaLog('Você foi removido do palco.');
            limparTudo();
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.tokenMidia, {
        onSuccess: (data: EMIT__Palco_tokenMidia) => {
            adicionaLog('Token de mídia recebido — conectando ao LiveKit.');
            conectarLiveKit(data.token, data.livekitUrl);
        },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.encerrado, {
        onSuccess: (_data: EMIT__Palco_encerrado) => {
            adicionaLog('O palco foi encerrado pelo administrador.');
            limparTudo();
        },
    });

    useEffect(() => { return () => { limparTudo(); }; }, [limparTudo]);

    const aoPegarFalante = useCallback((evento: PointerEventReact<SVGGElement>, falante: FalantePosicionado): void => {
        const mundo = paraMundo(evento.clientX, evento.clientY);
        arrastoRef.current = { identity: falante.identity, pegaX: falante.x - mundo.x, pegaY: falante.y - mundo.y };
        try { svgRef.current?.setPointerCapture(evento.pointerId); } catch (_err) { }
    }, [paraMundo]);

    const aoMoverPonteiro = useCallback((evento: PointerEventReact<SVGSVGElement>): void => {
        const arrasto = arrastoRef.current;
        if (!arrasto) return;
        const mundo = paraMundo(evento.clientX, evento.clientY);
        const x = mundo.x + arrasto.pegaX;
        const y = mundo.y + arrasto.pegaY;
        posicionarPanner(arrasto.identity, x, y);
        setFalantes(atuais => atuais.map(f => f.identity === arrasto.identity ? { ...f, x, y } : f));
    }, [paraMundo, posicionarPanner]);

    const aoSoltarPonteiro = useCallback((): void => { arrastoRef.current = null; }, []);

    return (
        <main style={{ maxWidth: '56em', margin: '0 auto', padding: '2em', display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <header>
                <h1 style={{ margin: 0, fontFamily: "'Cinzel', serif", color: '#D9D9D9', fontSize: '1.5em', letterSpacing: '0.06em' }}>Teste — Áudio 3D do Palco</h1>
                <p style={{ marginTop: '0.5em', color: '#7060a0', fontSize: '0.85em' }}>Use fones. Arraste os pontos e ouça a voz se mover ao redor de você.</p>
            </header>

            <div style={{ display: 'flex', gap: '0.75em', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => { entrarNoPalco().catch(() => {}); }} disabled={entrando || conectado}>{entrando ? 'Entrando...' : 'Entrar no palco (3D)'}</button>
                <button type="button" onClick={adicionarSomDeTeste}>Adicionar som de teste</button>
                <button type="button" onClick={limparTudo} disabled={!conectado && falantes.length === 0}>Sair / limpar</button>
                <span style={{ alignSelf: 'center', color: '#7060a0', fontSize: '0.85em' }}>{conectado ? `Conectado — papel: ${meuPapel ?? 'aguardando'}` : 'Fora do palco'}</span>
            </div>

            <svg ref={svgRef} viewBox="0 0 400 400" onPointerMove={aoMoverPonteiro} onPointerUp={aoSoltarPonteiro} style={{ width: '100%', maxWidth: '28em', touchAction: 'none', border: '0.1em solid #2d1a50', borderRadius: '0.55em', background: 'rgba(16, 8, 32, 0.75)' }}>
                {[2, 4, 6, 8].map(raio => <circle key={raio} cx={CENTRO_SVG} cy={CENTRO_SVG} r={raio * PIXELS_POR_METRO} fill="none" stroke="#2d1a50" strokeWidth="1" />)}
                <circle cx={CENTRO_SVG} cy={CENTRO_SVG} r={10} fill="#B79051" />
                <text x={CENTRO_SVG} y={CENTRO_SVG + 26} textAnchor="middle" fill="#EBE0C9" fontSize="12">Você</text>
                {falantes.map(f => (
                    <g key={f.identity} onPointerDown={evento => { aoPegarFalante(evento, f); }} style={{ cursor: 'grab' }}>
                        <circle cx={CENTRO_SVG + f.x * PIXELS_POR_METRO} cy={CENTRO_SVG + f.y * PIXELS_POR_METRO} r={14} fill="#6b21c8" stroke="#EBE0C9" strokeWidth="1.5" />
                        <text x={CENTRO_SVG + f.x * PIXELS_POR_METRO} y={CENTRO_SVG + f.y * PIXELS_POR_METRO + 30} textAnchor="middle" fill="#EBE0C9" fontSize="12">{f.nome} ({Math.hypot(f.x, f.y).toFixed(1)}m)</text>
                    </g>
                ))}
            </svg>

            <section style={{ border: '0.1em solid #2d1a50', borderRadius: '0.55em', padding: '1em', background: 'rgba(16, 8, 32, 0.75)' }}>
                <h2 style={{ marginTop: 0, fontSize: '0.9em', color: '#D9D9D9', fontFamily: "'Cinzel', serif" }}>Logs</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35em', maxHeight: '14em', overflow: 'auto' }}>
                    {logs.map((log, indice) => <code key={`${log}-${indice}`} style={{ fontSize: '0.78em', color: '#7060a0' }}>{log}</code>)}
                    {logs.length === 0 && <p style={{ margin: 0, color: '#4a3a6a', fontSize: '0.8em', fontStyle: 'italic' }}>Nenhum log ainda.</p>}
                </div>
            </section>
        </main>
    );
};