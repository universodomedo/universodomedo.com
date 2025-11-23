'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { TelemetrySnapshot, TelemetryEventLog } from 'types-nora-api';

type UseSSEOptions = {
    url?: string;
    reconnectAttempts?: number;
    onMessage?: (msg: TelemetrySnapshot) => void;
};

export function useSSE(options?: UseSSEOptions) {
    const url = options?.url ?? `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/telemetry/stream`;
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimer = useRef<number | null>(null);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
    const [snapshot, setSnapshot] = useState<TelemetrySnapshot | null>(null);
    const [events, setEvents] = useState<TelemetryEventLog[]>([]);
    const [attempts, setAttempts] = useState(0);
    const lastEventAt = useRef<number>(Date.now());

    const clearConnection = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        if (reconnectTimer.current) {
            window.clearTimeout(reconnectTimer.current);
            reconnectTimer.current = null;
        }
    }, []);

    const scheduleReconnect = useCallback(() => {
        const delay = Math.min(2000 * Math.pow(2, attempts), 60000);
        setStatus('reconnecting');
        reconnectTimer.current = window.setTimeout(() => {
            setAttempts(prev => prev + 1);
            connect();
        }, delay);
    }, [attempts]);

    const connect = useCallback(() => {
        clearConnection();
        setStatus('connecting');

        try {
            const es = new EventSource(url);
            eventSourceRef.current = es;

            es.onopen = () => {
                setStatus('connected');
                setAttempts(0);
                lastEventAt.current = Date.now();
            };

            es.onmessage = (evt) => {
                try {
                    const parsed = JSON.parse(evt.data) as TelemetrySnapshot;
                    lastEventAt.current = Date.now();
                    setSnapshot(parsed);
                    // add lastEvents if provided
                    if (parsed.lastEvents && parsed.lastEvents.length > 0) {
                        setEvents(prev => {
                            const merged = [...prev, ...parsed.lastEvents];
                            // keep last 500 events
                            return merged.slice(-500);
                        });
                    }
                    if (options?.onMessage) options.onMessage(parsed);
                } catch (err) {
                    // ignore invalid messages but mark error
                    console.error('SSE parse error', err);
                }
            };

            es.onerror = (err) => {
                console.error('SSE error', err);
                setStatus('error');
                clearConnection();
                scheduleReconnect();
            };
        } catch (err) {
            console.error('SSE connection error', err);
            setStatus('error');
            scheduleReconnect();
        }
    }, [url, clearConnection, scheduleReconnect, options]);

    // heartbeat monitor (client-side): if no events for 40s, attempt reconnect
    useEffect(() => {
        connect();
        const hb = setInterval(() => {
            if (status === 'connected') {
                const since = Date.now() - lastEventAt.current;
                if (since > 40000) {
                    console.warn('SSE heartbeat failure, reconnecting');
                    clearConnection();
                    scheduleReconnect();
                }
            }
        }, 15000);
        return () => {
            clearInterval(hb);
            clearConnection();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once

    return {
        status,
        snapshot,
        events,
        connect,
        disconnect: clearConnection,
        attempts,
    };
}
