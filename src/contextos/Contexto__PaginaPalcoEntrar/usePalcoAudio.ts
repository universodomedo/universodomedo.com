'use client';

import { useEffect, useRef } from 'react';
import { Room, RoomEvent, Track, type RemoteTrack } from 'livekit-client';
import { Eventos_Envia } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';

type PalcoAudioModo = 'ouvinte' | 'falante';

// ── Helpers de diagnóstico ─────────────────────────────────────────────────

// Gera um ID de rastreamento curto por tentativa de conexão.
function gerarTraceId(): string { return Math.random().toString(36).slice(2, 8).toUpperCase(); };

// Inspeciona metadados do JWT sem logar o valor completo.
interface TokenMeta { room: string; identity: string; canPublish: boolean; canSubscribe: boolean; tamanho: number };

interface LiveKitJWTVideoGrant { room?: string; roomJoin?: boolean; canPublish?: boolean; canSubscribe?: boolean };
interface LiveKitJWTPayload { sub?: string; video?: LiveKitJWTVideoGrant };

function inspecionarToken(token: string): TokenMeta | null {
    try {
        const partes = token.split('.');
        if (partes.length !== 3) return null;
        const payload = JSON.parse(atob(partes[1])) as LiveKitJWTPayload;
        return { room: payload.video?.room ?? 'não encontrada', identity: payload.sub ?? 'não encontrado', canPublish: payload.video?.canPublish ?? false, canSubscribe: payload.video?.canSubscribe ?? false, tamanho: token.length };
    } catch { return null; }
};

// Valida se a URL parece correta antes de tentar conectar.
function validarLivekitUrl(url: string, traceId: string): boolean {
    if (!url.trim()) { console.error(`[PalcoAudio:${traceId}] URL vazia ou apenas espaços.`); return false; };
    if (url !== url.trim()) { console.warn(`[PalcoAudio:${traceId}] URL contém espaços no início/fim: "${url}"`); };
    if (url.startsWith('http://') || url.startsWith('https://')) {
        console.error(`[PalcoAudio:${traceId}] URL começa com HTTP/HTTPS em vez de wss:// — LiveKit requer WebSocket. URL recebida: "${url}"`);
        return false;
    };
    if (!url.startsWith('wss://') && !url.startsWith('ws://')) {
        console.warn(`[PalcoAudio:${traceId}] URL não começa com wss:// nem ws://. URL recebida: "${url}"`);
    };
    if (url.startsWith('ws://')) { console.warn(`[PalcoAudio:${traceId}] URL usa ws:// (inseguro). Em produção/LiveKit Cloud deve ser wss://.`); };
    return true;
};

// Reporta telemetria de estado de áudio para o painel de diagnóstico do Admin.
function reportarTelemetria(dados: Record<string, string | number | undefined>): void {
    eventoWs(Eventos_Envia.Palco.eventos.relatarTelemetriaAudio, dados);
};

// ─────────────────────────────────────────────────────────────────────────────

