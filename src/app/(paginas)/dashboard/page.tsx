'use client';

import './dashboard.css';

import { useState, useEffect, useRef } from 'react';
import { WsTelemetria_Evento, WsTelemetria_DadosSistema, WsTelemetria_SSE_Event, WsTelemetria_TipoEvento } from 'types-nora-api';

// Componente para tempo seguro (client-only)
function ClientTime({ timestamp }: { timestamp: string }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        setTime(new Date(timestamp).toLocaleTimeString('pt-BR'));
    }, [timestamp]);

    return <span className="event-time">{time || '...'}</span>;
}

// Componente para último evento seguro
function LastEventTime({ events }: { events: WsTelemetria_SSE_Event[] }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        if (events.length > 0) {
            const lastEventTime = new Date(events[events.length - 1].timestamp);
            const secondsAgo = Math.round((Date.now() - lastEventTime.getTime()) / 1000);
            setTime(`${secondsAgo}s atrás`);
        } else {
            setTime('Nenhum');
        }
    }, [events]);

    return <span className="last-event">{time}</span>;
}

export default function TelemetryDashboard() {
    const [events, setEvents] = useState<WsTelemetria_SSE_Event[]>([]);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
    const [stats, setStats] = useState<WsTelemetria_DadosSistema>({
        active: 0,
        authenticated: 0,
        unauthenticated: 0,
        totalEvents: 0,
        eventsByType: {}
    });
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const [currentTime, setCurrentTime] = useState('');

    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastEventTimeRef = useRef<number>(Date.now());

    const connectSSE = () => {
        // Fecha conexão existente
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        // Limpa timeout de reconexão anterior
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        console.log(`🔗 Tentando conectar SSE (tentativa ${reconnectAttempts + 1})...`);
        setStatus('connecting');

        try {
            const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wsTelemetria/stream`);
            eventSourceRef.current = eventSource;

            eventSource.onopen = () => {
                console.log('✅ Conectado ao servidor de telemetria');
                setStatus('connected');
                setReconnectAttempts(0);
                lastEventTimeRef.current = Date.now();
            };

            eventSource.onmessage = (event) => {
                try {
                    const data: WsTelemetria_SSE_Event = JSON.parse(event.data);
                    console.log('📨 Evento recebido:', data);

                    lastEventTimeRef.current = Date.now();

                    // Atualiza stats se vierem no evento
                    if (data.tipo === 'DASHBOARD_CONNECTED' && data.data?.stats) {
                        setStats(data.data.stats);
                    }

                    // Não mostra heartbeat na lista de eventos
                    if (data.tipo !== 'HEARTBEAT') {
                        setEvents(prev => [...prev.slice(-199), data]);
                    }
                } catch (error) {
                    console.error('❌ Erro ao parsear evento SSE:', error);
                }
            };

            eventSource.onerror = (error) => {
                console.error('❌ Erro na conexão SSE:', error);
                setStatus('error');

                // Fecha a conexão para evitar múltiplas reconexões
                eventSource.close();
                eventSourceRef.current = null;

                // Reconexão com backoff exponencial
                scheduleReconnect();
            };

        } catch (error) {
            console.error('❌ Erro ao criar conexão SSE:', error);
            setStatus('error');
            scheduleReconnect();
        }
    };

    const scheduleReconnect = () => {
        // Limpa timeout anterior
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        // Backoff exponencial: 2s, 4s, 8s, 16s, 32s, max 60s
        const delay = Math.min(2000 * Math.pow(2, reconnectAttempts), 60000);

        console.log(`🔄 Reconectando em ${delay}ms...`);
        setStatus('reconnecting');

        reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connectSSE();
        }, delay);
    };

    // Monitora se a conexão está "parada" (sem eventos)
    useEffect(() => {
        const heartbeatInterval = setInterval(() => {
            if (status === 'connected' && eventSourceRef.current) {
                const timeSinceLastEvent = Date.now() - lastEventTimeRef.current;

                // Se não recebeu eventos por mais de 40 segundos, reconecta
                if (timeSinceLastEvent > 40000) {
                    console.log('🫀 Heartbeat: Sem eventos há 40s, reconectando...');
                    connectSSE();
                } else if (timeSinceLastEvent > 30000) {
                    console.log('🫀 Heartbeat: Sem eventos há 30s, conexão pode estar instável');
                }
            }
        }, 15000); // Verifica a cada 15 segundos

        return () => clearInterval(heartbeatInterval);
    }, [status]);

    // Atualiza o horário atual apenas no cliente
    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString('pt-BR'));

        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Conexão inicial
    useEffect(() => {
        connectSSE();

        // Cleanup
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const getStatusText = () => {
        switch (status) {
            case 'connected': return 'Conectado';
            case 'error': return 'Erro na conexão';
            case 'reconnecting': return `Reconectando... (${reconnectAttempts})`;
            default: return 'Conectando...';
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case 'connected': return 'status-connected';
            case 'error': return 'status-error';
            case 'reconnecting': return 'status-reconnecting';
            default: return 'status-connecting';
        }
    };

    const getEventTypeClass = (tipo: WsTelemetria_TipoEvento) => {
        if (tipo.includes('CONNECTION')) return 'connection';
        if (tipo.includes('DISCONNECTION')) return 'disconnection';
        if (tipo.includes('EVENT_IN')) return 'event-in';
        if (tipo.includes('EVENT_OUT')) return 'event-out';
        if (tipo.includes('HISTORICAL')) return 'historical';
        if (tipo.includes('DASHBOARD')) return 'dashboard';
        if (tipo.includes('HEARTBEAT')) return 'heartbeat';
        if (tipo.includes('AUTH_ERROR')) return 'auth-error';
        if (tipo.includes('SOCKET_ERROR')) return 'socket-error';
        return 'other';
    };

    const formatEventType = (tipo: WsTelemetria_TipoEvento) => {
        return tipo.replace('HISTORICAL_', '').replace('_', ' ');
    };

    const clearEvents = () => {
        setEvents([]);
    };

    // Filtra apenas eventos importantes para o display
    const displayEvents = events.filter(event =>
        !event.tipo.includes('HISTORICAL') &&
        event.tipo !== 'DASHBOARD_CONNECTED' &&
        event.tipo !== 'HEARTBEAT'
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1 className="dashboard-title">
                    📊 Dashboard de Telemetria WebSocket
                </h1>

                {/* Status e Estatísticas */}
                <div className="stats-container">
                    <div className="status-section">
                        <div className={`status-indicator ${getStatusClass()}`}>
                            <div className="status-dot"></div>
                            <span>{getStatusText()}</span>
                            <span className="last-event">
                                Último evento: <LastEventTime events={events} />
                            </span>
                        </div>
                        <button
                            className="reconnect-button"
                            onClick={connectSSE}
                            disabled={status === 'connecting' || status === 'reconnecting'}
                        >
                            🔄 Reconectar
                        </button>
                        <button
                            className="clear-button"
                            onClick={clearEvents}
                        >
                            🗑️ Limpar
                        </button>
                    </div>

                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-value">{stats.active}</div>
                            <div className="stat-label">Conexões Ativas</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.authenticated}</div>
                            <div className="stat-label">Autenticados</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.totalEvents}</div>
                            <div className="stat-label">Total Eventos</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{displayEvents.length}</div>
                            <div className="stat-label">Eventos Visíveis</div>
                        </div>
                    </div>
                </div>

                {/* Eventos */}
                <div className="events-container">
                    <div className="events-header">
                        <h2 className="events-title">
                            Eventos WebSocket ({displayEvents.length})
                        </h2>
                        <div className="events-info">
                            Conexão SSE: {status === 'connected' ? 'Estável' : 'Instável'} • {currentTime || '...'}
                        </div>
                    </div>

                    {displayEvents.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔌</div>
                            <p>Nenhum evento WebSocket ainda</p>
                            <p className="empty-subtitle">
                                Conecte clientes WebSocket ao servidor para ver eventos aqui
                            </p>
                        </div>
                    ) : (
                        <div className="events-list">
                            {displayEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className={`event-item event-${getEventTypeClass(event.tipo)}`}
                                >
                                    <div className="event-header">
                                        <span className="event-type">
                                            {formatEventType(event.tipo)}
                                        </span>
                                        <ClientTime timestamp={event.timestamp} />
                                    </div>

                                    <div className="event-client">
                                        Usuário: {event.username}
                                    </div>

                                    {event.data && (
                                        <div className="event-data">
                                            {event.data.event && (
                                                <div className="event-name">
                                                    Event: <strong>{event.data.event}</strong>
                                                </div>
                                            )}
                                            {event.data.reason && (
                                                <div>Razão: {event.data.reason}</div>
                                            )}
                                            {event.data.duration && (
                                                <div>Duração: {Math.round(event.data.duration / 1000)}s</div>
                                            )}
                                            {event.data.payload && (
                                                <div className="event-payload">
                                                    Payload: {JSON.stringify(event.data.payload)}
                                                </div>
                                            )}
                                            {event.message && (
                                                <div className="event-message">
                                                    {event.message}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Informações */}
                <div className="info-container">
                    <p>
                        {status === 'connected' ? '✅ Conexão estável' : '⚠️ Conexão instável'} •
                        Heartbeat ativo • Atualizado: {currentTime || '...'}
                    </p>
                    <p>Monitorando eventos WebSocket em tempo real • Reconexão automática ativa</p>
                </div>
            </div>
        </div>
    );
}