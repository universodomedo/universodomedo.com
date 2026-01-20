'use client';

import styles from './style.module.css';

import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { PAGINAS, type TelemetrySnapshot, type TelemetryConnectionInfo, type TelemetryEventLog } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export function DashboardWS_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.dashboardWs}>
            <DashboardWS_Slot />
        </ControladorSlot>
    );
};

function DashboardWS_Slot() {
    const [snapshot, setSnapshot] = useState<TelemetrySnapshot | null>(null);
    const [connections, setConnections] = useState<TelemetryConnectionInfo[]>([]);
    const [events, setEvents] = useState<TelemetryEventLog[]>([]);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connectSSE = (isReconnect = false) => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        if (!isReconnect) {
            setEvents([]);
            setConnections([]);
            setStatus('connecting');
        } else {
            setStatus('reconnecting');
        }

        console.log(`🔗 Conectando SSE (${isReconnect ? 'reconexão' : 'nova'})...`);

        try {
            const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wsTelemetria/stream`);
            eventSourceRef.current = eventSource;

            // ✅ Conexão aberta
            eventSource.onopen = () => {
                console.log('✅ SSE conectado');
                setStatus('connected');
                setReconnectAttempts(0);
            };

            // ✅ Recebe eventos de snapshot
            eventSource.addEventListener('snapshot', (event) => {
                try {
                    const data: TelemetrySnapshot = JSON.parse((event as MessageEvent).data);
                    setSnapshot(data);
                    setConnections(data.connections ?? []);
                    setEvents(data.lastEvents ?? []);
                } catch (err) {
                    console.error('❌ Erro ao parsear snapshot SSE:', err);
                }
            });

            // 🔹 Recebe heartbeat (mantém conexão viva)
            eventSource.addEventListener('heartbeat', () => {
                console.debug('💓 SSE heartbeat recebido');
            });

            // ❌ Erro na conexão
            eventSource.onerror = (err) => {
                console.warn('⚠️ SSE erro detectado, agendando reconexão...', err);
                setStatus('error');
                scheduleReconnect();
            };
        } catch (err) {
            console.error('❌ Falha crítica na conexão SSE:', err);
            setStatus('error');
            scheduleReconnect();
        }
    };

    const scheduleReconnect = () => {
        if (reconnectTimeoutRef.current) return; // já há um reconect programado

        const delay = Math.min(2000 * Math.pow(1.5, reconnectAttempts), 15000);
        console.log(`🔄 Tentando reconectar SSE em ${Math.round(delay)}ms...`);

        reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null; // libera o slot
            setReconnectAttempts((prev) => prev + 1);
            connectSSE(true);
        }, delay);
    };

    useEffect(() => {
        connectSSE();

        return () => {
            if (eventSourceRef.current) eventSourceRef.current.close();
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        };
    }, []);

    return (
        <div className={styles.container_dashboard}>
            <div className={styles.container_paineis}>
                <header className={styles.header}>
                    <h1>🛰️ Dashboard de Telemetria WS</h1>
                    <div className={styles.headerInfo}>
                        <span>Status: <b className={styles[status]}>{status}</b></span>
                        <span>Conexões: <b>{connections.length}</b></span>
                        <span>Eventos: <b>{events.length}</b></span>
                    </div>
                </header>

                <main className={styles.main}>
                    {/* Painel de conexões */}
                    <section className={cn(styles.panel, styles.painel_handshakes)}>
                        <h2>🤝 Handshakes Ativos ({connections.length})</h2>
                        <div className={styles.scrollArea}>
                            {connections.length === 0 ? (
                                <div className={styles.empty}>Nenhuma conexão ativa...</div>
                            ) : (
                                connections.map((c) => (
                                    <div key={c.socketId} className={styles.card}>
                                        <div><b>Usuário:</b> {c.username ?? '—'}</div>
                                        <div><b>Socket:</b> <span className={styles.socket}>{c.socketId}</span></div>
                                        <div><b>IP:</b> {c.ip}</div>
                                        {/* <div><b>User Agent:</b> {c.userAgent?.slice(0, 60) ?? '—'}</div> */}
                                        <div><b>Conectado:</b> {new Date(c.connectedAt).toLocaleTimeString()}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Painel de eventos */}
                    <section className={cn(styles.panel, styles.painel_eventos)}>
                        <h2>📡 Eventos Recentes ({events.length})</h2>
                        <div className={styles.scrollArea}>
                            <div className={styles.recipiente_eventos}>
                                {events.length === 0 ? (<div className={styles.empty}>Nenhum evento recebido...</div>) : (
                                    events.map((e, i) => (
                                        <div key={i} className={`${styles.event} ${e.direction === 'in' ? styles.in : styles.out}`}>
                                            <div className={styles.eventHeader}>
                                                <span className={styles.time}>
                                                    {new Date(e.timestamp).toLocaleTimeString()}
                                                </span>
                                                <span className={styles.direction}>{e.direction.toUpperCase()}</span>
                                                <span className={styles.eventName}>{e.event}</span>
                                                <span className={styles.username}>
                                                    {e.audiencia.escopo === 'unico'
                                                        ? e.audiencia.username
                                                        : `Entregue à ${e.audiencia.socketsCount} sockets`}
                                                </span>
                                            </div>

                                            {e.payload && Object.keys(e.payload).length > 0 && (
                                                <details className={styles.payloadWrapper}>
                                                    <summary className={styles.payloadSummary}>
                                                        Ver payload
                                                    </summary>
                                                    <pre className={styles.payload}>
                                                        {JSON.stringify(e.payload, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};