export function usePalcoAudio({ modo, token, livekitUrl, adicionaLog }: { modo: PalcoAudioModo; token: string | null; livekitUrl: string | null; adicionaLog: (mensagem: string) => void; }) {
    const roomRef = useRef<Room | null>(null);
    const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
    // Rastreia se adicionaLog muda de referência entre renders (depende da estabilidade no contexto pai).
    const adicionaLogRef = useRef(adicionaLog);
    adicionaLogRef.current = adicionaLog;

    useEffect(() => {
        const traceId = gerarTraceId();
        const tsInicio = Date.now();

        // ── Log de início do efeito ──
        console.log(`[PalcoAudio:${traceId}] === useEffect INICIADO === ts=${tsInicio}`);
        console.log(`[PalcoAudio:${traceId}]   modo="${modo}"`);
        console.log(`[PalcoAudio:${traceId}]   token presente: ${token !== null}`);
        console.log(`[PalcoAudio:${traceId}]   livekitUrl: "${livekitUrl ?? '(null)'}"`);

        if (token) {
            const meta = inspecionarToken(token);
            if (meta) {
                console.log(`[PalcoAudio:${traceId}]   token.tamanho=${meta.tamanho}`);
                console.log(`[PalcoAudio:${traceId}]   token.room="${meta.room}"`);
                console.log(`[PalcoAudio:${traceId}]   token.identity="${meta.identity}"`);
                console.log(`[PalcoAudio:${traceId}]   token.canPublish=${meta.canPublish}`);
                console.log(`[PalcoAudio:${traceId}]   token.canSubscribe=${meta.canSubscribe}`);
            } else {
                console.warn(`[PalcoAudio:${traceId}]   token presente mas não foi possível inspecionar (formato inesperado)`);
            }
        }

        // Sem token: aguarda emissão do backend após definirPapel.
        if (!token || !livekitUrl) {
            console.log(`[PalcoAudio:${traceId}] Sem token ou url — aguardando. Retornando sem conectar.`);
            return;
        };

        // Validação da URL antes de tentar conectar.
        if (!validarLivekitUrl(livekitUrl, traceId)) {
            console.error(`[PalcoAudio:${traceId}] URL inválida — conexão abortada.`);
            adicionaLog('Erro: URL LiveKit inválida. Verifique variável de ambiente LIVEKIT_WS_URL.');
            reportarTelemetria({ erroRecente: `URL LiveKit inválida: "${livekitUrl}"` });
            return;
        };

        console.log(`[PalcoAudio:${traceId}]   livekitUrl começa com wss://: ${livekitUrl.startsWith('wss://')}`);
        console.log(`[PalcoAudio:${traceId}]   livekitUrl começa com ws://:  ${livekitUrl.startsWith('ws://')}`);

        let cancelado = false;
        const room = new Room();
        roomRef.current = room;

        console.log(`[PalcoAudio:${traceId}] Room criada. Estado inicial: "${room.state}"`);

        // ── Eventos da Room ──────────────────────────────────────────────────

        room.on(RoomEvent.Connected, () => {
            console.log(`[PalcoAudio:${traceId}] EVENTO: Connected. room.state="${room.state}" cancelado=${cancelado}`);
        });

        room.on(RoomEvent.Disconnected, () => {
            console.log(`[PalcoAudio:${traceId}] EVENTO: Disconnected. room.state="${room.state}" cancelado=${cancelado} ts_desde_inicio=${Date.now() - tsInicio}ms`);
            adicionaLog('Desconectado do LiveKit.');
            reportarTelemetria({ audioCtxEstado: 'closed' });
        });

        room.on(RoomEvent.Reconnecting, () => {
            console.log(`[PalcoAudio:${traceId}] EVENTO: Reconnecting. room.state="${room.state}"`);
        });

        room.on(RoomEvent.Reconnected, () => {
            console.log(`[PalcoAudio:${traceId}] EVENTO: Reconnected. room.state="${room.state}"`);
        });

        room.on(RoomEvent.ConnectionStateChanged, (state) => {
            console.log(`[PalcoAudio:${traceId}] EVENTO: ConnectionStateChanged → "${state}" cancelado=${cancelado}`);
        });

        room.on(RoomEvent.MediaDevicesError, (error: Error) => {
            console.error(`[PalcoAudio:${traceId}] EVENTO: MediaDevicesError: ${error.message}`);
            console.error(error.stack ?? '(sem stack)');
            adicionaLog(`Erro de dispositivo de mídia: ${error.message}`);
            reportarTelemetria({ microfoneEstado: 'erro', erroRecente: `MediaDevicesError: ${error.message}` });
        });

        // Ouvinte: audio track remota recebida — conectar a elemento de áudio no DOM.
        room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _publication, participant) => {
            console.log(`[PalcoAudio:${traceId}] EVENTO: TrackSubscribed. track.kind="${track.kind}" participant="${participant?.identity ?? 'desconhecido'}"`);
            if (track.kind !== Track.Kind.Audio) { console.log(`[PalcoAudio:${traceId}]   (track ignorada — não é áudio)`); return; };

            const audioEl = track.attach() as HTMLAudioElement;
            audioEl.style.display = 'none';
            document.body.appendChild(audioEl);
            console.log(`[PalcoAudio:${traceId}]   audio element criado e anexado ao DOM. Chamando play()...`);

            audioEl.play().then(() => {
                console.log(`[PalcoAudio:${traceId}]   play() OK para participant="${participant?.identity ?? 'desconhecido'}"`);
            }).catch((err: Error) => {
                const msg = err instanceof Error ? err.message : String(err);
                console.warn(`[PalcoAudio:${traceId}]   play() bloqueado (autoplay policy): ${msg}`);
                adicionaLog('Autoplay bloqueado — interaja com a página para ouvir o áudio.');
                reportarTelemetria({ audioCtxEstado: 'suspended', erroRecente: `Autoplay bloqueado: ${msg}` });
            });
        });

        room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, _publication, participant) => {
            console.log(`[PalcoAudio:${traceId}] EVENTO: TrackUnsubscribed. track.kind="${track.kind}" participant="${participant?.identity ?? 'desconhecido'}"`);
            if (track.kind !== Track.Kind.Audio) return;
            track.detach().forEach(el => { el.parentElement?.removeChild(el); });
            console.log(`[PalcoAudio:${traceId}]   audio element removido do DOM`);
        });

        room.on(RoomEvent.LocalTrackPublished, (publication) => {
            console.log(`[PalcoAudio:${traceId}] EVENTO: LocalTrackPublished. kind="${publication.kind}" trackSid="${publication.trackSid}"`);
        });

        // ────────────────────────────────────────────────────────────────────

        const conectar = async (): Promise<void> => {
            console.log(`[PalcoAudio:${traceId}] Chamando room.connect(url, token)...`);
            console.log(`[PalcoAudio:${traceId}]   url="${livekitUrl}"`);
            console.log(`[PalcoAudio:${traceId}]   room.state antes do connect="${room.state}"`);

            await room.connect(livekitUrl, token);

            console.log(`[PalcoAudio:${traceId}] room.connect() resolveu. room.state="${room.state}" cancelado=${cancelado}`);

            if (cancelado) {
                console.log(`[PalcoAudio:${traceId}] cleanup foi acionado antes do connect resolver — chamando room.disconnect() imediatamente.`);
                room.disconnect();
                return;
            };

            adicionaLog(`Conectado ao LiveKit como ${modo}.`);
            reportarTelemetria({ audioCtxEstado: 'running' });

            if (modo === 'falante') {
                console.log(`[PalcoAudio:${traceId}] Solicitando microfone (setMicrophoneEnabled)...`);
                reportarTelemetria({ microfoneEstado: 'aguardando' });
                adicionaLog('Aguardando permissão de microfone...');

                try {
                    await room.localParticipant.setMicrophoneEnabled(true);
                    console.log(`[PalcoAudio:${traceId}] Microfone habilitado. cancelado=${cancelado}`);
                    adicionaLog('Microfone ativo — transmitindo.');
                    reportarTelemetria({ microfoneEstado: 'capturando', nivelMicrofone: 0 });
                } catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    const stack = err instanceof Error ? (err.stack ?? '(sem stack)') : '(sem stack)';
                    console.error(`[PalcoAudio:${traceId}] Erro ao habilitar microfone: ${msg}`);
                    console.error(stack);
                    adicionaLog(`Erro ao ativar microfone: ${msg}`);
                    reportarTelemetria({ microfoneEstado: 'erro', erroRecente: `Mic error: ${msg}` });
                }
            }

            // Relatório periódico de telemetria para o painel Admin (a cada 2 segundos).
            intervaloRef.current = setInterval(() => {
                if (cancelado) return;
                if (modo === 'falante') {
                    const nivel = Math.round((room.localParticipant.audioLevel ?? 0) * 100);
                    reportarTelemetria({ microfoneEstado: 'capturando', nivelMicrofone: nivel, audioCtxEstado: 'running' });
                } else {
                    const tracksAtivos = Array.from(room.remoteParticipants.values()).filter(p => Array.from(p.trackPublications.values()).some(pub => pub.kind === Track.Kind.Audio && pub.isSubscribed)).length;
                    reportarTelemetria({ audioCtxEstado: room.state === 'connected' ? 'running' : room.state, chunksRecebidos: tracksAtivos });
                }
            }, 2000);
        };

        conectar().catch(e => {
            if (cancelado) {
                console.warn(`[PalcoAudio:${traceId}] conectar() rejeitou MAS cleanup já estava ativo (cancelado=true). Isso pode ser React Strict Mode ou remount.`);
            }
            const nome = e instanceof Error ? e.name : 'Erro';
            const msg = e instanceof Error ? e.message : String(e);
            const stack = e instanceof Error ? (e.stack ?? '(sem stack)') : '(sem stack)';
            console.error(`[PalcoAudio:${traceId}] conectar() REJEITADO. room.state="${room.state}"`);
            console.error(`[PalcoAudio:${traceId}]   nome: ${nome}`);
            console.error(`[PalcoAudio:${traceId}]   mensagem: ${msg}`);
            console.error(`[PalcoAudio:${traceId}]   stack: ${stack}`);
            adicionaLog(`Erro ao conectar LiveKit: ${msg}`);
            reportarTelemetria({ microfoneEstado: 'erro', erroRecente: `Falha na conexão LiveKit: ${msg}` });
        });

        return () => {
            cancelado = true;
            const tsDiff = Date.now() - tsInicio;
            console.log(`[PalcoAudio:${traceId}] === CLEANUP ACIONADO PELO REACT/hook ===`);
            console.log(`[PalcoAudio:${traceId}]   ${tsDiff}ms após início do efeito`);
            console.log(`[PalcoAudio:${traceId}]   room.state no momento do cleanup="${room.state}"`);
            console.log(`[PalcoAudio:${traceId}]   Chamando room.disconnect()...`);
            if (intervaloRef.current !== null) { clearInterval(intervaloRef.current); intervaloRef.current = null; };
            room.disconnect();
            roomRef.current = null;
            reportarTelemetria({ microfoneEstado: 'parado', audioCtxEstado: 'closed' });
            console.log(`[PalcoAudio:${traceId}] cleanup concluído.`);
        };
    }, [token, livekitUrl, modo, adicionaLog]);
};